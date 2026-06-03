"use client";

import { useCart } from "../context/CartContext"; // Ajuste o caminho se necessário
import { X, Trash2, ShoppingBag } from "lucide-react"; // Usando os ícones que já instalamos

export default function CartDrawer() {
  const { cart, isCartOpen, isDrawerOpen, isOpen, setIsCartOpen, setIsDrawerOpen, toggleCart, setCart } = useCart() as any;

  const shouldShow = isCartOpen || isDrawerOpen || isOpen;

  const handleClose = () => {
    if (typeof setIsCartOpen === "function") setIsCartOpen(false);
    else if (typeof setIsDrawerOpen === "function") setIsDrawerOpen(false);
    else if (typeof toggleCart === "function") toggleCart();
  };

  // Função simples para remover um item do carrinho completamente
  const handleRemoveItem = (id: string) => {
    if (setCart) {
      setCart((prev: any[]) => prev.filter((item) => item.id !== id));
    }
  };

  // Calcula o valor total da sacola dinamicamente
  const subtotal = cart?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop de fundo escuro com blur perfeito igual ao resto do app */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose} 
      />
      
      {/* Painel Lateral Dark Premium */}
      <div className="relative w-full max-w-md h-full bg-[#0a0a0a] border-l border-neutral-900 p-6 flex flex-col z-10 shadow-2xl transition-transform duration-300">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-wonder" />
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
                {/* Miniatura da Imagem (se houver) */}
                {item.image && (
                  <div className="w-16 h-16 bg-[#0e0e0e] border border-neutral-800/60 rounded-lg flex items-center justify-center p-2 shrink-0">
                    <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                  </div>
                )}
                
                {/* Informações de texto */}
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

                {/* Botão de excluir item */}
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

        {/* Rodapé: Área de Finalização (Só aparece se houver itens) */}
        {cart && cart.length > 0 && (
          <div className="border-t border-neutral-900 pt-5 space-y-4 bg-[#0a0a0a]">
            {/* Metrificação de Subtotal */}
            <div className="flex items-center justify-between font-sans">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Subtotal</span>
              <span className="text-xl font-bold font-title tracking-tight text-white">
                {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            
            <p className="text-[11px] text-neutral-500 font-sans leading-tight">
              Taxas de envio e descontos adicionais serão calculados na próxima etapa do checkout.
            </p>

            {/* Botão de Finalização Massivo e Premium */}
            <button 
              onClick={() => alert("Simulação de Checkout Iniciada! ⚡")}
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