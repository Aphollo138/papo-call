import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Ticket, ShieldAlert, ShieldCheck, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

interface AdminPanelProps {
  onNavigate: (state: any) => void;
  key?: string;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
    } catch (error) {
      console.error("Erro ao buscar dados do admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        isBanned: !currentStatus
      });
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u));
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5865F2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex flex-col md:flex-row">
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
              <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
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
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-white">{user.name || user.displayName || 'Sem Nome'}</div>
                          <div className="text-xs text-zinc-500">@{user.username || 'user'}</div>
                        </td>
                        <td className="p-4 text-sm text-zinc-400">{user.email}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBanned ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {user.isBanned ? 'Banido' : 'Ativo'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleToggleBan(user.id, !!user.isBanned)}
                            disabled={actionLoading === user.id || user.id === ADMIN_UID}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${user.isBanned ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500'}`}
                          >
                            {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : user.isBanned ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                            {user.isBanned ? 'Desbanir' : 'Banir'}
                          </button>
                        </td>
                      </tr>
                    ))}
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
                    <div key={ticket.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-md bg-[#5865F2]/10 text-[#5865F2] text-xs font-bold uppercase tracking-wider">
                            {ticket.type}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">ID: {ticket.userId}</span>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed">{ticket.description}</p>
                      </div>
                      <button 
                        onClick={() => handleResolveTicket(ticket.id)}
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
        </motion.div>
      </div>
    </div>
  );
}
