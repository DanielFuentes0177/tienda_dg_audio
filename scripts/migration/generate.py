#!/usr/bin/env python3
"""
Migración de páginas de servicio HTML -> datos tipados de Next.
Uso:  python3 scripts/migration/generate.py <grupo> [<grupo> ...]
      (grupos: residencial-premium negocios-y-experiencias corporativo-e-institucional eventos-y-produccion)
Lee /Users/kelebra/Documents/Rpm_Code/Dg_audio (repo HTML), escribe src/content/services/<grupo>/<slug>.ts,
copia las imágenes a public/assets/... (misma ruta) y regenera el registro y la lista de rutas.
"""
import sys, os, re, json, glob, shutil
sys.path.insert(0, os.path.dirname(__file__))
from extract import extract_page, ROOT
from extract_hub import extract_hub
from extract_home import extract_home, extract_legal
from extract_legacy import extract_solutions, extract_applications
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
GROUPS = {
  'residencial-premium': 'Residencial Premium',
  'negocios-y-experiencias': 'Negocios y Experiencias',
  'corporativo-e-institucional': 'Corporativo e Institucional',
  'eventos-y-produccion': 'Eventos y Producción',
}

def camel(slug): 
    p = slug.split('-'); return p[0] + ''.join(x.capitalize() for x in p[1:])

def copy_img(src):
    """Copia /assets/... del repo HTML a public/ (misma ruta). Devuelve (w,h)."""
    s = os.path.join(ROOT, src.lstrip('/')); d = os.path.join(REPO, 'public', src.lstrip('/'))
    if not os.path.exists(s): raise FileNotFoundError(s)
    if not s.lower().endswith(('.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico')): raise ValueError('no es una imagen: ' + s)
    os.makedirs(os.path.dirname(d), exist_ok=True)
    if not os.path.exists(d): shutil.copy2(s, d)
    with Image.open(s) as im: return im.size

def with_dims(img):
    w, h = copy_img(img['src']); img['width'], img['height'] = w, h

def hubs(groups):
    out_dir = os.path.join(REPO, 'src', 'content', 'hubs'); os.makedirs(out_dir, exist_ok=True)
    for g in groups:
        d = extract_hub(g)
        for sl in d['hero']['slides']: copy_img(sl)
        for sl in d['showcase']['slides']: copy_img(sl)
        w, h = copy_img(d['blueprint']['image']['src']); d['blueprint']['image'].update(width=w, height=h)
        if d['problem']['image']:
            w, h = copy_img(d['problem']['image']['src']); d['problem']['image'].update(width=w, height=h)
        for c in d['gateway']['cards']:
            c['width'], c['height'] = copy_img(c['src'])
        if not os.path.exists(os.path.join(ROOT, d['seo']['ogImage'].lstrip('/'))):
            print('  AVISO og:image inexistente en hub', g); d['seo']['ogImage'] = d['hero']['slides'][0]
        copy_img(d['seo']['ogImage'])
        if not d['breadcrumbs']:
            d['breadcrumbs'] = [{'name': 'Inicio', 'href': '/'}, {'name': GROUPS[g], 'href': '/' + g}]
        order = ['path','seo','breadcrumbs','jsonLd','floatMessage','hero','problem','showcase','blueprint','benefits','process','gateway','brands','faq','contact']
        body = json.dumps({k: d[k] for k in order}, ensure_ascii=False, indent=2)
        ts = ('import type { HubPageContent } from "@/types/service.types";\n\n'
              '// GENERADO por scripts/migration/generate.py --hubs desde el sitio HTML. Se puede editar a mano.\n'
              f'export const {camel(g)}Hub: HubPageContent = {body};\n')
        open(os.path.join(out_dir, g + '.ts'), 'w').write(ts); print('ok hub', g)
    lines = ['import type { HubPageContent } from "@/types/service.types";']
    present = [g for g in GROUPS if os.path.exists(os.path.join(out_dir, g + '.ts'))]
    for g in present: lines.append(f'import {{ {camel(g)}Hub }} from "./{g}";')
    lines.append('\n/** Páginas hub servidas por Next (generado por scripts/migration/generate.py --hubs). */')
    lines.append('export const HUBS: Record<string, HubPageContent> = {')
    for g in present: lines.append(f'  "/{g}": {camel(g)}Hub,')
    lines.append('};\n')
    open(os.path.join(out_dir, 'index.ts'), 'w').write('\n'.join(lines))

