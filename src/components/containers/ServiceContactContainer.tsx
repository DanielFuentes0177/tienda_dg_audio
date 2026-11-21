"use client";

import React from "react";
import { ContactSection, type ContactFormData } from "@/components/organisms/service/ContactSection";
import { whatsappUrl } from "@/lib/whatsapp";
import { trackWhatsapp } from "@/lib/trackWhatsapp";
import type { ServicePageContent } from "@/types/service.types";

/** Contenedor (smart): arma el mensaje y abre WhatsApp al enviar el formulario. */
export const ServiceContactContainer = ({
  contact,
  whatsappMessage,
}: {
  contact: ServicePageContent["contact"];
  whatsappMessage: string;
}) => {
  const handleSubmit = (d: ContactFormData) => {
    const msg =
      `🎬 *DG Audiosound - ${contact.pageHeading.toUpperCase()}* 🎬\n\n` +
      `• *Cliente:* ${d.name}\n` +
      `• *Residencia / Proyecto:* ${d.project}\n` +
      `• *Teléfono:* ${d.phone}\n` +
      `• *Ciudad:* ${d.city}\n` +
      `• *Tipo de Proyecto:* ${d.projectType}\n\n` +
      `📝 *Detalles del Proyecto:*\n${d.details}\n\n` +
      `_Deseo recibir asesoría para evaluar este proyecto audiovisual._`;
    trackWhatsapp("formulario");
    window.open(whatsappUrl(msg), "_blank", "noopener");
  };
  return <ContactSection contact={contact} whatsappHref={whatsappUrl(whatsappMessage)} onSubmit={handleSubmit} />;
};
