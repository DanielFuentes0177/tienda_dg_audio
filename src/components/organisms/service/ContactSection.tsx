"use client";

import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { SITE } from "@/content/site";
import type { ServicePageContent } from "@/types/service.types";

export interface ContactSectionProps {
  contact: ServicePageContent["contact"];
  whatsappHref: string;
  /** Recibe los datos del formulario ya validados; el contenedor decide qué hacer (abrir WhatsApp). */
  onSubmit: (data: { name: string; project: string; phone: string; city: string; projectType: string; details: string }) => void;
}

export const ContactSection = ({ contact, whatsappHref, onSubmit }: ContactSectionProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const v = (id: string) => (form.elements.namedItem(id) as HTMLInputElement | null)?.value.trim() ?? "";
    onSubmit({
      name: v("cb-name"),
      project: v("cb-company") || "No especificado",
      phone: v("cb-phone"),
      city: v("cb-city"),
      projectType: v("cb-project"),
      details: v("cb-message"),
    });
  };

  return (
    <section className="contact-bubbles-section" id="contacto">
      <div className="container">
        <div className="section-header reveal fade-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h2 className="section-title"><RichText parts={contact.title} /></h2>
          <p className="section-subtitle" style={{ color: "#555560", maxWidth: 700, margin: "0 auto" }}>{contact.subtitle}</p>
        </div>
        <div className="contact-bubbles-wrapper reveal fade-up">
          <div className="contact-bubble contact-bubble-dark" style={{ background: "var(--bg-deep-dark)" }}>
            <span className="cb-badge">Contacto</span>
            <h2><RichText parts={contact.panelTitle} /></h2>
            <p className="cb-desc" style={{ color: "rgba(255,255,255,0.6)" }}>{contact.panelText}</p>
            <div className="cb-methods">
              <a className="cb-method" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <div className="cb-method-icon"><Icon name="whatsapp" /></div>
                <div className="cb-method-info">
                  <strong style={{ color: "#ffffff" }}>WhatsApp</strong>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{contact.whatsappDetail}</span>
                </div>
              </a>
              <a className="cb-method" href={`mailto:${SITE.email}`}>
                <div className="cb-method-icon"><Icon name="mail" /></div>
                <div className="cb-method-info">
                  <strong style={{ color: "#ffffff" }}>Correo de Atención</strong>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{SITE.email}</span>
                </div>
              </a>
              <div className="cb-method">
                <div className="cb-method-icon"><Icon name="pin" /></div>
                <div className="cb-method-info">
                  <strong style={{ color: "#ffffff" }}>Área de Cobertura</strong>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{contact.coverage}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-bubble contact-bubble-light" style={{ background: "var(--bg-primary)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: "var(--text-main)" }}>{contact.formTitle}</h3>
            <p className="cb-form-desc" style={{ color: "#64748b" }}>{contact.formDescription}</p>
            <form className="cb-form" id="bubblesWhatsappForm" onSubmit={handleSubmit}>
              <div className="cb-form-row">
                <div className="cb-field">
                  <label htmlFor="cb-name">Nombre *</label>
                  <input id="cb-name" name="cb-name" placeholder="Tu nombre" required type="text" />
                </div>
                <div className="cb-field">
                  <label htmlFor="cb-company">{contact.projectFieldLabel}</label>
                  <input id="cb-company" name="cb-company" placeholder={contact.projectFieldPlaceholder} type="text" />
                </div>
              </div>
              <div className="cb-form-row">
                <div className="cb-field">
                  <label htmlFor="cb-phone">WhatsApp / Teléfono *</label>
                  <input id="cb-phone" name="cb-phone" placeholder="55 0000 0000" required type="tel" />
                </div>
                <div className="cb-field">
                  <label htmlFor="cb-city">Ciudad *</label>
                  <input id="cb-city" name="cb-city" placeholder="Ej. Ciudad de México" required type="text" />
                </div>
              </div>
              <div className="cb-field">
                <label htmlFor="cb-project">Tipo de proyecto</label>
                <select id="cb-project" name="cb-project" required defaultValue="">
                  <option disabled value="">Selecciona el tipo de proyecto</option>
                  {contact.projectTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="cb-field full">
                <label htmlFor="cb-message">Detalles del proyecto</label>
                <textarea id="cb-message" name="cb-message" placeholder={contact.messagePlaceholder} required rows={4} />
              </div>
              <button className="cb-submit" style={{ background: "var(--color-whatsapp)", color: "var(--text-inverse)" }} type="submit">
                <Icon name="whatsapp" /> {contact.submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
