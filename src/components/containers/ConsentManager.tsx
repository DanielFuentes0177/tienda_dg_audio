"use client";

import React, { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { CookieBanner } from "@/components/molecules/CookieBanner";
import { FloatingWhatsApp } from "@/components/atoms/FloatingWhatsApp";
import { SITE, TRACKING } from "@/content/site";

type Consent = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    dgConsentCommand?: (...args: unknown[]) => void;
    dgBuildConsentState?: (status: "granted" | "denied") => Record<string, string>;
  }
}

let memoryChoice: Consent | null = null; // respaldo si localStorage no está disponible
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

function readConsent(): Consent | null {
  if (memoryChoice) return memoryChoice;
  try {
    const v = window.localStorage.getItem(TRACKING.consentStorageKey);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Contenedor (smart): estado del consentimiento (misma clave y flujo que el sitio HTML,
 * así la elección se comparte entre ambos al estar en el mismo origen) y UI flotante global.
 */
export const ConsentManager = () => {
  const pathname = usePathname() ?? "/";
  // En el servidor no se muestra el banner; en el cliente depende de lo guardado.
  const state = useSyncExternalStore(
    subscribe,
    () => readConsent() ?? "none",
    () => "server"
  );
  const visible = state === "none";

  const choose = (choice: Consent) => {
    memoryChoice = choice;
    try {
      window.localStorage.setItem(TRACKING.consentStorageKey, choice);
    } catch {
      /* almacenamiento no disponible: se respeta la elección solo en esta sesión */
    }
    const granted = choice === "accepted";
    if (window.dgConsentCommand && window.dgBuildConsentState) {
      window.dgConsentCommand("consent", "update", window.dgBuildConsentState(granted ? "granted" : "denied"));
    }
    (window.dataLayer = window.dataLayer || []).push({
      event: granted ? "cookie_consent_accepted" : "cookie_consent_rejected",
      consent_status: choice,
      consent_source: "cookie_banner",
    });
    listeners.forEach((l) => l());
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <CookieBanner
        visible={visible}
        privacyHref="/aviso-de-privacidad"
        onAccept={() => choose("accepted")}
        onReject={() => choose("rejected")}
      />
      <FloatingWhatsApp href={SITE.whatsappUrl} />
    </>
  );
};
