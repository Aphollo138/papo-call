import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare, Share2 } from 'lucide-react';
import PublicHeader from './PublicHeader';
import { blogPosts, BlogPost as BlogPostType } from './data';

interface BlogPostProps {
  slug: string;
  onNavigate: (state: any, data?: any) => void;
}

export default function BlogPost({ slug, onNavigate }: BlogPostProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      document.title = `${post.title} | Blog Papos`;
      // In a real app we'd update meta description here as well for SEO.
    }
  }, [post]);

  useEffect(() => {
    // Add event listeners to dynamically injected CTO buttons
    if (contentRef.current) {
      const ctas = contentRef.current.querySelectorAll('.cta-chat');
      const clickHandler = () => onNavigate('register');
      
      ctas.forEach(cta => {
        cta.addEventListener('click', clickHandler);
      });

      return () => {
        ctas.forEach(cta => {
          cta.removeEventListener('click', clickHandler);
        });
      };
    }
  }, [post, onNavigate]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0d0e11] flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
        <button onClick={() => onNavigate('blog_list')} className="text-[#5865F2] hover:underline">
          Voltar para o blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e11] font-sans selection:bg-[#5865F2]/30">
      <PublicHeader onNavigate={onNavigate} activePath="blog" />

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        
        <button 
          onClick={() => onNavigate('blog_list')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o Blog
        </button>

        <article>
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center gap-3 text-sm text-[#5865F2] font-black mb-6 uppercase tracking-[0.2em]">
              <span>{post.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#5865F2]/40" />
              <span>{post.author}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1] tracking-tight mb-12 text-balance">
              {post.title}
            </h1>
            
            <div className="w-full aspect-video md:aspect-[21/9] rounded-[2.5rem] overflow-hidden relative shadow-2xl mb-12 border border-white/5 group">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </div>

          <div 
            ref={contentRef}
            className="blog-content max-w-3xl mx-auto mb-24"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* New Humanized Author Card */}
          <div className="bg-[#1e1f22] border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865F2]/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-[#5865F2]/20 transition-all duration-700" />
            
            <div className="relative shrink-0">
               <div className="w-32 h-32 rounded-[2rem] border-4 border-white/10 overflow-hidden bg-zinc-800 shadow-2xl transform md:-rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <img src={post.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author}`} alt={post.author} className="w-full h-full object-cover" />
               </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-[#5865F2] font-black text-xs uppercase tracking-widest mb-1">Escrito por</p>
                <h4 className="text-3xl font-black text-white">{post.author}</h4>
              </div>
              <p className="text-zinc-400 text-lg leading-relaxed italic">
                "{post.authorBio || 'Apaixonado por criar conexões humanas genuínas através da tecnologia.'}"
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white text-white hover:text-black font-black text-xs rounded-xl transition-all uppercase tracking-widest">
                   <Share2 className="w-4 h-4" /> Compartilhar
                 </button>
              </div>
            </div>
          </div>
        </article>

      </main>

      {/* Floating CTA for long articles */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[400px]"
      >
        <button 
          onClick={() => onNavigate('register')}
          className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(88,101,242,0.4)] flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 border border-white/10"
        >
          <MessageSquare className="w-6 h-6" />
          Entrar no chat agora
        </button>
      </motion.div>

    </div>
  );
}
