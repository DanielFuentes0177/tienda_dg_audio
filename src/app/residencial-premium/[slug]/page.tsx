import type { Metadata } from "next";
import { ServicePage, serviceMeta, serviceParams } from "@/lib/services";

const GROUP = "residencial-premium";

// Acota el s-maxage de la página estática (por defecto 1 año) para que un CDN no sirva versiones viejas tras un deploy.
export const revalidate = 3600;
export const dynamicParams = false;

export const generateStaticParams = () => serviceParams(GROUP);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return serviceMeta(GROUP, (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <ServicePage group={GROUP} slug={(await params).slug} />;
}
