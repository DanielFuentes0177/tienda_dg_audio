import re, json, sys, glob, os
from bs4 import BeautifulSoup, NavigableString, Tag
ROOT='/Users/kelebra/Documents/Rpm_Code/Dg_audio'

def norm(t): return re.sub(r'\s+',' ',t or '').strip()
def text(el): return norm(el.get_text(' ')) if el else ''
def parts(el):
    """Contenido inline -> lista de partes [{text, accent?}] (spans .text-accent / .text-gradient-gold)."""
    out=[]
    if el is None: return out
    for c in el.children:
        if isinstance(c,NavigableString):
            t=re.sub(r'\s+',' ',str(c))
            if t: out.append({'text':t})
        elif isinstance(c,Tag):
            if c.name=='br': out.append({'text':'\n'}); continue
            acc = any(k in (c.get('class') or []) for k in ('text-accent','text-gradient-gold'))
            t=re.sub(r'\s+',' ',c.get_text())
            out.append({'text':t,'accent':True} if acc else {'text':t})
    # merge adjacent same-type, trim
    merged=[]
    for p in out:
        if merged and bool(merged[-1].get('accent'))==bool(p.get('accent')): merged[-1]['text']+=p['text']
        else: merged.append(dict(p))
    if merged:
        merged[0]['text']=merged[0]['text'].lstrip(); merged[-1]['text']=merged[-1]['text'].rstrip()
    return [m for m in merged if m['text']]
def icon_of(el):
    i = el.find('i') if el else None
    if not i: return None
    cl=[c for c in i.get('class',[]) if c.startswith('fa-') and c not in('fa-solid','fa-brands','fa-regular')]
    return cl[0][3:] if cl else None
def paras(el):
    """Párrafos de un contenedor: <p> hijos directos (con <br><br> separados en partes)."""
    return [text(p) for p in el.find_all('p',recursive=False)]
def img(el, base):
    if not el: return None
    src=el.get('src',''); src=re.sub(r'^(\.\./)+','/',src)
    return {'src':src,'alt':el.get('alt','')}

def load(path):
    h=open(os.path.join(ROOT,path)).read()
    return BeautifulSoup(h,'html.parser')

def inline(el):
    """Contenido inline -> partes {text, accent?, href?}; <br> como '\\n'."""
    out=[]
    for c in el.children:
        if isinstance(c,NavigableString):
            t=re.sub(r'\s+',' ',str(c))
            if t: out.append({'text':t})
        elif isinstance(c,Tag):
            if c.name=='br': out.append({'text':'\n'}); continue
            d={'text':re.sub(r'\s+',' ',c.get_text())}
            if 'text-accent' in (c.get('class') or []): d['accent']=True
            if 'text-gradient-gold' in (c.get('class') or []): d['gradient']=True
            if c.name=='a' and c.get('href'): d['href']=c['href']
            if c.name in('strong','b'): d['bold']=True
            out.append(d)
    merged=[]
    for p in out:
        key=(bool(p.get('accent')),bool(p.get('gradient')),p.get('href'),bool(p.get('bold')))
        if merged and merged[-1][0]==key and not p.get('href'): merged[-1][1]['text']+=p['text']
        else: merged.append([key,dict(p)])
    res=[m[1] for m in merged]
    if res: res[0]['text']=res[0]['text'].lstrip(); res[-1]['text']=res[-1]['text'].rstrip()
    return [r for r in res if r['text']!='']
def simple(parts_):
    """Si no hay formato, devuelve string; si no, lista de partes."""
    if all(len(p)==1 for p in parts_): return ''.join(p['text'] for p in parts_)
    return parts_
def wa_msg(href):
    from urllib.parse import urlparse, parse_qs, unquote
    q=parse_qs(urlparse(href).query); return unquote(q.get('text',[''])[0]) if q else ''
def icard(div):
    h=div.find(['h3','h4']); p=div.find('p')
    return {'icon': icon_cls(div), 'title': text(h), 'text': text(p)}
def icon_cls(el):
    i=el.find('i')
    if not i: return None
    cl=[c for c in i.get('class',[]) if c.startswith('fa-')]
    return ' '.join(cl) if cl else None
def sec_header(sec):
    return {'eyebrow':text(sec.find(class_='eyebrow')), 'title':simple(inline(sec.find(['h2']))),
            'subtitle':simple(inline(sec.find(class_='section-subtitle'))) if sec.find(class_='section-subtitle') else ''}

