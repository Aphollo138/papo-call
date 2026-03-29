import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Headphones, UserCheck, ShieldCheck, Twitter, Github, Linkedin, 
  Volume2, Mic, MicOff, PhoneOff, User, Loader2, Search, Activity, Hash, ArrowRight, Link as LinkIcon,
  Lock, Eye, EyeOff, Settings, Users, Zap, X, Heart, MessageSquare
} from 'lucide-react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, limit, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CompleteProfile from './components/auth/CompleteProfile';
import Community from './components/Community';
import SettingsModal from './components/ui/SettingsModal';

type AppState = 'landing' | 'login' | 'register' | 'profile' | 'dashboard' | 'call';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userData, setUserData] = useState<any>(null);
  const [callData, setCallData] = useState<{roomId: string, isCaller: boolean} | null>(null);

  return (
    <div className="min-h-screen bg-bg-main text-text-main selection:bg-blurple/30 font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {appState === 'landing' && <LandingPage onNavigate={setAppState} key="landing" />}
        {appState === 'login' && <Login onLogin={(data) => {
          setUserData(data);
          if (data.profileComplete === false) {
            setAppState('profile');
          } else {
            setAppState('dashboard');
          }
        }} onNavigate={setAppState} key="login" />}
        {appState === 'register' && (
          <Register 
            onNext={(data) => { setUserData(data); setAppState('profile'); }} 
            onBack={() => setAppState('landing')} 
            onNavigate={setAppState}
            key="register" 
          />
        )}
        {appState === 'profile' && (
          <CompleteProfile 
            userData={userData} 
            onComplete={() => setAppState('dashboard')} 
            key="profile" 
          />
        )}
        {appState === 'dashboard' && <Dashboard onMatch={(roomId, isCaller) => { setCallData({roomId, isCaller}); setAppState('call'); }} key="dashboard" />}
        {appState === 'call' && callData && <CallInterface roomId={callData.roomId} isCaller={callData.isCaller} onLeave={() => { setCallData(null); setAppState('dashboard'); }} key="call" />}
      </AnimatePresence>
    </div>
  );
}

