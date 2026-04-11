import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, ShieldAlert, CheckCircle } from 'lucide-react';
import { auth, db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';

interface TicketDetailsProps {
  ticketId: string;
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export default function TicketDetails({ ticketId, isOpen, onClose, userRole }: TicketDetailsProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !ticketId) return;

    setLoading(true);
    
    // Fetch ticket data
    const fetchTicket = async () => {
      const docRef = doc(db, 'tickets', ticketId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTicketData({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchTicket();

    // Listen to messages
    const q = query(
      collection(db, 'tickets', ticketId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsub();
  }, [ticketId, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, predefinedText?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = predefinedText || newMessage;
    if (!textToSend.trim() || !auth.currentUser || ticketData?.status === 'closed') return;

    setSending(true);
    try {
      await addDoc(collection(db, 'tickets', ticketId, 'messages'), {
        text: textToSend.trim(),
        senderId: auth.currentUser.uid,
        senderRole: userRole,
        createdAt: serverTimestamp()
      });
      if (!predefinedText) setNewMessage('');
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (userRole !== 'admin') return;
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: 'closed'
      });
      setTicketData(prev => ({ ...prev, status: 'closed' }));
    } catch (error) {
      console.error("Erro ao fechar chamado:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl h-[80vh] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-[#5865F2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {ticketData?.type || 'Carregando...'}
                </h2>
                <p className="text-xs text-zinc-400">
                  Status: <span className={ticketData?.status === 'closed' ? 'text-green-500' : 'text-yellow-500'}>
                    {ticketData?.status === 'closed' ? 'Resolvido' : 'Em análise'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {userRole === 'admin' && ticketData?.status !== 'closed' && (
                <button 
                  onClick={handleCloseTicket}
                  className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Fechar Chamado
                </button>
              )}
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/30">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-[#5865F2]" />
              </div>
            ) : (
              <>
                {/* Original Description as first message */}
                {ticketData && (
                  <div className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 ml-1">
                      Usuário
                    </span>
                    <div className="bg-zinc-800 text-zinc-200 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm">
                      {ticketData.description}
                    </div>
                  </div>
                )}
                
                {messages.map((msg) => {
                  const isMe = msg.senderId === auth.currentUser?.uid;
                  const isAdmin = msg.senderRole === 'admin';
                  
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'ml-auto' : ''}`}>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 mx-1">
                        {isAdmin ? 'Suporte' : 'Usuário'}
                      </span>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isAdmin 
                          ? 'bg-[#5865F2] text-white rounded-tl-sm' 
                          : isMe 
                            ? 'bg-zinc-700 text-white rounded-tr-sm' 
                            : 'bg-zinc-800 text-zinc-200 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-zinc-900">
            {userRole === 'admin' && ticketData?.status !== 'closed' && (
              <div className="mb-3 flex gap-2">
                <span className="text-xs text-zinc-500 font-medium self-center">Validação:</span>
                <button 
                  onClick={() => handleSendMessage(undefined, "Pode validar se funcionou?")}
                  disabled={sending}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-full transition-colors"
                >
                  "Pode validar se funcionou?"
                </button>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={ticketData?.status === 'closed' || sending}
                placeholder={ticketData?.status === 'closed' ? "Este chamado foi encerrado." : "Digite sua mensagem..."}
                className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || ticketData?.status === 'closed' || sending}
                className="w-12 h-12 shrink-0 rounded-xl bg-[#5865F2] hover:bg-[#6f7bf7] text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
