import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar"; // <-- Importando aqui

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium E-Commerce 3D",
  description: "Loja conceito interativa para demonstração de projetos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        <CartProvider>
          <Navbar /> {/* <-- Adicionado acima dos filhos para ficar fixo no topo */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}