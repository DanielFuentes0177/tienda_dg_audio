import type { Metadata } from "next";
import { HubPage, hubMeta } from "@/lib/services";

const GROUP = "residencial-premium";

// Acota el s-maxage de la página estática para que un CDN no sirva versiones viejas tras un deploy.
export const revalidate = 3600;

export const generateMetadata = (): Promise<Metadata> => hubMeta(GROUP);

export default function Page() {
  return <HubPage group={GROUP} />;
}
