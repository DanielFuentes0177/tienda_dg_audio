#!/usr/bin/env python3
"""Compara texto y estructura de una página HTML original con su versión en Next (SSR).
Uso: python3 scripts/migration/parity.py <base-url-next> <ruta> [<ruta> ...]"""
import sys, re, os, difflib, urllib.request
from bs4 import BeautifulSoup
sys.path.insert(0, os.path.dirname(__file__))
from extract import ROOT

KEY = ['benefit-v2-card','antithesis-problem-card','include-card','area-card','process-bento-item','faq-lux-item','ticker-item','cb-method','hero-badge-item','slide','check-list','event-banner','dark-panel','gold-panel','card-lux','gateway-lux-card','showcase-nav-btn','showcase-slide','hero-lux-badge','hero-lux-slide','blueprint-hotspot','faq-lux-btn','cb-field']

def words(root):
    for t in root.find_all(['script','style','noscript']): t.decompose()
    return re.sub(r'\s+',' ',root.get_text(' ')).strip().split(' ')

def counts(root):
    return {k: len(root.select('.'+k)) for k in KEY}

def main(base, paths):
    bad = 0
    for p in paths:
        f = os.path.join(ROOT, p.strip('/') + '.html')
        if not os.path.exists(f): f = os.path.join(ROOT, p.strip('/'), 'index.html')
        if p == '/': f = os.path.join(ROOT, 'index.html')
        soup0 = BeautifulSoup(open(f).read(), 'html.parser')
        orig = soup0.find('main')
        if orig is None:  # la home no tiene <main>: se quita el chrome (navbar, footer, cookies, whatsapp)
            orig = soup0.body
            for sel in ['header#navbar', 'footer', '.cookie-consent', 'a.whatsapp-float']:
                for t in orig.select(sel): t.decompose()
        html = urllib.request.urlopen(base + p).read().decode()
        nxt = BeautifulSoup(html, 'html.parser').select_one('.svc')
        c1, c2 = counts(orig), counts(nxt)
        w1, w2 = words(orig), words(nxt)
        ok_text = w1 == w2
        ok_cnt = c1 == c2
        print(('OK  ' if ok_text and ok_cnt else 'DIFF'), p, f'words {len(w1)} vs {len(w2)}')
        if not ok_cnt: print('   counts:', {k: (c1[k], c2[k]) for k in KEY if c1[k] != c2[k]})
        if not ok_text:
            bad += 1
            sm = difflib.SequenceMatcher(None, w1, w2, autojunk=False)
            n = 0
            for tag, i1, i2, j1, j2 in sm.get_opcodes():
                if tag != 'equal':
                    print('   ', tag, '|', ' '.join(w1[max(0,i1-3):i1]), '[[', ' '.join(w1[i1:i2]), ']] -> [[', ' '.join(w2[j1:j2]), ']]')
                    n += 1
                    if n >= 6: break
    return bad

if __name__ == '__main__':
    sys.exit(1 if main(sys.argv[1], sys.argv[2:]) else 0)
