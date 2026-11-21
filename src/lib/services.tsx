import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { HubPageTemplate } from "@/components/templates/HubPageTemplate";
import { HUBS } from "@/content/hubs";
import { SERVICES, servicesInGroup } from "@/content/services";
import { serviceJsonLd, serviceMetadata } from "@/lib/seo/serviceSeo";

/** Parámetros estáticos de un grupo (/residencial-premium/[slug], etc.). */
export const serviceParams = (group: string) =>
  servicesInGroup(group).map((s) => ({ slug: s.path.split("/").pop() as string }));

export function serviceMeta(group: string, slug: string): Metadata {
  const content = SERVICES[`/${group}/${slug}`];
  return content ? serviceMetadata(content) : {};
}

export function ServicePage({ group, slug }: { group: string; slug: string }) {
  const content = SERVICES[`/${group}/${slug}`];
  if (!content) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(content)) }} />
      <ServicePageTemplate content={content} />
    </>
  );
}

export function hubMeta(group: string): Metadata {
  const content = HUBS[`/${group}`];
  return content ? serviceMetadata(content) : {};
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
