"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// 1. Criamos um subcomponente interno apenas para lidar com as mensagens da URL
function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) setMessage(msg);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    setLoading(false);

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/shop");
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
        Acessar Conta
      </h1>
      <p className="text-neutral-400 text-sm mb-6">
        Entre com suas credenciais para gerenciar a plataforma.
      </p>

      {message && (
        <div className="bg-green-950/40 border border-green-800 text-green-400 p-3 rounded-xl text-sm mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-xl text-sm mb-4">
          {error}
          </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
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
          className="w-full bg-white text-black font-bold py-3 rounded-xl text-sm hover:bg-neutral-200 transition-colors active:scale-95 disabled:opacity-50"
        >
          {loading ? "Autenticando..." : "Entrar"}
        </button>
      </form>

      <p className="text-neutral-500 text-xs text-center mt-6">
        Não tem uma conta?{" "}
        <Link href="/signup" className="text-white hover:underline">
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  );
}

// 2. O componente principal apenas embrulha o conteúdo em um Suspense Boundary exigido pelo build da Vercel
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 pt-24">
      <Suspense fallback={
        <div className="text-neutral-400 text-sm animate-pulse">Carregando formulário...</div>
      }>
        <LoginFormContent />
      </Suspense>
    </main>
  );
}