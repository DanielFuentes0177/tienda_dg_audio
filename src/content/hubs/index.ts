import type { HubPageContent } from "@/types/service.types";
import { residencialPremiumHub } from "./residencial-premium";
import { negociosYExperienciasHub } from "./negocios-y-experiencias";
import { corporativoEInstitucionalHub } from "./corporativo-e-institucional";
import { eventosYProduccionHub } from "./eventos-y-produccion";

/** Páginas hub servidas por Next (generado por scripts/migration/generate.py --hubs). */
export const HUBS: Record<string, HubPageContent> = {
  "/residencial-premium": residencialPremiumHub,
  "/negocios-y-experiencias": negociosYExperienciasHub,
  "/corporativo-e-institucional": corporativoEInstitucionalHub,
  "/eventos-y-produccion": eventosYProduccionHub,
};
