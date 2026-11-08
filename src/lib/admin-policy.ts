import "server-only";
import { createHash } from "node:crypto";

// Reject the retired public default even if explicitly configured during transition.
const retiredSecretDigest = "21db835d9d32e511e1fce3376869c36c025869d25801ee54cecfb8f4861e58c3";

// Server-side policy shared by NextAuth, the page proxy and protected handlers.
export function authSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.trim().length < 32) return undefined;
  return createHash("sha256").update(secret).digest("hex") === retiredSecretDigest ? undefined : secret;
}

export function isStoreAdmin(id: unknown): boolean {
  if (typeof id !== "string") return false;
  const normalized = id.trim().toLowerCase();
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(normalized)) return false;
  return (process.env.STORE_ADMIN_IDS ?? "").split(",")
    .some(entry => entry.trim().toLowerCase() === normalized);
}

export function isAdminOrigin(origin: string | null): boolean {
  const configured = process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`);
  if (!origin || !configured) return false;
  try {
    const url = new URL(configured);
    return ["https:", "http:"].includes(url.protocol) && origin === url.origin;
  } catch {
    return false;
  }
}
