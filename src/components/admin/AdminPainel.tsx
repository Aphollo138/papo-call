import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Ticket, ShieldAlert, ShieldCheck, CheckCircle, ArrowLeft, Loader2, Search, X } from 'lucide-react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import TicketDetails from '../ui/TicketDetails';

interface AdminPanelProps {
  onNavigate: (state: any) => void;
  key?: string;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'tickets' | 'settings'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Ticket Details State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Ban Modal State
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<any>(null);
  const [banReason, setBanReason] = useState('');

  // Suspend Modal State
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<any>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState<number>(60000);

  const ADMIN_UID = 'XfWanDGXhHbfz9ahH6N11I9UunG3';

  useEffect(() => {
    const checkAccess = async () => {
      if (!auth.currentUser) {
        onNavigate('login');
        return;
      }
      
      if (auth.currentUser.uid !== ADMIN_UID) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.data()?.role !== 'admin') {
          onNavigate('dashboard');
          return;
        }
      }
      
      fetchData();
    };
    
    checkAccess();
  }, [onNavigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Users
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch Open Tickets
      const ticketsQ = query(collection(db, 'tickets'), where('status', '==', 'open'));
      const ticketsSnap = await getDocs(ticketsQ);
      setTickets(ticketsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch Settings
      const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
      if (settingsDoc.exists()) {
        setMaintenanceMode(settingsDoc.data().maintenanceMode || false);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (user: any) => {
    if (user.isBanned || user.isSuspended) {
      // Unban directly
      setActionLoading(user.id);
      try {
        await updateDoc(doc(db, 'users', user.id), {
          isBanned: false,
          isSuspended: false,
          suspendedUntil: null,
          banReason: null
        });
        setUsers(users.map(u => u.id === user.id ? { ...u, isBanned: false, isSuspended: false, suspendedUntil: null, banReason: null } : u));
      } catch (error) {
        console.error("Erro ao desbanir usuário:", error);
      } finally {
        setActionLoading(null);
      }
    } else {
      // Open ban modal
      setUserToBan(user);
      setBanReason('');
      setBanModalOpen(true);
    }
  };

  const confirmBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToBan || !banReason.trim()) return;

    setActionLoading(userToBan.id);
    try {
      await updateDoc(doc(db, 'users', userToBan.id), {
        isBanned: true,
        banReason: banReason.trim(),
        isSuspended: false,
        suspendedUntil: null
      });
      setUsers(users.map(u => u.id === userToBan.id ? { ...u, isBanned: true, banReason: banReason.trim(), isSuspended: false, suspendedUntil: null } : u));
      setBanModalOpen(false);
      setUserToBan(null);
    } catch (error) {
      console.error("Erro ao banir usuário:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenSuspend = (user: any) => {
    setUserToSuspend(user);
    setSuspendReason('');
    setSuspendDuration(60000);
    setSuspendModalOpen(true);
  };

  const confirmSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToSuspend || !suspendReason.trim()) return;

    setActionLoading(userToSuspend.id);
    try {
      const suspendedUntil = Date.now() + suspendDuration;
      await updateDoc(doc(db, 'users', userToSuspend.id), {
        isSuspended: true,
        suspendedUntil,
        banReason: suspendReason.trim(),
        isBanned: false
      });
      setUsers(users.map(u => u.id === userToSuspend.id ? { ...u, isSuspended: true, suspendedUntil, banReason: suspendReason.trim(), isBanned: false } : u));
      setSuspendModalOpen(false);
      setUserToSuspend(null);
    } catch (error) {
      console.error("Erro ao suspender usuário:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    setActionLoading(ticketId);
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: 'closed'
      });
      setTickets(tickets.filter(t => t.id !== ticketId));
    } catch (error) {
      console.error("Erro ao resolver ticket:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleMaintenance = async () => {
    setActionLoading('maintenance');
    try {
      const newMode = !maintenanceMode;
      await setDoc(doc(db, 'settings', 'global'), { maintenanceMode: newMode }, { merge: true });
      setMaintenanceMode(newMode);
    } catch (error) {
      console.error("Erro ao alterar modo manutenção:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = (user.name || user.displayName || '').toLowerCase().includes(searchLower);
    const usernameMatch = (user.username || '').toLowerCase().includes(searchLower);
    return nameMatch || usernameMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5865F2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex flex-col md:flex-row relative">
      {/* Ban Modal */}
      <AnimatePresence>
        {banModalOpen && userToBan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setBanModalOpen(false)} 
                className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">Banir Usuário</h2>
                    <p className="text-sm text-zinc-400">@{userToBan.username || 'user'}</p>
                  </div>
                </div>
                
                <form onSubmit={confirmBan} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Motivo do Banimento</label>
                    <input
                      type="text"
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      placeholder="Ex: Violação das regras da comunidade"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setBanModalOpen(false)}
                      className="flex-1 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      disabled={actionLoading === userToBan.id || !banReason.trim()}
                      className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === userToBan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Ban'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspend Modal */}
      <AnimatePresence>
        {suspendModalOpen && userToSuspend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setSuspendModalOpen(false)} 
                className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">Suspender Usuário</h2>
                    <p className="text-sm text-zinc-400">@{userToSuspend.username || 'user'}</p>
                  </div>
                </div>
                
                <form onSubmit={confirmSuspend} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tempo de Suspensão</label>
                    <select
                      value={suspendDuration}
                      onChange={(e) => setSuspendDuration(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value={60000}>1 minuto</option>
                      <option value={600000}>10 minutos</option>
                      <option value={3600000}>1 hora</option>
                      <option value={86400000}>24 horas</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Motivo da Suspensão</label>
                    <input
                      type="text"
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                      placeholder="Ex: Spam no chat"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setSuspendModalOpen(false)}
                      className="flex-1 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      disabled={actionLoading === userToSuspend.id || !suspendReason.trim()}
                      className="flex-1 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === userToSuspend.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Suspensão'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspend Modal */}
      <AnimatePresence>
        {suspendModalOpen && userToSuspend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setSuspendModalOpen(false)} 
                className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">Suspender Usuário</h2>
                    <p className="text-sm text-zinc-400">@{userToSuspend.username || 'user'}</p>
                  </div>
                </div>
                
                <form onSubmit={confirmSuspend} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tempo de Suspensão</label>
                    <select
                      value={suspendDuration}
                      onChange={(e) => setSuspendDuration(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value={60000}>1 minuto</option>
                      <option value={600000}>10 minutos</option>
                      <option value={3600000}>1 hora</option>
                      <option value={86400000}>24 horas</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Motivo da Suspensão</label>
                    <input
                      type="text"
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                      placeholder="Ex: Spam no chat"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setSuspendModalOpen(false)}
                      className="flex-1 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      disabled={actionLoading === userToSuspend.id || !suspendReason.trim()}
                      className="flex-1 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === userToSuspend.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Suspensão'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#5865F2]/20 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-[#5865F2]" />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight">Admin Panel</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Acesso Restrito</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-[#5865F2] text-white' : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'}`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Usuários</span>
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'tickets' ? 'bg-[#5865F2] text-white' : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'}`}
          >
            <Ticket className="w-5 h-5" />
            <span className="font-medium">Chamados</span>
            {tickets.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {tickets.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-[#5865F2] text-white' : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'}`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="font-medium">Servidor</span>
          </button>
        </nav>

        <button 
          onClick={() => onNavigate('dashboard')}
          className="mt-10 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Voltar ao App</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome ou @username"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all"
                  />
                </div>
              </div>
              
              <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20">
                      <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Nome / Usuário</th>
                      <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">E-mail</th>
                      <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-500">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-white">{user.name || user.displayName || 'Sem Nome'}</div>
                            <div className="text-xs text-zinc-500">@{user.username || 'user'}</div>
                          </td>
                          <td className="p-4 text-sm text-zinc-400">{user.email}</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBanned ? 'bg-red-500/10 text-red-500' : user.isSuspended ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                                {user.isBanned ? 'Banido' : user.isSuspended ? 'Suspenso' : 'Ativo'}
                              </span>
                              {user.isBanned && user.banReason && (
                                <div className="text-[10px] text-red-400/70 max-w-[150px] truncate" title={user.banReason}>
                                  {user.banReason}
                                </div>
                              )}
                              {user.isSuspended && user.suspendedUntil && (
                                <div className="text-[10px] text-yellow-400/70 max-w-[150px] truncate" title={`Até: ${new Date(user.suspendedUntil).toLocaleString()}`}>
                                  Até: {new Date(user.suspendedUntil).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!user.isBanned && !user.isSuspended && (
                                <button 
                                  onClick={() => handleOpenSuspend(user)}
                                  disabled={actionLoading === user.id || user.id === ADMIN_UID}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500"
                                >
                                  Suspender
                                </button>
                              )}
                              <button 
                                onClick={() => handleToggleBan(user)}
                                disabled={actionLoading === user.id || user.id === ADMIN_UID}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${user.isBanned || user.isSuspended ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500'}`}
                              >
                                {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (user.isBanned || user.isSuspended) ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                {user.isBanned ? 'Desbanir' : user.isSuspended ? 'Remover Suspensão' : 'Banir'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Chamados de Suporte</h2>
              {tickets.length === 0 ? (
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white">Tudo limpo!</h3>
                  <p className="text-zinc-500">Não há chamados abertos no momento.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between cursor-pointer hover:border-white/10 transition-colors"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-md bg-[#5865F2]/10 text-[#5865F2] text-xs font-bold uppercase tracking-wider">
                            {ticket.type}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">ID: {ticket.userId}</span>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2">{ticket.description}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveTicket(ticket.id);
                        }}
                        disabled={actionLoading === ticket.id}
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {actionLoading === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Marcar como Resolvido
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Configurações do Servidor</h2>
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                   <div>
                      <h3 className="text-lg font-medium text-white mb-1">Modo Manutenção</h3>
                      <p className="text-sm text-zinc-400 max-w-xl">
                         Ative o modo de manutenção para bloquear o acesso de todos os usuários (exceto administradores) ao site. Uma tela de manutenção será exibida.
                      </p>
                   </div>
                   <button
                      onClick={handleToggleMaintenance}
                      disabled={actionLoading === 'maintenance'}
                      className={`relative shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                         maintenanceMode 
                           ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                           : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                   >
                     {actionLoading === 'maintenance' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                     {maintenanceMode ? 'Desativar Manutenção' : 'Ativar Manutenção'}
                   </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicketId && (
        <TicketDetails
          ticketId={selectedTicketId}
          isOpen={!!selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          userRole="admin"
        />
      )}
    </div>
  );
}
