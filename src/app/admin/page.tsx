"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  Settings, 
  Trash2, 
  TrendingUp,
  Menu,
  X
} from "lucide-react";

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

  // 🎛️ Controle do Menu Lateral (Drawer)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");

  // Estados do Catálogo
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 📊 Estados do Analytics
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("name", { ascending: true });
    if (data) setProducts(data);
  };

  const fetchAnalytics = async () => {
    const { data } = await supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnalyticsEvents(data);
  };

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
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
      await fetchAnalytics();
      setLoading(false);
    };

    checkAdminAndFetchData();

    const channel = supabase
      .channel("realtime-admin-drawer-analytics")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "analytics_events" }, () => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      setMessage("Produto cadastrado com sucesso!");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  const totalViews = analyticsEvents.filter(e => e.event_type === "page_view").length;
  const totalClicks = analyticsEvents.filter(e => e.event_type === "click_buy").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-sans">
        <p className="text-sm uppercase tracking-widest animate-pulse">Sincronizando ambiente do painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 relative">
      
      {/* 🔘 BOTÃO FLUTUANTE PARA EXIBIR/OCULTAR O MENU */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-24 left-6 z-40 bg-neutral-900 border border-neutral-800 p-3 rounded-xl hover:bg-neutral-800 text-white shadow-xl cursor-pointer transition-all active:scale-95 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-sans"
      >
        <Menu size={16} className="text-wonder" />
        <span>Painel de Módulos</span>
      </button>

      {/* 📱 MENU LATERAL RETRÁTIL (DRAWER) ESTILO CARRINHO */}
      <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        
        {/* Backdrop de fundo escuro com Blur idêntico ao carrinho */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
        
        {/* Painel que desliza da esquerda para a direita */}
        <aside className={`relative w-64 h-full bg-neutral-950 border-r border-neutral-900 flex flex-col p-5 shadow-2xl transition-transform duration-300 ease-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          {/* Cabeçalho do Menu */}
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-4">
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold font-sans tracking-widest text-neutral-500">Operador Root</p>
              <h4 className="text-xs font-bold font-title text-white uppercase tracking-tight">PHLOX Admin</h4>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-neutral-900"
            >
              <X size={18} />
            </button>
          </div>

          {/* Abas Navegáveis */}
          <nav className="flex-1 space-y-1.5 font-sans text-xs font-semibold uppercase tracking-wider">
            <button 
              onClick={() => { setActiveTab("analytics"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${activeTab === "analytics" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"}`}
            >
              <LayoutDashboard size={16} /> Live Analytics
            </button>

            <button 
              onClick={() => { setActiveTab("catalog"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${activeTab === "catalog" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"}`}
            >
              <Package size={16} /> Catálogo
            </button>

            <button 
              onClick={() => { setActiveTab("shipping"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${activeTab === "shipping" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"}`}
            >
              <Truck size={16} /> Envios & Logística
            </button>

            <button 
              onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${activeTab === "users" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"}`}
            >
              <Users size={16} /> Clientes
            </button>
          </nav>

          {/* Rodapé da Sidebar */}
          <div className="border-t border-neutral-900 pt-4">
            <button 
              onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer text-xs font-semibold uppercase tracking-wider ${activeTab === "settings" ? "bg-neutral-900 text-white border border-neutral-800" : "text-neutral-500 hover:text-white"}`}
            >
              <Settings size={16} /> Configurações
            </button>
          </div>
        </aside>
      </div>

      {/* 🖥️ ÁREA DE CONTEÚDO PRINCIPAL (Ocupa 100% da largura, com um pt/pl ajustado por causa do botão flutuante) */}
      <div className="p-8 lg:p-12 pt-16 max-w-7xl mx-auto overflow-x-hidden">
        
        {/* ================= ABA 1: LIVE ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-8 mt-6">
            <div className="border-b border-neutral-900 pb-5">
              <h2 className="text-3xl font-black font-title tracking-tight uppercase">Métricas em Tempo Real</h2>
              <p className="text-neutral-400 text-sm font-sans">Estatísticas de navegação de usuários e conversão instantânea.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider font-sans">Visualizações (Views)</span>
                <p className="text-4xl font-black font-title text-white">{totalViews}</p>
              </div>
              <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-1 border-l-2 border-l-wonder">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider font-sans">Intenções de Compra</span>
                <p className="text-4xl font-black font-title text-wonder">{totalClicks}</p>
              </div>
            </div>

            <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold font-title uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={16} className="text-wonder" /> Monitor de Tráfego Recente
              </h3>
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto font-sans text-xs">
                {analyticsEvents.length === 0 ? (
                  <p className="text-neutral-500 py-4">Nenhum evento detectado.</p>
                ) : (
                  analyticsEvents.map((event) => (
                    <div key={event.id} className="flex justify-between items-center bg-neutral-950/60 border border-neutral-900 px-4 py-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider ${event.event_type === 'click_buy' ? 'bg-orange-950 text-wonder border border-orange-900' : 'bg-neutral-900 text-neutral-400'}`}>
                          {event.event_type === 'click_buy' ? 'venda' : 'visita'}
                        </span>
                        <p className="text-neutral-300">
                          {event.event_type === "click_buy" ? `Clicou em comprar: ${event.product_name}` : `Acessou a rota: ${event.page_url}`}
                        </p>
                      </div>
                      <span className="text-neutral-600 text-[10px]">{new Date(event.created_at).toLocaleTimeString("pt-BR")}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: GERENCIAMENTO DE ESTOQUE ================= */}
        {activeTab === "catalog" && (
          <div className="space-y-8 mt-6">
            <div className="border-b border-neutral-900 pb-5">
              <h2 className="text-3xl font-black font-title tracking-tight uppercase">Gerenciamento do Catálogo</h2>
              <p className="text-neutral-400 text-sm font-sans">Adicione novos fones ou remova os modelos antigos do inventário da loja.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl h-fit space-y-4">
                <h3 className="text-md font-bold font-title uppercase tracking-tight text-white">Novo Modelo</h3>
                
                {message && (
                  <div className={`p-3 rounded-xl text-sm font-medium ${message.includes("❌") ? "bg-red-900/30 text-red-400 border border-red-800" : "bg-green-950/40 text-green-400 border border-green-800"}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleCreateProduct} className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-400 uppercase tracking-wider mb-1">Nome do Fone</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-700 text-white" placeholder="Ex: Beats Studio Pro" />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-400 uppercase tracking-wider mb-1">Preço (R$)</label>
                    <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-700 text-white" placeholder="1299.00" />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-400 uppercase tracking-wider mb-1">URL da Imagem</label>
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-700 text-white" placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-400 uppercase tracking-wider mb-1">Descrição</label>
                    <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-700 text-white resize-none" placeholder="ANC, bateria..."></textarea>
                  </div>
                  <button type="submit" disabled={formLoading} className="w-full bg-white text-black font-bold py-3 rounded-xl uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer">
                    {formLoading ? "Salvando..." : "Injetar no Banco"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-neutral-900/20 border border-neutral-900 p-6 rounded-2xl space-y-4">
                <h3 className="text-md font-bold font-title uppercase tracking-tight text-white">Itens Ativos</h3>
                <div className="space-y-3">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between bg-neutral-950/60 p-4 rounded-xl border border-neutral-900">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-neutral-900 rounded-lg p-2 flex items-center justify-center border border-neutral-800">
                          <img src={product.image_url || "/images/beats-main.png"} alt={product.name} className="object-contain max-h-full" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm font-title uppercase tracking-tight text-neutral-100">{product.name}</h4>
                          <p className="text-neutral-500 text-xs font-semibold font-sans">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-[10px] font-bold text-red-500 bg-red-950/10 hover:bg-red-950/40 border border-red-900/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer uppercase tracking-wider">
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 3: ENVIOS & LOGÍSTICA ================= */}
        {activeTab === "shipping" && (
          <div className="space-y-8 mt-6">
            <div className="border-b border-neutral-900 pb-5">
              <h2 className="text-3xl font-black font-title tracking-tight uppercase">Envios & Rastreamento</h2>
              <p className="text-neutral-400 text-sm font-sans">Integração de frete, postagem e controle de entregas dos fones.</p>
            </div>
            <div className="bg-neutral-900/30 border border-dashed border-neutral-800 rounded-2xl p-12 text-center text-neutral-500 font-sans text-sm">
              <Truck size={36} className="mx-auto mb-3 text-neutral-700" />
              <p className="font-semibold text-neutral-400 mb-1">Módulo de Logística em Espera</p>
              <p className="text-xs text-neutral-600">Pronto para receber integrações com gateways de envio (Melhor Envio / Correios API).</p>
            </div>
          </div>
        )}

        {/* ================= ABA 4: CONFIGURAÇÕES ================= */}
        {(activeTab === "users" || activeTab === "settings") && (
          <div className="space-y-8 mt-6">
            <div className="border-b border-neutral-900 pb-5">
              <h2 className="text-3xl font-black font-title tracking-tight uppercase">Configurações do Nó</h2>
              <p className="text-neutral-400 text-sm font-sans">Aba administrativa para permissões, webhooks de pagamento e chaves de produção.</p>
            </div>
            <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-6 font-mono text-xs text-neutral-500 space-y-1">
              <p className="text-neutral-400 font-bold font-sans uppercase mb-2">// Status do Ambiente</p>
              <p>ENV_STATUS: PRODUCTION</p>
              <p>DATABASE_LINKED: SUPABASE_POSTGRES</p>
              <p>REALTIME_WEBSOCKET: CONNECTED</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}