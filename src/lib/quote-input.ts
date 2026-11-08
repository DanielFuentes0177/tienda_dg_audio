const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function field(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length <= max ? text : null;
}

export function parseQuote(value: unknown) {
  if (!record(value)) return null;
  const customerName = field(value.customerName, 191);
  const customerEmail = field(value.customerEmail, 191);
  const customerPhone = field(value.customerPhone ?? "", 32);
  const message = field(value.message ?? "", 4000);
  if (!customerName || !customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) return null;
  if (customerPhone === null || message === null) return null;
  if (customerPhone && (!/^[+\d() .-]+$/.test(customerPhone) || customerPhone.replace(/\D/g, "").length < 7)) return null;
  if (!Array.isArray(value.items) || !value.items.length || value.items.length > 100) return null;

  const seen = new Set<string>();
  const items: { productId: string; quantity: number }[] = [];
  for (const item of value.items) {
    if (!record(item) || typeof item.productId !== "string" || !uuid.test(item.productId)) return null;
    const productId = item.productId.toLowerCase();
    const quantity = item.quantity;
    if (seen.has(productId) || typeof quantity !== "number" || !Number.isInteger(quantity) ||
        quantity < 1 || quantity > 9999) return null;
    seen.add(productId);
    items.push({ productId, quantity });
  }
  return { customerName, customerEmail, customerPhone, message, items };
}

export async function readQuote(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 65536) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    return parseQuote(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}
