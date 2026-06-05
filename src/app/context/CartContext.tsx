"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// 🌟 Importação da sua instância do Supabase para buscar os cupons
import { supabase } from "../lib/supabase"; 

// Interface simples para o cupom ativo
interface AppliedCoupon {
  code: string;
  discountPercentage: number;
}

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 🎟️ Estado para armazenar o cupom ativo no carrinho
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // 1. Carrega os dados do localStorage apenas quando o componente monta no navegador
  useEffect(() => {
    const savedCart = localStorage.getItem("phlox_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erro ao ler o carrinho do localStorage", e);
      }
    }
  }, []);

  // 2. Salva no localStorage automaticamente toda vez que o estado do 'cart' mudar
  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem("phlox_cart")) {
      localStorage.setItem("phlox_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // 🛠️ Função para validar e aplicar o cupom direto do Supabase
  const applyCouponCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('code, discount_percentage')
        .eq('code', code.trim().toUpperCase()) // Remove espaços e força Letras Maiúsculas
        .single();

      if (error || !data) {
        return { success: false, message: "Cupom inválido ou expirado." };
      }

      setAppliedCoupon({
        code: data.code,
        discountPercentage: data.discount_percentage
      });

      return { success: true, message: `Cupom ${data.code} aplicado!` };
    } catch (err) {
      console.error("Erro ao aplicar cupom:", err);
      return { success: false, message: "Erro ao processar cupom." };
    }
  };

  // 🗑️ Função para remover o cupom caso o cliente desista
  const removeCoupon = () => setAppliedCoupon(null);

  // 🧮 Operações matemáticas do carrinho (Automáticas e Reativas)
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const discountAmount = appliedCoupon 
    ? (subtotal * appliedCoupon.discountPercentage) / 100 
    : 0;
    
  const totalWithDiscount = subtotal - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        isCartOpen,
        isDrawerOpen: isCartOpen, 
        isOpen: isCartOpen,
        setIsCartOpen,
        setIsDrawerOpen: setIsCartOpen,
        toggleCart,
        // 🎟️ Novas propriedades expostas globalmente:
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        subtotal,
        discountAmount,
        totalWithDiscount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}