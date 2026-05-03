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
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[#5865F2] font-bold mb-4 uppercase tracking-wider">
              <span>{post.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span>{post.author}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
              {post.title}
            </h1>
            
            <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden relative shadow-2xl mb-12">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div 
            ref={contentRef}
            className="blog-content max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-16 pt-8 border-t border-white/10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white text-xl">
               {post.author.charAt(0)}
             </div>
             <div>
               <p className="text-white font-bold text-sm">Escrito por {post.author}</p>
               <p className="text-zinc-400 text-xs">Ajudando a conectar pessoas</p>
             </div>
           </div>
           
           <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-300 transition-colors text-sm font-medium">
             <Share2 className="w-4 h-4" /> Compartilhar Artigo
           </button>
        </div>

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
