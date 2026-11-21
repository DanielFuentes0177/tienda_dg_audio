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
  const isSecure = req.cookies.has("__Secure-next-auth.session-token");
  const cookieName = isSecure ? "__Secure-next-auth.session-token" : "next-auth.session-token";

  const token = await getToken({
    req,
    secret,
    cookieName,
    secureCookie: isSecure,
  });

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
