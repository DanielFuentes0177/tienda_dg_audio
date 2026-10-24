import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only";
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
