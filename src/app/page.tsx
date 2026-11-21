import type { Metadata } from "next";
import { HomePage, homeMeta } from "@/lib/pages";

// Acota el s-maxage de la página estática para que un CDN no sirva versiones viejas tras un deploy.
export const revalidate = 3600;

export const metadata: Metadata = homeMeta();

export default function Page() {
  return <HomePage />;
}
