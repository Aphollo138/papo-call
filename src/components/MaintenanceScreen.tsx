import React, { useEffect, Suspense, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Cat } from 'lucide-react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { OBJLoader } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';

class SimpleErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function Cat3DModel() {
  const materials = useLoader(MTLLoader, '/gatinho.mtl');
  const obj = useLoader(OBJLoader, '/gatinho.obj', (loader: any) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  
  // O scale de 0.05 é para evitar que um modelo original venha enorme.
  // Você pode alterar esse valor de scale conforme necessário.
  // Rotação para a direita (Y: Math.PI / 2 = 90 graus)
  return <primitive object={obj} scale={0.05} rotation={[0, Math.PI / 2, 0]} />;
}

export default function MaintenanceScreen() {
  // Option: small protection against F12, even though data won't leak
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) e.preventDefault();
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) e.preventDefault();
    };
    
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center overflow-hidden selection:bg-purple-500/30">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Tech grid/server feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="flex flex-col items-center"
        >
          <span className="text-xl md:text-2xl font-medium text-zinc-400 tracking-widest uppercase mb-2">Servidor em</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-6">
            MANUTENÇÃO
          </h1>
          <div className="flex items-center gap-3 text-lg md:text-xl text-zinc-300 bg-zinc-900/50 border border-white/5 px-6 py-4 rounded-2xl backdrop-blur-md">
            <span>Estamos trabalhando para melhorar sua experiência. Voltamos em breve!</span>
            <Heart className="w-5 h-5 text-purple-400 animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          </div>
        </motion.div>
      </div>

      {/* Running Cat Area */}
      <div className="absolute bottom-10 right-0 w-full overflow-hidden h-48 pointer-events-none">
        
        {/* Cat Container pointing right always */}
        <motion.div 
          className="absolute bottom-4 left-0 w-40 h-32 md:w-56 md:h-48 flex items-center justify-center drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]"
          initial={{ x: "-20vw" }}
          animate={{ x: "120vw" }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Dust traces */}
          <motion.div 
            className="absolute -left-12 bottom-4 w-12 h-6 flex gap-1 items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-2 h-2 bg-white/20 rounded-full mb-1"></div>
            <div className="w-3 h-3 bg-white/20 rounded-full mb-2"></div>
            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full mb-3"></div>
          </motion.div>
           
          {/* Speed lines */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <div className="w-12 h-0.5 bg-purple-500/40 rounded-full"></div>
            <div className="w-8 h-0.5 bg-purple-500/40 rounded-full ml-4"></div>
            <div className="w-10 h-0.5 bg-purple-500/40 rounded-full ml-2"></div>
          </div>

          {/* Running Cat Emoji with bounce/run animation */}
          <motion.div 
            className="transform rotate-12 flex items-center justify-center"
            animate={{ 
              y: [0, -15, 0],
              rotate: [12, 18, 12]
            }}
            transition={{
              duration: 0.25,
              repeat: Infinity,
            }}
          >
            <SimpleErrorBoundary fallback={<Cat className="text-[#74c0fc] w-20 h-20" />}>
              <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px]">
                <Canvas camera={{ position: [0, 2, 5], fov: 45 }} gl={{ alpha: true }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6} adjustCamera preset="rembrandt">
                      <Cat3DModel />
                    </Stage>
                  </Suspense>
                  <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                </Canvas>
              </div>
            </SimpleErrorBoundary>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
}
