"use client";

import { useCart } from "../../context/CartContext";
import { useState } from "react";

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
    setIsAdding(true);
    
    // Mapeamos o objeto do banco para o formato esperado pelo tipo Product do carrinho
    // E usamos o 'as any' para garantir que propriedades visuais extras não quebrem o TypeScript
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

  // Formatador de moeda local (Real R$)
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black">
      {/* Área da Imagem */}
      <div className="relative aspect-square bg-neutral-950 flex items-center justify-center p-6 overflow-hidden">
        {(product.image_url || (product as any).image) ? (
          <img 
            src={product.image_url || (product as any).image} 
            alt={product.name}
            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          // Fallback visual caso o produto não tenha imagem de verdade
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 border border-dashed border-neutral-800 rounded-xl">
            <span className="text-xs uppercase tracking-widest font-semibold">Sem Imagem</span>
          </div>
        )}
      </div>

      {/* Informações do Produto */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-lg text-neutral-100 group-hover:text-white transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-neutral-400 text-sm mt-1 mb-4 line-clamp-2 min-h-[40px]">
          {product.description || "Nenhuma descrição fornecida para este item."}
        </p>
        
        {/* Rodapé do Card (Preço + Botão) */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Preço</span>
            <span className="text-xl font-extrabold text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 active:scale-95 ${
              isAdding 
                ? "bg-green-600 text-white" 
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            {isAdding ? "Adicionado! ✓" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}