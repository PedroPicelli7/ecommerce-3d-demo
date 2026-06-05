"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // Ajuste o caminho se necessário
import { X, Trash2, ShoppingBag, Ticket, Check, AlertTriangle } from "lucide-react"; 

export default function CartDrawer() {
  // 🌟 Importando os estados e métodos do nosso novo sistema de cupons
  const { 
    cart, 
    isCartOpen, 
    isDrawerOpen, 
    isOpen, 
    setIsCartOpen, 
    setIsDrawerOpen, 
    toggleCart, 
    setCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    subtotal,
    discountAmount,
    totalWithDiscount
  } = useCart() as any;

  // Estados locais para controlar o input de texto do cupom
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ status: "success" | "error" | null; text: string }>({
    status: null,
    text: ""
  });
  const [isApplying, setIsApplying] = useState(false);

  const shouldShow = isCartOpen || isDrawerOpen || isOpen;

  const handleClose = () => {
    if (typeof setIsCartOpen === "function") setIsCartOpen(false);
    else if (typeof setIsDrawerOpen === "function") setIsDrawerOpen(false);
    else if (typeof toggleCart === "function") toggleCart();
  };

  const handleRemoveItem = (id: string) => {
    if (setCart) {
      setCart((prev: any[]) => prev.filter((item) => item.id !== id));
    }
  };

  // Handler para processar a validação do cupom
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplying(true);
    setCouponMessage({ status: null, text: "" });

    const result = await applyCouponCode(couponInput);

    if (result.success) {
      setCouponMessage({ status: "success", text: result.message });
      setCouponInput(""); // Limpa o campo após aplicar
    } else {
      setCouponMessage({ status: "error", text: result.message });
    }
    setIsApplying(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage({ status: null, text: "" });
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop de fundo escuro com blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose} 
      />
      
      {/* Painel Lateral Dark Premium */}
      <div className="relative w-full max-w-md h-full bg-[#0a0a0a] border-l border-neutral-900 p-6 flex flex-col z-10 shadow-2xl transition-transform duration-300">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-white" />
            <h2 className="text-lg font-bold font-title uppercase tracking-tight text-white">
              Sua Sacola ({cart?.length || 0})
            </h2>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-neutral-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo: Lista de Itens Rolável */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {!cart || cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 pt-20">
              <ShoppingBag size={40} className="text-neutral-700 border border-dashed border-neutral-800 p-2 rounded-xl" />
              <p className="text-neutral-500 text-sm font-sans">Seu carrinho está vazio.</p>
            </div>
          ) : (
            cart.map((item: any) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl hover:border-neutral-800 transition-colors"
              >
                {item.image && (
                  <div className="w-16 h-16 bg-[#0e0e0e] border border-neutral-800/60 rounded-lg flex items-center justify-center p-2 shrink-0">
                    <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-bold font-title uppercase tracking-tight text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-sans">
                    Qtd: <span className="text-neutral-300 font-semibold">{item.quantity}</span>
                  </p>
                  <p className="text-sm font-bold font-title text-white tracking-tight">
                    {(item.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>

                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-neutral-900/80"
                  title="Remover item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Rodapé: Área de Finalização */}
        {cart && cart.length > 0 && (
          <div className="border-t border-neutral-900 pt-4 space-y-4 bg-[#0a0a0a]">
            
            {/* 🎟️ SEÇÃO DE CUPOM DE DESCONTO */}
            <div className="bg-neutral-900/30 border border-neutral-900/80 p-3 rounded-xl space-y-2">
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input 
                      type="text" 
                      placeholder="CUPOM DE DESCONTO" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs font-sans uppercase tracking-wider text-white focus:outline-none focus:border-neutral-600 placeholder-neutral-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="bg-white text-black font-bold text-xs px-4 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {isApplying ? "..." : "Aplicar"}
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-neutral-950/50 border border-neutral-800/60 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-xs font-bold tracking-wider text-emerald-500 uppercase font-sans">
                      {appliedCoupon.code} (-{appliedCoupon.discountPercentage}%)
                    </span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              )}

              {/* Mensagens de Feedback */}
              {couponMessage.text && (
                <div className={`flex items-center gap-1.5 text-[11px] font-sans px-1 ${
                  couponMessage.status === "success" ? "text-emerald-500" : "text-red-400"
                }`}>
                  {couponMessage.status === "success" ? <Check size={12} /> : <AlertTriangle size={12} />}
                  <span>{couponMessage.text}</span>
                </div>
              )}
            </div>

            {/* METRIFICAÇÃO FINANCEIRA */}
            <div className="space-y-2 border-b border-neutral-900 pb-3 font-sans">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Subtotal</span>
                <span className="font-semibold text-white">
                  {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>

              {/* Só exibe a linha de desconto se houver desconto real */}
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-500">
                  <span className="uppercase tracking-wider font-semibold">Desconto</span>
                  <span className="font-semibold">
                    -{discountAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Total</span>
                <span className="text-xl font-bold font-title tracking-tight text-white">
                  {totalWithDiscount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            </div>
            
            <p className="text-[11px] text-neutral-500 font-sans leading-tight">
              Taxas de envio adicionais serão calculadas na próxima etapa do checkout.
            </p>

            {/* Botão de Finalização */}
            <button 
              onClick={() => alert(`Checkout iniciado! Valor Final: ${totalWithDiscount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`)}
              className="w-full bg-white text-black font-bold font-sans text-sm py-4 rounded-xl text-center hover:bg-neutral-200 transition-all active:scale-95 shadow-xl shadow-white/5 cursor-pointer block"
            >
              Finalizar Compra ⚡
            </button>
          </div>
        )}

      </div>
    </div>
  );
}