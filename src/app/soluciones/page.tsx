import type { Metadata } from "next";
import { SolucionesPage, solucionesMeta } from "@/lib/pages";

export const revalidate = 3600;

export const metadata: Metadata = solucionesMeta();

export default function Page() {
  return <SolucionesPage />;
}