def home_and_legal():
    out = os.path.join(REPO, 'src', 'content', 'pages'); os.makedirs(out, exist_ok=True)
    d = extract_home()
    # imágenes de la home: tarjetas de soluciones (con dimensiones) + todo assets/Home (los fondos del hero los pide el CSS)
    for c in d['solutions']['cards']:
        c['img']['width'], c['img']['height'] = copy_img(c['img']['src'])
    home_dir = os.path.join(ROOT, 'assets', 'Home')
    for f in os.listdir(home_dir):
        if f.lower().endswith(('.webp', '.png', '.jpg', '.jpeg', '.svg')):  # (hay un .zip suelto en el repo HTML: no se publica)
            copy_img('/assets/Home/' + f)
    if not os.path.exists(os.path.join(ROOT, d['seo']['ogImage'].lstrip('/'))):
        print('  AVISO og:image inexistente en la home')
    else:
        copy_img(d['seo']['ogImage'])
    js = open(os.path.join(ROOT, 'scripts', 'organisms', 'hero-slider.js')).read()
    kick = json.loads(re.search(r'kickerTexts = (\[.*?\]);', js, re.S).group(1))
    order = ['path','seo','jsonLd','hero','trust','advice','assurance','solutions','applications','process','whyUs','brands','faq','contact']
    body = json.dumps({k: d[k] for k in order}, ensure_ascii=False, indent=2)
    open(os.path.join(out, 'home.ts'), 'w').write(
        'import type { HomePageContent } from "@/types/service.types";\n\n'
        '// GENERADO por scripts/migration/generate.py --home desde el sitio HTML. Se puede editar a mano.\n'
        f'export const homeContent: HomePageContent = {body};\n\n'
        '/** Textos del kicker del hero que rotan con cada diapositiva (como en el JS original). */\n'
        f'export const HOME_HERO_KICKERS: string[] = {json.dumps(kick, ensure_ascii=False)};\n')
    print('ok home')
    names = {'aviso-de-privacidad': 'avisoDePrivacidad', 'terminos-y-condiciones': 'terminosYCondiciones'}
    for slug, var in names.items():
        l = extract_legal(slug)
        if not os.path.exists(os.path.join(ROOT, l['seo']['ogImage'].lstrip('/'))):
            print('  AVISO og:image inexistente en', slug)
        else:
            copy_img(l['seo']['ogImage'])
        open(os.path.join(out, slug + '.ts'), 'w').write(
            'import type { LegalPageContent } from "@/types/service.types";\n\n'
            '// GENERADO por scripts/migration/generate.py --home desde el sitio HTML. Se puede editar a mano.\n'
            f'export const {var}: LegalPageContent = {json.dumps(l, ensure_ascii=False, indent=2)};\n')
        print('ok legal', slug)

def to_webp(src):
    """/assets/11.webp  <- assets/11.png del repo HTML (convertida: 2-4 MB -> ~150 KB). Devuelve (w,h) de la imagen publicada."""
    s = os.path.join(ROOT, re.sub(r'\.webp$', '.png', src).lstrip('/')); d = os.path.join(REPO, 'public', src.lstrip('/'))
    os.makedirs(os.path.dirname(d), exist_ok=True)
    with Image.open(s) as im:
        im = im.convert('RGB'); 
        if im.width > 1400: im = im.resize((1400, round(im.height * 1400 / im.width)))
        im.save(d, 'WEBP', quality=82, method=6); return im.size

def legacy():
    out = os.path.join(REPO, 'src', 'content', 'pages'); os.makedirs(out, exist_ok=True)
    s = extract_solutions()
    to_webp(re.search(r"url\('([^']+)'\)", s['hero']['sectionStyle']).group(1))
    for b in s['blocks']:
        b['image']['width'], b['image']['height'] = to_webp(b['image']['src'])
    copy_img(s['seo']['ogImage'])
    open(os.path.join(out, 'soluciones.ts'), 'w').write('import type { SolutionsPageContent } from "@/types/service.types";\n\n// GENERADO por scripts/migration/generate.py --legacy. Se puede editar a mano.\n'
        f'export const solucionesContent: SolutionsPageContent = {json.dumps(s, ensure_ascii=False, indent=2)};\n')
    a = extract_applications(); copy_img(a['seo']['ogImage'])
    open(os.path.join(out, 'aplicaciones.ts'), 'w').write('import type { ApplicationsPageContent } from "@/types/service.types";\n\n// GENERADO por scripts/migration/generate.py --legacy. Se puede editar a mano.\n'
        f'export const aplicacionesContent: ApplicationsPageContent = {json.dumps(a, ensure_ascii=False, indent=2)};\n')
    print('ok legacy soluciones/aplicaciones')

