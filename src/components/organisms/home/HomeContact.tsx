"use client";

import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import { Icon, WHATSAPP_ICON } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { cssString } from "@/lib/cssString";
import { SITE } from "@/content/site";
import { trackWhatsapp } from "@/lib/trackWhatsapp";
import type { HomePageContent } from "@/types/service.types";

export const HomeContact = ({ contact }: { contact: HomePageContent["contact"] }) => {
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
    <section className="contact-bubbles-section" id="contacto" style={cssString(contact.sectionStyle)}>
      <div className="container">
        <div className="section-header reveal fade-up" style={cssString(contact.titleStyle)}>
          <h2 className="section-title"><RichText parts={contact.title} /></h2>
          <p className="section-subtitle">{contact.subtitle}</p>
        </div>
        <div className="contact-bubbles-wrapper reveal fade-up">
          <div className="contact-bubble contact-bubble-dark">
            <span className="cb-badge">{contact.badge}</span>
            <h2><RichText parts={contact.panelTitle} /></h2>
            <p className="cb-desc">{contact.panelText}</p>
            <div className="cb-methods">
              {contact.methods.map((m) => {
                const inner = (
                  <>
                    <div className="cb-method-icon"><Icon name={m.icon} /></div>
                    <div className="cb-method-info">
                      <strong>{m.label}</strong>
                      <span>{m.detail}</span>
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

          <div className="contact-bubble contact-bubble-light">
            <h3>{contact.formTitle}</h3>
            <p className="cb-form-desc">{contact.formDescription}</p>
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
                  {contact.selectPlaceholder && (
                    <option value="" disabled={contact.selectPlaceholderDisabled}>{contact.selectPlaceholder}</option>
                  )}
                  {contact.projectTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="cb-field full">
                <label htmlFor="cb-message">{label("cb-message")}</label>
                <textarea id="cb-message" name="cb-message" placeholder={ph("cb-message")} required={req("cb-message")} rows={4} />
              </div>
              <button className="cb-submit" type="submit">
                <Icon name={WHATSAPP_ICON} /> {contact.submitLabel}
              </button>
              {contact.privacyNote && (
                <p className="cb-privacy-note">
                  {typeof contact.privacyNote === "string" ? contact.privacyNote : contact.privacyNote.map((p, i) => (p.href ? <AppLink key={i} href={p.href}>{p.text}</AppLink> : <React.Fragment key={i}>{p.text}</React.Fragment>))}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
