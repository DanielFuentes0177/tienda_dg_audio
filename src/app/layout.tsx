import type { Metadata } from "next";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Providers } from "@/components/providers";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dgaudiosound.com"),
  title: "Tienda | DG Audiosound",
  description: "Soluciones integrales de audio, video e iluminación premium para hogares y negocios",
  openGraph: {
    title: "Tienda | DG Audiosound",
    description: "Soluciones integrales de audio, video e iluminación premium para hogares y negocios",
    url: "https://www.dgaudiosound.com",
    siteName: "DG Audiosound",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DG Audiosound - Soluciones integrales de audio, video e iluminación premium",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda | DG Audiosound",
    description: "Soluciones integrales de audio, video e iluminación premium para hogares y negocios",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <Toaster position="bottom-right" />
            <main style={{ minHeight: "calc(100vh - 300px)" }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
