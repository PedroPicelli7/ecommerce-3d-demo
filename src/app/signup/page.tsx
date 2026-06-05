"use client";

import { useState } from "react";
// 🌟 CAMINHO DA IMPORTAÇÃO CONSOLIDADO PELA ÁRVORE DE DIRETÓRIOS
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Cadastra o usuário no Supabase Auth passando os metadados (nome)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Cadastro feito com sucesso! Redireciona para o login
      router.push("/login?message=Verifique seu e-mail para confirmar o cadastro.");
    }
  };

  // 🌐 DISPARADOR DE AUTENTICAÇÃO COM O PROVEDOR DO GOOGLE
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao registrar com o Google:", err);
      setError("Falha na comunicação com o Google. Tente novamente.");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Criar Conta
        </h1>
        <p className="text-neutral-400 text-sm mb-6">
          Cadastre-se para gerenciar seus pedidos e explorar o catálogo.
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 text-white"
              placeholder="Pedro Gonçalves"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 text-white"
              placeholder="seu-email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-xl text-sm hover:bg-neutral-200 transition-colors active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            {loading ? "Criando conta..." : "Registrar"}
          </button>
        </form>

        {/* 🔘 DIVISOR VISUAL */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="flex-shrink mx-4 text-neutral-500 text-[10px] uppercase tracking-widest font-bold">ou</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        {/* 🚀 BOTÃO PREMIUM DO GOOGLE PARA REGISTRO */}
        <button 
          onClick={handleGoogleSignUp}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-neutral-950 border border-neutral-800 text-white font-semibold py-3 rounded-xl text-sm hover:bg-neutral-900 transition-all cursor-pointer active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.17-4.53z"
            />
          </svg>
          <span>Registrar com o Google</span>
        </button>

        <p className="text-neutral-500 text-xs text-center mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-white hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}