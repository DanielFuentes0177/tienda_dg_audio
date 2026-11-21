"use client";

import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { savePageTexts } from "./actions";
import styles from "./textos.module.css";

interface Props {
  path: string;
  label: string;
  defaultTitle: string;
  defaultDescription: string;
  savedTitle: string;
  savedDescription: string;
}

const TITLE_MAX = 60;
const DESC_MAX = 155;

export function TextEditor({ path, label, defaultTitle, defaultDescription, savedTitle, savedDescription }: Props) {
  const [title, setTitle] = useState(savedTitle);
  const [description, setDescription] = useState(savedDescription);
  const [pending, startTransition] = useTransition();

  const shownTitle = title.trim() || defaultTitle;
  const shownDesc = description.trim() || defaultDescription;

  const submit = (t: string, d: string) => {
    const fd = new FormData();
    fd.set("path", path);
    fd.set("seoTitle", t);
    fd.set("seoDescription", d);
    startTransition(async () => {
      try {
        await savePageTexts(fd);
        toast.success(t || d ? `Guardado: ${label}` : `Restaurado el texto original de ${label}`);
      } catch {
        toast.error("No se pudo guardar. Revisa tu sesión e inténtalo de nuevo.");
      }
    });
  };

  return (
    <form
      className={styles.body}
      onSubmit={(e) => { e.preventDefault(); submit(title, description); }}
    >
      <div>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor={`t-${path}`}>Título (lo que se ve en Google)</label>
            <span className={`${styles.counter} ${shownTitle.length > TITLE_MAX ? styles.over : ""}`}>{shownTitle.length}/{TITLE_MAX}</span>
          </div>
          <input id={`t-${path}`} className={styles.input} value={title} maxLength={120} placeholder={defaultTitle} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor={`d-${path}`}>Descripción</label>
            <span className={`${styles.counter} ${shownDesc.length > DESC_MAX ? styles.over : ""}`}>{shownDesc.length}/{DESC_MAX}</span>
          </div>
          <textarea id={`d-${path}`} className={styles.textarea} value={description} maxLength={320} placeholder={defaultDescription} onChange={(e) => setDescription(e.target.value)} />
          <span className={styles.hint}>Si lo dejas vacío se usa el texto original (el gris). Google suele cortar el título a ~60 y la descripción a ~155 caracteres.</span>
        </div>
      </div>

      <div>
        <div className={styles.previewBox}>
          <div className={styles.previewLabel}>Así se vería en Google</div>
          <div className={styles.pUrl}>www.dgaudiosound.com{path === "/" ? "" : path}</div>
          <div className={styles.pTitle}>{shownTitle.length > 66 ? `${shownTitle.slice(0, 63)}…` : shownTitle}</div>
          <div className={styles.pDesc}>{shownDesc.length > 160 ? `${shownDesc.slice(0, 157)}…` : shownDesc}</div>
        </div>
      </div>

      <div className={styles.actions}>
        {(savedTitle || savedDescription) && (
          <button type="button" className={styles.btn} disabled={pending} onClick={() => { setTitle(""); setDescription(""); submit("", ""); }}>
            Restaurar original
          </button>
        )}
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={pending}>
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
