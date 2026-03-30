import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Loader2, UserCheck } from 'lucide-react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface RegisterProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onNavigate: (state: any) => void;
  key?: string;
}

const BLOCKED_DOMAINS = [
  'tempmail.com',
  'temp-mail.org',
  'adguard.com',
  '10minutemail.com',
  'yopmail.com',
  'guerrillamail.com',
  'mailinator.com',
  'dispostable.com',
  'throwawaymail.com',
  'tempmail.net',
  'tempmail.ninja',
  'tempmail.plus',
  'tempmail.dev',
  'tempmail.io',
  'tempmail.co'
];

export default function Register({ onNext, onBack, onNavigate }: RegisterProps) {
  const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const domain = formData.email.split('@')[1]?.toLowerCase();
    if (domain && BLOCKED_DOMAINS.includes(domain)) {
      setError('E-mails temporários não são permitidos. Por favor, use um provedor de e-mail válido (Gmail, Outlook, etc.).');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const actionCodeSettings = {
        url: 'https://papo.net.br/login',
        handleCodeInApp: true,
      };
      
      await sendEmailVerification(userCredential.user, actionCodeSettings);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        username: formData.username.toLowerCase(),
        profileComplete: false,
        createdAt: serverTimestamp()
      });
      
      setSuccess(true);
      setFormData({ name: '', email: '', username: '', password: '' });
      setLoading(false);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca.');
      } else {
        setError(err.message || 'Erro ao criar conta. Tente novamente.');
      }
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative">
      <button onClick={onBack} className="absolute top-8 left-8 text-zinc-400 hover:text-white transition-colors">Voltar</button>
      
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Criar uma conta</h2>
          <p className="text-zinc-400 text-sm">Junte-se ao Papos e comece a conversar.</p>
        </div>

        {success ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Conta criada!</h3>
            <p className="text-zinc-400">Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada.</p>
            <button onClick={() => onNavigate('login')} className="w-full py-3 mt-4 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors">
              Voltar para o Login
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-500" />
                </div>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-zinc-950 border ${error.includes('Nome') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#5865F2] focus:ring-[#5865F2]'} rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-1 transition-all`} placeholder="Como você se chama?" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full bg-zinc-950 border ${error.includes('e-mail') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#5865F2] focus:ring-[#5865F2]'} rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-1 transition-all`} placeholder="seu@email.com" />
              </div>
              {error.includes('e-mail') && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome de Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-zinc-500 font-bold">@</span>
                </div>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className={`w-full bg-zinc-950 border ${error.includes('usuário') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#5865F2] focus:ring-[#5865F2]'} rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-1 transition-all`} placeholder="joaosilva" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={`w-full bg-zinc-950 border ${error.includes('senha') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#5865F2] focus:ring-[#5865F2]'} rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-1 transition-all`} placeholder="Mínimo 6 caracteres" minLength={6} />
              </div>
              {error.includes('senha') && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {error && !error.includes('e-mail') && !error.includes('senha') && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 mt-4 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Conta'}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
