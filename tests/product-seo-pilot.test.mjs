import assert from "node:assert/strict";
import test from "node:test";
import config from "../next.config.ts";
import {
  PRODUCT_SEO_PILOT_4, getProductIdForRoute, getProductPath, getProductUrl,
} from "../src/lib/seo/productSeoPilot4.ts";

// Approved copy at 1d28dc3. Keep these expectations independent of the implementation.
const approved = {
  "d40b51e9-bb0b-4aa6-bc97-ac9aae7dc1c3": {
    "title": "Biamp Voltera D 1200.2M | Amplificador con DSP de dos canales",
    "description": "Dimensiona dos circuitos de bocinas con el Biamp Voltera D 1200.2M. Revisamos cómo distribuir sus 1,200 W entre las áreas de tu proyecto.",
    "slug": "biamp-voltera-d-1200-2m"
  },
  "35682066-ab42-41ba-aacb-0ff7b86f8796": {
    "title": "Barco ClickShare Bar Pro | Barra de videoconferencia para doble pantalla",
    "description": "Diseña una sala híbrida con Barco ClickShare Bar Pro. Compara una salida 4K y dos pantallas Full HD antes de definir el montaje.",
    "slug": "barco-clickshare-bar-pro"
  },
  "984d626a-5b96-4904-b5d5-9e1527541283": {
    "title": "Hisense Commercial 65WE3FE | Pantalla interactiva de 65 pulgadas",
    "description": "Hisense 65WE3FE de 65 pulgadas para clases y anotación colaborativa. Evalúa el montaje y la cámara externa si habrá sesiones híbridas.",
    "slug": "hisense-65we3fe"
  },
  "31056167-e2dd-417d-8de4-443aa5066709": {
    "title": "Bowers & Wilkins ISW-8 | Subwoofer pasivo empotrable en muro",
    "description": "Integra el Bowers & Wilkins ISW-8 en un muro de cine residencial. Revisa el espacio de su gabinete y la amplificación para su driver de 12 pulgadas.",
    "slug": "bowers-wilkins-isw-8"
  }
};

test("the pilot contains exactly the four approved products and unique slugs", () => {
  assert.deepEqual(PRODUCT_SEO_PILOT_4, approved);
  const slugs = Object.values(approved).map(entry => entry.slug);
  assert.equal(new Set(slugs).size, 4);
  assert.equal(new Set(Object.values(approved).map(entry => entry.title)).size, 4);
  assert.equal(new Set(Object.values(approved).map(entry => entry.description)).size, 4);
});

const redirects = await config.redirects();
for (const [id, { slug }] of Object.entries(approved)) {
  test(slug, () => {
    const path = `/tienda/producto/${slug}`;
    assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(getProductIdForRoute(slug), id);
    assert.equal(getProductIdForRoute(id), id);
    assert.equal(getProductPath(id), path);
    assert.equal(getProductUrl(id), `https://www.dgaudiosound.com${path}`);
    assert.deepEqual(redirects.filter(rule => rule.source === `/tienda/producto/${id}`), [
      { source: `/tienda/producto/${id}`, destination: path, statusCode: 301 },
    ]);
    assert.ok(!redirects.some(rule => rule.source === path));
  });
}

test("unmapped route parameters and non-pilot product URLs retain their identity", () => {
  const id = "00000000-0000-4000-8000-000000000005";
  for (const param of [id, "unlisted-product"]) assert.equal(getProductIdForRoute(param), param);
  assert.equal(getProductPath(id), `/tienda/producto/${id}`);
  assert.equal(getProductUrl(id), `https://www.dgaudiosound.com/tienda/producto/${id}`);
});
