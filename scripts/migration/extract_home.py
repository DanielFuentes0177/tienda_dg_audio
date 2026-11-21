"""Extractor de la HOME (index.html) y de las páginas LEGALES -> dicts para HomePageContent / LegalPageContent."""
import re, json, os
from bs4 import BeautifulSoup
from extract import ROOT, norm, text, inline, simple, icon_cls, wa_msg, load

def src_of(s):
    s = re.sub(r'\?.*$', '', s or '')
    return re.sub(r'^(\.\.?/)+', '/', s) if not s.startswith('/') else s
def style_of(el): return (el.get('style') or '').strip() if el is not None else ''
def delay_of(el): 
    m = re.search(r'transition-delay:\s*(\d+)ms', style_of(el)); return int(m.group(1)) if m else None
def metas(soup):
    g = lambda sel, a: (soup.select_one(sel).get(a, '') if soup.select_one(sel) else '')
    return {'title': text(soup.title), 'description': g('meta[name=description]', 'content'),
            'ogTitle': g('meta[property="og:title"]', 'content'), 'ogDescription': g('meta[property="og:description"]', 'content'),
            'ogImage': re.sub(r'^https://www.dgaudiosound.com', '', g('meta[property="og:image"]', 'content')),
            'ogImageAlt': g('meta[property="og:image:alt"]', 'content'), 'robots': g('meta[name=robots]', 'content')}
def jsonld(soup):
    out = []
    for x in soup.find_all('script', type='application/ld+json'):
        j = json.loads(x.string); out += j.get('@graph', [j])
    return out

