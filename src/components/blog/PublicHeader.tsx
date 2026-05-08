import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Menu, X } from 'lucide-react';

interface PublicHeaderProps {
  onNavigate: (state: any) => void;
  activePath: 'home' | 'chat' | 'blog';
}

export default function PublicHeader({ onNavigate, activePath }: PublicHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#111214]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('landing')} 
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center p-1">
              <img 
                src="https://i.postimg.cc/jDfHpdjL/image.png" 
                alt="Papos Logo" 
                className="w-full h-full object-contain brightness-0 invert" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">Papos</span>
          </button>

          <nav className="hidden md:flex items-center gap-8 bg-zinc-900/50 px-6 py-2 rounded-full border border-white/5">
            <button 
              onClick={() => onNavigate('landing')} 
              className={`text-sm font-bold transition-all ${activePath === 'home' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('register')} 
              className={`text-sm font-bold transition-all ${activePath === 'chat' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Chat
            </button>
            <button 
              onClick={() => onNavigate('blog_list')} 
              className={`text-sm font-bold transition-all relative ${activePath === 'blog' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Blog
              {activePath === 'blog' && (
                <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#5865F2] rounded-full" />
              )}
            </button>
            <button 
              onClick={() => onNavigate('about')} 
              className="text-sm font-bold text-zinc-400 hover:text-white transition-all"
            >
              Sobre
            </button>
            <button 
              onClick={() => onNavigate('contact')} 
              className="text-sm font-bold text-zinc-400 hover:text-white transition-all"
            >
              Contato
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('login')} 
              className="hidden sm:flex text-sm font-bold px-6 py-2.5 rounded-full bg-[#5865F2] text-white hover:bg-[#4752C4] transition-all hover:-translate-y-0.5 shadow-[0_0_15px_rgba(88,101,242,0.4)] items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Entrar no Chat
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 w-full bg-[#111214] border-b border-white/5 z-40 md:hidden shadow-2xl pt-2 pb-6 px-6 flex flex-col gap-4"
          >
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing'); }} 
              className={`text-lg font-bold text-left py-2 ${activePath === 'home' ? 'text-white' : 'text-zinc-400'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('register'); }} 
              className={`text-lg font-bold text-left py-2 ${activePath === 'chat' ? 'text-white' : 'text-zinc-400'}`}
            >
              Chat
            </button>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('blog_list'); }} 
              className={`text-lg font-bold text-left py-2 ${activePath === 'blog' ? 'text-white' : 'text-zinc-400'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('about'); }} 
              className="text-lg font-bold text-left py-2 text-zinc-400"
            >
              Sobre Nós
            </button>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('contact'); }} 
              className="text-lg font-bold text-left py-2 text-zinc-400"
            >
              Fale Conosco
            </button>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('login'); }} 
              className="mt-4 w-full text-base font-bold px-6 py-3.5 rounded-xl bg-[#5865F2] text-white hover:bg-[#4752C4] transition-all shadow-[0_0_15px_rgba(88,101,242,0.4)] flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Entrar no Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
