import styles from "./WhatsappStats.module.css";

export interface WhatsappStatsData {
  today: number;
  last7: number;
  last30: number;
  total: number;
  perDay: { label: string; count: number }[]; // últimos 30 días, del más viejo al más nuevo
  byPath: { name: string; count: number }[];
  bySource: { name: string; count: number }[];
}

const SOURCE_LABEL: Record<string, string> = {
  flotante: "Botón flotante",
  inicio: "Botón principal (portada de la página)",
  proceso: "Sección «Proceso»",
  contacto: "Sección «Contacto»",
  soluciones: "Sección «Soluciones»",
  formulario: "Formulario (enviar por WhatsApp)",
  menu: "Menú superior",
  pie: "Pie de página",
  "cotizacion-carrito": "Cotización del carrito",
  enlace: "Otro enlace",
};

const Ranking = ({ items, labels }: { items: { name: string; count: number }[]; labels?: Record<string, string> }) => {
  if (items.length === 0) return <div className={styles.empty}>Aún no hay clics registrados.</div>;
  const max = Math.max(...items.map((i) => i.count));
  return (
    <ul className={styles.rank}>
      {items.map((i) => (
        <li key={i.name} className={styles.rankRow}>
          <span className={styles.rankName} title={i.name}>{labels?.[i.name] ?? i.name}</span>
          <span className={styles.rankNum}>{i.count}</span>
          <span className={styles.rankBar}><span className={styles.rankFill} style={{ width: `${Math.max(4, (i.count / max) * 100)}%`, display: "block" }} /></span>
        </li>
      ))}
    </ul>
  );
};

/** Organismo dumb: clics en botones de WhatsApp (se mide el clic; WhatsApp no informa si se envió el mensaje). */
export const WhatsappStats = ({ data }: { data: WhatsappStatsData }) => {
  const max = Math.max(1, ...data.perDay.map((d) => d.count));
  return (
    <section className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.title}>Clics a WhatsApp</h2>
        <span className={styles.note}>Cuenta clics en los botones, no mensajes enviados.</span>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}><div className={styles.value}>{data.today}</div><div className={styles.label}>Hoy</div></div>
        <div className={styles.card}><div className={styles.value}>{data.last7}</div><div className={styles.label}>Últimos 7 días</div></div>
        <div className={styles.card}><div className={styles.value}>{data.last30}</div><div className={styles.label}>Últimos 30 días</div></div>
        <div className={styles.card}><div className={styles.value}>{data.total}</div><div className={styles.label}>Desde que se mide</div></div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>Por día (últimos 30)</h3>
        <div className={styles.bars} role="img" aria-label="Clics a WhatsApp por día">
          {data.perDay.map((d) => (
            <div key={d.label} className={`${styles.bar} ${d.count === 0 ? styles.barZero : ""}`} style={{ height: `${(d.count / max) * 100}%` }} title={`${d.label}: ${d.count}`} />
          ))}
        </div>
        <div className={styles.axis}><span>{data.perDay[0]?.label}</span><span>{data.perDay[data.perDay.length - 1]?.label}</span></div>
      </div>

      <div className={styles.grid}>
        <div className={styles.panel}><h3 className={styles.panelTitle}>Páginas de las que llegan (30 días)</h3><Ranking items={data.byPath} /></div>
        <div className={styles.panel}><h3 className={styles.panelTitle}>Botón usado (30 días)</h3><Ranking items={data.bySource} labels={SOURCE_LABEL} /></div>
      </div>
    </section>
  );
};