def extract_page(path):
    soup=load(path); main=soup.find('main'); secs=main.find_all('section',recursive=False)
    d={'path':'/'+path[:-5]}
    # SEO
    d['seo']={'title':text(soup.title),'description':soup.find('meta',attrs={'name':'description'})['content'],
              'ogImage':re.sub(r'^https://www.dgaudiosound.com','',soup.find('meta',attrs={'property':'og:image'})['content']),
              'ogImageAlt':soup.find('meta',attrs={'property':'og:image:alt'})['content'] if soup.find('meta',attrs={'property':'og:image:alt'}) else ''}
    ld=json.loads(soup.find('script',type='application/ld+json').string)
    graph=ld['@graph']; svc=[g for g in graph if g['@type']=='Service'][0]; bcs=[g for g in graph if g['@type']=='BreadcrumbList']; bc=bcs[0] if bcs else None
    d['jsonLd']=graph
    d['schema']={k:svc.get(k,'') for k in ('name','serviceType','category','areaServed','description')}
    d['breadcrumbs']=[{'name':i['name'],'href':re.sub(r'^https://www.dgaudiosound.com','',i['item']) or '/'} for i in bc['itemListElement']] if bc else []
    # hero
    hero=secs[0]
    slides=[]
    for s in hero.select('.hero-slider .slide'):
        m=re.search(r"url\('?([^')]+)'?\)",s.get('style','')); slides.append(re.sub(r'^(\.\./)+','/',m.group(1)) if m else None)
    cta=hero.find('a',class_='btn')
    hp=hero.find('p',class_='hero-subtitle')
    hparas=[]; cur=[]
    for c in hp.children:
        if isinstance(c,Tag) and c.name=='br':
            if cur: hparas.append(cur); cur=[]
            continue
        cur.append(c)
    if cur: hparas.append(cur)
    def join(nodes): return norm(''.join(str(n) if isinstance(n,NavigableString) else n.get_text() for n in nodes))
    d['hero']={'kicker':text(hero.find(class_='hero-kicker')),'title':inline(hero.find('h1')),
        'paragraphs':[join(x) for x in hparas if join(x)],
        'badges':[{'icon':icon_cls(b),'label':text(b)} for b in hero.select('.hero-badge-item')],
        'slides':slides,'ctaLabel':text(cta),'ctaIcon':icon_cls(cta),'ctaMessage':wa_msg(cta['href'])}
    # sections by role
    rest=secs[1:]
    ctx={}
    for s in rest:
        cl=s.get('class',[])
        if 'lux-dark-section' in cl: ctx['problem']=s
        elif 'contact-bubbles-section' in cl: ctx['contact']=s
        elif s.get('id')=='incluye': ctx['includes']=s
        elif s.get('id')=='proceso': ctx['process']=s
        elif s.get('id')=='faq': ctx['faq']=s
        elif s.select_one('.brands-ticker'): ctx['diff']=s
        elif s.select_one('.two-col') and 'intro' not in ctx: ctx['intro']=s
        elif s.select_one('.area-card'): ctx['areas']=s
        elif s.select_one('.value-prop-lux'): ctx['extra']=s
        else: ctx.setdefault('unknown',[]).append(s)
    # intro
    s=ctx['intro']; left=s.select_one('.two-col > div:nth-child(1)')
    fig=s.select_one('.two-col img')
    d['intro']={'eyebrow':text(left.find(class_='eyebrow')),'title':inline(left.find('h2')),
        'paragraphs':[simple(inline(p)) for p in left.find_all('p',recursive=False)],
        'image':{**img(fig,''),'width':0,'height':0},
        'benefits':[icard(c) for c in s.select('.benefits-corp-grid .benefit-v2-card')]}
    # problem
    s=ctx['problem']; box=s.select_one('.container > div')
    d['problem']={'eyebrow':text(box.find(class_='eyebrow')),'title':simple(inline(box.find('h2'))),
        'paragraphs':[simple(inline(p)) for p in box.find_all('p',recursive=False)],
        'cards':[icard(c) for c in s.select('.antithesis-problem-card')]}
    if 'extra' in ctx:
        s=ctx['extra']; h=sec_header(s); h['items']=[icard(c) for c in s.select('.benefit-v2-card')]; d['extra']=h
    # includes
    s=ctx['includes']; h=sec_header(s); h['items']=[icard(c) for c in s.select('.include-card')]; d['includes']=h
    # areas
    s=ctx['areas']; h=sec_header(s)
    h['items']=[{'image':img(a.find('img'),''),'label':text(a.find('span'))} for a in s.select('.area-card')]
    b=s.select_one('.event-banner')
    if b:
        bc_=b.find('a',class_='btn')
        h['banner']={'image':img(b.select_one('.event-img img'),''),'eyebrow':text(b.find(class_='eyebrow')),'title':simple(inline(b.find('h2'))),
           'text':text(b.select_one('.event-content p')),'ctaLabel':text(bc_) if bc_ else '','ctaMessage':wa_msg(bc_['href']) if bc_ else ''}
    d['areas']=h
    # process
    s=ctx['process']; h=sec_header(s)
    h['steps']=[{**icard(c),'num':text(c.select_one('.bento-num'))} for c in s.select('.process-bento-item')]
    h['quote']=text(s.find(class_='process-quote-simple'))
    cta2=s.select_one('.process-cta a')
    h['ctaLabel']=text(cta2); h['ctaMessage']=wa_msg(cta2['href'])
    d['process']=h
    # differentiator
    s=ctx['diff']; dk=s.select_one('.dark-panel'); gd=s.select_one('.gold-panel'); br=s.select_one('#marcas')
    d['differentiator']={'dark':{'eyebrow':text(dk.find(class_='eyebrow')),'title':simple(inline(dk.find('h2'))),'paragraphs':[simple(inline(p)) for p in dk.find_all('p',recursive=False)]},
        'gold':{'eyebrow':text(gd.find(class_='eyebrow')),'title':simple(inline(gd.find('h2'))),'items':[text(li) for li in gd.select('li')]},
        'brands':{'eyebrow':text(br.find(class_='eyebrow')),'title':inline(br.find('h2')),'subtitle':text(br.find(class_='section-subtitle')),
                  'names':[text(t) for t in s.select('.brands-ticker .ticker-item')]}}
    # faq
    s=ctx['faq']; h=sec_header(s); h['items']=[{'question':text(i.select_one('.faq-lux-btn span')),'answer':text(i.select_one('.faq-lux-answer'))} for i in s.select('.faq-lux-item')]; d['faq']=h
    # contact
    s=ctx['contact']; hd=s.select_one('.section-header'); dkb=s.select_one('.contact-bubble-dark'); lt=s.select_one('.contact-bubble-light')
    meths=dkb.select('.cb-method')
    def meth(m):
        st=m.find('strong'); sp=m.select_one('.cb-method-info span')
        return {'icon':icon_cls(m),'label':text(st),'detail':text(sp)}
    sel=lt.find('select')
    labels={l.get('for'):text(l) for l in lt.find_all('label')}
    d['contact']={'title':inline(hd.find('h2')),'subtitle':text(hd.find(class_='section-subtitle')),
        'badge':text(dkb.find(class_='cb-badge')),'panelTitle':inline(dkb.find('h2')),'panelText':text(dkb.find(class_='cb-desc')),
        'methods':[meth(m) for m in meths],
        'formTitle':simple(inline(lt.find('h3'))),'formDescription':text(lt.find(class_='cb-form-desc')),
        'labels':labels,
        'placeholders':{i.get('id'):i.get('placeholder','') for i in lt.find_all(['input','textarea'])},
        'selectPlaceholder':(text(sel.find('option',attrs={'disabled':True})) if sel.find('option',attrs={'disabled':True}) is not None else ''),
        'projectTypes':[{'value':o['value'],'label':text(o)} for o in sel.find_all('option') if o.get('value')],
        'required':{i.get('id'):i.has_attr('required') for i in lt.find_all(['input','textarea','select'])},
        'submitLabel':text(lt.find('button',class_='cb-submit')),
        'unknown':[str(u.get('class'))+':'+str(u.get('id')) for u in ctx.get('unknown',[])]}
    # pageHeading: pasa por options de initSubpage si existe
    html=open(os.path.join(ROOT,path)).read()
    m=re.search(r"pageTitle:\s*['\"]([^'\"]+)",html); d['contact']['pageHeading']=m.group(1) if m else ''
    # whatsapp float (aria + href msg)
    wf=soup.find('a',class_='whatsapp-float'); d['floatMessage']=wa_msg(wf['href']) if wf else ''
    return d