// --- LANDING PAGE ---
function LandingPage({ onNavigate }: { onNavigate: (state: AppState) => void, key?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col">
      <header className="border-b border-white/5 bg-bg-main/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md">
              <img src="https://i.postimg.cc/jDfHpdjL/image.png" alt="Papos Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Papos</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Recursos</a>
            <a href="#seguranca" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Segurança</a>
            <a href="#baixar" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Baixar</a>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('login')} className="text-sm font-medium text-text-main hover:text-white transition-colors cursor-pointer hidden sm:block">
              Entrar
            </button>
            <button onClick={() => onNavigate('register')} className="text-sm font-medium px-4 py-2 rounded-md bg-blurple hover:bg-blurple-hover text-white transition-colors cursor-pointer">
              Cadastrar
            </button>
          </div>
        </div>
      </header>

      <section className="relative pt-24 pb-20 px-6 overflow-hidden flex-grow">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 text-balance">
            Apenas voz. Conversas reais.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed text-balance">
            Entre, fale e ouça. O Papos remove as distrações visuais e o texto para focar no que importa: a conexão instantânea através do áudio.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <button onClick={() => onNavigate('register')} className="px-8 py-4 rounded-lg bg-blurple hover:bg-blurple-hover text-white font-semibold text-lg transition-colors cursor-pointer inline-flex items-center gap-2">
              Começar a Falar
            </button>
          </motion.div>
        </div>
        <div className="mt-20 max-w-3xl mx-auto flex items-center justify-center gap-1 h-32 opacity-80">
          {[...Array(40)].map((_, i) => {
            const height = 20 + Math.sin(i * 0.5) * 40 + Math.cos(i * 0.2) * 20 + Math.random() * 20;
            return (
              <motion.div key={i} className="w-2 rounded-full bg-gradient-to-t from-blurple to-blue-400"
                animate={{ height: [height, height * 0.4, height * 1.2, height] }}
                transition={{ duration: 1.5 + Math.random() * 1, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 0.5 }}
              />
            );
          })}
        </div>
      </section>

      <section id="recursos" className="py-24 px-6 bg-bg-main">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={<img src="https://img.icons8.com/?size=100&id=qlWqQuEnMw4W&format=png&color=5865F2" alt="Áudio" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />} title="Áudio de Alta Fidelidade" description="Latência zero e cancelamento de ruído nativo para conversas cristalinas." />
          <FeatureCard icon={<UserCheck className="w-6 h-6 text-blurple" />} title="Entrada Simplificada" description="Sem e-mails longos. Apenas Nome, Usuário e Senha para começar." />
          <FeatureCard icon={<img src="https://img.icons8.com/?size=100&id=83198&format=png&color=5865F2" alt="Privacidade" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />} title="Foco na Privacidade" description="Suas salas, suas regras. Sem chats de texto persistentes, o áudio é efêmero." />
        </div>
      </section>

      <section className="py-24 px-6 bg-[#000000] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">A organização que você conhece, focada em áudio</h2>
          
          {/* Call Container */}
          <div className="bg-[#111214] rounded-2xl p-4 md:p-6 border border-white/5 shadow-2xl max-w-4xl mx-auto">
            {/* Grid of users */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              {/* User 1 (Active Speaker) */}
              <div className="bg-[#2B2D31] rounded-xl aspect-video relative flex items-center justify-center overflow-hidden border-2 border-green shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#2B2D31] relative z-10">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Alex" className="w-full h-full object-cover" />
                </div>
                {/* Active speaker pulse */}
                <motion.div className="absolute w-24 h-24 rounded-full border-2 border-green" animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }} />
                
                {/* Name Tag */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2">
                  <span className="text-white text-sm font-medium">Alex</span>
                  <Volume2 className="w-4 h-4 text-green" />
                </div>
              </div>

              {/* User 2 */}
              <div className="bg-[#2B2D31] rounded-xl aspect-video relative flex items-center justify-center overflow-hidden border-2 border-transparent">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#2B2D31]">
                  <img src="https://i.pravatar.cc/150?img=32" alt="Sarah" className="w-full h-full object-cover" />
                </div>
                
                {/* Name Tag */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2">
                  <span className="text-white text-sm font-medium">Sarah</span>
                </div>
              </div>

            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="w-12 h-12 rounded-full bg-[#2B2D31] hover:bg-[#313338] flex items-center justify-center transition-colors text-white">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-[#2B2D31] hover:bg-[#313338] flex items-center justify-center transition-colors text-white">
                <Headphones className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors text-white shadow-lg shadow-red-500/20">
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 px-6 bg-bg-main">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center p-1 opacity-70 hover:opacity-100 transition-opacity">
              <img src="https://i.postimg.cc/jDfHpdjL/image.png" alt="Papos Logo" className="w-full h-full object-contain grayscale" referrerPolicy="no-referrer" />
            </div>
            <span className="text-lg font-bold text-text-muted">Papos</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Termos</a>
            <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl bg-bg-card border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-4">
      <div className="w-12 h-12 rounded-lg bg-bg-hover flex items-center justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-text-muted leading-relaxed text-sm">{description}</p>
    </div>
  );
}

// --- SUPPORT TAB ---
function SupportTab() {
  const [supportTab, setSupportTab] = useState<'abrir' | 'abertos'>('abrir');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'support_tickets'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || !currentUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'support_tickets'), {
        userId: currentUser.uid,
        title,
        message,
        status: 'Em análise',
        createdAt: serverTimestamp()
      });
      setTitle('');
      setMessage('');
      setSupportTab('abertos');
    } catch (error) {
      console.error("Error adding ticket:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 pt-6 px-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Suporte</h2>
      
      <div className="flex gap-6 mb-8 border-b border-white/10">
        <button 
          onClick={() => setSupportTab('abrir')}
          className={`text-sm font-bold uppercase tracking-wider transition-colors pb-3 -mb-[1px] ${supportTab === 'abrir' ? 'text-[#5865F2] border-b-2 border-[#5865F2]' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Abrir
        </button>
        <button 
          onClick={() => setSupportTab('abertos')}
          className={`text-sm font-bold uppercase tracking-wider transition-colors pb-3 -mb-[1px] ${supportTab === 'abertos' ? 'text-[#5865F2] border-b-2 border-[#5865F2]' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Abertos
        </button>
      </div>

      {supportTab === 'abrir' ? (
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Título</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all" 
                placeholder="Ex: Problema com o áudio" 
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Mensagem</label>
              <textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all min-h-[100px] resize-none" 
                placeholder="Descreva seu problema..." 
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !title || !message}
              className="w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Abrir Chamado'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">Nenhum chamado aberto.</p>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.id} className="bg-zinc-900/30 border border-white/5 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-medium">{ticket.title}</h4>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${ticket.status === 'Em análise' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm line-clamp-2">{ticket.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// --- DASHBOARD ---
function Dashboard({ onMatch }: { onMatch: (roomId: string, isCaller: boolean) => void, key?: string }) {
  const currentUser = auth.currentUser;
  const [searching, setSearching] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const [showDesktopProfile, setShowDesktopProfile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'match' | 'support' | 'community'>('match');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });
    return unsub;
  }, [currentUser]);

  useEffect(() => {
    if (!searching || !currentUser) return;
    
    // Listen for rooms where we are the callee
    const q = query(collection(db, 'rooms'), where('calleeId', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      snap.docChanges().forEach(change => {
        if (change.type === 'added') {
          setSearching(false);
          onMatch(change.doc.id, false); // false = we are callee
        }
      });
    });
    return unsub;
  }, [searching, currentUser]);

  const handleSearch = async () => {
    if (!currentUser) return;
    setActiveTab('match');
    setSearching(true);
    try {
      // 1. Check waiting room for others
      const waitingRef = collection(db, 'waiting_room');
      const q = query(waitingRef, limit(5));
      const waitingSnap = await getDocs(q);

      const matchDoc = waitingSnap.docs.find(d => d.data().uid !== currentUser.uid);

      if (matchDoc) {
        // Found someone!
        const matchUid = matchDoc.data().uid;

        // Create a room
        const roomRef = await addDoc(collection(db, 'rooms'), {
          callerId: currentUser.uid,
          calleeId: matchUid,
          createdAt: serverTimestamp()
        });

        // Remove them from waiting room
        await deleteDoc(doc(db, 'waiting_room', matchDoc.id));

        // Remove ourselves from waiting room if we were there
        const myWaitingQ = query(waitingRef, where('uid', '==', currentUser.uid));
        const myWaitingSnap = await getDocs(myWaitingQ);
        myWaitingSnap.docs.forEach(async (d) => {
          await deleteDoc(doc(db, 'waiting_room', d.id));
        });

        setSearching(false);
        onMatch(roomRef.id, true); // true = we are caller
      } else {
        // No one waiting, add ourselves
        // First check if we are already in waiting room to avoid duplicates
        const myWaitingQ = query(waitingRef, where('uid', '==', currentUser.uid));
        const myWaitingSnap = await getDocs(myWaitingQ);
        if (myWaitingSnap.empty) {
          await addDoc(waitingRef, {
            uid: currentUser.uid,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error("Error searching for match:", error);
      setSearching(false);
    }
  };

  const handleCancelSearch = async () => {
    if (!currentUser) return;
    setSearching(false);
    try {
      const waitingRef = collection(db, 'waiting_room');
      const myWaitingQ = query(waitingRef, where('uid', '==', currentUser.uid));
      const myWaitingSnap = await getDocs(myWaitingQ);
      myWaitingSnap.docs.forEach(async (d) => {
        await deleteDoc(doc(db, 'waiting_room', d.id));
      });
    } catch (error) {
      console.error("Error cancelling search:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="h-screen w-full bg-zinc-950 flex flex-col relative overflow-hidden"
    >
      {/* Active Tab Content */}
      {activeTab === 'match' && (
        <div className="flex-1 flex flex-col items-center justify-center z-10 pb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] mb-3">
              Papos
            </h1>
            <p className="text-zinc-400 text-sm font-medium tracking-wide mb-12">
              Online e pronto para falar
            </p>

            <button 
              onClick={handleSearch}
              className="px-12 py-5 rounded-2xl bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-bold text-xl transition-all shadow-[0_0_40px_rgba(88,101,242,0.4)] hover:shadow-[0_0_60px_rgba(88,101,242,0.6)] hover:scale-105 flex items-center gap-3"
            >
              <Mic className="w-6 h-6" />
              Match Real
            </button>
          </motion.div>
        </div>
      )}

      {activeTab === 'support' && <SupportTab />}
      {activeTab === 'community' && <Community />}

      {/* Desktop Bottom-Left Profile Widget */}
      <div className="hidden md:block fixed bottom-6 left-6 z-40">
        <AnimatePresence>
          {showDesktopProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-4 left-0 w-72 bg-[#111214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden origin-bottom-left"
            >
              <div 
                className="h-16 w-full relative"
                style={{
                  backgroundImage: userData?.bannerUrl ? `url(${userData.bannerUrl})` : 'linear-gradient(to right, #6366f1, #a855f7)',
                  backgroundSize: 'cover',
                  backgroundPosition: `center ${userData?.bannerPosition || 50}%`
                }}
              >
                <button 
                  onClick={() => setShowDesktopProfile(false)}
                  className="absolute top-2 right-2 p-1 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 pb-4 relative">
                <div className="w-16 h-16 rounded-full bg-[#111214] p-1 absolute -top-12 left-4">
                  <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden relative flex items-center justify-center">
                    {userData?.photoURL || currentUser?.photoURL ? (
                      <img src={userData?.photoURL || currentUser?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-zinc-400">{currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#111214] rounded-full"></div>
                </div>
                <div className="mt-12">
                  <h2 className="text-lg font-bold text-white leading-tight">{currentUser?.displayName || 'Usuário'}</h2>
                  <p className="text-sm text-zinc-400">@{currentUser?.displayName?.toLowerCase().replace(/\s+/g, '') || 'usuario'}</p>
                </div>
                {userData?.bio && (
                  <div className="mt-3">
                    <p className="text-sm text-zinc-300 break-words">{userData.bio}</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => {
                      setShowDesktopProfile(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-300 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Configurações</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowDesktopProfile(!showDesktopProfile)}
          className="relative overflow-hidden bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-xl hover:bg-zinc-800/80 transition-colors w-64 group"
        >
          {/* Background Banner Overlay */}
          {userData?.bannerUrl && (
            <>
              <div 
                className="absolute inset-0 z-0 opacity-40 transition-opacity group-hover:opacity-50"
                style={{
                  backgroundImage: `url(${userData.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: `center ${userData?.bannerPosition || 50}%`
                }}
              />
              {/* Gradient to ensure text readability */}
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/40 to-transparent" />
            </>
          )}

          <div className="relative z-10 shrink-0">
            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-700/50">
              {userData?.photoURL || currentUser?.photoURL ? (
                <img src={userData?.photoURL || currentUser?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-zinc-400">{currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
          </div>
          <div className="relative z-10 flex flex-col items-start text-left flex-1 overflow-hidden">
            <span className="text-sm font-bold text-white leading-tight truncate w-full drop-shadow-md">{currentUser?.displayName || 'Usuário'}</span>
            <span className="text-[11px] text-zinc-300 leading-tight mt-0.5 truncate w-full drop-shadow-md">Online</span>
          </div>
          <Settings className="relative z-10 w-4 h-4 text-zinc-400 shrink-0 group-hover:text-white transition-colors drop-shadow-md" />
        </button>
      </div>

      {/* Searching Overlay */}
      <AnimatePresence>
        {searching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center p-5 shadow-[0_0_60px_rgba(88,101,242,0.3)] mb-12 relative"
            >
              <img src="https://i.postimg.cc/jDfHpdjL/image.png" alt="Papos Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              
              {/* Radar sweep effect */}
              <motion.div 
                className="absolute inset-0 rounded-3xl border-2 border-[#5865F2]"
                animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.div>
            
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-6 relative">
              <motion.div 
                className="absolute top-0 bottom-0 left-0 bg-[#5865F2] rounded-full"
                animate={{ 
                  left: ["-100%", "100%"],
                  width: ["50%", "50%"]
                }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Procurando alguém...</h3>
            <p className="text-zinc-400 text-sm mb-12 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Lembre-se: Respeito com todos.
            </p>

            <button 
              onClick={handleCancelSearch}
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
            >
              Cancelar busca
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Full Profile Modal */}
      <AnimatePresence>
        {showMobileProfile && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-zinc-950 flex flex-col md:hidden"
          >
            <div 
              className="h-32 w-full relative"
              style={{
                backgroundImage: userData?.bannerUrl ? `url(${userData.bannerUrl})` : 'linear-gradient(to right, #6366f1, #a855f7)',
                backgroundSize: 'cover',
                backgroundPosition: `center ${userData?.bannerPosition || 50}%`
              }}
            >
              <button 
                onClick={() => setShowMobileProfile(false)}
                className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 relative flex-1">
              <div className="w-24 h-24 rounded-full bg-zinc-950 p-1.5 absolute -top-12 left-6">
                <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden relative flex items-center justify-center">
                  {userData?.photoURL || currentUser?.photoURL ? (
                    <img src={userData?.photoURL || currentUser?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-zinc-400">{currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-green-500 border-4 border-zinc-950 rounded-full"></div>
              </div>
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-white leading-tight">{currentUser?.displayName || 'Usuário'}</h2>
                <p className="text-base text-zinc-400">@{currentUser?.displayName?.toLowerCase().replace(/\s+/g, '') || 'usuario'}</p>
              </div>
              
              <div className="mt-8 space-y-2">
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Sobre mim</h3>
                  <p className="text-sm text-zinc-300 break-words">{userData?.bio || 'Olá! Estou usando o Papos para conhecer novas pessoas.'}</p>
                </div>
                
                <button 
                  onClick={() => {
                    setShowMobileProfile(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center justify-between bg-zinc-900/50 rounded-xl p-4 border border-white/5 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Configurações da Conta</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 pb-6 pt-2 z-30">
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          {/* Button 1: Suporte */}
          <button 
            onClick={() => setActiveTab('support')}
            className={`flex flex-col items-center justify-center w-16 md:w-20 gap-1 transition-colors ${activeTab === 'support' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Headphones className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none whitespace-nowrap">Suporte</span>
          </button>

          {/* Button 2: Match Real */}
          <button 
            onClick={searching ? handleCancelSearch : handleSearch}
            className="flex flex-col items-center justify-center w-20 md:w-24 gap-1 relative group -mt-6"
          >
            <div className="relative flex items-center justify-center">
              {searching && (
                <>
                  <motion.div className="absolute inset-0 rounded-full bg-[#5865F2]/40" animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
                  <motion.div className="absolute inset-0 rounded-full bg-[#5865F2]/40" animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
                </>
              )}
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${searching ? 'bg-zinc-800 border-2 border-[#5865F2] shadow-[0_0_20px_rgba(88,101,242,0.4)]' : 'bg-[#5865F2] group-active:scale-95 shadow-[0_0_15px_rgba(88,101,242,0.4)]'}`}>
                {searching ? (
                  <Zap className="w-7 h-7 md:w-8 md:h-8 text-[#5865F2] animate-pulse" />
                ) : (
                  <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />
                )}
              </div>
            </div>
            <span className={`text-[10px] font-medium leading-none mt-1 whitespace-nowrap ${searching ? 'text-[#5865F2]' : 'text-zinc-300'}`}>Match Real</span>
          </button>

          {/* Button 3: Comunidade */}
          <button 
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center justify-center w-16 md:w-20 gap-1 transition-colors ${activeTab === 'community' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none whitespace-nowrap">Comunidade</span>
          </button>

          {/* Button 4: Perfil (Mobile Only) */}
          <button 
            onClick={() => setShowMobileProfile(true)}
            className="md:hidden flex flex-col items-center justify-center w-16 gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-700">
                {userData?.photoURL || currentUser?.photoURL ? (
                  <img src={userData?.photoURL || currentUser?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-zinc-400">{currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-950 rounded-full"></div>
            </div>
            <span className="text-[10px] font-medium leading-none whitespace-nowrap">Perfil</span>
          </button>
        </div>
      </div>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </motion.div>
  );
}

// --- CALL INTERFACE ---
function CallInterface({ roomId, isCaller, onLeave }: { roomId: string, isCaller: boolean, onLeave: () => void, key?: string }) {
  const currentUser = auth.currentUser;
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('Conectando...');
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [localUserData, setLocalUserData] = useState<any>(null);
  const [remoteUserData, setRemoteUserData] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setLocalUserData(docSnap.data());
      }
    });
    return unsub;
  }, [currentUser]);

  useEffect(() => {
    let unsubRoom: () => void;
    let unsubCallerCand: () => void;
    let unsubCalleeCand: () => void;
    let unsubRemoteUser: () => void;

    const initCall = async () => {
      try {
        // 1. Get local audio
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }

        // 2. Initialize RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });
        pcRef.current = pc;

        // Add local tracks to PC
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Listen for remote tracks
        pc.ontrack = (event) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = event.streams[0];
            setStatus('Conectado');
          }
        };

        const roomRef = doc(db, 'rooms', roomId);
        const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
        const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');

        // Handle ICE candidates
        pc.onicecandidate = async (event) => {
          if (event.candidate) {
            const candCollection = isCaller ? callerCandidatesCollection : calleeCandidatesCollection;
            await addDoc(candCollection, event.candidate.toJSON());
          }
        };

        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
            setStatus('Desconectado');
            handleLeave();
          }
        };

        // Fetch remote user data
        const roomSnap = await getDoc(roomRef);
        if (roomSnap.exists()) {
          const roomData = roomSnap.data();
          const remoteUserId = isCaller ? roomData.calleeId : roomData.callerId;
          
          if (remoteUserId) {
            unsubRemoteUser = onSnapshot(doc(db, 'users', remoteUserId), (userSnap) => {
              if (userSnap.exists()) {
                setRemoteUserData(userSnap.data());
              }
            });
          }
        }

        if (isCaller) {
          // Caller logic
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await updateDoc(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });

          unsubRoom = onSnapshot(roomRef, (snap) => {
            const data = snap.data();
            if (!pc.currentRemoteDescription && data?.answer) {
              const rtcSessionDescription = new RTCSessionDescription(data.answer);
              pc.setRemoteDescription(rtcSessionDescription);
            }
          });

          unsubCalleeCand = onSnapshot(calleeCandidatesCollection, (snap) => {
            snap.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
              }
            });
          });
        } else {
          // Callee logic
          unsubRoom = onSnapshot(roomRef, async (snap) => {
            const data = snap.data();
            if (!pc.currentRemoteDescription && data?.offer) {
              const rtcSessionDescription = new RTCSessionDescription(data.offer);
              await pc.setRemoteDescription(rtcSessionDescription);
              
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });
            }
          });

          unsubCallerCand = onSnapshot(callerCandidatesCollection, (snap) => {
            snap.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
              }
            });
          });
        }
      } catch (error) {
        console.error("Error initializing call:", error);
        setStatus('Erro de conexão');
      }
    };

    initCall();

    return () => {
      if (unsubRoom) unsubRoom();
      if (unsubCallerCand) unsubCallerCand();
      if (unsubCalleeCand) unsubCalleeCand();
      if (unsubRemoteUser) unsubRemoteUser();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      pcRef.current?.close();
    };
  }, [roomId, isCaller]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleLeave = async () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    pcRef.current?.close();
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
    } catch (e) {}
    onLeave();
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#000000]">
      <audio ref={localAudioRef} autoPlay muted playsInline className="hidden" />
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
      
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-2 bg-bg-card px-4 py-2 rounded-lg border border-white/10">
            <Activity className={`w-4 h-4 ${status === 'Conectado' ? 'text-green animate-pulse' : 'text-yellow-500'}`} />
            <span className="text-sm font-medium text-white">{status}</span>
          </div>
          <span className="text-text-muted font-mono text-sm">00:00</span>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-16 w-full">
          
          {/* Current User Card */}
          <div className="relative flex flex-col items-center w-full max-w-sm">
            <div 
              className="w-full aspect-[4/3] rounded-2xl bg-bg-card border-2 border-green flex flex-col items-center justify-center overflow-hidden relative z-10 shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all"
              style={{
                backgroundImage: localUserData?.bannerUrl ? `url(${localUserData.bannerUrl})` : 'linear-gradient(to bottom right, #111214, #2B2D31)',
                backgroundSize: 'cover',
                backgroundPosition: `center ${localUserData?.bannerPosition || 50}%`
              }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
              
              <div className="w-24 h-24 rounded-full bg-bg-card border-4 border-green flex items-center justify-center overflow-hidden relative z-20 shadow-xl mb-4">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="You" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">{currentUser?.displayName?.charAt(0) || 'U'}</span>
                )}
              </div>
              
              <div className="relative z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="font-medium text-white">{currentUser?.displayName || 'Você'}</span>
                {isMuted ? <MicOff className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-green" />}
              </div>
            </div>
            <motion.div className="absolute top-0 w-full aspect-[4/3] rounded-2xl border-2 border-green z-0" animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>

          {/* Animated Waveform connecting them */}
          <div className="hidden md:flex items-center justify-center gap-1 w-24 h-16 z-20">
            {[...Array(10)].map((_, i) => (
              <motion.div key={i} className={`w-1.5 rounded-full ${status === 'Conectado' ? 'bg-gradient-to-t from-green to-blurple' : 'bg-zinc-800'}`}
                animate={status === 'Conectado' ? { height: ['20%', '100%', '20%'] } : { height: '20%' }}
                transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, delay: Math.random() * 0.5 }}
              />
            ))}
          </div>

          {/* Match User Card */}
          <div className="relative flex flex-col items-center w-full max-w-sm">
            <div 
              className="w-full aspect-[4/3] rounded-2xl bg-bg-card border-2 border-blurple flex flex-col items-center justify-center overflow-hidden relative z-10 shadow-[0_0_30px_rgba(88,101,242,0.15)] transition-all"
              style={{
                backgroundImage: remoteUserData?.bannerUrl ? `url(${remoteUserData.bannerUrl})` : 'linear-gradient(to bottom right, #111214, #2B2D31)',
                backgroundSize: 'cover',
                backgroundPosition: `center ${remoteUserData?.bannerPosition || 50}%`
              }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
              
              <div className="w-24 h-24 rounded-full bg-bg-card border-4 border-blurple flex items-center justify-center overflow-hidden relative z-20 shadow-xl mb-4">
                {remoteUserData?.photoURL ? (
                  <img src={remoteUserData.photoURL} alt="Remote User" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-zinc-400" />
                )}
              </div>
              
              <div className="relative z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="font-medium text-white">{remoteUserData?.displayName || 'Anônimo'}</span>
                <Volume2 className={`w-4 h-4 ${status === 'Conectado' ? 'text-blurple' : 'text-zinc-600'}`} />
              </div>
            </div>
            {status === 'Conectado' && (
              <motion.div className="absolute top-0 w-full aspect-[4/3] rounded-2xl border-2 border-blurple z-0" animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
            )}
          </div>

        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button onClick={toggleMute} className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-colors group ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-bg-card text-white hover:bg-bg-hover'}`}>
            {isMuted ? <MicOff className="w-6 h-6 group-hover:scale-110 transition-transform" /> : <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />}
          </button>
          <button onClick={handleLeave} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg shadow-red-500/20 group">
            <PhoneOff className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button className="w-14 h-14 rounded-full bg-bg-card border border-white/10 flex items-center justify-center hover:bg-bg-hover transition-colors group">
            <Headphones className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
