import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";

export async function proxy(req: NextRequest) {
  const secret = getAuthSecret();
  if (!secret) {
    // Sin secreto configurado en producción: denegar todo acceso al admin.
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // Se prueban ambas cookies: un navegador puede traer una "__Secure-" vieja o de otra app en el mismo
  // host (p. ej. localhost) y eso no debe impedir usar la sesión válida.
  const candidates = [
    { cookieName: "__Secure-next-auth.session-token", secureCookie: true },
    { cookieName: "next-auth.session-token", secureCookie: false },
  ].filter((c) => req.cookies.has(c.cookieName));

  let token = null;
  for (const c of candidates) {
    try {
      token = await getToken({ req, secret, cookieName: c.cookieName, secureCookie: c.secureCookie });
    } catch {
      token = null;
    }
    if (token) break;
  }

  if (!token) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Aplica el middleware (protección) a cualquier ruta que empiece con /admin
     * No protege /login, /, ni /api (a menos que sean /api/admin)
     */
    "/admin/:path*",
  ],
};
