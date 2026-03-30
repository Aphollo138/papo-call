import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface PrivacyProps {
  onBack: () => void;
  key?: string;
}

export default function Privacy({ onBack }: PrivacyProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-zinc-950 text-zinc-300 py-12 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Política de Privacidade</h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              A sua privacidade é papo sério. No Papos, acreditamos que a sua voz e os seus dados pertencem apenas a você. Escrevemos esta política de forma clara e direta para você saber exatamente o que guardamos e o que não guardamos.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. O que coletamos (O básico do básico)</h2>
            <p className="leading-relaxed">
              Para você poder criar sua conta e usar o Papos, precisamos de algumas informações essenciais (usamos o Firebase do Google para isso):
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li><strong>Seu E-mail:</strong> Apenas para login, recuperação de senha e segurança da conta.</li>
              <li><strong>Seu Nome de Usuário:</strong> Como a galera vai te chamar nas salas e comunidades.</li>
              <li><strong>Sua Foto de Perfil e Bio:</strong> Para deixar seu perfil com a sua cara.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Esses dados ficam guardados de forma segura no nosso banco de dados (Firestore).
            </p>
          </section>

          <section className="space-y-4 bg-zinc-900/50 border border-[#5865F2]/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#5865F2]"></div>
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-6 h-6 text-[#5865F2]" />
              <h2 className="text-2xl font-bold text-white">2. O Papo sobre a sua Voz</h2>
            </div>
            <p className="leading-relaxed text-zinc-300">
              O Papos é focado em conversas de voz em tempo real. E aqui vai a nossa maior promessa: <strong>nós não gravamos, não ouvimos e não armazenamos o áudio das suas conversas nos nossos servidores.</strong>
            </p>
            <p className="leading-relaxed text-zinc-400 mt-2">
              Como isso funciona? Usamos uma tecnologia chamada WebRTC (P2P - Peer-to-Peer). Isso significa que o áudio vai diretamente do seu microfone para o fone de ouvido da outra pessoa. A conversa acontece apenas entre vocês, sem intermediários gravando o papo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Cookies e Tecnologias Semelhantes</h2>
            <p className="leading-relaxed">
              Usamos alguns cookies básicos, mas não para te rastrear pela internet. Eles servem apenas para manter você logado na sua conta com segurança (usamos os cookies de autenticação padrão do Firebase). Assim, você não precisa digitar sua senha toda vez que abrir o Papos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Compartilhamento de Dados</h2>
            <p className="leading-relaxed">
              Nós não vendemos seus dados para ninguém. Ponto final. Só compartilhamos informações com serviços essenciais para o app funcionar (como o Google Firebase, que hospeda nosso banco de dados e sistema de login) ou se formos obrigados por lei.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
