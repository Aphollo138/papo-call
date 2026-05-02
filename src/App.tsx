import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Headphones, UserCheck, ShieldCheck, Twitter, Github, Linkedin, 
  Volume2, Mic, MicOff, PhoneOff, User, Loader2, Search, Activity, Hash, ArrowRight, Link as LinkIcon,
  Lock, Eye, EyeOff, Settings, Users, Zap, X, Heart, MessageSquare, ShieldAlert, Globe, Mail
} from 'lucide-react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, limit, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CompleteProfile from './components/auth/CompleteProfile';
import Community from './components/Community';
import SettingsModal from './components/ui/SettingsModal';
import Terms from './components/legal/Terms';
import Privacy from './components/legal/Privacy';
import AdminPanel from './components/admin/AdminPainel';
import SupportTicketModal from './components/ui/SupportTicketModal';
import TicketDetails from './components/ui/TicketDetails';
import MaintenanceScreen from './components/MaintenanceScreen';

import GlobalChat from './components/GlobalChat';
import PublicHeader from './components/blog/PublicHeader';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';

type AppState = 'landing' | 'login' | 'register' | 'profile' | 'dashboard' | 'call' | 'terms' | 'privacy' | 'admin' | 'blog_list' | 'blog_post';

export default function App() {
  const getInitialState = (): { state: AppState, slug?: string } => {
    const path = window.location.pathname;
    if (path === '/blog') return { state: 'blog_list' };
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      return { state: 'blog_post', slug };
    }
    return { state: 'landing' };
  };

  const initial = getInitialState();
  const [appState, setAppState] = useState<AppState>(initial.state);
  const [userData, setUserData] = useState<any>(null);
  const [callData, setCallData] = useState<{roomId: string, isCaller: boolean} | null>(null);
  const [blogSlug, setBlogSlug] = useState<string>(initial.slug || '');
  const [isMaintenance, setIsMaintenance] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/blog') {
        setAppState('blog_list');
      } else if (path.startsWith('/blog/')) {
        setBlogSlug(path.replace('/blog/', ''));
        setAppState('blog_post');
      } else if (path === '/' || path === '') {
        setAppState('landing');
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().maintenanceMode) {
        setIsMaintenance(true);
      } else {
        setIsMaintenance(false);
      }
    });
    return unsub;
  }, []);

  const isAdmin = currentUser?.uid === 'XfWanDGXhHbfz9ahH6N11I9UunG3';

  if (isMaintenance && !isAdmin) {
    return <MaintenanceScreen />;
  }

  const handleNavigate = (state: AppState, data?: any) => {
    if (state === 'blog_post' && data?.slug) {
      setBlogSlug(data.slug);
      window.history.pushState({}, '', `/blog/${data.slug}`);
    } else if (state === 'blog_list') {
      window.history.pushState({}, '', '/blog');
    } else {
      window.history.pushState({}, '', '/');
    }
    setAppState(state);
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main selection:bg-blurple/30 font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {appState === 'landing' && <LandingPage onNavigate={handleNavigate} key="landing" />}
        {appState === 'login' && <Login onLogin={(data) => {
          setUserData(data);
          if (data.profileComplete === false) {
            handleNavigate('profile');
          } else {
            handleNavigate('dashboard');
          }
        }} onNavigate={handleNavigate} key="login" />}
        {appState === 'register' && (
          <Register 
            onNext={(data) => { setUserData(data); handleNavigate('profile'); }} 
            onBack={() => handleNavigate('landing')} 
            onNavigate={handleNavigate}
            key="register" 
          />
        )}
        {appState === 'profile' && (
          <CompleteProfile 
            userData={userData} 
            onComplete={() => handleNavigate('dashboard')} 
            key="profile" 
          />
        )}
        {appState === 'dashboard' && <Dashboard onMatch={(roomId, isCaller) => { setCallData({roomId, isCaller}); handleNavigate('call'); }} onNavigate={handleNavigate} key="dashboard" />}
        {appState === 'call' && callData && <CallInterface roomId={callData.roomId} isCaller={callData.isCaller} onLeave={() => { setCallData(null); handleNavigate('dashboard'); }} key="call" />}
        {appState === 'terms' && <Terms onBack={() => handleNavigate('landing')} key="terms" />}
        {appState === 'privacy' && <Privacy onBack={() => handleNavigate('landing')} key="privacy" />}
        {appState === 'admin' && <AdminPanel onNavigate={handleNavigate} key="admin" />}
        {appState === 'blog_list' && <BlogList onNavigate={handleNavigate} key="blog_list" />}
        {appState === 'blog_post' && <BlogPost slug={blogSlug} onNavigate={handleNavigate} key="blog_post" />}
      </AnimatePresence>
    </div>
  );
}

