import { supabase } from "../../lib/supabase";
import ProductCard from "../../components/ui/ProductCard"; // Vamos criar esse componente a seguir

// Força o Next.js a buscar dados novos do banco a cada requisição (sem cache estático antigo)
export const revalidate = 0;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category?: string;
}

export default async function ShopPage() {
  // Busca todos os produtos do Supabase ordenados pelo nome
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Erro ao carregar produtos:", error);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col mb-12 border-b border-neutral-800 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Nosso Catálogo
        </h1>
        <p className="text-neutral-400">
          Explore nossos produtos premium com tecnologia de ponta e designs exclusivos.
        </p>
      </div>

      {/* Grid de Produtos */}
      {!products || products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
          <p className="text-xl font-medium mb-2">Nenhum produto encontrado</p>
          <p className="text-sm">Cadastre novos itens na tabela 'products' do seu Supabase.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}