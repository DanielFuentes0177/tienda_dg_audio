"""Extractor de las páginas HUB (index.html de cada grupo) -> dict para HubPageContent."""
import re, json, os, subprocess
from bs4 import BeautifulSoup
from extract import ROOT, norm, text, inline, simple, icon_cls, wa_msg, load, icard

def img_src(s): return re.sub(r'^(\.\./)+', '/', s or '')
def style_of(el): return (el.get('style') or '').strip() if el is not None else ''

def js_literal(js, name):
    """Evalúa con node un literal `const <name> = ...;` del JS de la página."""
    m = re.search(r'const\s+' + name + r'\s*=\s*', js)
    if not m: return None
    i = m.end(); open_ch = js[i]; close_ch = {'[': ']', '{': '}'}[open_ch]
    depth = 0; j = i; in_str = None
    while j < len(js):
        c = js[j]
        if in_str:
            if c == '\\': j += 2; continue
            if c == in_str: in_str = None
        else:
            if c in '"\'`': in_str = c
            elif c == open_ch: depth += 1
            elif c == close_ch:
                depth -= 1
                if depth == 0: break
        j += 1
    lit = js[i:j + 1]
    out = subprocess.run(['node', '-e', 'process.stdout.write(JSON.stringify(eval("(" + process.argv[1] + ")")))', lit], capture_output=True, text=True)
    if out.returncode: raise RuntimeError(out.stderr)
    return json.loads(out.stdout)

def html_inline(s):
    """'Cine en <strong>Casa</strong>' -> partes con bold."""
    el = BeautifulSoup('<x>' + s + '</x>', 'html.parser').find('x')
    return simple(inline(el))

