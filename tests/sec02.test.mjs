// In-process tests. All persistence is in memory. No HTTP listener or external target.
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { after, mock, test } from "node:test";
import { compileFunction } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { encode } = require("next-auth/jwt");
const { NextRequest } = require("next/server");
const nextHeaders = require("next/headers");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const origin = "http://localhost:3000";
const secret = randomBytes(40).toString("hex");
const admin = randomUUID(), colleague = randomUUID(), member = randomUUID();
const allowlist = ` ${admin.toUpperCase()} , ${colleague} `;
process.env.NEXTAUTH_URL = origin;
process.env.NEXTAUTH_SECRET = secret;
process.env.STORE_ADMIN_IDS = allowlist;
const tokenFor = (id, maxAge = 3600) => encode({ token: { id, sub: id }, secret, maxAge });
const sessions = {
  valid: await tokenFor(admin), second: await tokenFor(colleague), member: await tokenFor(member),
  expired: await tokenFor(admin, -120), invalid: "invalid-test-cookie", none: "",
};
let cookie = "", requestOrigin = origin;
const sessionCookie = "next-auth.session-token";
mock.method(nextHeaders, "cookies", async () => ({
  getAll: () => cookie ? [{ name: sessionCookie, value: cookie }] : [],
}));
mock.method(nextHeaders, "headers", async () => new Headers(requestOrigin ? { origin: requestOrigin } : {}));
after(() => mock.restoreAll());

const active = randomUUID(), inactive = randomUUID();
const rows = [{ id: active, name: "A", isActive: true, stock: 4 },
  { id: inactive, name: "B", isActive: false, stock: 9 }];
