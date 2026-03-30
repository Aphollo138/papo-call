import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import SupportModal from '../ui/SupportModal';

interface LoginProps {
  onNavigate: (state: any) => void;
  onLogin: (userData: any) => void;
  key?: string;
}

export default function Login({ onNavigate, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await user.reload();
          if (user.emailVerified) {
            alert("E-mail confirmado! Redirecionando...");
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              onLogin({ ...userData, uid: user.uid });
            }
          }
        } catch (err) {
          console.error("Erro ao recarregar usuário:", err);
        }
      }
    });

    return () => unsubscribe();
  }, [onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        setError('Por favor, verifique seu e-mail antes de entrar.');
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        onLogin({ ...userData, uid: userCredential.user.uid });
      } else {
        setError('Erro ao buscar dados do usuário.');
      }
    } catch (err: any) {
      console.error(err);
      setError('E-mail ou senha incorretos.');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative">
      <button onClick={() => onNavigate('landing')} className="absolute top-8 left-8 text-zinc-400 hover:text-white transition-colors">Voltar</button>
      
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h2>
        <p className="text-zinc-400 text-sm">Estamos muito felizes em ver você novamente!</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">E-mail</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-zinc-500" />
            </div>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className={`w-full bg-zinc-950 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#5865F2] focus:ring-[#5865F2]'} rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-1 transition-all`} 
              placeholder="seu@email.com" 
              required 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Senha</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-zinc-500" />
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className={`w-full bg-zinc-950 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#5865F2] focus:ring-[#5865F2]'} rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-1 transition-all`} 
              placeholder="••••••••" 
              required 
            />
          </div>
          <div className="flex justify-start mt-1">
            <button type="button" onClick={() => setIsSupportModalOpen(true)} className="text-xs text-[#5865F2] hover:underline font-medium">Esqueceu a senha?</button>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3 mt-2 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-zinc-400 text-sm">
          Precisando de uma conta? {' '}
          <button onClick={() => onNavigate('register')} className="text-[#5865F2] hover:underline font-medium">Registre-se</button>
        </p>
      </div>

      <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
      </div>
    </motion.div>
  );
}
