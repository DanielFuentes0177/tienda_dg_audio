import prisma from "@/lib/prisma";
import { Package, Users, ShoppingCart } from "lucide-react";
import { DashboardCharts } from "@/components/organisms/DashboardCharts";
import { WhatsappStats, type WhatsappStatsData } from "@/components/organisms/WhatsappStats";

const TZ = "America/Mexico_City";
const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // AAAA-MM-DD

async function getWhatsappStats(): Promise<WhatsappStatsData> {
  const empty: WhatsappStatsData = { today: 0, last7: 0, last30: 0, total: 0, perDay: [], byPath: [], bySource: [] };
  try {
    const since = new Date(Date.now() - 31 * 24 * 3600 * 1000);
    const [total, rows] = await Promise.all([
      prisma.whatsappClick.count(),
      prisma.whatsappClick.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, path: true, source: true } }),
    ]);
    const days: { key: string; label: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      days.push({ key: dayKey(d), label: new Intl.DateTimeFormat("es-MX", { timeZone: TZ, day: "numeric", month: "short" }).format(d), count: 0 });
    }
    const byKey = new Map(days.map((d) => [d.key, d]));
    const byPath = new Map<string, number>();
    const bySource = new Map<string, number>();
    for (const r of rows) {
      const day = byKey.get(dayKey(r.createdAt));
      if (!day) continue;
      day.count += 1;
      byPath.set(r.path, (byPath.get(r.path) ?? 0) + 1);
      bySource.set(r.source, (bySource.get(r.source) ?? 0) + 1);
    }
    const top = (m: Map<string, number>, n: number) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
    const sum = (n: number) => days.slice(-n).reduce((a, d) => a + d.count, 0);
    return { today: sum(1), last7: sum(7), last30: sum(30), total, perDay: days.map(({ label, count }) => ({ label, count })), byPath: top(byPath, 8), bySource: top(bySource, 8) };
  } catch {
    return empty; // la tabla puede no existir todavía
  }
}

// Consulta de métricas siempre en tiempo de solicitud, no durante el build.
export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  // Consultas a la base de datos para obtener las métricas
  const totalProducts = await prisma.product.count();
  
  // Estadísticas de Cotizaciones (Leads)
  const totalQuotes = await prisma.quote.count();
  const attendedQuotes = await prisma.quote.count({ where: { status: "ATTENDED" } });
  
  // Agrupar cotizaciones por mes (aproximado usando código TS)
  const allQuotes = await prisma.quote.findMany({
    select: { createdAt: true, status: true }
  });

  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  
  const quotesByMonthMap = new Map();
  
  // Inicializar últimos 6 meses
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthIndex = new Date(d.getFullYear(), d.getMonth() - i, 1).getMonth();
    quotesByMonthMap.set(monthNames[monthIndex], { month: monthNames[monthIndex], total: 0, attended: 0 });
  }

  allQuotes.forEach(q => {
    const monthStr = monthNames[q.createdAt.getMonth()];
    if (quotesByMonthMap.has(monthStr)) {
      const current = quotesByMonthMap.get(monthStr);
      current.total += 1;
      if (q.status === "ATTENDED") current.attended += 1;
    }
  });

  const chartData = Array.from(quotesByMonthMap.values());

  const whatsapp = await getWhatsappStats();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#111827", fontWeight: 800 }}>Dashboard Analítico</h1>
      
      {/* Top Metrics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        
        {/* Total Leads */}
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "12px", color: "#111827" }}>
            <Users size={28} />
          </div>
          <div>
            <h3 style={{ color: "#6b7280", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>
              Total Leads (Cotizaciones)
            </h3>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              {totalQuotes}
            </p>
          </div>
        </div>

        {/* Atendidas */}
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#ecfdf5", borderRadius: "12px", color: "#10b981" }}>
            <ShoppingCart size={28} />
          </div>
          <div>
            <h3 style={{ color: "#6b7280", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>
              Cotizaciones Atendidas
            </h3>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              {attendedQuotes}
            </p>
          </div>
        </div>

        {/* Productos en Catálogo */}
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#fef3c7", borderRadius: "12px", color: "#d97706" }}>
            <Package size={28} />
          </div>
          <div>
            <h3 style={{ color: "#6b7280", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>
              Productos en Catálogo
            </h3>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              {totalProducts}
            </p>
          </div>
        </div>

      </div>

      {/* Main Charts */}
      <WhatsappStats data={whatsapp} />

      <DashboardCharts quotesByMonth={chartData} />
    </div>
  );
}
