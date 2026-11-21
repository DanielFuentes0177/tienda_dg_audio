import type { Metadata } from "next";
import { AplicacionesPage, aplicacionesMeta } from "@/lib/pages";

export const revalidate = 3600;

export const metadata: Metadata = aplicacionesMeta();

export default function Page() {
  return <AplicacionesPage />;
}
