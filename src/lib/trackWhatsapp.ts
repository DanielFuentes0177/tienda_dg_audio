/**
 * Registra un clic en WhatsApp (solo página y botón; sin datos personales ni cookies).
 * Se usa donde WhatsApp se abre por código (formularios); los enlaces <a href="wa.me/..."> los detecta
 * WhatsappTracker automáticamente.
 */
export function trackWhatsapp(source: string): void {
  try {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) return;
    const body = JSON.stringify({ path, source });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track/whatsapp", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    }
  } catch {
    // Contar clics nunca debe romper el botón.
  }
}
