import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportTicketModal({ isOpen, onClose }: SupportTicketModalProps) {
  const [type, setType] = useState('Relatar Bug');
  const [description, setDescription] = useState('');
  const [reportedUser, setReportedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !auth.currentUser) return;
    if (type === 'Denunciar Usuário' && !reportedUser.trim()) return;
    
    setLoading(true);
    try {
      const ticketData: any = {
        userId: auth.currentUser.uid,
        type,
        description,
        status: 'open',
        createdAt: serverTimestamp()
      };

      if (type === 'Denunciar Usuário') {
        ticketData.reportedUser = reportedUser.trim();
      }

      await addDoc(collection(db, 'tickets'), ticketData);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDescription('');
        setReportedUser('');
        setType('Relatar Bug');
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Erro ao abrir chamado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Suporte</h2>
              {success ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 mx-auto" />
                  <p className="text-white font-medium">Chamado enviado para a administração!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-zinc-400 text-sm mb-6">Como podemos ajudar você hoje?</p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tipo de Problema</label>
                    <div className="relative">
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all appearance-none cursor-pointer"
                      >
                        <option value="Relatar Bug">Relatar Bug</option>
                        <option value="Denunciar Usuário">Denunciar Usuário</option>
                        <option value="Apelo de Banimento">Apelo de Banimento</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  {type === 'Denunciar Usuário' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nome de Usuário a ser denunciado (@)</label>
                      <input
                        type="text"
                        value={reportedUser}
                        onChange={(e) => setReportedUser(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all"
                        placeholder="@username"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Descreva o problema com detalhes</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all min-h-[120px] resize-none"
                      placeholder="Explique o que aconteceu..."
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading || !description.trim()} className="w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Chamado'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
