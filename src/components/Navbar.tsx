"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer"; // <-- Importando o Drawer

export default function Navbar() {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false); // <-- Estado para controlar abertura

  return (
    <>
      <header className="border-b border-slate-100 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-black text-xl tracking-wider uppercase text-slate-900">
            PHLOX
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="text-slate-950">Home</a>
            <a href="#" className="hover:text-slate-950 transition">Shop</a>
            <a href="#" className="hover:text-slate-950 transition">About Us</a>
            <a href="#" className="hover:text-slate-950 transition">Contact Us</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Adicionado o onClick para abrir o carrinho */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-2 text-slate-700 hover:text-slate-950 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Renderizando o componente e passando o controle de fechar */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}