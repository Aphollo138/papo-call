import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, AlertCircle, ArrowLeft, Mail, MessageSquare, User, AtSign } from 'lucide-react';
import PublicHeader from './blog/PublicHeader';

export default function ContactUs({ onBack, onNavigate }: { onBack: () => void, onNavigate: (state: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // 1. Send to Formspree for actual email delivery to social@papo.net.br
      const formspreePromise = fetch("https://formspree.io/f/mnqepprq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          message: formData.message,
          _subject: `Novo Contato Papos: ${formData.name}`,
          _replyto: formData.email
        })
      });

      // 2. Send to our own API for Telegram notification
      const localApiPromise = fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const [formspreeRes] = await Promise.all([formspreePromise, localApiPromise]);

      if (formspreeRes.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', username: '', message: '' });
      } else {
        throw new Error('Erro ao enviar');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PublicHeader onNavigate={onNavigate} activePath="home" />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
              Fale Conosco
            </h1>
            <p className="text-zinc-500 font-medium">
              Olá! Preencha o formulário e retornaremos seu e-mail em breve.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-4">Mensagem Enviada!</h2>
                  <p className="text-zinc-400 mb-8">Recebemos sua mensagem e entraremos em contato através do e-mail social@papo.net.br.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-[#5865F2] font-black uppercase tracking-widest text-sm hover:underline"
                  >
                    Enviar outra mensagem
                  </button>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-4">Ops! Algo deu errado.</h2>
                  <p className="text-zinc-400 mb-8">Não foi possível enviar sua mensagem agora. Tente novamente mais tarde ou envie diretamente para social@papo.net.br.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-[#5865F2] font-black uppercase tracking-widest text-sm hover:underline font-black"
                  >
                    Tentar Novamente
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <User className="w-3 h-3" /> Nome completo *
                    </label>
                    <input 
                      required
                      type="text"
                      placeholder="Digite seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 placeholder:text-zinc-700 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> E-mail *
                      </label>
                      <input 
                        required
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 placeholder:text-zinc-700 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <AtSign className="w-3 h-3" /> Usuário
                      </label>
                      <input 
                        type="text"
                        placeholder="@usuario"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 placeholder:text-zinc-700 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Mensagem *
                    </label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Digite sua mensagem"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 placeholder:text-zinc-700 transition-all font-medium resize-none"
                    />
                  </div>

                  <button 
                    disabled={status === 'sending'}
                    type="submit"
                    className="w-full py-5 bg-[#5865F2] hover:bg-[#4752C4] disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-black text-xl rounded-2xl transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 active:scale-95"
                  >
                    {status === 'sending' ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        ENVIAR MENSAGEM
                      </>
                    )}
                  </button>
                  
                  <div className="pt-4 text-center">
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">
                      Resposta garantida em até 24 horas
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <button 
            onClick={onBack}
            className="mt-12 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mx-auto font-black uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </button>
        </div>
      </main>
    </div>
  );
}
