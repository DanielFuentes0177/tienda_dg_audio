import type { ServicePageContent } from "@/types/service.types";
import { audioDistribuido } from "./residencial-premium/audio-distribuido";
import { audioHiFi } from "./residencial-premium/audio-hi-fi";
import { cineEnCasa } from "./residencial-premium/cine-en-casa";
import { familyRoom } from "./residencial-premium/family-room";
import { homeOffice } from "./residencial-premium/home-office";
import { terrazasYJardin } from "./residencial-premium/terrazas-y-jardin";
import { barberias } from "./negocios-y-experiencias/barberias";
import { baresAntros } from "./negocios-y-experiencias/bares-antros";
import { cafeterias } from "./negocios-y-experiencias/cafeterias";
import { gimnasios } from "./negocios-y-experiencias/gimnasios";
import { restaurantes } from "./negocios-y-experiencias/restaurantes";
import { retail } from "./negocios-y-experiencias/retail";
import { auditoriosCorporativos } from "./corporativo-e-institucional/auditorios-corporativos";
import { educacion } from "./corporativo-e-institucional/educacion";
import { gobierno } from "./corporativo-e-institucional/gobierno";
import { hoteles } from "./corporativo-e-institucional/hoteles";
import { oficinasCorporativas } from "./corporativo-e-institucional/oficinas-corporativas";
import { salasDeJuntas } from "./corporativo-e-institucional/salas-de-juntas";
import { centrosDeCulto } from "./eventos-y-produccion/centros-de-culto";
import { cineIndependiente } from "./eventos-y-produccion/cine-independiente";
import { musicosVocalistas } from "./eventos-y-produccion/musicos-vocalistas";
import { podcast } from "./eventos-y-produccion/podcast";
import { sonidosDj } from "./eventos-y-produccion/sonidos-dj";
import { streamers } from "./eventos-y-produccion/streamers";

/** Registro de páginas de servicio servidas por Next (generado por scripts/migration/generate.py). */
export const SERVICES: Record<string, ServicePageContent> = {
  "/residencial-premium/audio-distribuido": audioDistribuido,
  "/residencial-premium/audio-hi-fi": audioHiFi,
  "/residencial-premium/cine-en-casa": cineEnCasa,
  "/residencial-premium/family-room": familyRoom,
  "/residencial-premium/home-office": homeOffice,
  "/residencial-premium/terrazas-y-jardin": terrazasYJardin,
  "/negocios-y-experiencias/barberias": barberias,
  "/negocios-y-experiencias/bares-antros": baresAntros,
  "/negocios-y-experiencias/cafeterias": cafeterias,
  "/negocios-y-experiencias/gimnasios": gimnasios,
  "/negocios-y-experiencias/restaurantes": restaurantes,
  "/negocios-y-experiencias/retail": retail,
  "/corporativo-e-institucional/auditorios-corporativos": auditoriosCorporativos,
  "/corporativo-e-institucional/educacion": educacion,
  "/corporativo-e-institucional/gobierno": gobierno,
  "/corporativo-e-institucional/hoteles": hoteles,
  "/corporativo-e-institucional/oficinas-corporativas": oficinasCorporativas,
  "/corporativo-e-institucional/salas-de-juntas": salasDeJuntas,
  "/eventos-y-produccion/centros-de-culto": centrosDeCulto,
  "/eventos-y-produccion/cine-independiente": cineIndependiente,
  "/eventos-y-produccion/musicos-vocalistas": musicosVocalistas,
  "/eventos-y-produccion/podcast": podcast,
  "/eventos-y-produccion/sonidos-dj": sonidosDj,
  "/eventos-y-produccion/streamers": streamers,
};

export const servicesInGroup = (group: string): ServicePageContent[] =>
  Object.values(SERVICES).filter((s) => s.path.startsWith(`/${group}/`));
