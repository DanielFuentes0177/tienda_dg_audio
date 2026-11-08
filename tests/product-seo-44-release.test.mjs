import assert from "node:assert/strict";
import test from "node:test";
import { PRODUCT_SEO_PILOT_44 } from "../src/lib/seo/productSeoPilot44.ts";
import { PRODUCT_SEO_PILOT_4, getProductUrl } from "../src/lib/seo/productSeoPilot4.ts";

test("exactamente 44 productos con metadatos aprobados", () => {
  assert.equal(Object.keys(PRODUCT_SEO_PILOT_44).length, 44);
  for (const [id, seo] of Object.entries(PRODUCT_SEO_PILOT_44)) {
    assert.match(id, /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/);
    assert.ok(seo.title.length > 15);
    assert.ok(seo.description.length > 40);
  }
});

test("piloto de cuatro slugs permanece incluido en las 44 aprobaciones", () => {
  for (const [id, product] of Object.entries(PRODUCT_SEO_PILOT_4)) {
    assert.ok(PRODUCT_SEO_PILOT_44[id], `Ausente: ${id}`);
    assert.equal(getProductUrl(id), `https://www.dgaudiosound.com/tienda/producto/${product.slug}`);
  }
});

test("los otros cuarenta productos conservan UUID en rutas públicas", () => {
  const pilot = new Set(Object.keys(PRODUCT_SEO_PILOT_4));
  const remaining = Object.keys(PRODUCT_SEO_PILOT_44).filter(id => !pilot.has(id));
  assert.equal(remaining.length, 40);
  for (const id of remaining) assert.equal(getProductUrl(id), `https://www.dgaudiosound.com/tienda/producto/${id}`);
});
