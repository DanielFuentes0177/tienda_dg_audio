"""Extractor de /soluciones y /aplicaciones (páginas heredadas) -> dicts para Solutions/ApplicationsPageContent."""
import re
from extract import ROOT, norm, text, simple, inline, icon_cls, load
from extract_home import metas, jsonld, style_of

def webp(src):  # las PNG de 2-4 MB se publican como WebP
    return re.sub(r'\.png$', '.webp', re.sub(r'^(\.\.?/)+', '/', src))

def extract_solutions():
    soup = load('soluciones/index.html'); main = soup.find('main'); secs = main.find_all('section', recursive=False)
    seo = metas(soup); seo['ogImage'] = seo['ogImage'] or '/assets/DG.png'
    hero = secs[0]
    d = {'path': '/soluciones', 'seo': seo, 'jsonLd': jsonld(soup), 'mainStyle': style_of(main),
         'hero': {'sectionStyle': re.sub(r"url\('([^']+)'\)", lambda m: "url('" + webp(m.group(1)) + "')", style_of(hero)),
                  'title': text(hero.find('h1')), 'titleStyle': style_of(hero.find('h1')), 'subtitle': text(hero.find(class_='hero-subtitle'))}}
    blocks = []
    for b in secs[1].select('.cta-container'):
        txt = b.find('div'); im = b.find('img'); cta = txt.find('a', class_='btn')
        blocks.append({'wrapStyle': style_of(b), 'textStyle': style_of(txt), 'textClass': ' '.join(txt.get('class', [])),
            'title': text(txt.find('h2')), 'subtitle': text(txt.find(class_='section-subtitle')), 'subtitleStyle': style_of(txt.find(class_='section-subtitle')),
            'bulletsStyle': style_of(txt.find('ul')), 'bullets': [text(li) for li in txt.find_all('li')],
            'ctaLabel': text(cta), 'ctaHref': cta['href'], 'ctaStyle': style_of(cta),
            'imageClass': ' '.join(im.parent.get('class', [])), 'image': {'src': webp(im['src']), 'alt': im.get('alt', ''), 'style': style_of(im)}})
    d['blocks'] = blocks
    cta = secs[2]; a = cta.find('a', class_='btn')
    d['cta'] = {'sectionClass': ' '.join(cta.get('class', [])), 'sectionStyle': style_of(cta), 'title': text(cta.find('h2')), 'titleClass': ' '.join(cta.find('h2').get('class', [])),
                'subtitle': text(cta.find(class_='section-subtitle')), 'subtitleClass': ' '.join(cta.find(class_='section-subtitle').get('class', [])),
                'btnWrapStyle': style_of(a.parent), 'ctaLabel': text(a), 'ctaHref': a['href'], 'btnClass': ' '.join(a.get('class', []))}
    return d

def extract_applications():
    soup = load('aplicaciones/index.html'); main = soup.find('main'); secs = main.find_all('section', recursive=False)
    seo = metas(soup); seo['ogImage'] = seo['ogImage'] or '/assets/DG.png'
    hero = secs[0]
    d = {'path': '/aplicaciones', 'seo': seo, 'jsonLd': jsonld(soup), 'mainStyle': style_of(main),
         'hero': {'sectionClass': ' '.join(hero.get('class', [])), 'sectionStyle': style_of(hero), 'title': text(hero.find('h1')),
                  'subtitle': text(hero.find(class_='hero-subtitle')), 'subtitleClass': ' '.join(hero.find(class_='hero-subtitle').get('class', []))},
         'categories': []}
    for c in secs[1].select('.app-category-block'):
        items = c.select('.sub-item')
        d['categories'].append({'icon': icon_cls(c.find(class_='category-name')), 'name': text(c.find(class_='category-name')), 'itemsStyle': style_of(c.find(class_='app-sub-items')),
            'items': [{'href': a['href'], 'style': style_of(a), 'title': text(a.find('h4')), 'iconClass': icon_cls(a.find('h4')), 'iconStyle': style_of(a.find('h4').find('i')), 'desc': text(a.find('p'))} for a in items]})
    cta = secs[2]; a = cta.find('a', class_='btn')
    d['sectionsClass'] = ' '.join(secs[1].get('class', []))
    d['cta'] = {'sectionClass': ' '.join(cta.get('class', [])), 'sectionStyle': style_of(cta), 'title': text(cta.find('h2')), 'titleClass': ' '.join(cta.find('h2').get('class', [])),
                'subtitle': text(cta.find(class_='section-subtitle')), 'subtitleClass': ' '.join(cta.find(class_='section-subtitle').get('class', [])),
                'btnWrapStyle': style_of(a.parent), 'ctaLabel': text(a), 'ctaHref': a['href'], 'btnClass': ' '.join(a.get('class', []))}
    return d
