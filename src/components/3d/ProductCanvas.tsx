"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// Componente interno original
function Model() {
  const { scene } = useGLTF("/models/headphone.glb");
  
  // Voltamos para o original! Ajuste apenas a escala se achar que ele ficou gigante
  return <primitive object={scene} scale={1.05} />;
}

export default function ProductCanvas() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]} 
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        <Suspense fallback={null}>
          {/* Usando o shadows="contact" que corrigiu o erro do TypeScript */}
          <Stage environment="city" intensity={0.6} shadows="contact">
            <Model />
          </Stage>
        </Suspense>

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

useGLTF.preload("/models/headphone.glb");