def write_paths():
    svc_root = os.path.join(REPO, 'src', 'content', 'services')
    entries = [(g, os.path.basename(f)[:-3]) for g in GROUPS for f in sorted(glob.glob(os.path.join(svc_root, g, '*.ts')))]
    hub_dir = os.path.join(REPO, 'src', 'content', 'hubs')
    hub_paths = [f'/{g}' for g in GROUPS if os.path.exists(os.path.join(hub_dir, g + '.ts'))]
    home_path = ['/'] if os.path.exists(os.path.join(REPO, 'src', 'content', 'pages', 'home.ts')) else []
    legacy_paths = [f'/{n}' for n in ('soluciones', 'aplicaciones') if os.path.exists(os.path.join(REPO, 'src', 'content', 'pages', n + '.ts'))]
    paths = ',\n'.join([f'  "{p}"' for p in home_path + hub_paths + legacy_paths] + [f'  "/{g}/{slug}"' for g, slug in entries])
    open(os.path.join(REPO, 'src', 'content', 'servicePaths.ts'), 'w').write(
        '/** Rutas de servicio y hubs servidas por Next (generado por scripts/migration/generate.py). Ligero: lo usa el cliente. */\n'
        f'export const SERVICE_PATHS: string[] = [\n{paths},\n];\n')

def main(groups):
    for g in groups:
        out_dir = os.path.join(REPO, 'src', 'content', 'services', g); os.makedirs(out_dir, exist_ok=True)
        files = sorted(f for f in glob.glob(os.path.join(ROOT, g, '*.html')) if not f.endswith('index.html'))
        for f in files:
            rel = os.path.relpath(f, ROOT); slug = os.path.basename(f)[:-5]
            d = extract_page(rel)
            # imágenes
            with_dims(d['intro']['image'])
            for a in d['areas']['items']: with_dims(a['image'])
            if 'banner' in d['areas']: with_dims(d['areas']['banner']['image'])
            for s in d['hero']['slides']:
                if s: copy_img(s)
            if not os.path.exists(os.path.join(ROOT, d['seo']['ogImage'].lstrip('/'))):
                # og:image roto en el HTML original: se usa la primera imagen del hero
                print('  AVISO og:image inexistente en', slug, '->', d['hero']['slides'][0])
                d['seo']['ogImage'] = d['hero']['slides'][0]
            copy_img(d['seo']['ogImage'])
            # migas de pan si faltan
            if not d['breadcrumbs']:
                label = re.split(r'\s+(?:en CDMX|\|)', d['seo']['title'])[0].strip()
                d['breadcrumbs'] = [{'name': 'Inicio', 'href': '/'}, {'name': GROUPS[g], 'href': '/' + g}, {'name': label, 'href': d['path']}]
            # encabezado de la solicitud de WhatsApp (el HTML usa el h1 si no hay opción)
            if not d['contact']['pageHeading']:
                d['contact']['pageHeading'] = ''.join(p['text'] for p in d['hero']['title']).replace('\n', ' ').strip()
            d['contact'].pop('unknown', None)
            d.pop('ctaIcon', None)
            order = ['path','seo','breadcrumbs','jsonLd','floatMessage','hero','intro','problem','extra','includes','areas','process','differentiator','faq','contact']
            data = {k: d[k] for k in order if k in d}
            body = json.dumps(data, ensure_ascii=False, indent=2)
            ts = ('import type { ServicePageContent } from "@/types/service.types";\n\n'
                  '// GENERADO por scripts/migration/generate.py desde el sitio HTML. Se puede editar a mano.\n'
                  f'export const {camel(slug)}: ServicePageContent = {body};\n')
            open(os.path.join(out_dir, slug + '.ts'), 'w').write(ts)
            print('ok', g, slug)

    # registro + rutas
    svc_root = os.path.join(REPO, 'src', 'content', 'services')
    entries = []
    for g in GROUPS:
        for f in sorted(glob.glob(os.path.join(svc_root, g, '*.ts'))):
            slug = os.path.basename(f)[:-3]; entries.append((g, slug))
    lines = ['import type { ServicePageContent } from "@/types/service.types";']
    for g, slug in entries: lines.append(f'import {{ {camel(slug)} }} from "./{g}/{slug}";')
    lines.append('\n/** Registro de páginas de servicio servidas por Next (generado por scripts/migration/generate.py). */')
    lines.append('export const SERVICES: Record<string, ServicePageContent> = {')
    for g, slug in entries: lines.append(f'  "/{g}/{slug}": {camel(slug)},')
    lines.append('};\n')
    lines.append('export const servicesInGroup = (group: string): ServicePageContent[] =>')
    lines.append('  Object.values(SERVICES).filter((s) => s.path.startsWith(`/${group}/`));\n')
    open(os.path.join(svc_root, 'index.ts'), 'w').write('\n'.join(lines))
    write_paths()

if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == '--legacy':
        legacy(); write_paths()
    elif args and args[0] == '--home':
        home_and_legal()
    elif args and args[0] == '--hubs':
        hubs(args[1:] or list(GROUPS)); write_paths()
    else:
        main(args or ['residencial-premium'])
