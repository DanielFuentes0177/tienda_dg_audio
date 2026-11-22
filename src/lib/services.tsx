import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { HubPageTemplate } from "@/components/templates/HubPageTemplate";
import { HUBS } from "@/content/hubs";
import { SERVICES, servicesInGroup } from "@/content/services";
import { serviceJsonLd, serviceMetadata } from "@/lib/seo/serviceSeo";
import { withPageTexts } from "@/lib/pageTexts";

/** Parámetros estáticos de un grupo (/residencial-premium/[slug], etc.). */
export const serviceParams = (group: string) =>
  servicesInGroup(group).map((s) => ({ slug: s.path.split("/").pop() as string }));

export async function serviceMeta(group: string, slug: string): Promise<Metadata> {
  const path = `/${group}/${slug}`;
  const content = SERVICES[path];
  return content ? withPageTexts(path, serviceMetadata(content)) : {};
}

export function ServicePage({ group, slug }: { group: string; slug: string }) {
  const content = SERVICES[`/${group}/${slug}`];
  if (!content) notFound();
  const hub = content.breadcrumbs.length >= 2 ? content.breadcrumbs[content.breadcrumbs.length - 2] : undefined;
  const siblings = Object.values(SERVICES).filter((c) => c.path !== content.path && c.path.startsWith(`/${group}/`));
  const related = hub
    ? {
        title: "Otras soluciones de esta categoría",
        hubHref: hub.href,
        hubLabel: `Ver todas las soluciones de ${hub.name}`,
        items: siblings.map((c) => ({ href: c.path, label: c.breadcrumbs[c.breadcrumbs.length - 1].name })),
      }
    : undefined;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(content)) }} />
      <ServicePageTemplate content={content} related={related} />
    </>
  );
}

export async function hubMeta(group: string): Promise<Metadata> {
  const content = HUBS[`/${group}`];
  return content ? withPageTexts(`/${group}`, serviceMetadata(content)) : {};
}

export function HubPage({ group }: { group: string }) {
  const content = HUBS[`/${group}`];
  if (!content) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(content)) }} />
      <HubPageTemplate content={content} />
    </>
  );
}
