import type { ServicePageContent } from "@/types/service.types";
import { audioDistribuido } from "./residencial-premium/audio-distribuido";
import { audioHiFi } from "./residencial-premium/audio-hi-fi";
import { cineEnCasa } from "./residencial-premium/cine-en-casa";
import { familyRoom } from "./residencial-premium/family-room";
import { homeOffice } from "./residencial-premium/home-office";
import { terrazasYJardin } from "./residencial-premium/terrazas-y-jardin";

/** Registro de páginas de servicio servidas por Next (generado por scripts/migration/generate.py). */
export const SERVICES: Record<string, ServicePageContent> = {
  "/residencial-premium/audio-distribuido": audioDistribuido,
  "/residencial-premium/audio-hi-fi": audioHiFi,
  "/residencial-premium/cine-en-casa": cineEnCasa,
  "/residencial-premium/family-room": familyRoom,
  "/residencial-premium/home-office": homeOffice,
  "/residencial-premium/terrazas-y-jardin": terrazasYJardin,
};

export const servicesInGroup = (group: string): ServicePageContent[] =>
  Object.values(SERVICES).filter((s) => s.path.startsWith(`/${group}/`));
