import { PrismaClient } from "@prisma/client";

/**
 * Durante `next build` hay decenas de workers y cada uno crea su propio cliente: con el tamaño
 * de pool por defecto de Prisma (según nº de CPU) se agotan las conexiones de MySQL y falla la
 * generación estática del blog (P1001). En esa fase se usa 1 conexión por worker.
 */
const databaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url || process.env.NEXT_PHASE !== "phase-production-build" || url.includes("connection_limit")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}connection_limit=1&pool_timeout=30`;
};

const prismaClientSingleton = () => {
  const url = databaseUrl();
  return url ? new PrismaClient({ datasources: { db: { url } } }) : new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
