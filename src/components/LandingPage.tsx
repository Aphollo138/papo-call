import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Gamepad2, Headphones, MessagesSquare, Star, Rocket, Music, UserPlus } from 'lucide-react';
import PublicHeader from './blog/PublicHeader';

export default function LandingPage({ onNavigate }: { onNavigate: (state: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col bg-[#111214]">
      <PublicHeader onNavigate={onNavigate} activePath="home" />

      <section className="relative pt-40 md:pt-56 pb-32 md:pb-64 px-6 overflow-hidden bg-[#0d0e11] flex-shrink-0">
        
        {/* Panela - Background Desfocada */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="absolute top-[20%] right-[5%] w-[80vw] max-w-[900px] h-[80vw] max-h-[900px] blur-[80px] md:blur-[120px] opacity-30 md:opacity-40 bg-center bg-no-repeat bg-contain mix-blend-screen" style={{ backgroundImage: "url('https://i.postimg.cc/nMCPFGGM/image.png')" }}></div>
            <div className="absolute bottom-[20%] left-[5%] w-[60vw] max-w-[700px] h-[60vw] max-h-[700px] blur-[60px] md:blur-[100px] opacity-20 md:opacity-30 bg-center bg-no-repeat bg-contain mix-blend-screen transform -rotate-12" style={{ backgroundImage: "url('https://i.postimg.cc/nMCPFGGM/image.png')" }}></div>
            <div className="absolute top-[10%] left-[20%] w-[40vw] max-w-[400px] h-[40vw] max-h-[400px] blur-[80px] opacity-20 bg-center bg-no-repeat bg-contain mix-blend-screen transform rotate-45" style={{ backgroundImage: "url('https://i.postimg.cc/nMCPFGGM/image.png')" }}></div>
        </div>

        {/* Discord-like Wave at the bottom */}
        <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-[100px] md:h-[200px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
             <path fill="#111214" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[25%] left-[5%] text-white/5 animate-float"><Cloud className="w-20 h-20 md:w-32 md:h-32" /></div>
          <div className="absolute top-[55%] right-[8%] text-white/5 animate-float-delayed"><Gamepad2 className="w-20 h-20 md:w-28 md:h-28" /></div>
          <div className="absolute bottom-[25%] md:bottom-[35%] left-[10%] text-white/5 animate-float-slow -rotate-12"><Headphones className="w-24 h-24 md:w-36 md:h-36" /></div>
          <div className="absolute top-[30%] right-[22%] text-white/5 animate-float"><MessagesSquare className="w-16 h-16 md:w-24 md:h-24" /></div>
          <div className="absolute bottom-[20%] md:bottom-[40%] right-[15%] text-yellow-300/10 animate-float-delayed"><Star className="w-12 h-12 md:w-20 md:h-20" /></div>
          <div className="absolute top-[15%] left-[25%] text-white/5 animate-float-slow"><Rocket className="w-20 h-20 md:w-24 md:h-24" /></div>
          <div className="absolute bottom-[15%] md:bottom-[30%] left-[30%] text-white/5 animate-float"><Music className="w-10 h-10 md:w-16 md:h-16" /></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-20">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="text-4xl sm:text-5xl md:text-[70px] lg:text-[80px] font-black tracking-tight text-white mb-6 md:mb-10 text-balance leading-[1.1] font-['Arial',sans-serif]">
            IMAGINE UM LUGAR...
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }} className="text-base sm:text-lg md:text-xl text-white/90 mb-10 md:mb-14 max-w-3xl mx-auto leading-relaxed text-balance font-medium">
            ...onde você possa pertencer a uma comunidade ativa, encontrar novas amizades pelo mundo todo através da sua voz. Segurança, diversão e conexão instantânea.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }} className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 md:mt-12">
            <button onClick={() => onNavigate('register')} className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-full bg-white hover:bg-gray-100 text-[#2B2D31] font-medium text-lg transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
              <UserPlus className="w-5 h-5" />
              Começar Agora
            </button>
            <button onClick={() => onNavigate('login')} className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-full bg-[#2B2D31] hover:bg-[#1e1f22] text-white font-medium text-lg transition-all border border-transparent hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
              Entrar no Papos
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 1 - Chat Global */}
      <section id="features-cards" className="py-32 px-6 bg-[#111214]">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
          
          {/* Card 1 - Chat Global */}
          <div className="bg-[#1e1f22] border border-white/5 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative overflow-hidden shadow-2xl">
            <div className="flex-1 text-center md:text-left z-10">
              <h2 className="text-3xl md:text-[42px] lg:text-[48px] font-black text-white mb-6 leading-tight font-['Arial',sans-serif]">
                Um Chat Global para todos
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
                Conecte-se com a comunidade instantaneamente. Troque mensagens de texto, compartilhe interesses e conheça novas pessoas a qualquer momento em um ambiente vibrante.
              </p>
            </div>
            <div className="flex-1 w-full relative z-10">
               <div className="relative">
                 <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
                 <img src="https://i.postimg.cc/rpyX33DY/chat-global.png" width="800" height="450" loading="lazy" alt="Chat Global" className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain relative z-20 border border-white/10" referrerPolicy="no-referrer" />
               </div>
            </div>
          </div>

          {/* Card 2 - Comunidade */}
          <div className="bg-[#1e1f22] border border-white/5 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative overflow-hidden shadow-2xl">
            <div className="flex-1 w-full order-2 md:order-1 relative z-10">
               <div className="relative">
                 <div className="absolute inset-0 bg-fuchsia-500/20 blur-[100px] rounded-full"></div>
                 <img src="https://i.postimg.cc/fbWnppVr/comunidade.png" width="800" height="450" loading="lazy" alt="Comunidade" className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain relative z-20 border border-white/10" referrerPolicy="no-referrer" />
               </div>
            </div>
            <div className="flex-1 text-center md:text-left order-1 md:order-2 z-10">
              <h2 className="text-3xl md:text-[42px] lg:text-[48px] font-black text-white mb-6 leading-tight font-['Arial',sans-serif]">
                O seu espaço na comunidade
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
                Crie seu perfil, adicione seus interesses e conecte-se com pessoas incríveis. Um ambiente totalmente pensado para você se expressar e encontrar novas amizades.
              </p>
            </div>
          </div>

          {/* Card 3 - Calls/Match Real */}
          <div className="bg-[#1e1f22] border border-white/5 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative overflow-hidden shadow-2xl">
            <div className="flex-1 text-center md:text-left z-10">
              <h2 className="text-3xl md:text-[42px] lg:text-[48px] font-black text-white mb-6 leading-tight font-['Arial',sans-serif]">
                Onde é fácil conversar por voz
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
                Descreva-se, entre em calls seguras de áudio e faça um "Match Real". Sem distrações visuais, foque apenas na qualidade da conversa no momento da conexão.
              </p>
            </div>
            <div className="flex-1 w-full relative z-10">
               <div className="relative">
                 <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full"></div>
                 <img src="https://i.postimg.cc/R0P5BdtQ/call.png" width="800" height="450" loading="lazy" alt="Calls" className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain relative z-20 border border-white/10" referrerPolicy="no-referrer" />
               </div>
            </div>
          </div>

          {/* Card 4 - Support/Tickets */}
          <div className="bg-[#1e1f22] border border-white/5 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative overflow-hidden shadow-2xl">
            <div className="flex-1 w-full order-2 md:order-1 relative z-10">
               <div className="relative">
                 <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full"></div>
                 <img src="https://i.postimg.cc/MGs2S5Bm/suporte.png" width="800" height="450" loading="lazy" alt="Suporte via Ticket" className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain relative z-20 border border-white/10" referrerPolicy="no-referrer" />

               </div>
            </div>
            <div className="flex-1 text-center md:text-left order-1 md:order-2 z-10">
              <h2 className="text-3xl md:text-[42px] lg:text-[48px] font-black text-white mb-6 leading-tight font-['Arial',sans-serif]">
                Suporte sempre presente
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
                Precisa de ajuda ou quer reportar algo? Nosso sistema de tickets garante que você seja atendido rapidamente, mantendo a comunidade sempre segura e organizada para todos.
              </p>
            </div>
          </div>

        </div>
      </section>

      <footer className="border-t border-white/5 py-12 px-6 bg-[#09090b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center grayscale opacity-80 hover:opacity-100 transition-opacity">
              <img src="https://i.postimg.cc/jDfHpdjL/image.png" width="32" height="32" alt="Papos Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-lg font-bold text-zinc-500">Papos</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('terms')} className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Termos do Serviço</button>
            <button onClick={() => onNavigate('privacy')} className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Privacidade</button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