const calls = [];
const track = (key, fn) => (...args) => { calls.push(key); return fn(...args); };
function selected(row, select) {
  if (!row || !select) return row;
  return Object.fromEntries(Object.entries(row).filter(([key]) => select[key]));
}
const password = randomBytes(20).toString("hex");
const user = { id: admin, email: "operator@example.invalid", name: "Synthetic", password: await bcrypt.hash(password, 4) };
const db = {
  user: { findUnique: track("user.read", () => user) },
  product: {
    findMany: track("product.list", ({ where, select } = {}) => rows.filter(p =>
      where?.isActive === undefined || p.isActive === where.isActive).map(p => selected(p, select))),
    findUnique: track("product.read", ({ where, select }) => selected(rows.find(p => p.id === where.id &&
      (where.isActive === undefined || where.isActive === p.isActive)) ?? null, select)),
    count: track("product.count", ({ where }) => rows.filter(p => where.id.in.includes(p.id) && p.isActive === where.isActive).length),
    create: track("product.create", ({ data }) => ({ ...data, id: data.id ?? randomUUID() })),
    update: track("product.update", ({ where, data }) => ({ ...where, ...data })),
    delete: track("product.delete", ({ where }) => where),
    upsert: track("product.upsert", ({ where, update }) => ({ ...where, ...update })),
  },
  quote: {
    create: track("quote.create", ({ data }) => { assert.equal(data.items.create[0].productId, active); return { id: randomUUID() }; }),
    findMany: track("quote.list", () => []),
    update: track("quote.update", ({ where, data }) => ({ ...where, ...data })),
  },
  post: {
    findUnique: track("post.read", () => null), findFirst: track("post.first", () => null),
    create: track("post.create", ({data}) => data), update: track("post.update", () => ({slug:"fixture"})),
    delete: track("post.delete", () => ({slug:"fixture"})),
  },
  $transaction: track("transaction", (fn, opts) => { assert.equal(opts.isolationLevel, "Serializable"); return fn(db); }),
};
const modules = new Map();
function app(path) {
  if (modules.has(path)) return modules.get(path);
  const file = resolve(path);
  const {outputText} = ts.transpileModule(readFileSync(file, "utf8"), {compilerOptions:{
    module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022, esModuleInterop:true,
  }});
  const mod = {exports:{}};
  const fromApp = id => {
    if (id === "@/lib/prisma") return db;
    if (id === "sharp") return track("sharp", sharp);
    if (id === "server-only") return {};
    if (id === "next/cache") return { revalidatePath() {} };
    if (id.startsWith("@/")) return app("src/"+id.slice(2)+".ts");
    return require(id);
  };
  compileFunction(outputText, ["module","exports","require"], { filename:file })(mod, mod.exports, fromApp);
  modules.set(path,mod.exports);
  return mod.exports;
}
const png = await sharp({create:{width:2,height:2,channels:3,background:"white"}}).png().toBuffer();
const operations = [
  ["create","products","POST",{name:"Fixture",description:"test"},201,"product.create"],
  ["edit","products/[id]","PUT",{name:"Edited"},200,"product.update"],
  ["delete","products/[id]","DELETE",null,200,"product.delete"],
  ["bulk","products/bulk","POST",[{id:active,name:"A",description:"test"}],201,"product.upsert"],
  ["preview","products/import-preview","POST",[{id:active,name:"Edited"}],200,"product.list"],
  ["quotes","quotes","GET",null,200,"quote.list"],
  ["status","quotes/[id]","PATCH",{status:"ATTENDED"},200,"quote.update"],
  ["image","upload","POST",null,200,"sharp"],
  ["inventory","admin/products","GET",null,200,"product.list"],
];
async function invoke(path, method, body, id = active) {
  const headers = requestOrigin ? { origin:requestOrigin } : {};
  let content;
  if (path === "upload") {
    content = new FormData();
    content.set("file", new Blob([png],{type:"image/png"}),"fixture.png");
  } else if (body !== null && body !== undefined) {
    headers["content-type"] = "application/json";
    content = JSON.stringify(body);
  }
  const req = new NextRequest(origin+"/", {method,headers,body:content});
  return app("src/app/api/"+path+"/route.ts")[method](req,{params:Promise.resolve({id})});
}
const scenarios = [
  ["anonymous","none",401], ["expired","expired",401], ["invalid","invalid",401],
  ["ordinary","member",403], ["unconfigured","valid",403], ["foreign-origin","valid",403],
  ["missing-origin","valid",403], ["missing-secret","valid",503], ["admin","valid",200],
];
for (const [label,path,method,body,ok,operation] of operations) {
  for (const [scenario,identity,expected] of scenarios) {
    if (method==="GET" && scenario.endsWith("origin")) continue;
    test(`AUTH ${label} / ${scenario}`,async t=>{
      cookie=sessions[identity];requestOrigin=scenario==="foreign-origin"?"https://elsewhere.invalid":scenario==="missing-origin"?null:origin;
      process.env.STORE_ADMIN_IDS=scenario==="unconfigured"?"":allowlist;
      process.env.NEXTAUTH_SECRET=scenario==="missing-secret"?"":secret;
      // NextAuth emits an expected diagnostic when it rejects an invalid test token.
      if (["expired","invalid"].includes(scenario)) t.mock.method(console,"error",()=>{});
      calls.length=0;
      try {
        const response=await invoke(path,method,body);
        assert.equal(response.status,scenario==="admin"?ok:expected);
        if (scenario!=="admin") assert.deepEqual(calls,[]);
        else {
          assert.ok(calls.includes(operation));
          const result=await response.json();
          if (label==="inventory") assert.deepEqual(result.map(p=>p.id),[active,inactive]);
          if (label==="image") assert.match(result.base64,/^data:image\/webp;base64,/);
          if (label==="edit") assert.equal(result.name,"Edited");
          if (label==="bulk") assert.equal(result.count,1);
          if (label==="status") assert.equal(result.quote.status,"ATTENDED");
        }
      } finally { process.env.NEXTAUTH_SECRET=secret;process.env.STORE_ADMIN_IDS=allowlist;requestOrigin=origin; }
    });
  }
}
test("public reads project active fields and withhold inactive details",async()=>{
  cookie="";
  const list=await (await invoke("products","GET")).json();
  assert.deepEqual(list,[{id:active,name:"A"}]);
  assert.deepEqual(await (await invoke("products/[id]","GET",null,active)).json(),list[0]);
  assert.equal((await invoke("products/[id]","GET",null,inactive)).status,404);
});
const quote={customerName:"Synthetic",customerEmail:"buyer@example.invalid",items:[{productId:active,quantity:2}]};
test("public quote uses original UUID, validates all active items before its only write",async()=>{
  cookie=""; calls.length=0;
  assert.equal((await invoke("quotes","POST",quote)).status,200);
  assert.deepEqual(calls,["transaction","product.count","quote.create"]);
  for(const id of [inactive,randomUUID()]){
    calls.length=0;
    assert.equal((await invoke("quotes","POST",{...quote,items:[...quote.items,{productId:id,quantity:2}]})).status,400);
    assert.deepEqual(calls,["transaction","product.count"]);
  }
});
test("malformed, oversized and invalid public quotes never reach persistence",async()=>{
  const payloads=[null,[],{...quote,items:[]},{...quote,customerName:"  "},{...quote,customerName:"a".repeat(192)},
    {...quote,customerEmail:"invalid"},{...quote,customerPhone:{}},{...quote,message:"x".repeat(70000)},
    {...quote,items:Array(101).fill(quote.items[0])},{...quote,items:[...quote.items,...quote.items]},
    {...quote,items:[{productId:"missing",quantity:1}]},
    ...[0,-1,1.5,10000,"2"].map(quantity=>({...quote,items:[{productId:active,quantity}]}))];
  for(const body of payloads){calls.length=0;assert.equal((await invoke("quotes","POST",body)).status,400);assert.deepEqual(calls,[]);}
  const response=await app("src/app/api/quotes/route.ts").POST(new Request(origin,{method:"POST",body:"{"}));
  assert.equal(response.status,400);
});
test("second administrator, revocation with an existing token, panel and protected actions",async()=>{
  cookie=sessions.second;
  const access=app("src/lib/admin-access.ts");
  await access.requireAdminPage();
  const proxy=app("src/proxy.ts").proxy;
  const req=new NextRequest(origin+"/admin",{headers:{cookie:sessionCookie+"="+cookie}});
  assert.equal((await proxy(req)).headers.get("x-middleware-next"),"1");
  assert.equal((await invoke("products/[id]","PUT",{isActive:false})).status,200);
  process.env.STORE_ADMIN_IDS=admin;
  try {
    assert.equal((await proxy(req)).status,403);
    assert.equal((await invoke("admin/products","GET")).status,403);
    await assert.rejects(access.requireAdminPage);
    const actions=app("src/app/admin/blog/actions.ts");
    for(const run of [()=>actions.createPost({}),()=>actions.updatePost(active,{}),()=>actions.deletePost(active),()=>actions.togglePublishPost(active,true)]) {
      calls.length=0;await assert.rejects(run);assert.deepEqual(calls,[]);
    }
  } finally {process.env.STORE_ADMIN_IDS=allowlist;}
  requestOrigin=null;
  try {await assert.rejects(access.requireAdminAction);}finally{requestOrigin=origin;}
});
test("NextAuth credentials provider validates the original account and retains its session ID",async()=>{
  const options=app("src/lib/auth.ts").authOptions;
  const authorize=options.providers[0].options.authorize;
  const verified=await authorize({email:user.email,password});
  assert.equal(verified.id,admin);assert.equal(verified.password,undefined);
  await assert.rejects(()=>authorize({email:user.email,password:"incorrect"}));
  const token=await options.callbacks.jwt({token:{},user:verified});
  assert.equal((await options.callbacks.session({session:{user:{}},token})).user.id,admin);
});
test("missing secret disables authentication handler and panel before DB access",async()=>{
  delete process.env.NEXTAUTH_SECRET;
  try {
    calls.length=0;
    const req=new NextRequest(origin+"/admin");
    assert.equal((await app("src/proxy.ts").proxy(req)).status,503);
    assert.equal((await app("src/app/api/auth/[...nextauth]/route.ts").GET(req,{})).status,503);
    assert.deepEqual(calls,[]);
  } finally {process.env.NEXTAUTH_SECRET=secret;}
});
test("seed fails before creating a client without explicit provisioning inputs",()=>{
  const result=spawnSync(process.execPath,["prisma/seed.mjs"],{env:{},encoding:"utf8"});
  assert.equal(result.status,1);assert.match(result.stderr,/No se completó/);
});
