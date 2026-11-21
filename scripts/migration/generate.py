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

def write_paths():
    svc_root = os.path.join(REPO, 'src', 'content', 'services')
    entries = [(g, os.path.basename(f)[:-3]) for g in GROUPS for f in sorted(glob.glob(os.path.join(svc_root, g, '*.ts')))]
    hub_dir = os.path.join(REPO, 'src', 'content', 'hubs')
    hub_paths = [f'/{g}' for g in GROUPS if os.path.exists(os.path.join(hub_dir, g + '.ts'))]
    paths = ',\n'.join([f'  "{p}"' for p in hub_paths] + [f'  "/{g}/{slug}"' for g, slug in entries])
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
    if args and args[0] == '--hubs':
        hubs(args[1:] or list(GROUPS)); write_paths()
    else:
        main(args or ['residencial-premium'])
