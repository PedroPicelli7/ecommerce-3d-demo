"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

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
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 text-white z-50 px-6 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="text-2xl font-black tracking-wider text-white hover:opacity-90">
        PHLOX
      </Link>

      {/* Links de Páginas */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </div>

      {/* Botões de Ação / Autenticação */}
      <div className="flex items-center space-x-4">
        {isAdmin && (
          <Link 
            href="/admin" 
            className="text-xs bg-red-950/50 hover:bg-red-900/50 border border-red-800 text-red-400 px-3 py-1.5 rounded-xl font-bold tracking-wide transition-all"
          >
            ⚙ Painel Admin
          </Link>
        )}

        {user ? (
          <button
            onClick={handleSignOut}
            className="text-sm text-neutral-400 hover:text-white transition-colors font-medium"
          >
            Sair
          </button>
        ) : (
          <>
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors font-medium">
              Entrar
            </Link>
            <Link 
              href="/signup" 
              className="bg-white text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-200 transition-all active:scale-95"
            >
              Criar Conta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}