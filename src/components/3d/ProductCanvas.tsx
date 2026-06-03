"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// Componente interno ajustado para alinhar o fone corretamente
function Model() {
  const { scene } = useGLTF("/models/headphone.glb");
  
  return (
    <primitive 
      object={scene} 
      // 1. Reduzimos um pouco para ele não ficar gigante (mude de 1.5 para 0.8 ou ajuste conforme necessário)
      scale={0.8} 
      
      // 2. Afastamos ele um pouco para cima do chão para a sombra fazer sentido
      position={[0, 0.2, 0]} 
      
      // 3. Aqui está o segredo: rotacionamos no eixo X (primeiro valor) para desvirar ele de ponta-cabeça
      // Valores em radianos: Math.PI seria 180 graus. Vamos testar virar ele.
      rotation={[0, -0.5, 0]} 
    />
  );
}

export default function ProductCanvas() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]} // Melhora a nitidez em telas Retina
      >
        {/* Luz ambiente suave */}
        <ambientLight intensity={0.7} />
        {/* Luz direcional para dar sombras e reflexos realistas */}
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        <Suspense fallback={null}>
          {/* 
            CORREÇÃO AQUI: Mudamos 'contactShadows={{...}}' para 'shadows="contact"'. 
            Isso ativa as sombras suaves do Stage sem quebrar a tipagem do TypeScript.
          */}
          <Stage environment="city" intensity={0.6} shadows="contact">
            <Model />
          </Stage>
        </Suspense>

        {/* Permite o usuário girar o modelo com o mouse, mas trava o zoom para não quebrar o layout */}
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          makeDefault 
        />
      </Canvas>
    </div>
  );
}

// Pré-carrega o modelo para evitar delays quando a página abrir
useGLTF.preload("/models/headphone.glb");