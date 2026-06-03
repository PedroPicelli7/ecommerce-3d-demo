import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Seção Principal (Hero) */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-4 max-w-xl">
          <span className="text-sm font-semibold tracking-widest uppercase text-gray-400">Beats Solo</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-slate-950">
            Wireless
          </h1>
          <p className="text-gray-500 text-lg">
            Experimente um som imersivo de alta fidelidade com o design minimalista que você procura.
          </p>
          <button className="bg-red-500 text-white font-medium px-8 py-3 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20">
            Shop By Category
          </button>
        </div>

        {/* Container para o Modelo 3D Interativo */}
        <div className="w-full md:w-1/2 h-[450px] bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-slate-400">⚡ O fone 3D interativo será renderizado aqui</p>
            <p className="text-xs text-slate-300">Carregando canvas WebGL...</p>
          </div>
        </div>
      </section>

      {/* Grid de Categorias (Inspirado na imagem download.jpg) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Bloco 1: Earphone */}
          <div className="bg-zinc-950 text-white p-8 rounded-3xl h-64 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase">Enjoy</span>
              <h3 className="text-2xl font-bold mt-1">With Earphone</h3>
            </div>
            <button className="bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-full w-max hover:bg-red-600 transition">
              Browse
            </button>
          </div>

          {/* Bloco 2: Gadget */}
          <div className="bg-amber-400 text-slate-950 p-8 rounded-3xl h-64 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-semibold text-amber-900/60 uppercase">New</span>
              <h3 className="text-2xl font-bold mt-1">Wear Gadget</h3>
            </div>
            <button className="bg-white text-amber-600 text-xs font-bold px-5 py-2.5 rounded-full w-max hover:bg-slate-50 transition shadow-md">
              Browse
            </button>
          </div>

          {/* Bloco 3: Laptop (Ocupa 2 colunas no grid) */}
          <div className="bg-red-500 text-white p-8 rounded-3xl h-64 md:col-span-2 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-semibold text-red-200 uppercase">Trend</span>
              <h3 className="text-2xl font-bold mt-1">Devices Laptop</h3>
            </div>
            <button className="bg-white text-red-500 text-xs font-bold px-5 py-2.5 rounded-full w-max hover:bg-slate-50 transition shadow-md">
              Browse
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}