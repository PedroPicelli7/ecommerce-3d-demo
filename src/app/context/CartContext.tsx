"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicializa o carrinho vazio de forma segura
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    // Evita resetar o localStorage se o app ainda estiver carregando o estado inicial
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
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}