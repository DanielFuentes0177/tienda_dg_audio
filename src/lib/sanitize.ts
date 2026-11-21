import sanitizeHtml from "sanitize-html";

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s,.%]+\)|hsla?\([\d\s,.%]+\)|[a-z]+|transparent)$/i;
const ALIGN = /^(left|right|center|justify)$/i;

/** Limpia el HTML del editor del blog (XSS almacenado): lista blanca de etiquetas, atributos y estilos. */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: [
      "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "mark", "span",
      "a", "ul", "ol", "li", "blockquote", "code", "pre", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td", "sub", "sup",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "class", "style"],
      "*": ["style", "class", "colspan", "rowspan"],
    },
    allowedClasses: { "*": [/^image-align-/, /^tiptap-/, "ProseMirror"] },
    allowedStyles: {
      "*": {
        color: [COLOR],
        "background-color": [COLOR],
        "text-align": [ALIGN],
        width: [/^\d+(\.\d+)?(px|%|em|rem)$/],
        height: [/^\d+(\.\d+)?(px|%|em|rem)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tag, attribs) => ({
        tagName: tag,
        attribs: { ...attribs, ...(attribs.target === "_blank" ? { rel: "noopener noreferrer" } : {}) },
      }),
    },
  });
}
