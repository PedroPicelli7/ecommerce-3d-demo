"use client";

import React from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="font-black text-xl tracking-wider uppercase text-slate-900">
          PHLOX
        </div>

        {/* Menu (Inspirado no topo do download.jpg) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="text-slate-950">Home</a>
          <a href="#" className="hover:text-slate-950 transition">Shop</a>
          <a href="#" className="hover:text-slate-950 transition">About Us</a>
          <a href="#" className="hover:text-slate-950 transition">Contact Us</a>
        </nav>

        {/* Ícone de Carrinho Funcional */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-700 hover:text-slate-950 transition">
            {/* Ícone de Sacola / Carrinho */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            
            {/* Contador de Itens Flutuante */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scaleIn">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}