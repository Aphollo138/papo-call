import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

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

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const currentUser = auth.currentUser;
  
  const [photoURL, setPhotoURL] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerPosition, setBannerPosition] = useState(50);
  const [bio, setBio] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    setPhotoURL(currentUser.photoURL || '');
    
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.bannerUrl) setBannerUrl(data.bannerUrl);
          if (data.bannerPosition !== undefined) setBannerPosition(data.bannerPosition);
          if (data.bio) setBio(data.bio);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setFetching(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (photoURL !== currentUser.photoURL) {
        await updateProfile(currentUser, { photoURL });
      }

      await setDoc(doc(db, 'users', currentUser.uid), {
        photoURL,
        bannerUrl,
        bannerPosition,
        bio,
        updatedAt: new Date()
      }, { merge: true });

      onClose();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Editar Perfil</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          {/* Preview Area */}
          <div className="relative">
            {/* Banner */}
            <div 
              className="h-32 w-full bg-zinc-800"
              style={{
                backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'linear-gradient(to right, #4f46e5, #9333ea)',
                backgroundSize: 'cover',
                backgroundPosition: `center ${bannerPosition}%`
              }}
            />
            
            {/* Avatar */}
            <div className="absolute top-20 left-4">
              <div className="w-20 h-20 rounded-full border-4 border-zinc-900 bg-zinc-800 overflow-hidden flex items-center justify-center">
                {photoURL ? (
                  <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-zinc-400">
                    {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>

            {/* Name & Bio Preview */}
            <div className="mt-10 px-4 pb-4 border-b border-white/5">
              <h3 className="text-xl font-bold text-white leading-tight">
                {currentUser?.displayName || 'Usuário'}
              </h3>
              <p className="text-sm text-zinc-400 mt-1 break-words">
                {bio || 'Nenhuma bio definida ainda.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">URL da Foto de Perfil</label>
              <input 
                type="text" 
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://exemplo.com/foto.png"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#5865F2] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">URL do Banner</label>
              <input 
                type="text" 
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://exemplo.com/banner.png"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#5865F2] transition-colors mb-3"
              />
              
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Banners Animados (Presets)</label>
              <div className="grid grid-cols-4 gap-2">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-zinc-400 uppercase">Posição do Banner</label>
                <span className="text-xs text-zinc-500">{bannerPosition}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={bannerPosition}
                onChange={(e) => setBannerPosition(Number(e.target.value))}
                className="w-full accent-[#5865F2] h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Sobre mim</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conte um pouco sobre você..."
                rows={3}
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#5865F2] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-white/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white hover:underline disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
