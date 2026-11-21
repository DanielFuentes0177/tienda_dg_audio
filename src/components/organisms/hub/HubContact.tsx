"use client";

import React from "react";
import { Icon, WHATSAPP_ICON } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { SITE } from "@/content/site";
import { trackWhatsapp } from "@/lib/trackWhatsapp";
import type { HubPageContent } from "@/types/service.types";

type Contact = HubPageContent["contact"];

export const HubContact = ({ contact }: { contact: Contact }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const v = (id: string) => (form.elements.namedItem(id) as HTMLInputElement | null)?.value ?? "";
    const values: Record<string, string> = {
      name: v("cb-name"),
      company: v("cb-company") || "No especificada",
      phone: v("cb-phone"),
      city: v("cb-city"),
      project: v("cb-project"),
      message: v("cb-message"),
    };
    const msg = contact.whatsappTemplate.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
    trackWhatsapp("formulario");
    window.open(`https://wa.me/${SITE.phoneTel.replace("+", "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const label = (id: string) => contact.labels[id] ?? "";
  const ph = (id: string) => contact.placeholders[id] ?? "";
  const req = (id: string) => contact.required[id] ?? false;

  return (
    <section className="contact-bubbles-section" id="contacto">
      <div className="container">
        <div className="section-header reveal-lux" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h2 className="section-title"><RichText parts={contact.title} /></h2>
          <p className="section-subtitle" style={{ color: "#555560", maxWidth: 700, margin: "0 auto" }}>{contact.subtitle}</p>
        </div>
        <div className="contact-bubbles-wrapper reveal-lux">
          <div className="contact-bubble contact-bubble-dark" style={{ background: "#050505" }}>
            <span className="cb-badge">{contact.badge}</span>
            <h2><RichText parts={contact.panelTitle} /></h2>
            <p className="cb-desc" style={{ color: "rgba(255,255,255,0.6)" }}>{contact.panelText}</p>
            <div className="cb-methods">
              {contact.methods.map((m) => {
                const inner = (
                  <>
                    <div className="cb-method-icon"><Icon name={m.icon} /></div>
                    <div className="cb-method-info">
                      <strong style={{ color: "#ffffff" }}>{m.label}</strong>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>{m.detail}</span>
                    </div>
                  </>
                );
                return m.href ? (
                  <a key={m.label} className="cb-method" href={m.href} {...(m.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {inner}
                  </a>
                ) : (
                  <div key={m.label} className="cb-method">{inner}</div>
                );
              })}
            </div>
          </div>

          <div className="contact-bubble contact-bubble-light" style={{ background: "#ffffff", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: "#050505" }}>{contact.formTitle}</h3>
            <p className="cb-form-desc" style={{ color: "#64748b" }}>{contact.formDescription}</p>
            <form className="cb-form" id="bubblesWhatsappForm" onSubmit={handleSubmit}>
              <div className="cb-form-row">
                <div className="cb-field">
                  <label htmlFor="cb-name" style={{ color: "#374151" }}>{label("cb-name")}</label>
                  <input id="cb-name" name="cb-name" placeholder={ph("cb-name")} required={req("cb-name")} type="text" />
                </div>
                <div className="cb-field">
                  <label htmlFor="cb-company" style={{ color: "#374151" }}>{label("cb-company")}</label>
                  <input id="cb-company" name="cb-company" placeholder={ph("cb-company")} required={req("cb-company")} type="text" />
                </div>
              </div>
              <div className="cb-form-row">
                <div className="cb-field">
                  <label htmlFor="cb-phone" style={{ color: "#374151" }}>{label("cb-phone")}</label>
                  <input id="cb-phone" name="cb-phone" placeholder={ph("cb-phone")} required={req("cb-phone")} type="tel" />
                </div>
                <div className="cb-field">
                  <label htmlFor="cb-city" style={{ color: "#374151" }}>{label("cb-city")}</label>
                  <input id="cb-city" name="cb-city" placeholder={ph("cb-city")} required={req("cb-city")} type="text" />
                </div>
              </div>
              <div className="cb-field">
                <label htmlFor="cb-project" style={{ color: "#374151" }}>{label("cb-project")}</label>
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
                <label htmlFor="cb-message" style={{ color: "#374151" }}>{label("cb-message")}</label>
                <textarea id="cb-message" name="cb-message" placeholder={ph("cb-message")} required={req("cb-message")} rows={4} />
              </div>
              <button className="cb-submit" style={{ background: "var(--color-whatsapp)", color: "white" }} type="submit">
                <Icon name={WHATSAPP_ICON} /> {contact.submitLabel}
              </button>
              {contact.privacyNote && (
                <p className="cb-privacy-note" style={{ color: "#94a3b8" }}><RichText parts={contact.privacyNote} /></p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
