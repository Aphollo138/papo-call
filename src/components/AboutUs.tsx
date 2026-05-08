import React from 'react';
import { motion } from 'motion/react';
import { Heart, Users, MessageSquare, Headphones, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import PublicHeader from './blog/PublicHeader';

export default function AboutUs({ onBack, onNavigate }: { onBack: () => void, onNavigate: (state: any) => void }) {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <PublicHeader onNavigate={onNavigate} activePath="home" />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] text-sm font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4" />
              Nossa História
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
              Conexões que <br />somam de verdade.
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              O Papos não é apenas mais um chat. É um movimento para trazer de volta a essência da comunicação humana através da voz.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black text-white tracking-tight">Onde tudo começou</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Percebemos que, apesar de estarmos mais "conectados" do que nunca, a solidão digital só aumentava. Comentários, curtidas e textos curtos não conseguem transmitir o que um simples tom de voz consegue.
              </p>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Decidimos criar um refúgio. Um lugar onde você é ouvido pelo que diz, não pelo que posta. Onde o anonimato serve para a liberdade, mas o respeito serve para a união.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-center"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#5865F2] flex items-center justify-center shadow-[0_0_20px_rgba(88,101,242,0.3)]">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Missão: Humanizar</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Nossa missão é facilitar 1 milhão de conexões genuínas até 2027. Queremos que o Papos seja a sua primeira escolha quando o tédio bater e você quiser algo real.
              </p>
            </motion.div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Headphones, title: "Voz Primeiro", desc: "A voz carrega emoção, contexto e verdade." },
              { icon: Shield, title: "Segurança", desc: "Moderação ativa para garantir paz para todos." },
              { icon: Users, title: "Diversidade", desc: "Pessoas de todos os cantos em um só lugar." }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-[#5865F2]/20 transition-all group"
              >
                <div className="text-zinc-500 group-hover:text-[#5865F2] transition-colors mb-4 transform group-hover:scale-110 transition-transform origin-left">
                  <pillar.icon className="w-8 h-8" />
                </div>
                <h4 className="text-white font-bold mb-2">{pillar.title}</h4>
                <p className="text-zinc-500 text-sm">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => onNavigate('register')}
              className="px-10 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xl rounded-2xl transition-all shadow-[0_0_30px_rgba(88,101,242,0.3)] hover:scale-105"
            >
              Fazer parte dessa história
            </button>
            <button 
              onClick={onBack}
              className="block mt-8 mx-auto text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2 font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
