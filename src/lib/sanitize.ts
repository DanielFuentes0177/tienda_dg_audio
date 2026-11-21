import sanitizeHtml from "sanitize-html";

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s,.%]+\)|hsla?\([\d\s,.%]+\)|[a-z]+|transparent)$/i;
const ALIGN = /^(left|right|center|justify)$/i;

/** Limpia el HTML del editor del blog (XSS almacenado): lista blanca de etiquetas, atributos y estilos. */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: [
      "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "mark", "span",
      "a", "ul", "ol", "li", "blockquote", "code", "pre", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col", "caption", "sub", "sup",
      "div", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "class", "style", "data-align"],
      iframe: ["src", "width", "height", "allowfullscreen", "frameborder", "allow", "title"],
      div: ["data-youtube-video", "class", "style"],
      col: ["span", "style", "width"],
      "*": ["style", "class", "colspan", "rowspan", "colwidth", "data-colwidth"],
    },
    // Solo YouTube (el editor inserta videos con ese iframe).
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
    // Un iframe cuyo src fue rechazado (host no permitido) se elimina por completo.
    exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
    allowedClasses: { "*": [/^image-align-/, /^tiptap-/, /^dg-blog-/, "ProseMirror"] },
    allowedStyles: {
      "*": {
        color: [COLOR],
        "background-color": [COLOR],
        "text-align": [ALIGN],
        width: [/^\d+(\.\d+)?(px|%|em|rem)$/],
        "min-width": [/^\d+(\.\d+)?(px|%|em|rem)$/],
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
