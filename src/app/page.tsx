"use client";

import React from "react";
import ProductCanvas from "../components/3d/ProductCanvas";
import { useCart } from "../context/CartContext";
import productsData from "../data/products.json";

export default function Home() {
  const { addToCart } = useCart();
  
  // Pegamos o fone Beats (ID 1) do nosso JSON para a seção principal
  const mainProduct = productsData.find((p) => p.id === "1") || productsData[0];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Seção Principal (Hero) */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-4 max-w-xl">
          <span className="text-sm font-semibold tracking-widest uppercase text-gray-400">
            {mainProduct.category}
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-slate-950">
            {mainProduct.name.split(" ")[1] || "Wireless"}
          </h1>
          <p className="text-gray-500 text-lg">
            {mainProduct.description}
          </p>
          <div className="pt-2">
            <p className="text-2xl font-bold text-slate-900 mb-4">
              {mainProduct.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            <button 
              onClick={() => addToCart(mainProduct)}
              className="bg-red-500 text-white font-medium px-8 py-3 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20 active:scale-95"
            >
              Adicionar ao Carrinho 🚀
            </button>
          </div>
        </div>

        {/* Container para o Modelo 3D Interativo */}
        {/* Container para o Modelo 3D Interativo */}
<div className="w-full md:w-1/2 h-[450px] bg-transparent flex items-center justify-center relative overflow-hidden">
  <ProductCanvas />
</div>
      </section>

      {/* Grid de Categorias (Inspirado na imagem download.jpg) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Bloco 1 */}
          <div className="bg-zinc-950 text-white p-8 rounded-3xl h-64 flex flex-col justify-between shadow-xl">
            <div><span className="text-xs font-semibold text-zinc-500 uppercase">Enjoy</span><h3 className="text-2xl font-bold mt-1">With Earphone</h3></div>
            <button className="bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-full w-max hover:bg-red-600 transition">Browse</button>
          </div>
          {/* Bloco 2 */}
          <div className="bg-amber-400 text-slate-950 p-8 rounded-3xl h-64 flex flex-col justify-between shadow-xl">
            <div><span className="text-xs font-semibold text-amber-900/60 uppercase">New</span><h3 className="text-2xl font-bold mt-1">Wear Gadget</h3></div>
            <button className="bg-white text-amber-600 text-xs font-bold px-5 py-2.5 rounded-full w-max hover:bg-slate-50 transition shadow-md">Browse</button>
          </div>
          {/* Bloco 3 */}
          <div className="bg-red-500 text-white p-8 rounded-3xl h-64 md:col-span-2 flex flex-col justify-between shadow-xl">
            <div><span className="text-xs font-semibold text-red-200 uppercase">Trend</span><h3 className="text-2xl font-bold mt-1">Devices Laptop</h3></div>
            <button className="bg-white text-red-500 text-xs font-bold px-5 py-2.5 rounded-full w-max hover:bg-slate-50 transition shadow-md">Browse</button>
          </div>
        </div>
      </section>
    </main>
  );
}