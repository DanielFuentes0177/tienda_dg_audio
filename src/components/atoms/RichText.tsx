import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import type { Inline, InlinePart } from "@/types/service.types";

const renderPart = (p: InlinePart, i: number) => {
  const lines = p.text.split("\n");
  const content = lines.map((line, k) => (
    <React.Fragment key={k}>
      {k > 0 && <br />}
      {line}
    </React.Fragment>
  ));
  let node: React.ReactNode = content;
  if (p.bold) node = <strong>{node}</strong>;
  if (p.href) node = <AppLink href={p.href}>{node}</AppLink>;
  if (p.accent) node = <span className="text-accent">{node}</span>;
  if (p.gradient) node = <span className="text-gradient-gold">{node}</span>;
  return <React.Fragment key={i}>{node}</React.Fragment>;
};

/** Átomo dumb: texto simple o con partes (acento dorado, enlaces, negritas, saltos). */
export const RichText = ({ parts }: { parts: Inline }) =>
  typeof parts === "string" ? <>{parts}</> : <>{parts.map(renderPart)}</>;
