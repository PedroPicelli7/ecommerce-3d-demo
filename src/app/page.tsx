"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "./context/CartContext";
import ProductCanvas from "../components/3d/ProductCanvas";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { trackEvent } from "../lib/analytics";

// Definição da interface para os produtos vindo do banco
interface DatabaseProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  has_3d: boolean;
}

export default function Home() {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<DatabaseProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // Puxar os dados do Supabase assim que a página carregar
  useEffect(() => {
    async function fetchMainProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("name", "Beats Solo Wireless") // Busca pelo fone inserido no SQL
          .single();

        if (error) throw error;
        if (data) setProduct(data);
      } catch (err) {
        console.error("Erro ao carregar produto do banco:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMainProduct();
    trackEvent("page_view", window.location.pathname);
  }, []);

  // Adaptador simples para transformar o padrão do banco no formato que o Contexto do carrinho já aceita
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      category: product.category,
      image: product.image,
      has3D: product.has_3d,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-sans text-neutral-500 gap-3">
        <div className="w-6 h-6 border-2 border-wonder border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm tracking-wider uppercase animate-pulse">Sincronizando com a nuvem...</p>
      </div>
    );
  }

  // Caso o banco falhe por falta das chaves do .env, criamos um fallback seguro
  const displayProduct = product || {
    name: "Beats Solo Wireless",
    category: "Headphones",
    description: "Fone de ouvido premium com cancelamento de ruído ativo e som imersivo. (Local Fallback)",
    price: 1490.00
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center relative overflow-hidden px-6 lg:px-16 pt-24 pb-12">
      
      {/* Glow de Fundo Sutil (Cyber-Dusk Violet & Wonder Orange) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-wonder/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Seção Principal (Hero) */}
      <section className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center z-10 relative mb-16">
        <div className="md:col-span-6 space-y-6 text-left order-2 md:order-1">
          
          {/* Badge Tecnológica Streetwear */}
          <div className="inline-flex items-center gap-2 bg-neutral-900/80 border border-neutral-800/60 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-wonder rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
              {displayProduct.category} - Edição Conceito
            </span>
          </div>

          {/* Título Massivo e Largo (Syne Font) */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black font-title tracking-tight leading-none text-white uppercase">
            PHLOX <br />
            <span className="bg-gradient-to-r from-wonder to-orange-500 bg-clip-text text-transparent">
              {displayProduct.name.split(" ")[1] || "SOLO"}
            </span>
          </h1>

          {/* Descrição Limpa e Sofisticada (Plus Jakarta Sans Font) */}
          <p className="text-neutral-400 text-base sm:text-lg font-sans max-w-lg leading-relaxed">
            {displayProduct.description}
          </p>

          {/* Seção de Preço Metrificada */}
          <div className="pt-2">
            <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold mb-1 font-sans">Preço Exclusivo</p>
            <p className="text-4xl font-bold font-title tracking-tight text-white">
              {displayProduct.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>

          {/* Botões com cantos intermediários (rounded-xl) */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button 
              onClick={handleAddToCart}
              className="bg-white text-black font-bold font-sans text-sm px-8 py-4 rounded-xl text-center hover:bg-neutral-200 transition-all active:scale-95 shadow-lg shadow-white/5 cursor-pointer"
            >
              Adicionar ao Carrinho ⚡
            </button>
            
            <Link 
              href="/shop" 
              className="bg-neutral-900 text-neutral-300 font-semibold font-sans text-sm px-8 py-4 rounded-xl text-center border border-neutral-800 hover:border-neutral-700 hover:text-white transition-all"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>

        {/* Container para o Modelo 3D Interativo */}
        <div className="md:col-span-6 w-full h-[350px] sm:h-[450px] lg:h-[550px] order-1 md:order-2 relative flex items-center justify-center cursor-grab active:cursor-grabbing">
          <ProductCanvas />
        </div>
      </section>

      {/* Grid de Categorias Estilizado */}
      <section className="max-w-7xl mx-auto w-full z-10 relative pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="bg-neutral-900 border border-neutral-800/60 p-8 rounded-2xl h-64 flex flex-col justify-between shadow-xl group hover:border-wonder/30 transition-all duration-300">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest font-sans">Enjoy</span>
              <h3 className="text-2xl font-bold font-title mt-2 uppercase tracking-tight text-white">With Earphone</h3>
            </div>
            <Link href="/shop" className="bg-wonder text-white text-xs font-bold px-5 py-3 rounded-xl w-max hover:bg-orange-600 transition font-sans text-center">
              Browse
            </Link>
          </div>

          <div className="bg-neutral-900 border border-neutral-800/60 p-8 rounded-2xl h-64 flex flex-col justify-between shadow-xl group hover:border-purple-500/30 transition-all duration-300">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest font-sans">New</span>
              <h3 className="text-2xl font-bold font-title mt-2 uppercase tracking-tight text-white">Wear Gadget</h3>
            </div>
            <Link href="/shop" className="bg-white text-black text-xs font-bold px-5 py-3 rounded-xl w-max hover:bg-neutral-200 transition font-sans text-center">
              Browse
            </Link>
          </div>

          <div className="bg-gradient-to-br from-wonder/20 to-neutral-900 border border-wonder/30 p-8 rounded-2xl h-64 sm:col-span-2 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest font-sans">Trend</span>
              <h3 className="text-3xl font-black font-title mt-2 uppercase tracking-tight text-white">Devices Laptop</h3>
            </div>
            <Link href="/shop" className="bg-white text-black text-xs font-bold px-6 py-3 rounded-xl w-max hover:bg-neutral-200 transition font-sans text-center shadow-lg">
              Browse
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}