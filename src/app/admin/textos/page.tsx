import prisma from "@/lib/prisma";
import { getPageEntries } from "./defaults";
import { TextEditor } from "./TextEditor";
import styles from "./textos.module.css";

export const dynamic = "force-dynamic";

export default async function TextosPage() {
  let rows: { path: string; field: string; value: string }[] = [];
  let missingTable = false;
  try {
    rows = await prisma.pageText.findMany();
  } catch {
    missingTable = true;
  }
  const saved = new Map<string, { seoTitle?: string; seoDescription?: string }>();
  for (const r of rows) saved.set(r.path, { ...saved.get(r.path), [r.field]: r.value });

  const groups = new Map<string, ReturnType<typeof getPageEntries>>();
  for (const e of getPageEntries()) groups.set(e.group, [...(groups.get(e.group) ?? []), e]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Textos SEO</h1>
      <p className={styles.subtitle}>
        Cambia el título y la descripción con los que cada página aparece en Google. Sin cambios, se usa el texto original.
        Los cambios pueden tardar hasta una hora en verse en el sitio y varias semanas en reflejarse en Google.
      </p>
      {missingTable && <div className={styles.warn}>La tabla PageText aún no existe en la base de datos: hay que aplicar la migración.</div>}

      {[...groups.entries()].map(([group, entries]) => (
        <section key={group}>
          <h2 className={styles.groupTitle}>{group}</h2>
          {entries.map((e) => {
            const s = saved.get(e.path) ?? {};
            const custom = Boolean(s.seoTitle || s.seoDescription);
            return (
              <details key={e.path} className={styles.item}>
                <summary className={styles.summary}>
                  <div style={{ minWidth: 0 }}>
                    <div className={styles.name}>{e.label}<span className={styles.path}>{e.path}</span></div>
                    <div className={styles.current}>{s.seoTitle || e.title}</div>
                  </div>
                  <span className={`${styles.chip} ${custom ? styles.chipOn : ""}`}>{custom ? "Personalizado" : "Original"}</span>
                </summary>
                <TextEditor
                  path={e.path}
                  label={e.label}
                  defaultTitle={e.title}
                  defaultDescription={e.description}
                  savedTitle={s.seoTitle ?? ""}
                  savedDescription={s.seoDescription ?? ""}
                />
              </details>
            );
          })}
        </section>
      ))}
    </div>
  );
}
