"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de envio rápida
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center relative overflow-hidden px-6 lg:px-16 pt-32 pb-16">
      
      {/* Glows de Fundo da Identidade PHLOX */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-purple-900/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] bg-wonder/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto w-full z-10 relative">
        
        {/* Grid Principal: Quebra em 1 coluna no celular e divide em 2 no desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Lado Esquerdo: Textos e Informações de Canais */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-wonder rounded-full"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
                Suporte & Conexão
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black font-title tracking-tight leading-none uppercase">
              ENTRE EM <br />
              <span className="bg-gradient-to-r from-wonder to-orange-500 bg-clip-text text-transparent">
                CONTATO
              </span>
            </h1>

            <p className="text-neutral-400 text-base font-sans leading-relaxed max-w-md mx-auto lg:mx-0">
              Tem alguma dúvida sobre os fones modulares, prazos de entrega ou quer enviar uma proposta comercial? Nossa equipe está pronta para responder.
            </p>

            {/* Lista de informações institucionais simuladas */}
            <div className="pt-6 space-y-4 text-sm font-sans text-neutral-400">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2">
                <span className="text-white font-bold font-title text-xs uppercase tracking-wider text-wonder">E-mail //</span>
                <span>suporte@phloxaudio.com</span>
              </div>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2">
                <span className="text-white font-bold font-title text-xs uppercase tracking-wider text-wonder">HQ Ops //</span>
                <span>Americana, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Formulário Dark Premium */}
          <div className="lg:col-span-7 w-full bg-neutral-900/60 border border-neutral-800/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
            
            {success ? (
              <div className="h-[350px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 bg-green-950/40 border border-green-800 text-green-400 rounded-full flex items-center justify-center text-xl">✓</div>
                <h3 className="text-xl font-bold font-title uppercase tracking-tight">Mensagem Enviada!</h3>
                <p className="text-neutral-400 text-sm max-w-xs font-sans">Sua transmissão foi recebida com sucesso. Responderemos em até 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold font-sans mb-1.5">Seu Nome</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 transition text-white font-sans"
                      placeholder="Pedro"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold font-sans mb-1.5">Seu E-mail</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 transition text-white font-sans"
                      placeholder="seuemail@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold font-sans mb-1.5">Assunto</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 transition text-white font-sans"
                    placeholder="Dúvida sobre o modelo 3D / Comercial"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold font-sans mb-1.5">Mensagem</label>
                  <textarea 
                    rows={5}
                    required 
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 transition text-white font-sans resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold font-sans text-sm py-4 rounded-xl hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {loading ? "Transmitindo dados..." : "Enviar Mensagem ⚡"}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}