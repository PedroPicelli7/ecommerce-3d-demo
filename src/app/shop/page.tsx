import { supabase } from "../lib/supabase";
import ProductCard from "../ui/ProductCard";

// Força o Next.js a buscar dados novos do banco a cada requisição
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
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-16 px-6 lg:px-16 relative overflow-hidden">
      
      {/* Glow de fundo sutil para manter o ambiente premium */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-900/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Cabeçalho da Página (Alinhado com a Identidade PHLOX) */}
        <div className="flex flex-col mb-12 border-b border-neutral-800/60 pb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full w-max">
            <span className="w-1.5 h-1.5 bg-wonder rounded-full"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
              Coleção Completa
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black font-title tracking-tight leading-none text-white uppercase">
            NOSSO <br />
            <span className="bg-gradient-to-r from-wonder to-orange-500 bg-clip-text text-transparent">
              CATÁLOGO
            </span>
          </h1>
          
          <p className="text-neutral-400 font-sans text-base max-w-xl">
            Explore nossos produtos premium com tecnologia de ponta, engenharia acústica pura e designs exclusivos.
          </p>
        </div>

        {/* Grid de Produtos Responsivo */}
        {!products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500 font-sans">
            <p className="text-xl font-medium mb-2">Nenhum produto encontrado</p>
            <p className="text-sm">Cadastre novos itens na tabela 'products' do seu Supabase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
      </div>
    </main>
  );
}