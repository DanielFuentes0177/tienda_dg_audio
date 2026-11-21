/**
 * Limpia el HTML que Word (y Outlook) ponen en el portapapeles para que el editor lo entienda:
 *  - convierte los párrafos con "mso-list" (viñetas y numeración de Word) en listas <ul>/<ol> reales, con niveles;
 *  - elimina etiquetas y estilos propios de Office (o:p, mso-*, clases Mso*, comentarios condicionales);
 *  - quita fuente y tamaño (Calibri 11pt, etc.) para que el texto tome la tipografía del blog.
 * Se conservan negritas, cursivas, subrayado, colores, resaltado, alineación, encabezados, tablas y enlaces.
 * Solo corre en el navegador (usa DOMParser); fuera de Word devuelve el HTML tal cual.
 */
export function cleanPastedHtml(html: string): string {
  if (typeof DOMParser === "undefined") return html;
  const isOffice = /mso-|class="?Mso|<o:p|urn:schemas-microsoft-com:office|xmlns:o=/i.test(html);
  if (!isOffice) return html;

  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;

  // 1) Fuera: estilos, metadatos, XML y comentarios (incluye los condicionales <!--[if ...]>)
  body.querySelectorAll("style, meta, link, xml, title, script").forEach((n) => n.remove());
  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_COMMENT);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.parentNode?.removeChild(c));
  body.querySelectorAll("o\\:p").forEach((n) => { n.replaceWith(...Array.from(n.childNodes)); });

  // 2) Listas de Word -> <ul>/<ol>
  const listLevel = (el: Element) => {
    const m = /mso-list:[^;"']*level(\d+)/i.exec(el.getAttribute("style") || "");
    return m ? Math.max(1, parseInt(m[1], 10)) : 1;
  };
  const isListPara = (el: Element | null): el is HTMLElement =>
    !!el && el.tagName === "P" && /mso-list:\s*(?!none)[^;"']+/i.test(el.getAttribute("style") || "") && !/mso-list:\s*none/i.test(el.getAttribute("style") || "");
  const markerOf = (p: HTMLElement) => {
    const span = Array.from(p.querySelectorAll("span")).find((s) => /mso-list:\s*Ignore/i.test(s.getAttribute("style") || ""));
    const text = (span?.textContent || "").replace(/ /g, " ").trim();
    span?.remove();
    return text;
  };
  const isOrdered = (marker: string) => /^\(?([0-9]+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[.)]$/.test(marker);

  const paras = Array.from(body.querySelectorAll("p")).filter((p) => isListPara(p));
  const handled = new Set<Element>();
  for (const first of paras) {
    if (handled.has(first)) continue;
    // Grupo = párrafos de lista consecutivos
    const group: HTMLElement[] = [];
    let cur: Element | null = first;
    while (cur && isListPara(cur)) { group.push(cur); handled.add(cur); cur = cur.nextElementSibling; }

    const root = doc.createElement("div");
    const stack: { level: number; list: HTMLElement; lastLi: HTMLElement | null }[] = [];
    for (const p of group) {
      const level = listLevel(p);
      const ordered = isOrdered(markerOf(p));
      while (stack.length && stack[stack.length - 1].level > level) stack.pop();
      if (!stack.length || stack[stack.length - 1].level < level) {
        const list = doc.createElement(ordered ? "ol" : "ul");
        const parent = stack.length ? stack[stack.length - 1].lastLi : null;
        (parent ?? root).appendChild(list);
        stack.push({ level, list, lastLi: null });
      }
      const top = stack[stack.length - 1];
      const li = doc.createElement("li");
      li.innerHTML = p.innerHTML.trim();
      top.list.appendChild(li);
      top.lastLi = li;
    }
    first.replaceWith(...Array.from(root.childNodes));
    group.slice(1).forEach((p) => p.remove());
  }

  // 3) Quitar clases/estilos de Office; conservar solo lo que el editor entiende
  const KEEP = new Set(["color", "background-color", "background", "text-align", "font-weight", "font-style", "text-decoration", "text-decoration-line"]);
  body.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const cls = (el.getAttribute("class") || "").split(/\s+/).filter((c) => c && !/^Mso/i.test(c));
    if (cls.length) el.setAttribute("class", cls.join(" ")); else el.removeAttribute("class");
    const style = el.getAttribute("style");
    if (style) {
      const kept = style.split(";").map((d) => d.trim()).filter((d) => {
        const prop = d.split(":")[0]?.trim().toLowerCase();
        return prop && KEEP.has(prop) && !/^(color|background(-color)?)\s*:\s*(windowtext|auto|transparent|inherit)\b/i.test(d);
      });
      if (kept.length) el.setAttribute("style", kept.join("; ")); else el.removeAttribute("style");
    }
    el.removeAttribute("lang");
  });

  return body.innerHTML;
}
