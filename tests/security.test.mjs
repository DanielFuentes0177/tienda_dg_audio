import test from "node:test";
import assert from "node:assert/strict";
import { sanitizePostHtml } from "../src/lib/sanitize.ts";
import { rateLimit } from "../src/lib/rate-limit.ts";

test("sanitize elimina scripts, handlers y javascript:", () => {
  const out = sanitizePostHtml('<p onclick="x()">Hola</p><script>alert(1)</script><a href="javascript:alert(1)">a</a><img src=x onerror=alert(1)><iframe src="//evil"></iframe>');
  assert.ok(!/script|onclick|onerror|javascript:|iframe/i.test(out), out);
  assert.ok(out.includes("Hola"));
});

test("sanitize conserva formato del editor", () => {
  const out = sanitizePostHtml('<h2 style="text-align:center">T</h2><p><strong>b</strong> <span style="color:#d4a437">c</span></p><img class="image-align-left" src="https://x.com/a.jpg" alt="a">');
  assert.match(out, /<h2 style="text-align:center">/);
  assert.match(out, /color:#d4a437/);
  assert.match(out, /image-align-left/);
});

test("rateLimit bloquea tras el máximo", () => {
  for (let i = 0; i < 3; i++) assert.ok(rateLimit("t", 3, 1000).ok);
  const r = rateLimit("t", 3, 1000);
  assert.equal(r.ok, false);
  assert.ok(r.retryAfterSec >= 1);
});

import { failuresLocked, recordFailure, clearFailures } from "../src/lib/rate-limit.ts";

test("login: solo fallos bloquean y un acierto limpia", () => {
  for (let i = 0; i < 8; i++) {
    assert.equal(failuresLocked("u", 8, 1000).locked, false); // consultar no consume
    recordFailure("u");
  }
  assert.equal(failuresLocked("u", 8, 1000).locked, true);
  clearFailures("u");
  assert.equal(failuresLocked("u", 8, 1000).locked, false);
});

test("sanitize conserva tablas, botones CTA y videos de YouTube del editor", () => {
  const html = '<table style="min-width: 75px"><colgroup><col style="min-width: 25px"></colgroup><tbody><tr><td colspan="1" style="text-align: left">x</td></tr></tbody></table>'
    + '<a class="dg-blog-cta-button" href="https://wa.me/525537270177">Cotiza</a>'
    + '<div data-youtube-video=""><iframe src="https://www.youtube.com/embed/abc" width="640" height="360" allowfullscreen></iframe></div>'
    + '<img class="image-align-center" data-align="center" src="https://x.com/a.png">';
  const out = sanitizePostHtml(html);
  assert.match(out, /<colgroup><col/);
  assert.match(out, /min-width:\s*25px/);
  assert.match(out, /dg-blog-cta-button/);
  assert.match(out, /<iframe src="https:\/\/www\.youtube\.com\/embed\/abc"/);
  assert.match(out, /data-align="center"/);
});

test("sanitize bloquea iframes que no son de YouTube", () => {
  assert.ok(!/<iframe/.test(sanitizePostHtml('<iframe src="https://evil.com/x"></iframe>')));
});
