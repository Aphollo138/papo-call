import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Loader2 } from 'lucide-react';
import { auth, db } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const PRESET_BANNERS = [
  { name: 'Synthwave', url: 'https://media.tenor.com/Yh6Jaus-YuQAAAAC/city-sunset.gif' },
  { name: 'Pixel Night', url: 'https://media.tenor.com/ZJ1Yl5kYEUUAAAAC/pixel-art-city.gif' },
  { name: 'Lofi Anime', url: 'https://media.tenor.com/Mqku-ywxNEIAAAAC/kagome-inuyasha.gif' },
  { name: 'Cyberpunk', url: 'https://media.tenor.com/YvNg4lPfMbYAAAAC/cinemagraph-rain.gif' },
  { name: 'Deep Space', url: 'https://media.tenor.com/m2ArosH-_ogAAAAC/space-universe.gif' },
  { name: 'Mystic Forest', url: 'https://media.tenor.com/IQOFfIkrzwAAAAAC/magical-melody-forest.gif' },
  { name: 'Ocean Waves', url: 'https://media.tenor.com/lPUBoNehwZcAAAAC/aesthetic-waves.gif' },
  { name: 'Rainy Window', url: 'https://media.tenor.com/3e5xTKIkoJYAAAAC/aesthetic-anime.gif' },
  { name: 'Cozy Coffee', url: 'https://media.tenor.com/plgSCZLAgFIAAAAC/coffee-time-coffee.gif' },
  { name: 'Night Drift', url: 'https://media.tenor.com/wz0TyWSKWmAAAAAC/initial-d-snow.gif' },
  { name: 'Neon Abstract', url: 'https://media.tenor.com/cKRRrkh1J_YAAAAC/banner-abstract.gif' },
  { name: 'Vaporwave', url: 'https://media.tenor.com/KdoPEvR2KLIAAAAC/statue-vaporwave.gif' },
  { name: 'Pixel Campfire', url: 'https://media.tenor.com/f3qNOW4H2wgAAAAC/shovel-knight.gif' },
  { name: 'Anime Scenery', url: 'https://media.tenor.com/1tG-7wnYePgAAAAC/blaze-stream.gif' },
  { name: 'Galaxy Space', url: 'https://media.tenor.com/Fni772pdGu8AAAAC/galaxy-space.gif' },
  { name: 'Cherry Blossom', url: 'https://media.tenor.com/n5hx8o_gzXkAAAAC/yasmina.gif' },
];

interface CompleteProfileProps {
  userData: any;
  onComplete: () => void;
  key?: string;
}

export default function CompleteProfile({ userData, onComplete }: CompleteProfileProps) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [displayName, setDisplayName] = useState(userData?.name || '');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bio, setBio] = useState('');
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
          bannerUrl: bannerUrl,
          bio: bio,
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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center sm:p-6 relative z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full h-full sm:h-auto sm:max-w-2xl bg-zinc-900 sm:rounded-2xl border-0 sm:border border-white/5 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 sm:p-8 border-b border-white/5 shrink-0">
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo ao Papos!</h2>
          <p className="text-zinc-400 text-sm">Vamos configurar seu perfil para a galera te conhecer.</p>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 p-6 sm:p-8 space-y-8">
          
          {/* Preview Section */}
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Preview do Perfil</h3>
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-zinc-950">
              {/* Banner */}
              <div 
                className="h-32 w-full bg-zinc-800 transition-all duration-300"
                style={{
                  backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'linear-gradient(to right, #4f46e5, #9333ea)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 50%'
                }}
              />
              
              {/* Avatar */}
              <div className="absolute top-20 left-4">
                <div className="w-20 h-20 rounded-full border-4 border-zinc-950 bg-zinc-800 overflow-hidden flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : displayName ? (
                    <span className="text-3xl font-bold text-zinc-500">{displayName.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User className="w-10 h-10 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Name & Bio Preview */}
              <div className="mt-10 px-4 pb-4">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {displayName || 'Seu Nome'}
                </h3>
                <p className="text-sm text-zinc-400 mt-1 break-words">
                  {bio || 'Sua bio aparecerá aqui...'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Seu Nome de Perfil</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all" placeholder="Como os outros te verão" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Foto de Perfil</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 shrink-0 rounded-full bg-zinc-950 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-[#5865F2] transition-colors"
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-zinc-500 group-hover:text-[#5865F2] transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider text-center">Mudar</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="w-full space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Ou cole o Link da Foto (URL)</label>
                  <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#5865F2] transition-all" placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Banner do Perfil</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_BANNERS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBannerUrl(preset.url)}
                    className={`h-12 rounded-lg border-2 overflow-hidden transition-all ${bannerUrl === preset.url ? 'border-[#5865F2] scale-105 shadow-[0_0_10px_rgba(88,101,242,0.5)]' : 'border-transparent hover:border-white/20 opacity-70 hover:opacity-100'}`}
                    style={{
                      backgroundImage: `url(${preset.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
              <div className="w-full space-y-1 mt-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Ou cole o Link do Banner (URL)</label>
                <input type="url" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#5865F2] transition-all" placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Sobre mim (Bio)</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-all resize-none" 
                placeholder="Conte um pouco sobre você..." 
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t border-white/5 bg-zinc-900 shrink-0">
          <button onClick={handleComplete} disabled={loading || !displayName} className="w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#6f7bf7] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar na Home'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
