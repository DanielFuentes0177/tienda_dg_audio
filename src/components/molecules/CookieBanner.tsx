import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import styles from "./CookieBanner.module.css";

export interface CookieBannerProps {
  visible: boolean;
  privacyHref: string;
  onAccept: () => void;
  onReject: () => void;
}

/** Molécula dumb: banner de consentimiento. El estado vive en ConsentManager. */
export const CookieBanner = ({ visible, privacyHref, onAccept, onReject }: CookieBannerProps) => {
  if (!visible) return null;
  return (
    <div className={styles.banner} role="dialog" aria-label="Preferencias de cookies" aria-live="polite">
      <div>
        <strong>Privacidad y medición</strong>
        <p>
          Usamos cookies y tecnologías de medición para mejorar el sitio, analizar visitas y optimizar campañas.
          Puedes aceptar o rechazar el uso de analítica y publicidad. Consulta nuestro{" "}
          <AppLink href={privacyHref}>Aviso de Privacidad</AppLink>.
        </p>
      </div>
      <div className={styles.actions} aria-label="Acciones de consentimiento">
        <button type="button" className={`${styles.button} ${styles.reject}`} onClick={onReject}>
          Rechazar
        </button>
        <button type="button" className={`${styles.button} ${styles.accept}`} onClick={onAccept}>
          Aceptar
        </button>
      </div>
    </div>
  );
};
