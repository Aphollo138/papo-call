import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import SupportTicketModal from './ui/SupportTicketModal';
import TicketDetails from './ui/TicketDetails';

export default function SupportTab() {
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
