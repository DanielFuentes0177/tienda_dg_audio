import type { Metadata } from "next";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Providers } from "@/components/providers";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tienda | DG Audiosound",
  description: "Soluciones integrales de audio, video e iluminación premium para hogares y negocios",
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
