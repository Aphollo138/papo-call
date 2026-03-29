import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Loader2 } from 'lucide-react';
import { auth, db } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface CompleteProfileProps {
  userData: any;
  onComplete: () => void;
  key?: string;
}

export default function CompleteProfile({ userData, onComplete }: CompleteProfileProps) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [displayName, setDisplayName] = useState(userData?.name || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: photoUrl || null
        });
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          nomePerfil: displayName,
          displayName: displayName,
          photoUrl: photoUrl,
          profileComplete: true
        });
      }
      onComplete();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative z-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo ao Papos!</h2>
          <p className="text-zinc-400 text-sm">Vamos configurar seu perfil.</p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full bg-zinc-950 border-2 border-dashed border-white/20 flex items-center justify-center mb-4 overflow-hidden relative group cursor-pointer hover:border-[#5865F2] transition-colors"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : displayName ? (
              <span className="text-5xl font-bold text-zinc-500 group-hover:text-[#5865F2] transition-colors">{displayName.charAt(0).toUpperCase()}</span>
            ) : (
              <User className="w-12 h-12 text-zinc-500 group-hover:text-[#5865F2] transition-colors" />
            )}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Escolher Foto</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-full space-y-1 mt-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-center block">Ou cole o Link da Foto (URL)</label>
            <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#5865F2] transition-all text-center" placeholder="https://..." />
          </div>
        </div>

        <div className="space-y-1 mb-8">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Seu Nome de Perfil</label>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all" placeholder="Como os outros te verão na call" />
        </div>

        <button onClick={handleComplete} disabled={loading || !displayName} className="w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalizar e Começar a Falar'}
        </button>
      </motion.div>
    </div>
  );
}
