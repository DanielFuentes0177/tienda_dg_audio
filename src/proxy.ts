import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { productPath } from "@/lib/seo/productSeo";

export async function proxy(req: NextRequest) {
  // Redirección 301 de UUID a slug; UUID sigue siendo la clave de cotizaciones.
  if (req.nextUrl.pathname.startsWith("/tienda/producto/")) {
    const token = req.nextUrl.pathname.slice("/tienda/producto/".length).split("/")[0];
    if (/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(token)) {
      const product = await prisma.product.findUnique({
        where: { id: token.toLowerCase() },
        select: { id: true, slug: true, isActive: true },
      });
      if (product?.isActive && product.slug) {
        return NextResponse.redirect(new URL(productPath(product), req.url), 301);
      }
    }
    return NextResponse.next();
  }
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
    "/tienda/producto/:path*",
  ],
};
