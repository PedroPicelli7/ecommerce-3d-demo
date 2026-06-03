"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
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
            className="w-full bg-white text-black font-bold py-3 rounded-xl text-sm hover:bg-neutral-200 transition-colors active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "Criando conta..." : "Registrar"}
          </button>
        </form>

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