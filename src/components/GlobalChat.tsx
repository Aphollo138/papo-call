import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, Smile, MessagesSquare, MessageCircle, AlertCircle, Info, Link as LinkIcon, Users, ArrowLeft, MessageSquare, Menu, Trash2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit, getDocs, doc, setDoc, where, updateDoc, getDoc, arrayRemove } from 'firebase/firestore';

export default function GlobalChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [showUsersList, setShowUsersList] = useState(window.innerWidth >= 1280);
  const [cooldown, setCooldownState] = useState(() => {
    const saved = localStorage.getItem('globalChatCooldown');
    if (saved) {
      const remaining = Math.ceil((parseInt(saved) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });

  const setCooldown = (seconds: number) => {
    setCooldownState(seconds);
    if (seconds > 0) {
      localStorage.setItem('globalChatCooldown', (Date.now() + seconds * 1000).toString());
    } else {
      localStorage.removeItem('globalChatCooldown');
    }
  };

  // Right sidebar and Profile State
  const [rightView, setRightView] = useState<'users' | 'profile'>('users');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // DM State
  const [currentView, setCurrentView] = useState<'global' | 'dm'>('global');
  const [activeDmUser, setActiveDmUser] = useState<any>(null);
  const [dmChats, setDmChats] = useState<any[]>([]);
  const [dmMessages, setDmMessages] = useState<any[]>([]);
  const [newDmMessage, setNewDmMessage] = useState('');
  const [sendingDm, setSendingDm] = useState(false);
  const dmMessagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mobile Toggles
  const [showMobileLeft, setShowMobileLeft] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      let suspicious = false;
      if (e.key === 'F12') suspicious = true;
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) suspicious = true;
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) suspicious = true;

      if (suspicious && currentUser) {
        try {
          await fetch('/api/moderate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'devtools',
              userId: currentUser.uid,
              username: currentUser.displayName || 'Usuário',
              content: 'Atalhos detectados: ' + (e.key === 'F12' ? 'F12' : `Ctrl+Shift+${e.key}`)
            })
          });
        } catch (error) {
          console.error('Error reporting suspicious activity', error);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // DOM Manipulation Heuristics (watching for suspicious style changes or script injections)
    const observer = new MutationObserver((mutations) => {
      let suspicious = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'SCRIPT' || (node as HTMLElement).style?.position === 'fixed' && (node as HTMLElement).style?.zIndex === '999999') {
              suspicious = true;
            }
          });
        }
      });
      if (suspicious && currentUser) {
        fetch('/api/moderate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'devtools', userId: currentUser.uid, username: currentUser.displayName || 'Usuário', content: 'Manipulação anormal do DOM detectada (Possível script injetado)' })
        }).catch(console.error);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Listen to messages
    const q = query(
      collection(db, 'global_messages'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs.reverse());
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    // Real-time online users
    const usersQuery = query(collection(db, 'users'), where('isOnline', '==', true));
    const unsubUsers = onSnapshot(usersQuery, (snap) => {
      const usersList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setActiveUsers(usersList);
    });

    return () => {
      unsub();
      unsubUsers();
      window.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, []);

  // Presence Logic
  useEffect(() => {
    if (!currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.uid);
    
    const setOnline = async () => {
      try {
        await setDoc(userRef, { isOnline: true, lastActive: serverTimestamp() }, { merge: true });
      } catch (e) {
        console.error("Error setting online status", e);
      }
    };
    
    const setOffline = async () => {
      try {
        await setDoc(userRef, { isOnline: false, lastActive: serverTimestamp() }, { merge: true });
      } catch (e) {
        console.error("Error setting offline status", e);
      }
    };

    setOnline();
    const intervalId = setInterval(setOnline, 60000);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setOffline();
      } else {
        setOnline();
      }
    };
    
    const handleBeforeUnload = () => {
      setOffline();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setOffline();
    };
  }, [currentUser]);

  // Cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownState((prev) => {
        const saved = localStorage.getItem('globalChatCooldown');
        if (saved) {
          const remaining = Math.ceil((parseInt(saved) - Date.now()) / 1000);
          if (remaining > 0) return remaining;
          localStorage.removeItem('globalChatCooldown');
        }
        return 0;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || sending || cooldown > 0) return;

    setSending(true);
    try {
      let modResult = { blocked: false, reason: '' };
      try {
        const response = await fetch('/api/moderate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'chat',
            userId: currentUser.uid,
            username: currentUser.displayName || 'Usuário',
            content: newMessage.trim()
          })
        });
        const text = await response.text();
        if (text) {
          modResult = JSON.parse(text);
        }
      } catch (e) {
        console.warn("Moderação offline ou erro na API:", e);
      }
      
      if (modResult.blocked) {
         setErrorMessage('Mensagem bloqueada: ' + modResult.reason);
         setTimeout(() => setErrorMessage(''), 5000);
         setNewMessage('');
         setCooldown(30); // Penalty cooldown
         return;
      }

      await addDoc(collection(db, 'global_messages'), {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Usuário',
        senderPhotoUrl: currentUser.photoURL || '',
        createdAt: serverTimestamp()
      });
      setNewMessage('');
      setCooldown(4); // 4 seconds delay
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setErrorMessage("Erro de conexão ao enviar mensagem.");
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'direct_chats'),
      where('participants', 'array-contains', currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const chats = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      chats.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setDmChats(chats);
    });
    return () => unsub();
  }, [currentUser]);

  const activeDmId = activeDmUser && currentUser ? [currentUser.uid, activeDmUser.id].sort().join('_') : null;

  useEffect(() => {
    if (!activeDmId) return;
    const q = query(
      collection(db, 'direct_chats', activeDmId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setDmMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => dmMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsub();
  }, [activeDmId]);

  const handleOpenProfile = async (userSummary: any) => {
    setRightView('profile');
    setShowUsersList(true);
    let user = activeUsers.find(u => u.id === userSummary.id || u.id === userSummary.senderId);
    if (!user || (!user.about && !user.bannerUrl)) {
       const uId = userSummary.id || userSummary.senderId;
       const docSnap = await getDoc(doc(db, 'users', uId));
       if (docSnap.exists()) {
         user = { id: docSnap.id, ...docSnap.data() };
       } else {
         user = userSummary;
       }
    }
    setSelectedUser(user);
  };

  const handleStartDm = (user: any) => {
    setActiveDmUser(user);
    setCurrentView('dm');
    setRightView('users');
    setShowUsersList(window.innerWidth >= 1280);
    setShowMobileLeft(false);
  };

  const handleSendDm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDmMessage.trim() || !currentUser || !activeDmUser || sendingDm) return;
    setSendingDm(true);
    
    const dmChatId = [currentUser.uid, activeDmUser.id].sort().join('_');
    const chatRef = doc(db, 'direct_chats', dmChatId);
    const messagesRef = collection(db, 'direct_chats', dmChatId, 'messages');

    try {
      let modResult = { blocked: false, reason: '' };
      try {
        const response = await fetch('/api/moderate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'chat',
            userId: currentUser.uid,
            username: currentUser.displayName || 'Usuário',
            content: newDmMessage.trim()
          })
        });
        const text = await response.text();
        if (text) {
          modResult = JSON.parse(text);
        }
      } catch (e) {
        console.warn("Moderação offline ou erro na API:", e);
      }
      
      if (modResult.blocked) {
         setErrorMessage('Mensagem bloqueada: ' + modResult.reason);
         setTimeout(() => setErrorMessage(''), 5000);
         setNewDmMessage('');
         setCooldown(30);
         return;
      }

       const myData = await getDoc(doc(db, 'users', currentUser.uid)).then(s => ({ username: s.data()?.username, photoURL: s.data()?.photoURL }));
       await setDoc(chatRef, {
          participants: [currentUser.uid, activeDmUser.id],
          updatedAt: serverTimestamp(),
          lastMessage: newDmMessage.trim(),
          usersData: {
              [currentUser.uid]: { username: currentUser.displayName || myData.username || 'Usuário', photoUrl: currentUser.photoURL || myData.photoURL || '' },
              [activeDmUser.id]: { username: activeDmUser.username || 'Usuário', photoUrl: activeDmUser.photoURL || activeDmUser.photoUrl || '' }
          }
       }, { merge: true });

       await addDoc(messagesRef, {
           text: newDmMessage.trim(),
           senderId: currentUser.uid,
           senderName: currentUser.displayName || myData.username || 'Usuário',
           senderPhotoUrl: currentUser.photoURL || myData.photoURL || '',
           createdAt: serverTimestamp()
       });
       setNewDmMessage('');
    } catch (error) {
       console.error("Erro ao enviar DM: ", error);
       setErrorMessage("Erro de conexão ao enviar mensagem.");
       setTimeout(() => setErrorMessage(''), 5000);
    } finally {
       setSendingDm(false);
    }
  };

  const handleDeleteDm = async (e: React.MouseEvent, chatId: string, otherUserId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      const chatRef = doc(db, 'direct_chats', chatId);
      await updateDoc(chatRef, {
        participants: arrayRemove(currentUser.uid)
      });
      if (activeDmUser?.id === otherUserId) {
        setCurrentView('global');
        setActiveDmUser(null);
      }
    } catch (error) {
      console.error("Erro ao deletar DM: ", error);
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="relative flex h-screen w-full bg-[#1e1e1e] overflow-hidden pb-24 pt-0">
      {showMobileLeft && <div className="absolute inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setShowMobileLeft(false)} />}
      {showUsersList && <div className="absolute inset-0 z-20 bg-black/50 xl:hidden" onClick={() => setShowUsersList(false)} />}
      
      {/* 1. Sidebar Esquerda */}
      <div className={`absolute lg:relative z-30 h-full w-[280px] bg-[#222222] border-r border-white/5 flex flex-col shrink-0 transition-transform duration-300 lg:translate-x-0 ${showMobileLeft ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 flex flex-col items-center justify-center">
          <div className="relative mb-3">
            {currentUser?.photoURL ? (
               <img src={currentUser.photoURL} alt="Você" loading="lazy" width={80} height={80} className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-[#1e1e1e]" />
            ) : (
               <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-[#5865F2] shadow-lg">
                 {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
               </div>
            )}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#222222]"></div>
          </div>
          <span className="text-white font-medium text-lg">{currentUser?.displayName || 'Você'}</span>
        </div>
        <div className="p-3">
           <button onClick={() => setCurrentView('global')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${currentView === 'global' ? 'bg-[#5865F2] text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
              <MessageCircle className="w-5 h-5" /> Global
           </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
          <div className="text-xs font-bold text-zinc-500 mb-3 mt-2 uppercase tracking-wider px-2">Mensagens Privadas</div>
          {dmChats.length === 0 ? (
            <div className="flex flex-col gap-1 items-center justify-center h-32 text-zinc-500 opacity-60">
              <MessagesSquare className="w-8 h-8 mb-2" />
              <p className="text-sm">Nenhuma mensagem</p>
            </div>
          ) : (
            <div className="space-y-1">
               {dmChats.map(chat => {
                  const otherUserId = chat.participants.find((id: string) => id !== currentUser?.uid);
                  const otherUser = chat.usersData?.[otherUserId] || { username: 'Usuário' };
                  const isActive = currentView === 'dm' && activeDmUser?.id === otherUserId;
                  return (
                     <div key={chat.id} onClick={() => handleStartDm({ id: otherUserId, username: otherUser.username, photoURL: otherUser.photoUrl })} className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                        {otherUser.photoUrl ? (
                           <img src={otherUser.photoUrl} alt="Avatar" loading="lazy" width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${getAvatarColor(otherUser.username)}`}>
                             {otherUser.username.charAt(0).toUpperCase()}
                           </div>
                        )}
                        <div className="flex flex-col min-w-0 flex-1 pr-6">
                           <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>{otherUser.username}</span>
                           <span className="text-[10px] text-zinc-400 truncate">{chat.lastMessage}</span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteDm(e, chat.id, otherUserId)}
                          className={`absolute right-2 p-1.5 rounded-md transition-all ${isActive ? 'opacity-100 text-zinc-400 hover:text-red-400 hover:bg-red-500/10' : 'opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 hover:bg-red-500/10'}`}
                          title="Apagar conversa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  )
               })}
            </div>
          )}
        </div>
      </div>

      {/* 2. Área principal */}
      <div className="flex-1 flex flex-col relative h-full bg-[#18181b] min-w-0 min-h-0">
        <div className="h-16 min-h-[64px] border-b border-white/5 flex items-center px-4 lg:px-6 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMobileLeft(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white"><Menu className="w-5 h-5"/></button>
            {currentView === 'global' ? (
               <><h2 className="text-xl font-bold text-white">#Global</h2><MessageCircle className="w-5 h-5 text-green-500" /></>
            ) : (
               <><h2 className="text-xl font-bold text-white">@{activeDmUser?.username}</h2></>
            )}
          </div>
          {currentView === 'global' && (
            <button onClick={() => setShowUsersList(!showUsersList)} className={`p-2 rounded-lg transition-colors flex items-center justify-center ${showUsersList ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}><Users className="w-5 h-5" /></button>
          )}
        </div>

        {currentView === 'global' ? (
           <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar flex flex-col">
             <div className="bg-[#423c21]/80 text-[#e6d08c] px-6 py-3 text-sm flex items-center gap-2 border-b border-[#5e532b] shrink-0">
               <span className="font-bold">[NOTICE]</span> 
               <span>Lembre-se das regras da comunidade! Seja gentil com os outros usuários do Papos.</span>
             </div>
             <div className="mx-6 mt-6 p-4 rounded-xl border border-green-500/50 bg-green-500/10 text-green-100 flex items-start gap-4 shrink-0">
               <Info className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
               <div className="text-sm leading-relaxed">
                 ✨ Bem-vindo(a) ao Papos <LinkIcon className="inline w-3 h-3 mx-1" /> Converse por texto livremente. Escolha um usuário na lista se quiser amizades. Simples, rápido e divertido! ✨🎉
               </div>
             </div>
             <div className="p-6 space-y-5 flex-1 w-full">
               {loading ? (
                 <div className="flex items-center justify-center h-32"><Loader2 className="w-6 h-6 animate-spin text-[#5865F2]" /></div>
               ) : messages.length === 0 ? (
                 <div className="flex items-center justify-center h-32 text-zinc-500">Comece a interagir!</div>
               ) : (
                 <>
                   {messages.map((msg, index) => {
                     const showHeader = index === 0 || messages[index - 1].senderId !== msg.senderId;
                     const msgTime = msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Agora';
                     return (
                       <div key={msg.id} className={`flex gap-4 ${!showHeader ? 'mt-1' : ''} max-w-full group`}>
                         <div className="w-10 min-w-10 shrink-0 flex justify-end">
                           {showHeader ? (
                             <button onClick={() => handleOpenProfile(msg)} className="w-10 h-10 rounded-full overflow-hidden shadow-sm hover:ring-2 hover:ring-[#5865F2] transition-all">
                               {msg.senderPhotoUrl ? (
                                 <img src={msg.senderPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                               ) : (
                                 <div className={`w-full h-full flex items-center justify-center text-white font-bold ${getAvatarColor(msg.senderName)}`}>{msg.senderName.charAt(0).toUpperCase()}</div>
                               )}
                             </button>
                           ) : (
                              <div className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 pr-2 pt-1">{msgTime.slice(0,5)}</div>
                           )}
                         </div>
                         <div className="flex flex-col flex-1 min-w-0 pb-1">
                           {showHeader && (
                             <div className="flex items-baseline gap-2 mb-0.5">
                               <button onClick={() => handleOpenProfile(msg)} className="font-bold text-[#b492f2] hover:underline">{msg.senderName}</button>
                               <span className="text-xs text-zinc-500">{msgTime !== 'Invalid Date' ? msgTime : ''}</span>
                             </div>
                           )}
                           <span className="text-zinc-200 text-[15px] leading-relaxed break-words">{msg.text}</span>
                         </div>
                       </div>
                     );
                   })}
                   <div ref={messagesEndRef} className="h-4" />
                 </>
               )}
             </div>
           </div>
        ) : (
           <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar flex flex-col p-6 space-y-5">
               {dmMessages.length === 0 ? (
                 <div className="flex items-center justify-center h-32 text-zinc-500">Diga um oi para {activeDmUser?.username}!</div>
               ) : (
                 <>
                   {dmMessages.map((msg, index) => {
                     const showHeader = index === 0 || dmMessages[index - 1].senderId !== msg.senderId;
                     const msgTime = msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Agora';
                     return (
                       <div key={msg.id} className={`flex gap-4 ${!showHeader ? 'mt-1' : ''} max-w-full group`}>
                         <div className="w-10 min-w-10 shrink-0 flex justify-end">
                           {showHeader ? (
                             <button onClick={() => handleOpenProfile(msg)} className="w-10 h-10 rounded-full overflow-hidden shadow-sm hover:ring-2 hover:ring-[#5865F2] transition-all">
                               {msg.senderPhotoUrl ? (
                                  <img src={msg.senderPhotoUrl} alt="Avatar" loading="lazy" width={40} height={40} className="w-full h-full object-cover" />
                               ) : (
                                  <div className={`w-full h-full flex items-center justify-center text-white font-bold ${getAvatarColor(msg.senderName)}`}>{msg.senderName.charAt(0).toUpperCase()}</div>
                               )}
                             </button>
                           ) : (
                              <div className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 pr-2 pt-1">{msgTime.slice(0,5)}</div>
                           )}
                         </div>
                         <div className="flex flex-col flex-1 min-w-0 pb-1">
                           {showHeader && (
                             <div className="flex items-baseline gap-2 mb-0.5">
                               <button onClick={() => handleOpenProfile(msg)} className="font-bold text-[#b492f2] hover:underline">{msg.senderName}</button>
                               <span className="text-xs text-zinc-500">{msgTime !== 'Invalid Date' ? msgTime : ''}</span>
                             </div>
                           )}
                           <span className="text-zinc-200 text-[15px] leading-relaxed break-words">{msg.text}</span>
                         </div>
                       </div>
                     );
                   })}
                   <div ref={dmMessagesEndRef} className="h-4" />
                 </>
               )}
           </div>
        )}

        <div className="p-4 bg-[#1e1e1e] border-t border-white/5 shrink-0">
          {errorMessage && (
            <div className="mb-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-300">×</button>
            </div>
          )}
          <form onSubmit={currentView === 'global' ? handleSendMessage : handleSendDm} className="flex gap-3 bg-[#2a2a2a] rounded-lg px-2 py-2 items-end">
            <textarea
              value={currentView === 'global' ? newMessage : newDmMessage}
              onChange={(e) => currentView === 'global' ? setNewMessage(e.target.value) : setNewDmMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  currentView === 'global' ? handleSendMessage(e) : handleSendDm(e);
                }
              }}
              disabled={currentView === 'global' ? (sending || cooldown > 0) : sendingDm}
              placeholder={currentView === 'global' && cooldown > 0 ? `Aguarde ${cooldown}s...` : "Enviar uma mensagem..."}
              className="flex-1 bg-transparent border-none px-3 py-2 text-[15px] text-white focus:outline-none focus:ring-0 resize-none max-h-32 min-h-[44px] custom-scrollbar disabled:opacity-50"
              rows={1}
            />
            <div className="flex items-center gap-2 pb-1 shrink-0">
              <button type="button" className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"><Smile className="w-5 h-5" /></button>
              <button
                type="submit"
                disabled={currentView === 'global' ? (!newMessage.trim() || sending || cooldown > 0) : (!newDmMessage.trim() || sendingDm)}
                className="w-10 h-10 rounded-md bg-[#5865F2] hover:bg-[#6f7bf7] text-white flex items-center justify-center transition-colors disabled:opacity-50 relative group"
              >
                {(currentView === 'global' ? sending : sendingDm) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4 ml-1" />}
                {currentView === 'global' && cooldown > 0 && <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center text-xs font-bold pointer-events-none">{cooldown}</div>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Sidebar Direita (Usuários / Perfil) */}
      {showUsersList && (
        <div className="absolute xl:relative right-0 z-30 w-[280px] h-full bg-[#1e1e1e] border-l border-white/5 flex flex-col shrink-0 shadow-2xl xl:shadow-none animate-in slide-in-from-right-full xl:animate-none duration-300">
          {rightView === 'users' ? (
             <>
                <div className="h-16 border-b border-white/5 flex items-center px-4 shrink-0 shadow-sm">
                  <span className="text-sm font-medium text-zinc-300 tracking-wide uppercase text-[11px]">{activeUsers.length || 0} online agora</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-1">
                  {activeUsers.map(u => (
                    <div key={u.id} onClick={() => handleOpenProfile(u)} className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group overflow-hidden">
                      {u.bannerUrl && <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${u.bannerUrl})` }} />}
                      <div className="relative shrink-0 z-10">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="Avatar" loading="lazy" width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${getAvatarColor(u.username || 'U')}`}>{(u.username || 'U').charAt(0).toUpperCase()}</div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-[#1e1e1e]"></div>
                      </div>
                      <div className="flex flex-col min-w-0 z-10">
                        <span className={`text-sm font-medium truncate ${u.id === currentUser?.uid ? 'text-[#b492f2]' : 'text-zinc-300 group-hover:text-white'}`}>{u.username || 'Usuário'}</span>
                        {u.about && <span className="text-[10px] text-zinc-500 truncate">{u.about}</span>}
                      </div>
                    </div>
                  ))}
                </div>
             </>
          ) : (
             <div className="flex-1 overflow-y-auto flex flex-col pt-0 relative custom-scrollbar bg-[#18181b]">
                <button onClick={() => setRightView('users')} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/60 shadow-lg text-white flex items-center justify-center z-20 hover:bg-black/80 transition-colors"> <ArrowLeft className="w-4 h-4" /> </button>
                {selectedUser?.bannerUrl ? (
                  <div className="h-32 w-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${selectedUser.bannerUrl})`, backgroundPosition: `center ${selectedUser?.bannerPosition || 50}%` }} />
                ) : (
                  <div className="h-32 w-full bg-[#5865F2]" />
                )}
                <div className="px-5 pb-5 -mt-12 relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-3">
                        {selectedUser?.photoURL || selectedUser?.senderPhotoUrl ? (
                           <img src={selectedUser.photoURL || selectedUser.senderPhotoUrl} alt="Avatar" loading="lazy" width={96} height={96} className="w-24 h-24 rounded-full object-cover border-[6px] border-[#18181b] shadow-xl bg-zinc-800" />
                        ) : (
                           <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-[6px] border-[#18181b] shadow-xl bg-zinc-800 ${getAvatarColor(selectedUser?.username || selectedUser?.senderName || 'U')}`}>
                              {(selectedUser?.username || selectedUser?.senderName || 'U').charAt(0).toUpperCase()}
                           </div>
                        )}
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-[3px] border-[#18181b]"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {selectedUser?.username || selectedUser?.senderName || 'Usuário'}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-3 px-2 leading-relaxed">{selectedUser?.about || selectedUser?.bio || 'Nenhuma biografia disponível no momento.'}</p>
                    
                    {selectedUser?.id !== currentUser?.uid && selectedUser?.senderId !== currentUser?.uid && (
                       <button onClick={() => handleStartDm(selectedUser)} className="mt-6 w-full py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-medium transition-all shadow-lg hover:shadow-[#5865F2]/20 flex items-center justify-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Enviar Mensagem
                       </button>
                    )}
                 </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