def extract_hub(group):
    path = f'{group}/index.html'
    soup = load(path); main = soup.find('main'); secs = main.find_all('section', recursive=False)
    js = open(os.path.join(ROOT, 'scripts', 'pages', f'{group}.js')).read()
    d = {'path': '/' + group}
    meta = lambda sel, a: (soup.select_one(sel) or {}).get(a, '') if soup.select_one(sel) else ''
    d['seo'] = {'title': text(soup.title), 'description': meta('meta[name=description]', 'content'),
                'ogImage': re.sub(r'^https://www.dgaudiosound.com', '', meta('meta[property="og:image"]', 'content')),
                'ogImageAlt': meta('meta[property="og:image:alt"]', 'content')}
    ld = json.loads(soup.find('script', type='application/ld+json').string)
    d['jsonLd'] = ld.get('@graph', [ld])
    d['breadcrumbs'] = []
    for g in d['jsonLd']:
        if g.get('@type') == 'BreadcrumbList':
            d['breadcrumbs'] = [{'name': i['name'], 'href': re.sub(r'^https://www.dgaudiosound.com', '', i['item']) or '/'} for i in g['itemListElement']]
    wf = soup.find('a', class_='whatsapp-float'); d['floatMessage'] = wa_msg(wf['href']) if wf else ''

    by_id = {s.get('id'): s for s in secs}
    cls_of = lambda s: s.get('class', [])
    hero = secs[0]
    cta = hero.find('a', class_='btn')
    d['hero'] = {'slides': [img_src(re.search(r"url\('?([^')]+)'?\)", s.get('style', '')).group(1)) for s in hero.select('.hero-lux-slide')],
                 'kicker': text(hero.find(class_='lux-kicker')), 'title': inline(hero.find('h1')),
                 'subtitle': text(hero.find(class_='hero-lux-subtitle')),
                 'ctaLabel': text(cta), 'ctaHref': cta['href'], 'ctaStyle': style_of(cta),
                 'badges': [{'icon': icon_cls(b), 'label': text(b.find('span'))} for b in hero.select('.hero-lux-badge')]}
    # problema
    s = by_id['problema']; box = s.select_one('.reveal-lux')
    ps = box.find_all('p', recursive=False)
    cards = s.select('.antithesis-problem-card')
    pimg = s.select_one('.antithesis-main-img')
    pc = s.select_one('.antithesis-problems')
    d['problem'] = {'kicker': text(box.find(class_='lux-kicker')), 'title': simple(inline(box.find('h2'))),
        'lead': simple(inline(ps[0])), 'leadStyle': style_of(ps[0]),
        'body': simple(inline(ps[1])) if len(ps) > 1 else None, 'bodyStyle': style_of(ps[1]) if len(ps) > 1 else '',
        'cards': [{**icard(c), 'iconStyle': style_of(c.find('i'))} for c in cards], 'cardsStyle': style_of(pc), 'cardsReveal': 'reveal-lux' in pc.get('class', []),
        'sideLayout': s.select_one('.antithesis-grid') is not None,
        'image': {'src': img_src(pimg['src']), 'alt': pimg.get('alt', ''), 'style': style_of(pimg)} if pimg else None,
        'imageWrapStyle': style_of(s.select_one('.antithesis-visual-wrapper')) if pimg else ''}
    # showcase
    s = by_id['sistemas']; sysdata = js_literal(js, 'systemsData')
    navs = [text(b) for b in s.select('.showcase-nav-btn')]
    first_link = s.select_one('.showcase-info-panel .gateway-lux-link')
    d['showcase'] = {'kicker': text(s.select_one('.showcase-info-panel .lux-kicker')), 'kickerStyle': style_of(s.select_one('.showcase-info-panel .lux-kicker')),
        'slides': [img_src(re.search(r"url\('?([^')]+)'?\)", x.get('style', '')).group(1)) for x in s.select('.showcase-slide')],
        'linkLabel': norm(first_link.get_text()), 'navLabels': navs,
        'initial': {'title': simple(inline(s.select_one('.showcase-slide-title'))), 'desc': text(s.select_one('.showcase-slide-desc')),
                    'specs': [text(li) for li in s.select('.showcase-specs li')], 'link': first_link['href']},
        'systems': [{'title': html_inline(x['title']), 'desc': norm(x['desc']), 'specs': [norm(t) for t in x['specs']], 'link': x['link']} for x in sysdata]}
    # blueprint
    s = by_id['blueprint']; bp = js_literal(js, 'blueprintData'); head = s.select_one('.container-lux > div')
    panel = s.select_one('#blueprint-details')
    d['blueprint'] = {'kicker': text(head.find(class_='lux-kicker')), 'title': simple(inline(head.find('h2'))), 'lead': simple(inline(head.find(class_='lux-lead'))),
        'image': {'src': img_src(s.select_one('.blueprint-viewer img')['src']), 'alt': s.select_one('.blueprint-viewer img').get('alt', '')},
        'hotspots': [{'key': h['data-target'], 'spot': [c for c in h['class'] if c.startswith('spot-')][0], 'label': text(h)} for h in s.select('.blueprint-hotspot')],
        'panelHeader': text(panel.select_one('#bp-header')), 'initial': {
            'title': simple(inline(panel.select_one('#bp-title'))), 'desc': text(panel.select_one('#bp-desc')),
            'tech1Title': text(panel.select_one('#bp-tech1-title')), 'tech1Desc': text(panel.select_one('#bp-tech1-desc')),
            'tech2Title': text(panel.select_one('#bp-tech2-title')), 'tech2Desc': text(panel.select_one('#bp-tech2-desc'))},
        'entries': {k: {'header': v['header'], 'title': html_inline(v['title']), 'desc': norm(v['desc']), 'tech1Title': v['tech1Title'], 'tech1Desc': v['tech1Desc'], 'tech2Title': v['tech2Title'], 'tech2Desc': v['tech2Desc']} for k, v in bp.items()}}
    # beneficios
    s = by_id['beneficios']; head = s.select_one('.container-lux > div')
    d['benefits'] = {'kicker': text(head.find(class_='lux-kicker')), 'title': simple(inline(head.find('h2'))), 'subtitle': text(head.find('p')),
        'cards': [{'icon': icon_cls(c), 'title': text(c.find(class_='card-lux-title')), 'text': text(c.find(class_='card-lux-desc')), 'style': style_of(c)} for c in s.select('.card-lux')]}
    # proceso
    s = by_id['proceso']; head = s.select_one('.container-lux > div')
    cta2 = s.select_one('.process-cta a')
    d['process'] = {'kicker': text(head.find(class_='lux-kicker')), 'title': simple(inline(head.find('h2'))), 'subtitle': text(head.find('p')),
        'steps': [{**icard(c), 'num': text(c.select_one('.bento-num'))} for c in s.select('.process-bento-item')],
        'quote': text(s.find(class_='process-quote-simple')), 'ctaLabel': text(cta2), 'ctaMessage': wa_msg(cta2['href']), 'ctaStyle': style_of(cta2)}
    # aplicaciones (gateway)
    s = by_id['aplicaciones']; head = s.select_one('.container-lux > div')
    d['gateway'] = {'kicker': text(head.find(class_='lux-kicker')), 'title': simple(inline(head.find('h2'))), 'lead': simple(inline(head.find(class_='lux-lead'))),
        'cards': [{'src': img_src(c.find('img')['src']), 'alt': c.find('img').get('alt', ''), 'title': text(c.find('h3')), 'text': text(c.find('p')),
                   'href': c.find('a')['href'], 'linkLabel': norm(c.find('a').get_text()), 'style': style_of(c)} for c in s.select('.gateway-lux-card')]}
    # marcas
    s = by_id['marcas']; head = s.select_one('.container-lux > div')
    d['brands'] = {'kicker': text(head.find(class_='lux-kicker')), 'title': simple(inline(head.find('h2'))), 'titleStyle': style_of(head.find('h2')), 'subtitle': text(head.find('p')),
        'names': [text(t) for t in s.select('.ticker-item')], 'sectionStyle': style_of(s)}
    # faq
    s = by_id['faq']; head = s.select_one('.container-lux > div')
    d['faq'] = {'kicker': text(head.find(class_='lux-kicker')), 'title': simple(inline(head.find('h2'))),
        'items': [{'question': text(i.select_one('.faq-lux-btn')), 'answer': text(i.select_one('.faq-lux-answer'))} for i in s.select('.faq-lux-item')]}
    # contacto
    s = by_id['contacto']; hd = s.select_one('.section-header'); dkb = s.select_one('.contact-bubble-dark'); lt = s.select_one('.contact-bubble-light'); sel = lt.find('select')
    def meth(m): return {'icon': icon_cls(m), 'label': text(m.find('strong')), 'detail': text(m.select_one('.cb-method-info span')), 'href': m.get('href', '')}
    ph = sel.find('option', attrs={'disabled': True})
    note = lt.select_one('.cb-privacy-note')
    msg = re.search(r'const msg = `(.*?)`;', js, re.S).group(1)
    msg = re.sub(r'\$\{(\w+)\}', r'{\1}', msg)
    d['contact'] = {'title': inline(hd.find('h2')), 'subtitle': text(hd.find(class_='section-subtitle')),
        'badge': text(dkb.find(class_='cb-badge')), 'panelTitle': inline(dkb.find('h2')), 'panelText': text(dkb.find(class_='cb-desc')),
        'methods': [meth(m) for m in dkb.select('.cb-method')],
        'formTitle': text(lt.find('h3')), 'formDescription': text(lt.find(class_='cb-form-desc')),
        'labels': {l.get('for'): text(l) for l in lt.find_all('label')},
        'placeholders': {i.get('id'): i.get('placeholder', '') for i in lt.find_all(['input', 'textarea'])},
        'required': {i.get('id'): i.has_attr('required') for i in lt.find_all(['input', 'textarea', 'select'])},
        'selectPlaceholder': text(ph) if ph is not None else '',
        'projectTypes': [{'value': o['value'], 'label': text(o)} for o in sel.find_all('option') if o.get('value')],
        'submitLabel': text(lt.find('button', class_='cb-submit')),
        'privacyNote': simple(inline(note)) if note else '',
        'whatsappTemplate': msg}
    return d

if __name__ == '__main__':
    import sys
    out = extract_hub(sys.argv[1]); print(json.dumps(out, ensure_ascii=False, indent=1)[:2500])
