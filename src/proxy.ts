import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authSecret, isStoreAdmin } from "@/lib/admin-policy";

export async function proxy(req: NextRequest) {
  const secret = authSecret();
  if (!secret) return new NextResponse("Administración no disponible", { status: 503 });
  const secureCookie = req.cookies.getAll().some(({ name }) =>
    name === "__Secure-next-auth.session-token" || name.startsWith("__Secure-next-auth.session-token.")
  );
  const token = await getToken({ req, secret, secureCookie });
  if (!token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  if (!isStoreAdmin(token.id)) return new NextResponse("Acceso denegado", { status: 403 });
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
