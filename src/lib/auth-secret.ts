/**
 * Secreto de NextAuth. En producción NO hay valor por defecto: si falta,
 * nadie puede autenticarse (más seguro que firmar tokens con un secreto público).
 */
export function getAuthSecret(): string | undefined {
  if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET;
  return process.env.NODE_ENV === "production" ? undefined : "dev-only-secret-change-me";
}
