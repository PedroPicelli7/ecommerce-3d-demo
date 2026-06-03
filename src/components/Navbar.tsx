"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext"; // Importa o contexto do carrinho
import { Menu, X, ShoppingBag } from "lucide-react"; // Ícones limpos e modernos

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // Puxa o estado dos produtos e a função para abrir a gaveta lateral do carrinho
  const { cart, setIsCartOpen, toggleCart, setIsDrawerOpen } = useCart() as any;

  // Calcula dinamicamente o número total de itens que o usuário comprou
  const totalItems = cart?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    // 1. Checa o estado da sessão ao carregar a barra de navegação
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // Busca se o usuário é admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        setIsAdmin(profile?.role === "admin");
      }
    };

    getSession();

    // 2. Escuta mudanças na autenticação (login, logout) em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 text-white z-50 px-6 lg:px-16 flex items-center justify-between">
      
      {/* LOGO (Estilo Wordmark Streetwear) */}
      <Link href="/" className="text-2xl font-black font-title tracking-tighter text-white hover:opacity-90 uppercase transition-opacity">
        PHLOX
      </Link>

      {/* LINKS DE PÁGINAS DESKTOP (Escondidos no celular: hidden md:flex) */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium font-sans text-neutral-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </div>

      {/* BOTÕES DE AÇÃO INTEGRADOS */}
      <div className="flex items-center space-x-4">
        
        {/* Painel do Administrador (Com nossa cor de destaque Wonder para casar com a marca) */}
        {isAdmin && (
          <Link 
            href="/admin" 
            className="text-[10px] bg-neutral-900 hover:border-wonder/50 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-xl font-bold font-sans uppercase tracking-widest transition-all"
          >
            ⚙ Admin
          </Link>
        )}

        {/* Ícone da Sacola do Carrinho de Compras */}
        <button 
          onClick={() => {
            if (typeof setIsCartOpen === "function") setIsCartOpen(true);
            else if (typeof setIsDrawerOpen === "function") setIsDrawerOpen(true);
            else if (typeof toggleCart === "function") toggleCart();
          }} 
          className="relative p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-wonder text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans animate-pulse">
              {totalItems}
            </span>
          )}
        </button>

        {/* Links de Login no Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-sm text-neutral-400 hover:text-white transition-colors font-medium font-sans cursor-pointer"
            >
              Sair
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors font-medium font-sans">
                Entrar
              </Link>
              <Link 
                href="/signup" 
                className="bg-white text-black text-xs font-bold px-4 py-2 rounded-xl font-sans hover:bg-neutral-200 transition-all active:scale-95"
              >
                Criar Conta
              </Link>
            </>
          )}
        </div>

        {/* BOTÃO HAMBÚRGUER (Aparece apenas no celular: flex md:hidden) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* DROPDOWN RESPONSIVO MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full bg-[#0a0a0a] border-b border-neutral-900 px-6 py-6 flex flex-col space-y-4 font-sans font-semibold text-neutral-300 shadow-2xl backdrop-blur-lg">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2 border-b border-neutral-900/40">Home</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2 border-b border-neutral-900/40">Shop</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2 border-b border-neutral-900/40">About Us</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2 border-b border-neutral-900/40">Contact Us</Link>
          
          {/* Sessão de conta adaptada dentro do menu mobile */}
          <div className="pt-2 flex items-center justify-between">
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-sm text-neutral-400 hover:text-white transition-colors font-medium cursor-pointer"
              >
                Sair da Conta
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-neutral-400 hover:text-white transition-colors font-medium">
                  Entrar
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white text-black text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}