def extract_home():
    soup = load('index.html'); body = soup.body
    els = [e for e in body.find_all(recursive=False) if e.name in ('section', 'div') and 'cookie-consent' not in (e.get('class') or [])]
    by = lambda pred: next(e for e in els if pred(e))
    cls = lambda e: e.get('class', [])
    d = {'path': '/', 'seo': metas(soup), 'jsonLd': jsonld(soup)}
    d['seo']['verification'] = (soup.find('meta', attrs={'name': 'google-site-verification'}) or {}).get('content', '')
    # hero
    h = by(lambda e: 'hero' in cls(e))
    kick = h.find(class_='hero-kicker')
    d['hero'] = {'kicker': text(kick), 'kickerStyle': style_of(kick), 'title': inline(h.find('h1')), 'subtitle': text(h.find(class_='hero-subtitle')),
        'slides': [{'bgClass': (s.get('data-bg-class') or [c for c in s.get('class', []) if c.startswith('slide-')][0])} for s in h.select('.hero-slider .slide')],
        'specialties': [{'icon': icon_cls(a), 'label': text(a), 'href': a['href']} for a in h.select('.specialty-tag')],
        'buttons': [{'label': text(a), 'href': a['href'], 'variant': 'btn-secondary' if 'btn-secondary' in a['class'] else 'btn-primary', 'style': style_of(a)} for a in h.select('.hero-buttons a')],
        'subtext': text(h.find(class_='hero-subtext')), 'subtextStyle': style_of(h.find(class_='hero-subtext'))}
    # trust bar
    t = by(lambda e: 'trust-bar-wrapper' in cls(e))
    d['trust'] = [{'icon': icon_cls(i), 'title': text(i.find(class_='trust-title')), 'text': text(i.find('p'))} for i in t.select('.trust-item')]
    # advice
    a = by(lambda e: 'section-dark-premium' in cls(e))
    d['advice'] = {'badge': text(a.find(class_='advice-badge')), 'title': simple(inline(a.find(class_='advice-title'))), 'subtitle': text(a.find(class_='advice-subtitle')),
        'cards': [{'title': simple(inline(c.find('h3'))), 'text': text(c.find('p')), 'delay': delay_of(c)} for c in a.select('.advice-card')],
        'footer': text(a.find(class_='advice-footer-text'))}
    # assurance (premium white)
    p = by(lambda e: 'section-premium-white' in cls(e))
    d['assurance'] = {'title': simple(inline(p.find(class_='process-title'))), 'subtitle': text(p.find(class_='process-subtitle')),
        'cards': [{'num': text(c.find(class_='process-number')), 'icon': icon_cls(c), 'title': text(c.find('h3')), 'text': text(c.find('p')), 'delay': delay_of(c)} for c in p.select('.process-card')],
        'closing': text(p.find(class_='section-closing-text'))}
    # soluciones
    s = by(lambda e: e.get('id') == 'soluciones'); hd = s.select_one('.section-header')
    d['solutions'] = {'title': text(hd.find('h2')), 'subtitle': text(hd.find('p')),
        'cards': [{'delay': delay_of(c), 'img': {'src': src_of(c.find('img')['src']), 'alt': c.find('img').get('alt', '')}, 'overlayTitle': text(c.find(class_='apps-title')),
                   'tags': [text(t) for t in c.select('.app-tag')], 'icon': icon_cls(c.find(class_='solution-icon')), 'title': text(c.find(class_='solution-title')),
                   'desc': text(c.find(class_='solution-desc')), 'linkLabel': text(c.find(class_='btn-solution')), 'href': c.find(class_='btn-solution')['href']} for c in s.select('.solution-card')],
        'closing': text(s.find(class_='section-closing-text'))}
    # aplicaciones
    s = by(lambda e: e.get('id') == 'aplicaciones'); hd = s.select_one('.section-header')
    d['applications'] = {'title': text(hd.find('h2')), 'subtitle': text(hd.find('p')),
        'categories': [{'icon': icon_cls(c.find(class_='category-name')), 'name': text(c.find(class_='category-name')), 'intro': text(c.find(class_='category-intro')),
                        'items': [{'href': a['href'], 'icon': icon_cls(a), 'title': text(a.find('h4')), 'desc': text(a.find(class_='hover-desc'))} for a in c.select('.sub-item')]} for c in s.select('.app-category-block')],
        'footerText': text(s.find(class_='apps-footer-text')),
        'ctas': [{'label': text(a), 'href': a['href'], 'variant': 'btn-secondary' if 'btn-secondary' in a['class'] else 'btn-primary'} for a in s.select('.apps-ctas a')]}
    # proceso
    s = by(lambda e: e.get('id') == 'proceso'); hd = s.select_one('.section-header'); cta = s.select_one('.process-cta a')
    d['process'] = {'title': simple(inline(hd.find('h2'))), 'subtitle': text(hd.find('p')),
        'steps': [{'num': text(c.find(class_='bento-num')), 'icon': icon_cls(c), 'title': text(c.find('h3')), 'text': text(c.find('p'))} for c in s.select('.process-bento-item')],
        'quote': text(s.find(class_='process-quote-simple')), 'ctaLabel': text(cta), 'ctaMessage': wa_msg(cta['href'])}
    # por qué
    s = by(lambda e: e.get('id') == 'nosotros'); hd = s.select_one('.section-header')
    d['whyUs'] = {'title': text(hd.find('h2')), 'subtitle': text(hd.find('p')),
        'cards': [{'icon': icon_cls(c), 'title': text(c.find('h3')), 'text': text(c.find('p')), 'delay': delay_of(c)} for c in s.select('.why-card')],
        'closing': text(s.find(class_='section-closing-text')), 'closingClass': ' '.join(c for c in s.find(class_='section-closing-text')['class'] if c != 'section-closing-text')}
    # marcas
    s = by(lambda e: e.get('id') == 'marcas'); hd = s.select_one('.section-header')
    d['brands'] = {'title': simple(inline(hd.find('h2'))), 'subtitle': text(hd.find('p')), 'names': [text(t) for t in s.select('.ticker-item')], 'closing': text(s.find(class_='section-closing-text'))}
    # faq
    s = by(lambda e: e.get('id') == 'faq')
    d['faq'] = {'title': text(s.find('h2')), 'items': [{'question': text(i.find(class_='accordion-header')), 'answer': text(i.find(class_='accordion-content'))} for i in s.select('.accordion-item')]}
    # contacto
    s = by(lambda e: e.get('id') == 'contacto'); hd = s.select_one('.section-header'); dkb = s.select_one('.contact-bubble-dark'); lt = s.select_one('.contact-bubble-light'); sel = lt.find('select')
    def meth(m): return {'icon': icon_cls(m), 'label': text(m.find('strong')), 'detail': text(m.select_one('.cb-method-info span')), 'href': m.get('href', '')}
    ph = sel.find('option', value='')
    js = open(os.path.join(ROOT, 'scripts', 'organisms', 'whatsapp-forms.js')).read()
    msg_m = re.search(r"const text = `(Hola DG Audiosound! 👋\\n\\nSolicito asesor.*?)`;", js, re.S)
    note = lt.select_one('.cb-privacy-note')
    d['contact'] = {'title': inline(hd.find('h2')), 'titleStyle': style_of(hd), 'sectionStyle': style_of(s), 'subtitle': text(hd.find(class_='section-subtitle')),
        'badge': text(dkb.find(class_='cb-badge')), 'panelTitle': inline(dkb.find('h2')), 'panelText': text(dkb.find(class_='cb-desc')),
        'methods': [meth(m) for m in dkb.select('.cb-method')], 'formTitle': text(lt.find('h3')), 'formDescription': text(lt.find(class_='cb-form-desc')),
        'labels': {l.get('for'): text(l) for l in lt.find_all('label')}, 'placeholders': {i.get('id'): i.get('placeholder', '') for i in lt.find_all(['input', 'textarea'])},
        'required': {i.get('id'): i.has_attr('required') for i in lt.find_all(['input', 'textarea', 'select'])},
        'selectPlaceholder': text(ph) if ph is not None else '', 'selectPlaceholderDisabled': bool(ph is not None and ph.has_attr('disabled')),
        'projectTypes': [{'value': o['value'], 'label': text(o)} for o in sel.find_all('option') if o.get('value')],
        'submitLabel': text(lt.find('button', class_='cb-submit')), 'privacyNote': simple(inline(note)) if note else '',
        'whatsappTemplate': re.sub(r'\$\{(\w+)\}', r'{\1}', msg_m.group(1)).replace('\\n', '\n') if msg_m else ''}
    return d

def extract_legal(slug):
    soup = load(slug + '.html'); main = soup.find('main'); hdr = main.find(class_='legal-header')
    d = {'path': '/' + slug, 'seo': metas(soup), 'jsonLd': jsonld(soup), 'title': text(hdr.find('h1')), 'updated': text(hdr.find('p')),
         'index': [{'href': a['href'], 'label': text(a)} for a in main.select('.legal-index-list a')], 'indexTitle': text(main.select_one('.legal-index-card h3')), 'sections': []}
    for sec in main.select('.legal-article > div[id]'):
        blocks = []
        for c in sec.find_all(recursive=False):
            if c.name == 'h2': continue
            if c.name == 'p': blocks.append({'type': 'p', 'text': simple(inline(c))})
            elif c.name == 'ul': blocks.append({'type': 'ul', 'items': [simple(inline(li)) for li in c.find_all('li', recursive=False)]})
            else: raise ValueError('bloque legal no soportado: ' + c.name)
        d['sections'].append({'id': sec['id'], 'title': text(sec.find('h2')), 'blocks': blocks})
    return d
