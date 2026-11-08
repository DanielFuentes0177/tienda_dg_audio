import { createHash } from "node:crypto";

// Funciones puras: no abren conexiones ni escriben en base de datos.
export const DRAFT_MARKER = "BLOQUEADO_HASTA_IMPORTADOR_SEO_ONLY_VERIFICADO";
export const RELEASE_MARKER = "DGAS_SEO_ONLY_APROBADO_PARA_PUBLICAR";
export const IMMUTABLES_MARKER = "PROHIBIDO_CAMBIAR_PRECIO_STOCK_NOMBRE_IMAGEN_ESTADO_CATEGORIA";
export const APPROVED_STATUS = "APROBADO_EDITORIAL_Y_TECNICO";
export const CSV_COLUMNS = ["CONTROL_NO_IMPORTAR","uuid","baseline_sha256","baseline_updated_at","brand_solo_guard","model_solo_guard","seo_title","seo_meta_description","seo_h1","seo_body","seo_slug_propuesto_no_aplicar","estado_revision","validacion_fabricante","fuente_oficial","inmutables_guard"];
const columns = new Set(CSV_COLUMNS);
const uuidRe=/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i;
const shaRe=/^[a-f0-9]{64}$/i;
const hashKeys=["id","brand","model","name","description","category","subcategory","family","isActive","updatedAt"].sort();
export class SeoOnlyInputError extends Error {}
const fail=(message)=>{throw new SeoOnlyInputError(message);};
const date=(v)=>v instanceof Date?v.toISOString():typeof v==="string" && !Number.isNaN(new Date(v).getTime())?new Date(v).toISOString():v;
export function hashProductBaseline(product){
 const identity={};
 for(const k of hashKeys){if(!(k in product))fail("Falta campo "+k+" para "+product.id);identity[k]=k==="updatedAt"?date(product[k]):product[k];}
 return createHash("sha256").update(JSON.stringify(identity)).digest("hex");
}
export function parseSeoOnlyRows(input){
 if(!Array.isArray(input)||input.length<1||input.length>100)fail("Se requieren 1 a 100 fichas.");
 const seen=new Set(),titles=new Set();
 return input.map((raw,i)=>{
  if(!raw||typeof raw!=="object"||Array.isArray(raw))fail("Fila "+(i+1)+" inválida.");
  if(Object.keys(raw).some(k=>!columns.has(k)))fail("Fila "+(i+1)+": columnas no autorizadas.");
  for(const value of Object.values(raw)){if(value!==undefined&&typeof value!=="string")fail("Los valores deben ser texto.");}
  const row=Object.fromEntries(CSV_COLUMNS.map(k=>[k,(raw[k]||"").trim()]));
  row.uuid=row.uuid.toLowerCase();
  if(!uuidRe.test(row.uuid)||seen.has(row.uuid))fail("UUID inválido o repetido: "+row.uuid);
  seen.add(row.uuid);
  if(!shaRe.test(row.baseline_sha256)||!row.baseline_updated_at||!row.brand_solo_guard||!row.model_solo_guard)fail("Faltan guardias de identidad en "+row.uuid);
  if(!row.seo_title||row.seo_title.length>150||!row.seo_meta_description||row.seo_meta_description.length>300)fail("SEO inválido en "+row.uuid);
  if(titles.has(row.seo_title.toLowerCase()))fail("Título SEO repetido.");titles.add(row.seo_title.toLowerCase());
  if(![DRAFT_MARKER,RELEASE_MARKER].includes(row.CONTROL_NO_IMPORTAR)||row.inmutables_guard!==IMMUTABLES_MARKER)fail("Marca de seguridad inválida.");
  return row;
 });
}
export function inspectSeoOnlyRows(rows,products){
 const byId=new Map(products.map(p=>[p.id.toLowerCase(),p]));
 const blocked=[],changes=[],snapshot=[];
 for(const row of rows){
  const p=byId.get(row.uuid);
  if(!p){blocked.push({uuid:row.uuid,reason:"UUID no encontrado"});continue;}
  const reasons=[],baseline=hashProductBaseline(p);
  if(p.isActive!==true)reasons.push("Ficha inactiva");
  if(p.brand!==row.brand_solo_guard||p.model!==row.model_solo_guard)reasons.push("Marca/modelo distintos");
  if(date(p.updatedAt)!==date(row.baseline_updated_at))reasons.push("updatedAt distinto");
  if(baseline!==row.baseline_sha256)reasons.push("SHA256 de identidad distinto");
  if(row.CONTROL_NO_IMPORTAR!==RELEASE_MARKER)reasons.push("CSV NO IMPORTAR");
  if(row.estado_revision!==APPROVED_STATUS)reasons.push("Sin aprobación editorial/técnica");
  if(reasons.length)blocked.push({uuid:row.uuid,reason:reasons.join("; ")});
  const patch={};
  if(p.seoTitle!==row.seo_title)patch.seoTitle=row.seo_title;
  if(p.seoDescription!==row.seo_meta_description)patch.seoDescription=row.seo_meta_description;
  if(Object.keys(patch).length)changes.push({uuid:row.uuid,name:p.name,fields:Object.keys(patch),patch});
  snapshot.push({id:p.id,brand:p.brand,model:p.model,name:p.name,updatedAt:date(p.updatedAt),baseline,seoTitle:p.seoTitle??null,seoDescription:p.seoDescription??null});
 }
 const fingerprint=createHash("sha256").update(JSON.stringify({rows,snapshot})).digest("hex");
 return {fingerprint,requestedCount:rows.length,modifiedCount:changes.length,unchangedCount:rows.length-changes.length,blockedCount:blocked.length,blocked,changes,ignoredColumns:["seo_h1","seo_body","seo_slug_propuesto_no_aplicar"]};
}
