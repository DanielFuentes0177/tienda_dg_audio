// DG Audiosound SEO v1.1 — piloto aislado de 4 productos APROBADOS.
// Los UUID permanecen como identificadores de base de datos; los slugs son sólo rutas públicas.
export interface ProductSeoPilotEntry { title: string; description: string; slug: string }

export const PRODUCT_SEO_PILOT_4: Record<string, ProductSeoPilotEntry> = {
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

const SLUG_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_SEO_PILOT_4).map(([id, product]) => [product.slug, id])
);

export function getProductIdForRoute(param: string): string {
  return SLUG_TO_ID[param] ?? param;
}

export function getProductPath(id: string): string {
  return `/tienda/producto/${PRODUCT_SEO_PILOT_4[id]?.slug ?? id}`;
}

export function getProductUrl(id: string): string {
  return `https://www.dgaudiosound.com${getProductPath(id)}`;
}
