import React from "react";

export interface IconProps {
  /** Clases de Font Awesome, p. ej. "fa-solid fa-award". */
  name: string | null | undefined;
  style?: React.CSSProperties;
}

/**
 * Átomo dumb: ícono Font Awesome (la hoja /assets/font-awesome.min.css la carga ServicePageTemplate).
 * Es el mismo set que usa el sitio HTML, así el diseño es idéntico.
 */
export const Icon = ({ name, style }: IconProps) =>
  name ? <i className={name} style={style} aria-hidden="true" /> : null;

export const WHATSAPP_ICON = "fa-brands fa-whatsapp";
