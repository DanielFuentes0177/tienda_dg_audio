import type { Metadata } from "next";
import { HomePage, homeMeta } from "@/lib/pages";
import { withPageTexts } from "@/lib/pageTexts";

// Acota el s-maxage de la página estática para que un CDN no sirva versiones viejas tras un deploy.
export const revalidate = 3600;

export const generateMetadata = (): Promise<Metadata> => withPageTexts("/", homeMeta());

export default function Page() {
  return <HomePage />;
}
