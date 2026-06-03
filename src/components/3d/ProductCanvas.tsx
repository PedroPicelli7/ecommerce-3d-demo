"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Componente interno com rotação forçada para desvirar o fone
function Model() {
  const { scene } = useGLTF("/models/headphone.glb");
  
  return (
    <primitive 
      object={scene} 
      // 1. Deixamos um tamanho controlado manualmente
      scale={1.3} 
      
      // 2. Centraliza o fone no meio do espaço branco
      position={[0, 0, 0]} 
      
      // 3. O PULO DO GATO: Rotacionamos 180 graus no eixo X (3.14 radianos) para desvirar ele de ponta-cabeça
      rotation={[3.14, 0, 0]} 
    />
  );
}

export default function ProductCanvas() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        {/* Iluminação manual de estúdio para o fone brilhar */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, 5, -5]} intensity={1} />
        <pointLight position={[0, -3, 2]} intensity={0.5} />

        <Suspense fallback={null}>
          <Model />
        </Suspense>

        {/* Controles do mouse com rotação automática bem suave */}
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/headphone.glb");