import type { Metadata } from "next";
import { LegalPage, legalMeta } from "@/lib/pages";
import { terminosYCondiciones } from "@/content/pages/terminos-y-condiciones";

export const revalidate = 3600;

export const metadata: Metadata = legalMeta(terminosYCondiciones);

export default function Page() {
  return <LegalPage content={terminosYCondiciones} />;
}
