import React from "react";
import type { TextPart } from "@/types/service.types";

/** Átomo dumb: texto con partes resaltadas en dorado (clase heredada .text-accent). */
export const RichText = ({ parts }: { parts: TextPart[] }) => (
  <>
    {parts.map((p, i) =>
      p.accent ? (
        <span key={i} className="text-accent">
          {p.text}
        </span>
      ) : (
        <React.Fragment key={i}>{p.text}</React.Fragment>
      )
    )}
  </>
);
