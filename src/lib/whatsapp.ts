import { SITE } from "@/content/site";

/** URL de WhatsApp con mensaje codificado. */
export const whatsappUrl = (message: string): string =>
  `https://wa.me/${SITE.phoneTel.replace("+", "")}?text=${encodeURIComponent(message)}`;
