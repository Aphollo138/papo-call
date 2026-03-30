import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
  key?: string;
}

export default function Terms({ onBack }: TermsProps) {
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
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Termos de Uso</h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Bem-vindo ao Papos! Que bom ter você aqui. Nossa missão é conectar pessoas através da voz de forma autêntica e em tempo real. Para que todo mundo tenha uma experiência incrível e segura, criamos algumas regrinhas básicas. Prometemos não usar aquele juridiquês chato!
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Regras da Comunidade</h2>
            <p className="leading-relaxed">
              O Papos é um espaço para trocar ideias, conhecer gente nova e se divertir. Por isso, temos tolerância zero para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Discurso de ódio, racismo, homofobia ou qualquer tipo de discriminação.</li>
              <li>Assédio, bullying ou ameaças a outros usuários.</li>
              <li>Compartilhamento de conteúdo ilegal, explícito ou que viole direitos autorais.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Queremos que aqui seja o seu lugar seguro na internet. Respeito é a nossa regra número um.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Nosso Direito de Agir</h2>
            <p className="leading-relaxed">
              Para manter a casa em ordem, o Papos se reserva o direito de banir, suspender ou remover qualquer usuário que quebre essas regras ou poste coisas indevidas nas comunidades. Não queremos ser os chatos da festa, mas a segurança da comunidade vem em primeiro lugar.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Idade Mínima</h2>
            <p className="leading-relaxed">
              Para usar o Papos, recomendamos que você tenha pelo menos 13 anos de idade (ou a idade mínima exigida pelas leis do seu país). Se você for menor de idade, certifique-se de que seus pais ou responsáveis estão de acordo com o seu uso do aplicativo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Mudanças nos Termos</h2>
            <p className="leading-relaxed">
              A internet muda rápido, e nós também. Podemos atualizar estes termos de vez em quando. Se fizermos mudanças grandes, vamos te avisar. Continuar usando o Papos depois das mudanças significa que você concorda com as novas regras.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