// --- LANDING PAGE ---
function LandingPage({ onNavigate }: { onNavigate: (state: AppState) => void, key?: string }) {
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
          <motion.i animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="fa-solid fa-cloud absolute top-[25%] left-[5%] text-[80px] md:text-[120px] text-white/5" />
          <motion.i animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="fa-solid fa-gamepad absolute top-[55%] right-[8%] text-[70px] md:text-[100px] text-white/5" />
          <motion.i animate={{ y: [0, -25, 0], rotate: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="fa-solid fa-headphones absolute bottom-[25%] md:bottom-[35%] left-[10%] text-[100px] md:text-[140px] text-white/5" />
          <motion.i animate={{ y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="fa-solid fa-comments absolute top-[30%] right-[22%] text-[60px] md:text-[90px] text-white/5" />
          <motion.i animate={{ y: [0, -20, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="fa-solid fa-star absolute bottom-[20%] md:bottom-[40%] right-[15%] text-[50px] md:text-[70px] text-yellow-300/10" />
          <motion.i animate={{ y: [0, 30, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="fa-solid fa-rocket absolute top-[15%] left-[25%] text-[70px] md:text-[90px] text-white/5" />
          <motion.i animate={{ y: [0, -20, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }} className="fa-solid fa-music absolute bottom-[15%] md:bottom-[30%] left-[30%] text-[40px] md:text-[60px] text-white/5" />
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
              <i className="fa-solid fa-user-plus text-lg"></i>
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
                 <img src="https://i.postimg.cc/rpyX33DY/chat-global.png" alt="Chat Global" className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain relative z-20 border border-white/10" referrerPolicy="no-referrer" />
               </div>
            </div>
          </div>

          {/* Card 2 - Comunidade */}
          <div className="bg-[#1e1f22] border border-white/5 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative overflow-hidden shadow-2xl">
            <div className="flex-1 w-full order-2 md:order-1 relative z-10">
               <div className="relative">
                 <div className="absolute inset-0 bg-fuchsia-500/20 blur-[100px] rounded-full"></div>
                 <img src="https://i.postimg.cc/fbWnppVr/comunidade.png" alt="Comunidade" className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain relative z-20 border border-white/10" referrerPolicy="no-referrer" />
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
                 <img src="https://i.postimg.cc/R0P5BdtQ/call.png" alt="Calls" className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain relative z-20 border border-white/10" referrerPolicy="no-referrer" />
               </div>
            </div>
          </div>

          {/* Card 4 - Support/Tickets */}
          <div className="bg-[#1e1f22] border border-white/5 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative overflow-hidden shadow-2xl">
            <div className="flex-1 w-full order-2 md:order-1 relative z-10">
               <div className="relative">
                 <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full"></div>
                 <img src="https://i.postimg.cc/MGs2S5Bm/suporte.png" alt="Suporte via Ticket" className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain relative z-20 border border-white/10" referrerPolicy="no-referrer" />
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
              <img src="https://i.postimg.cc/jDfHpdjL/image.png" alt="Papos Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'tickets'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentUser]);

  return (
    <div className="flex-1 overflow-y-auto pb-32 pt-6 px-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Suporte</h2>
          <p className="text-zinc-400 text-sm">Acompanhe seus chamados ou abra um novo.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#5865F2] hover:bg-[#6f7bf7] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Abrir Chamado
        </button>
      </div>

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-zinc-500">Você não tem nenhum chamado aberto.</p>
          </div>
        ) : (
          tickets.map(ticket => (
            <div 
              key={ticket.id} 
              onClick={() => setSelectedTicketId(ticket.id)}
              className="bg-zinc-900 border border-white/5 rounded-xl p-5 cursor-pointer hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#5865F2]/10 text-[#5865F2] text-xs font-bold uppercase tracking-wider">
                  {ticket.type}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${ticket.status === 'open' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                  {ticket.status === 'open' ? 'Em análise' : 'Resolvido'}
                </span>
              </div>
              <p className="text-zinc-300 text-sm line-clamp-2">{ticket.description}</p>
            </div>
          ))
        )}
      </div>

      <SupportTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {selectedTicketId && (
        <TicketDetails
          ticketId={selectedTicketId}
          isOpen={!!selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          userRole="user"
        />
      )}
    </div>
  );
}

// --- DASHBOARD ---
function Dashboard({ onMatch, onNavigate }: { onMatch: (roomId: string, isCaller: boolean) => void, onNavigate: (state: any) => void, key?: string }) {
  const currentUser = auth.currentUser;
  const [searching, setSearching] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const [showDesktopProfile, setShowDesktopProfile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'match' | 'support' | 'community' | 'global'>('match');
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
      className="h-[100dvh] w-full bg-zinc-950 flex flex-col relative overflow-hidden overscroll-none"
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
      {activeTab === 'global' && <GlobalChat />}

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
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {currentUser?.displayName || 'Usuário'}
                  </h2>
                  <p className="text-sm text-zinc-400">@{currentUser?.displayName?.toLowerCase().replace(/\s+/g, '') || 'usuario'}</p>
                </div>
                {userData?.bio && (
                  <div className="mt-3">
                    <p className="text-sm text-zinc-300 break-words">{userData.bio}</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-white/5">
                  {currentUser?.uid === 'XfWanDGXhHbfz9ahH6N11I9UunG3' && (
                    <button 
                      onClick={() => {
                        setShowDesktopProfile(false);
                        onNavigate('admin');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-300 transition-colors mb-2"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Painel Admin</span>
                    </button>
                  )}
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
            <span className="text-sm font-bold text-white leading-tight truncate w-full drop-shadow-md">
              {currentUser?.displayName || 'Usuário'}
            </span>
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
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {currentUser?.displayName || 'Usuário'}
                </h2>
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
                
                {currentUser?.uid === 'XfWanDGXhHbfz9ahH6N11I9UunG3' && (
                  <button 
                    onClick={() => {
                      setShowMobileProfile(false);
                      onNavigate('admin');
                    }}
                    className="w-full flex items-center justify-between bg-zinc-900/50 rounded-xl p-4 border border-white/5 hover:bg-zinc-800/50 transition-colors mt-2"
                  >
                    <div className="flex items-center gap-3 text-red-400">
                      <ShieldAlert className="w-5 h-5" />
                      <span className="text-sm font-medium">Painel Admin</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-red-400/50" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed z-30 bottom-2 md:bottom-0 left-4 right-4 md:left-0 md:right-0 md:w-full bg-zinc-900/70 md:bg-zinc-950/80 backdrop-blur-3xl md:backdrop-blur-xl border border-white/10 md:border-x-0 md:border-b-0 md:border-t md:border-white/5 rounded-[2rem] md:rounded-none px-6 md:px-0 py-3 md:pb-6 md:pt-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:shadow-none max-w-md mx-auto mb-[env(safe-area-inset-bottom)] md:mb-0">
        <div className="flex items-center justify-between md:justify-around gap-2 h-12 md:h-16 md:max-w-md md:mx-auto">
          {/* Button 1: Suporte */}
          <button 
            onClick={() => setActiveTab('support')}
            className={`flex flex-col items-center justify-center md:w-20 gap-1 transition-all ${activeTab === 'support' ? 'text-white scale-110' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <Headphones className="w-6 h-6 md:w-6 md:h-6" />
            <span className="hidden md:block text-[10px] font-medium leading-none whitespace-nowrap">Suporte</span>
          </button>

          {/* Button 2: Match Real */}
          <button 
            onClick={searching ? handleCancelSearch : handleSearch}
            className="flex flex-col items-center justify-center md:w-24 gap-1 relative group md:-mt-6"
          >
            <div className="relative flex items-center justify-center">
              {searching && (
                <>
                  <motion.div className="absolute inset-0 rounded-2xl md:rounded-full bg-[#5865F2]/40" animate={{ scale: [1, 1.3, 1.8], opacity: [0.8, 0.4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
                  <motion.div className="absolute inset-0 rounded-2xl md:rounded-full bg-[#5865F2]/40" animate={{ scale: [1, 1.3, 1.8], opacity: [0.8, 0.4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
                </>
              )}
              <div className={`w-14 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-full flex items-center justify-center transition-all duration-300 z-10 ${searching ? 'bg-zinc-800 border-2 border-[#5865F2] shadow-[0_0_20px_rgba(88,101,242,0.4)]' : 'bg-white/10 md:bg-[#5865F2] group-active:scale-95 md:shadow-[0_0_15px_rgba(88,101,242,0.4)] hover:bg-white/20 md:hover:bg-[#6f7bf7]'}`}>
                {searching ? (
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-[#5865F2] animate-pulse" />
                ) : (
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                )}
              </div>
            </div>
            <span className={`hidden md:block text-[10px] font-medium leading-none mt-1 whitespace-nowrap ${searching ? 'text-[#5865F2]' : 'text-zinc-300'}`}>Match Real</span>
          </button>

          {/* Button 3: Comunidade */}
          <button 
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center justify-center md:w-20 gap-1 transition-all ${activeTab === 'community' ? 'text-white scale-110' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <Users className="w-6 h-6 md:w-6 md:h-6" />
            <span className="hidden md:block text-[10px] font-medium leading-none whitespace-nowrap">Comunidade</span>
          </button>

          {/* Button 4: Global */}
          <button 
            onClick={() => setActiveTab('global')}
            className={`flex flex-col items-center justify-center md:w-20 gap-1 transition-all ${activeTab === 'global' ? 'text-white scale-110' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <Globe className="w-6 h-6 md:w-6 md:h-6" />
            <span className="hidden md:block text-[10px] font-medium leading-none whitespace-nowrap">Global</span>
          </button>

          {/* Button 5: Perfil (Mobile Only) */}
          <button 
            onClick={() => setShowMobileProfile(true)}
            className="md:hidden flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-300 transition-all active:scale-95"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-sm bg-zinc-800 overflow-hidden flex items-center justify-center border-2 border-transparent">
                {userData?.photoURL || currentUser?.photoURL ? (
                  <img src={userData?.photoURL || currentUser?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-zinc-400">{currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-950 rounded-full"></div>
            </div>
            <span className="hidden text-[10px] font-medium leading-none whitespace-nowrap">Perfil</span>
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

  const handleLeave = async () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    if (pcRef.current) {
      pcRef.current.close();
    }
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
    } catch (e) {}
    onLeave();
  };

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
    let pendingCandidates: RTCIceCandidateInit[] = [];

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
          if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
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

          unsubRoom = onSnapshot(roomRef, async (snap) => {
            if (!snap.exists()) {
              handleLeave();
              return;
            }
            const data = snap.data();
            if (!pc.currentRemoteDescription && data?.answer) {
              const rtcSessionDescription = new RTCSessionDescription(data.answer);
              await pc.setRemoteDescription(rtcSessionDescription);
              
              // Process buffered candidates
              pendingCandidates.forEach(cand => pc.addIceCandidate(new RTCIceCandidate(cand)).catch(console.error));
              pendingCandidates = [];
            }
          });

          unsubCalleeCand = onSnapshot(calleeCandidatesCollection, (snap) => {
            snap.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const candidate = change.doc.data() as RTCIceCandidateInit;
                if (pc.remoteDescription) {
                  pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
                } else {
                  pendingCandidates.push(candidate);
                }
              }
            });
          });
        } else {
          // Callee logic
          unsubRoom = onSnapshot(roomRef, async (snap) => {
            if (!snap.exists()) {
              handleLeave();
              return;
            }
            const data = snap.data();
            if (!pc.currentRemoteDescription && data?.offer) {
              const rtcSessionDescription = new RTCSessionDescription(data.offer);
              await pc.setRemoteDescription(rtcSessionDescription);
              
              // Process buffered candidates
              pendingCandidates.forEach(cand => pc.addIceCandidate(new RTCIceCandidate(cand)).catch(console.error));
              pendingCandidates = [];
              
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });
            }
          });

          unsubCallerCand = onSnapshot(callerCandidatesCollection, (snap) => {
            snap.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const candidate = change.doc.data() as RTCIceCandidateInit;
                if (pc.remoteDescription) {
                  pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
                } else {
                  pendingCandidates.push(candidate);
                }
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
      if (pcRef.current) {
        pcRef.current.close();
      }
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
