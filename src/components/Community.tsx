import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Loader2, Smile, Trash2 } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, arrayRemove, arrayUnion, deleteDoc } from 'firebase/firestore';

export default function Community() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Usuário',
        authorPhoto: currentUser.photoURL || '',
        content,
        likes: [],
        createdAt: serverTimestamp()
      });
      setContent('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error adding post:", error);
    }
    setLoading(false);
  };

  const handleLike = async (postId: string, currentLikes: string[]) => {
    if (!currentUser) return;
    const postRef = doc(db, 'posts', postId);
    try {
      if (currentLikes.includes(currentUser.uid)) {
        await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      console.log("Post deletado!");
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setContent(prevInput => prevInput + emojiObject.emoji);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 pt-6 px-4 md:px-6 w-full max-w-2xl mx-auto custom-scrollbar">
      <h2 className="text-2xl font-bold text-white mb-6 px-2">Comunidade</h2>
      
      <form onSubmit={handlePost} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 mb-8 flex gap-3 relative">
        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-zinc-400">{currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            className="w-full bg-transparent text-white focus:outline-none resize-none placeholder:text-zinc-600 text-lg" 
            placeholder="O que podemos melhorar no Papos?" 
            rows={2}
            required
          />
          <div className="flex justify-between items-center">
            <div className="relative" ref={emojiPickerRef}>
              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute z-50 mt-2 left-0"
                  >
                    <EmojiPicker 
                      onEmojiClick={onEmojiClick}
                      theme={Theme.DARK}
                      searchDisabled={true}
                      skinTonesDisabled={true}
                      width={300}
                      height={350}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit" 
              disabled={loading || !content.trim()}
              className="px-6 py-2 rounded-full bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Postar'}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">Nenhuma postagem ainda. Seja o primeiro!</p>
        ) : (
          posts.map(post => {
            const isLiked = currentUser && post.likes?.includes(currentUser.uid);
            const isAuthor = currentUser && post.authorId === currentUser.uid;
            
            return (
              <div key={post.id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex gap-3 group relative">
                <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                  {post.authorPhoto ? (
                    <img src={post.authorPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-zinc-400">{post.authorName?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{post.authorName}</span>
                      <span className="text-zinc-500 text-sm">@{post.authorName.toLowerCase().replace(/\\s+/g, '')}</span>
                    </div>
                    
                    {isAuthor && (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Excluir postagem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-zinc-300 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(post.id, post.likes || [])}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-400'}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
