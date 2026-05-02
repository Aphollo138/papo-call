export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  popular?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Como fazer amigos online em 2026",
    slug: "como-fazer-amigos-online",
    excerpt: "Descubra as melhores dicas para superar a timidez e construir amizades verdadeiras no ambiente digital.",
    content: `
      <h2>A internet diminuiu distâncias</h2>
      <p>Nos dias de hoje, fazer amizades não se limita mais ao seu bairro ou escola. A internet abriu portas para conectarmos com pessoas do mundo todo que compartilham de nossos mesmos interesses.</p>
      
      <h3>1. Seja você mesmo</h3>
      <p>A regra de ouro da internet: a autenticidade atrai as pessoas certas. Não tente criar um personagem, mostre seus verdadeiros gostos e opiniões.</p>

      <h3>2. Participe de comunidades do seu interesse</h3>
      <p>Se você ama jogos, procure chats de gamers. Se ama leitura, fóruns de livros. Iniciar uma conversa com um assunto em comum quebra o gelo rapidamente.</p>

      <div class="my-8 p-6 bg-[#5865F2]/10 rounded-2xl border border-[#5865F2]/20 flex flex-col items-center text-center">
        <h4 class="text-xl font-bold text-white mb-2">Pronto para colocar isso em prática?</h4>
        <p class="text-zinc-400 mb-4">Milhares de pessoas estão conversando agora no Papos.</p>
        <button class="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all hover:scale-105 cta-chat">
          Entrar no Chat Agora
        </button>
      </div>

      <h3>3. Mantenha a segurança sempre em primeiro lugar</h3>
      <p>Nunca compartilhe informações pessoais logo de cara. Construa a confiança aos poucos, mantendo-se em ambientes seguros e moderados.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "02 Mai 2026",
    author: "Equipe Papos",
    popular: true
  },
  {
    title: "5 Melhores sites de chat para conhecer pessoas",
    slug: "melhores-sites-de-chat",
    excerpt: "Analisamos as principais plataformas de conversação online para te ajudar a escolher a melhor comunidade.",
    content: `
      <h2>Onde estão as melhores conversas?</h2>
      <p>A internet está cheia de opções, mas escolher o site de chat certo pode fazer toda a diferença na sua experiência. Avaliamos segurança, moderação e facilidade de uso.</p>
      
      <h3>A Importância da Moderação</h3>
      <p>Sites de chat antigos muitas vezes sofriam com falta de moderação. Hoje, as melhores plataformas usam tanto automação quanto moderadores humanos para garantir um ambiente seguro.</p>

      <div class="my-8 p-6 bg-gradient-to-r from-zinc-900 to-[#1e1f22] rounded-2xl border border-white/10">
        <h4 class="text-lg font-bold text-[#5865F2] mb-2">Dica de Especialista</h4>
        <p class="text-zinc-300">Sempre prefira plataformas que exigem algum nível de autenticação (como Google ou Email), pois isso reduz drasticamente a presença de bots e pessoas mal-intencionadas.</p>
      </div>
      
      <h3>Chats por Voz vs Texto</h3>
      <p>Algumas pessoas preferem a calma do texto, enquanto outras adoram a emoção da voz. As melhores plataformas oferecem ambos, permitindo que você mude conforme seu humor.</p>

      <div class="my-8 flex justify-center">
        <button class="px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:scale-105 flex items-center gap-2 cta-chat">
          Conheça o Papos - O Chat do Futuro <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    `,
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "28 Abr 2026",
    author: "Laura Mendes",
    popular: true
  },
  {
    title: "Como conversar com desconhecidos com segurança",
    slug: "como-conversar-com-seguranca",
    excerpt: "Privacidade e cuidado: o guia definitivo para você fazer amizades online sem correr riscos.",
    content: `
      <h2>Privacidade acima de tudo</h2>
      <p>Fazer amigos na internet é maravilhoso, mas a sua segurança deve vir em primeiro lugar. Aqui estão regras indispensáveis para quem quer socializar tranquilamente.</p>
      
      <h3>O que NUNCA compartilhar</h3>
      <p>Endereço completo, nome da sua escola ou trabalho local, dados bancários e senhas. Parece óbvio, mas em conversas envolventes, é fácil relaxar demais.</p>
      
      <div class="my-8 p-6 bg-[#5865F2]/10 rounded-2xl border border-[#5865F2]/20 flex flex-col items-center text-center">
        <h4 class="text-xl font-bold text-white mb-2">Comunidade Segura</h4>
        <p class="text-zinc-400 mb-4">No Papos, investimos em tecnologia avançada para banir spam e comportamentos tóxicos rapidamente.</p>
        <button class="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all hover:scale-105 cta-chat">
          Crie sua conta gratuita
        </button>
      </div>
    `,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "15 Abr 2026",
    author: "Equipe de Segurança"
  },
  {
    title: "Apps e plataformas para conversar por voz",
    slug: "apps-conversar-por-voz",
    excerpt: "Saia do tédio do texto e descubra como as conexões através da voz são muito mais profundas.",
    content: `
      <h2>O poder incrível do áudio</h2>
      <p>Enquanto o texto pode ser mal interpretado, a voz traz nuances, emoções e um calor humano que é impossível de replicar em letras de teclado.</p>
      
      <h3>Quebrando a barreira inicial</h3>
      <p>Entrar em uma call com desconhecidos pode dar um frio na barriga. A dica é entrar como ouvinte primeiro, entender a 'vibe' da sala e então se apresentar puxando um assunto em comum.</p>

      <div class="my-8 flex justify-center">
        <button class="px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:scale-105 flex items-center gap-2 cta-chat">
          Experimente nossas Calls de Áudio <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    `,
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "05 Abr 2026",
    author: "Equipe Papos"
  },
  {
    title: "5 Dicas contra o tédio online",
    slug: "dicas-contra-tedio-online",
    excerpt: "Cansado de rolar o feed infinitamente? Veja formas ativas de aproveitar seu tempo na internet.",
    content: `
      <h2>Pare de ser um espectador</h2>
      <p>O tédio online frequentemente vem de um consumo passivo de conteúdo (como rolar infinitamente redes sociais). O segredo é se tornar um participante ativo.</p>
      
      <h3>1. Engaje em discussões reais</h3>
      <p>Encontre tópicos que você domina e entre em chats sobre eles. A troca de ideias ativa o cérebro de formas que um vídeo curto jamais conseguirá.</p>

      <h3>2. Conheça pessoas fora da sua bolha</h3>
      <p>Procurar conversar com pessoas de diferentes regiões, idades ou interesses expande muito sua visão de mundo e garante conversas fascinantes.</p>
      
      <div class="my-8 p-6 bg-[#5865F2]/10 rounded-2xl border border-[#5865F2]/20 flex flex-col items-center text-center">
        <h4 class="text-xl font-bold text-white mb-2">Acabe com o tédio agora</h4>
        <p class="text-zinc-400 mb-4">Encontre alguém legal para conversar em menos de 1 minuto.</p>
        <button class="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all hover:scale-105 cta-chat">
          Buscar Pareamento de Chat
        </button>
      </div>
    `,
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "20 Mar 2026",
    author: "Rafael"
  }
];
