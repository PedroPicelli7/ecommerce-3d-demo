"use client";

import React, { createContext, useContext, useState } from "react";

// Criamos o contexto do zero
const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  
  // Criamos o estado único de abertura da gaveta lateral
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Adicionar item ao carrinho
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

  // Função alternativa para alternar o estado de abrir/fechar
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        
        // Mapeamos o mesmo estado e funções para todas as variações que criamos nos outros arquivos
        isCartOpen,
        isDrawerOpen: isCartOpen, 
        isOpen: isCartOpen,
        
        setIsCartOpen,
        setIsDrawerOpen: setIsCartOpen,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook customizado seguro
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}