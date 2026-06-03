"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  // Estados do Formulário de Cadastro
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("name", { ascending: true });
    if (data) setProducts(data);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?message=Faça login para acessar esta área.");
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

      if (profile?.role !== "admin") {
        router.push("/shop");
        return;
      }

      await fetchProducts();
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);

    const { error } = await supabase.from("products").insert([
      {
        name,
        description,
        price: parseFloat(price),
        image_url: imageUrl || null
      }
    ]);

    setFormLoading(false);

    if (error) {
      setMessage(`❌ Erro: ${error.message}`);
    } else {
      setMessage("Product cadastrado com sucesso!");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      fetchProducts(); // Atualiza a tabela abaixo
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Autenticando administrador...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Painel do Gerenciador Geral
          </h1>
          <p className="text-neutral-400 text-sm">Controle de estoque, preços e inclusão de fones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Formulário de Cadastro */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-bold mb-4 text-white">Cadastrar Novo Produto</h2>
          
          {message && (
            <div className={`p-3 rounded-xl text-sm mb-4 font-medium ${message.includes("❌") ? "bg-red-900/30 text-red-400 border border-red-800" : "bg-green-950/40 text-green-400 border border-green-800"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Nome do Fone</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-600 text-white" placeholder="Ex: Beats Studio Pro" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Preço (R$)</label>
              <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-600 text-white" placeholder="1299.00" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">URL da Imagem</label>
              <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-600 text-white" placeholder="https://images.unsplash.com/..." />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Descrição</label>
              <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-600 text-white resize-none" placeholder="Especificações de áudio, ANC, bateria..."></textarea>
            </div>

            <button type="submit" disabled={formLoading} className="w-full bg-white text-black font-bold py-3 rounded-xl text-sm hover:bg-neutral-200 transition-colors disabled:opacity-50">
              {formLoading ? "Salvando..." : "Adicionar ao Catálogo"}
            </button>
          </form>
        </div>

        {/* Listagem / Tabela de Modificação */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-white">Produtos no Catálogo Atual</h2>
          
          {products.length === 0 ? (
            <p className="text-neutral-500 text-sm">Nenhum fone cadastrado no banco de dados.</p>
          ) : (
            <div className="overflow-x-auto space-y-3">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between bg-neutral-950 p-4 rounded-xl border border-neutral-800/60">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-lg overflow-hidden p-2 flex items-center justify-center border border-neutral-800">
                      <img src={product.image_url || "/images/beats-main.png"} alt="" className="object-contain max-h-full" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-100">{product.name}</h3>
                      <p className="text-neutral-400 text-xs font-semibold">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-xs font-bold text-red-500 bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 px-3 py-1.5 rounded-lg transition-colors">
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}