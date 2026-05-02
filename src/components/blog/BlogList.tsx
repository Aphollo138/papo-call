import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Users2 } from 'lucide-react';
import PublicHeader from './PublicHeader';
import { blogPosts, BlogPost } from './data';

interface BlogListProps {
  onNavigate: (state: any, data?: any) => void;
}

export default function BlogList({ onNavigate }: BlogListProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Blog Papos - Dicas, Amizades e Segurança Online';
  }, []);

  const popularPosts = blogPosts.filter(p => p.popular);
  const otherPosts = blogPosts.filter(p => !p.popular);

  return (
    <div className="min-h-screen bg-[#0d0e11] font-sans selection:bg-[#5865F2]/30">
      <PublicHeader onNavigate={onNavigate} activePath="blog" />
      
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Top Highlight Section */}
        <div className="bg-gradient-to-r from-[#5865F2]/10 to-fuchsia-500/10 border border-[#5865F2]/20 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Aprenda a fazer amigos online e conversar com pessoas reais
            </h1>
            <p className="text-lg text-zinc-300 font-medium max-w-2xl">
              Descubra dicas de segurança, plataformas ideais e como quebrar o gelo para construir amizades verdadeiras do conforto de casa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => onNavigate('register')}
                className="px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(88,101,242,0.4)] flex items-center justify-center gap-2"
              >
                Começar a Conversar <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="hidden lg:flex w-72 h-72 rounded-full border-[8px] border-[#1e1f22] bg-zinc-800 shadow-2xl items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2] to-fuchsia-500 opacity-20"></div>
             <Users2 className="w-32 h-32 text-white opacity-80" />
          </div>
        </div>

        <div className="space-y-16">
          {/* Top Posts */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Em Alta no Papos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPosts.map((post, idx) => (
                <BlogCard key={post.slug} post={post} onNavigate={onNavigate} index={idx} />
              ))}
            </div>
          </section>

          {/* All Posts */}
          <section>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-8">Últimos Artigos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post, idx) => (
                <BlogCard key={post.slug} post={post} onNavigate={onNavigate} index={idx} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Conversion Banner Bottom */}
      <div className="bg-[#1e1f22] border-t border-white/5 py-24 px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Pronto para sair do tédio?</h2>
        <p className="text-zinc-400 mb-10 max-w-xl mx-auto text-lg">
          Junte-se a milhares de pessoas conversando agora e crie conexões que vão além da tela.
        </p>
        <button 
          onClick={() => onNavigate('register')}
          className="px-10 py-5 bg-white text-[#111214] font-bold rounded-xl text-lg hover:bg-gray-200 transition-all hover:scale-105 shadow-xl inline-flex items-center gap-2"
        >
          Entrar no Chat Agora
        </button>
      </div>

      <footer className="bg-[#111214] py-12 border-t border-white/5 text-center text-zinc-500 text-sm">
         <p>&copy; 2026 Papos Chat. O blog oficial sobre amizades na internet.</p>
      </footer>
    </div>
  );
}

function BlogCard({ post, onNavigate, index }: { post: BlogPost, onNavigate: any, index: number }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#1e1f22] border border-white/5 rounded-2xl overflow-hidden hover:border-[#5865F2]/50 transition-colors group flex flex-col h-full shadow-lg"
    >
      <div className="h-48 overflow-hidden relative cursor-pointer" onClick={() => onNavigate('blog_post', { slug: post.slug })}>
        <div className="absolute inset-0 bg-[#5865F2]/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium mb-3">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span>{post.author}</span>
        </div>
        <h3 
          className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#5865F2] transition-colors cursor-pointer"
          onClick={() => onNavigate('blog_post', { slug: post.slug })}
        >
          {post.title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
          {post.excerpt}
        </p>
        <button 
          onClick={() => onNavigate('blog_post', { slug: post.slug })}
          className="text-[#5865F2] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all self-start w-full py-3 bg-white/5 hover:bg-[#5865F2]/10 rounded-xl justify-center"
        >
          Ler Artigo Completo <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
}
