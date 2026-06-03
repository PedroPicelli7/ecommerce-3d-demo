import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { CartProvider } from "./context/CartContext";
import Navbar from "../components/Navbar";
import CartDrawer from "./ui/CartDrawer"; // 

// Configuração da fonte dos títulos (Streetwear / Tech Impact)
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"], // Pesos pesados para títulos marcantes
});

// Configuração da fonte do texto (Premium / Minimalista)
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PHLOX | Premium 3D E-Commerce",
  description: "Fones de ouvido de alta performance com tecnologia de ponta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-neutral-950 text-white antialiased font-sans">
        <CartProvider>
          <Navbar />
          <CartDrawer /> {/* ⚡ Agora o carrinho escuta o contexto globalmente */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}