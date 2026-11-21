"use client";

import React from "react";
import { Icon, WHATSAPP_ICON } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import type { ServicePageContent } from "@/types/service.types";

export interface ContactFormData {
  name: string;
  project: string;
  phone: string;
  city: string;
  projectType: string;
  details: string;
}

export interface ContactSectionProps {
  contact: ServicePageContent["contact"];
  whatsappHref: string;
  /** Recibe los datos ya validados; el contenedor decide qué hacer (abrir WhatsApp). */
  onSubmit: (data: ContactFormData) => void;
}

const MethodInner = ({ m }: { m: ServicePageContent["contact"]["methods"][number] }) => (
  <>
    <div className="cb-method-icon"><Icon name={m.icon} /></div>
    <div className="cb-method-info">
      <strong style={{ color: "#ffffff" }}>{m.label}</strong>
      <span style={{ color: "rgba(255,255,255,0.5)" }}>{m.detail}</span>
    </div>
  </>
);

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
  const req = (id: string) => contact.required[id] ?? false;
  const ph = (id: string) => contact.placeholders[id] ?? "";
  const label = (id: string) => contact.labels[id] ?? "";

  return (
    <section className="contact-bubbles-section" id="contacto">
      <div className="container">
        <div className="section-header reveal fade-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h2 className="section-title"><RichText parts={contact.title} /></h2>
          <p className="section-subtitle" style={{ color: "#555560", maxWidth: 700, margin: "0 auto" }}>{contact.subtitle}</p>
        </div>
        <div className="contact-bubbles-wrapper reveal fade-up">
          <div className="contact-bubble contact-bubble-dark" style={{ background: "var(--bg-deep-dark)" }}>
            <span className="cb-badge">{contact.badge}</span>
            <h2><RichText parts={contact.panelTitle} /></h2>
            <p className="cb-desc" style={{ color: "rgba(255,255,255,0.6)" }}>{contact.panelText}</p>
            <div className="cb-methods">
              {contact.methods.map((m) => {
                if (m.icon === WHATSAPP_ICON) {
                  return (
                    <a key={m.label} className="cb-method" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MethodInner m={m} />
                    </a>
                  );
                }
                if (m.icon?.includes("envelope")) {
                  return (
                    <a key={m.label} className="cb-method" href={`mailto:${m.detail}`}>
                      <MethodInner m={m} />
                    </a>
                  );
                }
                return (
                  <div key={m.label} className="cb-method">
                    <MethodInner m={m} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="contact-bubble contact-bubble-light" style={{ background: "var(--bg-primary)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: "var(--text-main)" }}><RichText parts={contact.formTitle} /></h3>
            <p className="cb-form-desc" style={{ color: "#64748b" }}>{contact.formDescription}</p>
            <form className="cb-form" id="bubblesWhatsappForm" onSubmit={handleSubmit}>
              <div className="cb-form-row">
                <div className="cb-field">
                  <label htmlFor="cb-name">{label("cb-name")}</label>
                  <input id="cb-name" name="cb-name" placeholder={ph("cb-name")} required={req("cb-name")} type="text" />
                </div>
                <div className="cb-field">
                  <label htmlFor="cb-company">{label("cb-company")}</label>
                  <input id="cb-company" name="cb-company" placeholder={ph("cb-company")} required={req("cb-company")} type="text" />
                </div>
              </div>
              <div className="cb-form-row">
                <div className="cb-field">
                  <label htmlFor="cb-phone">{label("cb-phone")}</label>
                  <input id="cb-phone" name="cb-phone" placeholder={ph("cb-phone")} required={req("cb-phone")} type="tel" />
                </div>
                <div className="cb-field">
                  <label htmlFor="cb-city">{label("cb-city")}</label>
                  <input id="cb-city" name="cb-city" placeholder={ph("cb-city")} required={req("cb-city")} type="text" />
                </div>
              </div>
              <div className="cb-field">
                <label htmlFor="cb-project">{label("cb-project")}</label>
                <select
                  id="cb-project"
                  name="cb-project"
                  required={req("cb-project")}
                  defaultValue={contact.selectPlaceholder ? "" : contact.projectTypes[0]?.value}
                >
                  {contact.selectPlaceholder && <option disabled value="">{contact.selectPlaceholder}</option>}
                  {contact.projectTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="cb-field full">
                <label htmlFor="cb-message">{label("cb-message")}</label>
                <textarea id="cb-message" name="cb-message" placeholder={ph("cb-message")} required={req("cb-message")} rows={4} />
              </div>
              <button className="cb-submit" style={{ background: "var(--color-whatsapp)", color: "var(--text-inverse)" }} type="submit">
                <Icon name={WHATSAPP_ICON} /> {contact.submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
