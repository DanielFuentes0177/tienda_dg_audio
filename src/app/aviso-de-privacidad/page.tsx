import type { Metadata } from "next";
import { LegalPage, legalMeta } from "@/lib/pages";
import { avisoDePrivacidad } from "@/content/pages/aviso-de-privacidad";

export const revalidate = 3600;

export const metadata: Metadata = legalMeta(avisoDePrivacidad);

export default function Page() {
  return <LegalPage content={avisoDePrivacidad} />;
}
