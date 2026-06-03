"use client";

import React from "react";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background escurecido (Overlay) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Painel do Carrinho */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Topo do Carrinho */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Seu Carrinho</h2>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-slate-400 space-y-2">
                <p className="text-lg font-medium">Sua sacola está vazia</p>
                <p className="text-sm">Adicione produtos para começar.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-4 border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-4">
                    {/* Placeholder da imagem do produto */}
                    <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-400">
                      BOX
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.product.name}</h4>
                      <p className="text-xs text-gray-400 mb-1">{item.product.category}</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </div>
                  </div>

                  {/* Controles de Quantidade e Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-slate-200 rounded-full bg-slate-50">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 text-slate-600 hover:text-slate-950 font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium px-1 text-slate-950">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 text-slate-600 hover:text-slate-950 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs text-red-500 hover:underline font-medium"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rodapé fixo com o Total */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between text-base font-bold text-slate-950">
                <span>Subtotal</span>
                <span>{cartTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <p className="text-xs text-slate-400">Frete e impostos calculados no checkout fictício.</p>
              <button className="w-full bg-slate-950 text-white py-3.5 rounded-full font-semibold hover:bg-slate-900 transition active:scale-98 shadow-md">
                Finalizar Compra (Demonstração)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}