export const DRAFT_MARKER: string;
export const RELEASE_MARKER: string;
export const IMMUTABLES_MARKER: string;
export const APPROVED_STATUS: string;
export const CSV_COLUMNS: string[];
export class SeoOnlyInputError extends Error {}
export interface SeoOnlyRow {
  uuid: string; baseline_sha256: string; baseline_updated_at: string;
  brand_solo_guard: string; model_solo_guard: string; seo_title: string;
  seo_meta_description: string; CONTROL_NO_IMPORTAR: string;
  estado_revision: string; inmutables_guard: string;
  seo_h1: string; seo_body: string; seo_slug_propuesto_no_aplicar: string;
  validacion_fabricante: string; fuente_oficial: string;
}
export interface SeoOnlyChange { uuid: string; name: string; fields: string[]; patch: { seoTitle?: string; seoDescription?: string } }
export interface SeoOnlyInspection {
  fingerprint: string; requestedCount: number; modifiedCount: number; unchangedCount: number;
  blockedCount: number; blocked: Array<{uuid: string; reason: string}>;
  changes: SeoOnlyChange[]; ignoredColumns: string[];
}
export function hashProductBaseline(product: Record<string, unknown>): string;
export function parseSeoOnlyRows(value: unknown): SeoOnlyRow[];
export function inspectSeoOnlyRows(rows: SeoOnlyRow[], products: Record<string, unknown>[]): SeoOnlyInspection;
