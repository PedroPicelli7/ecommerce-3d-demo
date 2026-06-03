"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center relative overflow-hidden px-6 lg:px-16 pt-32 pb-16">
      
      {/* Glows de Fundo (Sincronizados com a Identidade da Home) */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-900/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-wonder/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto w-full z-10 relative space-y-20">
        
        {/* Seção 1: O Manifesto (Cabeçalho de Impacto) */}
        <section className="text-center md:text-left max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-wonder rounded-full"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
              Nossa Essência
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-title tracking-tight leading-none uppercase">
            MÚSICA EM <br />
            <span className="bg-gradient-to-r from-wonder to-orange-500 bg-clip-text text-transparent">
              ALTA DEFINIÇÃO
            </span>
          </h1>
          
          <p className="text-neutral-400 text-lg font-sans leading-relaxed">
            A PHLOX nasceu da inconformidade com o mercado de áudio tradicional. Unimos a engenharia acústica de nível de estúdio com a estética forte e pulsante do streetwear, criando dispositivos modulares feitos para quem vive a tecnologia e a cultura urbana intensamente.
          </p>
        </section>

        {/* Seção 2: Pilares da Marca (Grid Responsivo: 1 col no mobile, 3 col no desktop) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-neutral-900 border border-neutral-800/60 p-8 rounded-2xl space-y-4 hover:border-wonder/30 transition-all duration-300">
            <div className="text-3xl text-wonder font-title">01 /</div>
            <h3 className="text-xl font-bold font-title uppercase tracking-tight">Engenharia Pura</h3>
            <p className="text-neutral-400 text-sm font-sans leading-relaxed">
              Cada componente dos nossos fones é projetado para entregar uma resposta de frequência plana e cancelamento de ruído cirúrgico. Sem distorções, apenas som puro.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800/60 p-8 rounded-2xl space-y-4 hover:border-purple-500/30 transition-all duration-300">
            <div className="text-3xl text-purple-500 font-title">02 /</div>
            <h3 className="text-xl font-bold font-title uppercase tracking-tight">Cultura Urbana</h3>
            <p className="text-neutral-400 text-sm font-sans leading-relaxed">
              Não fazemos apenas hardware; fazemos parte do seu estilo visual. Nossas linhas geométricas pesadas são inspiradas no design futurista e nas tendências globais de streetwear.
            </p>
          </div>

          <div className="bg-gradient-to-br from-wonder/10 to-neutral-900 border border-wonder/20 p-8 rounded-2xl space-y-4">
            <div className="text-3xl text-orange-400 font-title">03 /</div>
            <h3 className="text-xl font-bold font-title uppercase tracking-tight">Modularidade</h3>
            <p className="text-neutral-400 text-sm font-sans leading-relaxed">
              Acreditamos em produtos sustentáveis e duradouros. Nossos fones possuem almofadas, cabos e arco totalmente substituíveis e customizáveis pelo usuário.
            </p>
          </div>

        </section>

        {/* Seção 3: Call to Action de Fechamento */}
        <section className="bg-neutral-900/50 border border-neutral-800/60 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-wonder/5 blur-3xl rounded-full pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-4xl font-black font-title uppercase tracking-tight">
            Pronto para o Próximo Nível?
          </h2>
          <p className="text-neutral-400 font-sans max-w-xl mx-auto text-sm sm:text-base">
            Experimente a imersão do áudio espacial 3D em nosso catálogo e descubra a verdadeira potência sonora da PHLOX.
          </p>
          <div className="pt-2">
            <Link 
              href="/shop" 
              className="inline-block bg-white text-black font-bold font-sans text-sm px-8 py-4 rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-md"
            >
              Ver Modelos Disponíveis ⚡
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}