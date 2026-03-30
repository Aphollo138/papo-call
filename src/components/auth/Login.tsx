import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Loader2, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, applyActionCode, confirmPasswordReset } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import SupportModal from '../ui/SupportModal';

interface LoginProps {
  onNavigate: (state: any) => void;
  onLogin: (userData: any) => void;
  key?: string;
}

function ResetPasswordModal({ isOpen, onClose, oobCode }: { isOpen: boolean, onClose: () => void, oobCode: string }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao redefinir a senha. O link pode ter expirado.');
    }
    setLoading(false);
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
              <h2 className="text-2xl font-bold text-white mb-2">Nova Senha</h2>
              {success ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 mx-auto" />
                  <p className="text-white font-medium mb-6">Senha atualizada com sucesso!</p>
                  <button onClick={onClose} className="w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors">
                    Fazer Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <p className="text-zinc-400 text-sm mb-6">Digite sua nova senha abaixo.</p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nova Senha</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-zinc-500" />
                      </div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Confirmar Nova Senha</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-zinc-500" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  
                  <button type="submit" disabled={loading || !newPassword || !confirmPassword} className="w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Atualizar Senha'}
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

export default function Login({ onNavigate, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [oobCode, setOobCode] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode');
    const code = searchParams.get('oobCode') || searchParams.get('Code');

    if (mode === 'verifyEmail' && code) {
      setVerifying(true);
      setVerifyMessage('Verificando sua conta...');
      applyActionCode(auth, code)
        .then(() => {
          setVerifyMessage('E-mail confirmado com sucesso! Agora você pode entrar.');
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error(err);
          setVerifyMessage('O link de verificação é inválido ou expirou.');
        })
        .finally(() => {
          setVerifying(false);
        });
    } else if (mode === 'resetPassword' && code) {
      setOobCode(code);
      setIsResetPasswordModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

      {verifyMessage && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium text-center ${verifyMessage.includes('sucesso') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : verifyMessage.includes('Verificando') ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {verifying && <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />}
          {verifyMessage}
        </div>
      )}

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
      <ResetPasswordModal isOpen={isResetPasswordModalOpen} onClose={() => setIsResetPasswordModalOpen(false)} oobCode={oobCode} />
      </div>
    </motion.div>
  );
}
