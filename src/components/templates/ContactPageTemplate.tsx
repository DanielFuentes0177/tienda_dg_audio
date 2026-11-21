import React from "react";
import "@/styles/service-page.css";
import "@/styles/service-page-overrides.css";
import { HomeContact } from "@/components/organisms/home/HomeContact";
import { ServicePageEffects } from "@/components/containers/ServicePageEffects";
import type { HomePageContent } from "@/types/service.types";

/** Template de /contacto: encabezado con H1 y el mismo formulario (WhatsApp) de la home. */
export const ContactPageTemplate = ({ title, intro, contact }: { title: string; intro: string; contact: HomePageContent["contact"] }) => (
  <div className="svc">
    <link rel="stylesheet" href="/assets/font-awesome.min.css" precedence="default" />
    <div>
      <div className="container legal-header">
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <HomeContact contact={contact} />
    </div>
    <ServicePageEffects variant="home" kickers={[]} />
  </div>
);
