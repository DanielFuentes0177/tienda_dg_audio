import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseSeoOnlyRows, inspectSeoOnlyRows, hashProductBaseline,
  APPROVED_STATUS, RELEASE_MARKER, DRAFT_MARKER, IMMUTABLES_MARKER,
} from "../src/lib/seo/seoOnlyRules.mjs";
const p = {
  id:"00000000-0000-4000-8000-000000000001",brand:"Biamp",model:"X1",
  name:"Nombre actual",description:"Descripción vigente",category:"Audio",
  subcategory:"Bocinas",family:"Negocios",isActive:true,
  updatedAt:"2026-11-08T00:00:00.000Z",
  stock:7,imageUrl:"https://example.com/imagen.jpg",seoTitle:null,seoDescription:null,
};
function row(approved=false){
  return {
    CONTROL_NO_IMPORTAR:approved?RELEASE_MARKER:DRAFT_MARKER,
    uuid:p.id,baseline_sha256:hashProductBaseline(p),
    baseline_updated_at:p.updatedAt,brand_solo_guard:p.brand,
    model_solo_guard:p.model,seo_title:"Biamp X1 | Bocina profesional",
    seo_meta_description:"Biamp X1: audio profesional para negocios. Consulta integración DG Audiosound.",
    seo_h1:"Un H1 candidato",seo_body:"Texto de propuesta",
    seo_slug_propuesto_no_aplicar:"nuevo-slug",
    estado_revision:approved?APPROVED_STATUS:"LISTO_PARA_AUDITORIA_FINAL",
    validacion_fabricante:"POR_REVISAR",fuente_oficial:"https://example.com",
    inmutables_guard:IMMUTABLES_MARKER,
  };
}
test("preview es puro, no muta inventario",()=>{const before=structuredClone(p);inspectSeoOnlyRows(parseSeoOnlyRows([row()]),[p]);assert.deepEqual(p,before)});
test("preview solo prepara cambios de seoTitle y seoDescription",()=>{
 const r=inspectSeoOnlyRows(parseSeoOnlyRows([row()]),[p]);
 assert.deepEqual(r.changes[0].fields,["seoTitle","seoDescription"]);
 assert.equal(r.blockedCount,1);
});
test("CSV duplicado bloqueado",()=>assert.throws(()=>parseSeoOnlyRows([row(),row()]),/repetido/));
test("Campos comerciales no permitidos",()=>assert.throws(()=>parseSeoOnlyRows([{...row(),stock:"0"}]),/columnas/));
test("La imagen y stock no forman parte del patch",()=>{
 const r=inspectSeoOnlyRows(parseSeoOnlyRows([row(true)]),[p]);
 assert.equal("stock" in r.changes[0].patch,false);
 assert.equal("imageUrl" in r.changes[0].patch,false);
});
test("Cambio de nombre tras exportación bloqueado",()=>{
 const r=inspectSeoOnlyRows(parseSeoOnlyRows([row(true)]),[{...p,name:"Cambio inesperado"}]);
 assert.match(r.blocked[0].reason,/SHA256/);
});
test("Cambio de updatedAt tras exportación bloqueado",()=>{
 const r=inspectSeoOnlyRows(parseSeoOnlyRows([row(true)]),[{...p,updatedAt:"2026-11-09T00:00:00.000Z"}]);
 assert.match(r.blocked[0].reason,/updatedAt/);
});
test("Cambio de modelo bloqueado",()=>{
 const r=inspectSeoOnlyRows(parseSeoOnlyRows([row(true)]),[{...p,model:"X2"}]);
 assert.match(r.blocked[0].reason,/Marca\/modelo/);
});
test("Borrador no publica",()=>{
 const r=inspectSeoOnlyRows(parseSeoOnlyRows([row()]),[p]);
 assert.match(r.blocked[0].reason,/NO IMPORTAR/);
});
test("Solo aprobado explícito superaría controles locales",()=>{
 const r=inspectSeoOnlyRows(parseSeoOnlyRows([row(true)]),[p]);
 assert.equal(r.blockedCount,0);
});
test("Fingerprint cambia tras una edición SEO",()=>{
 const rows=parseSeoOnlyRows([row(true)]);
 const a=inspectSeoOnlyRows(rows,[p]);
 const b=inspectSeoOnlyRows(rows,[{...p,seoTitle:"Otro título"}]);
 assert.notEqual(a.fingerprint,b.fingerprint);
});
test("SHA es estable para fechas Date y ISO",()=>{
 assert.equal(hashProductBaseline(p),hashProductBaseline({...p,updatedAt:new Date(p.updatedAt)}));
});
