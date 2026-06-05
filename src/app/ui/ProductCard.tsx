"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import { trackEvent } from "../lib/analytics";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    category?: string;
    has3D?: boolean;
    image?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    trackEvent("click_buy", window.location.pathname, product.name);
    setIsAdding(true);
    
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: Number(product.price),
      image: product.image_url || product.image || "",
      category: product.category || "Geral",
      has3D: product.has3D || false
    } as any);

    setTimeout(() => setIsAdding(false), 800);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="group flex flex-col bg-neutral-900/50 border border-neutral-800/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-wonder/40 hover:shadow-2xl hover:shadow-black">
      
      {/* Área da Imagem (Fundo Fosco Centralizado) */}
      <div className="relative aspect-square bg-[#0e0e0e] flex items-center justify-center p-8 overflow-hidden border-b border-neutral-800/40">
        {(product.image_url || (product as any).image) ? (
          <img 
            src={product.image_url || (product as any).image} 
            alt={product.name}
            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 border border-dashed border-neutral-800 rounded-xl">
            <span className="text-[10px] uppercase tracking-widest font-bold font-sans">Sem Imagem</span>
          </div>
        )}
      </div>

      {/* Informações do Produto */}
      <div className="flex flex-col flex-1 p-5 space-y-2">
        <h3 className="font-bold font-title text-base text-neutral-100 uppercase tracking-tight group-hover:text-white transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-2 min-h-[36px]">
          {product.description || "Nenhuma descrição fornecida para este dispositivo."}
        </p>
        
        {/* Rodapé do Card (Preço + Ação) */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800/60">
          <div className="flex flex-col">
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold font-sans">Preço</span>
            <span className="text-lg font-bold font-title tracking-tight text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide transition-all duration-200 active:scale-95 cursor-pointer ${
              isAdding 
                ? "bg-green-950/40 border border-green-800 text-green-400" 
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            {isAdding ? "Salvo ✓" : "Comprar ⚡"}
          </button>
        </div>
      </div>
    </div>
  );
}