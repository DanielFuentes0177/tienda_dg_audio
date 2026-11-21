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
