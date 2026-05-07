export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  popular?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    title: "A Arte de Escutar: Por que conexões por voz são mais profundas",
    slug: "arte-de-escutar-conexoes-voz",
    excerpt: "Em um mundo dominado por textos frios, a voz humana resgata a empatia e cria laços que as letras não conseguem.",
    content: `
      <p class="mb-6">O resgate da humanidade na comunicação moderna é um desafio que enfrentamos diariamente. Vivemos em uma era onde a maioria das nossas interações acontece através de uma tela, mediada por textos curtos, abreviações e emojis. Embora esse formato seja inegavelmente prático para o dia a dia, ele muitas vezes remove a "alma" da conversa, transformando diálogos significativos em meras trocas de dados.</p>
      
      <p class="mb-6">Falar e ouvir são atos ancestrais que moldaram nossa evolução social. Quando ouvimos a voz de alguém, nosso cérebro processa muito mais do que apenas palavras. Captamos micro-expressões sonoras que o texto jamais poderia replicar: uma pequena hesitação antes de uma confissão, o brilho sonoro de uma risada genuína, ou aquele suspiro que diz "eu te entendo". Esses elementos formam a base biológica da <strong>empatia</strong>.</p>

      <h2 class="text-3xl font-black mt-12 mb-6">A Vulnerabilidade gera Conexão</h2>
      <p class="mb-6">Falar exige mais coragem do que digitar. Quando digitamos, temos o botão de apagar; podemos editar nossa personalidade até que ela pareça perfeita. Ao usar a voz, nos mostramos mais vulneráveis, e é justamente nessa vulnerabilidade que as amizades verdadeiras encontram solo fértil para florescer.</p>
      
      <p class="mb-6">No Papos, observamos esse fenômeno todos os dias: pessoas de diferentes estados e realidades sociais que começam como completos estranhos e, após 15 ou 20 minutos de conversa por voz, sentem que compartilham uma conexão mais robusta do que com "amigos" de rede social de longa data. Isso ocorre porque o som da voz ativa áreas do cérebro ligadas ao afeto e ao pertencimento.</p>

      <div class="my-10 p-10 bg-gradient-to-br from-[#5865F2] to-[#404EED] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full -mr-16 -mt-16"></div>
        <h4 class="text-2xl font-black mb-6 italic leading-tight">"A voz não é apenas um canal de informação; é um transporte de sentimentos e intenções que transcende o vocabulário."</h4>
        <p class="text-white/80 text-xl font-medium leading-relaxed italic border-l-4 border-white/30 pl-6">Ricardo Silva, Especialista em Comunicação Humana.</p>
      </div>

      <h2 class="text-3xl font-black mt-12 mb-6">Como ser um ouvinte que as pessoas amam</h2>
      <p class="mb-6">Para criar essas conexões profundas, o segredo não reside apenas na eloquência do falar, mas na <strong>escuta ativa</strong>. Escutar ativamente significa dar ao outro o presente da sua total atenção. Em um mundo cheio de notificações, estar 100% presente em uma conversa é o maior elogio que você pode fazer a alguém.</p>
      
      <ul class="space-y-4 mb-8 list-none">
        <li class="flex items-start gap-4 p-4 bg-zinc-900/40 rounded-2xl border border-white/5">
          <div class="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center font-bold shrink-0">1</div>
          <p class="text-zinc-300"><span class="text-white font-bold">Faça perguntas abertas:</span> Em vez de "Você gosta disso?", tente "O que nessa experiência mais te marcou?". Isso convida o outro a compartilhar mais nuances.</p>
        </li>
        <li class="flex items-start gap-4 p-4 bg-zinc-900/40 rounded-2xl border border-white/5">
          <div class="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center font-bold shrink-0">2</div>
          <p class="text-zinc-300"><span class="text-white font-bold">Respeite as pausas:</span> O silêncio na voz não é tédio, muitas vezes é reflexão. Aprender a não interromper o pensamento alheio é o que diferencia um bom papo de uma conversa ansiosa.</p>
        </li>
      </ul>
      
      <div class="my-12 flex justify-center">
        <button class="group relative px-10 py-5 bg-white text-[#5865F2] hover:bg-zinc-100 font-black text-2xl rounded-2xl transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 cta-chat">
          INICIAR UMA CONVERSA AGORA
          <span class="absolute -top-3 -right-3 px-3 py-1 bg-orange-500 text-white text-[10px] rounded-full animate-bounce">GRÁTIS</span>
        </button>
      </div>
    `,
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    date: "07 Mai 2026",
    author: "Ricardo Silva",
    authorAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ricardo&backgroundColor=ffdfbf",
    authorBio: "Psicólogo clínico com 12 anos de experiência em mediação de conflitos e comportamento digital.",
    popular: true
  },
  {
    title: "Solidão na Era Digital: Como a tecnologia pode nos aproximar de verdade",
    slug: "solidao-era-digital-proximidade",
    excerpt: "Estamos mais conectados do que nunca, mas muitos se sentem sós. Descubra como usar a web para encontrar sua tribo.",
    content: `
      <p class="mb-6">O paradoxo da conexão moderna é uma das questões mais discutidas por sociólogos e psicólogos deste século. Nunca foi tão fácil "falar" com alguém em qualquer lugar do globo, mas ao mesmo tempo, os índices de solidão subjetiva nunca foram tão altos. Como podemos estar rodeados de likes, comentários e visualizações, e ainda assim sentirmos um vazio comunicativo?</p>
      
      <p class="mb-6">A resposta curta é que estamos consumindo muita <strong>informação</strong> sobre os outros, mas estamos compartilhando pouca <strong>presença</strong> com eles. O scroll infinito das redes sociais tradicionais é um ato solitário revestido de entretenimento social. Precisamos migrar urgentemente do consumo passivo para a <strong>interação ativa e recíproca</strong>.</p>

      <h2 class="text-3xl font-black mt-12 mb-6">A importância de pertencer a uma comunidade</h2>
      <p class="mb-6">O ser humano é um animal tribal. Precisamos da sensação de que somos parte de um grupo que nos reconhece e nos valoriza. Quando essa necessidade não é suprida, nosso bem-estar mental começa a declinar. A internet, se usada com sabedoria, é a ferramenta de conexão mais poderosa já inventada.</p>

      <div class="my-12 flex flex-col md:flex-row gap-10 items-stretch bg-zinc-900/50 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
        <div class="flex-1 flex flex-col justify-center">
          <h4 class="text-2xl font-black text-white mb-4">Quebre o ciclo da comparação</h4>
          <p class="text-zinc-400 text-lg leading-relaxed">Nas redes de feed, vemos o palco dos outros. Em chats de voz como o Papos, ouvimos os bastidores. Essa troca de realidades sem filtros visuais é o antídoto natural para a ansiedade social e a solidão digital.</p>
        </div>
        <div class="w-full md:w-64 h-64 relative shrink-0">
           <img src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover rounded-[2rem] shadow-xl border-4 border-white/5" alt="Pessoas convivendo" />
        </div>
      </div>

      <h2 class="text-3xl font-black mt-12 mb-6">A Voz como Ponte para a Intimidade Amigável</h2>
      <p class="mb-6">Ao remover a barreira da estética visual (fotos retocadas, filtros, vídeos editados), o Papos permite que a conexão se baseie no intelecto, no humor e na personalidade. É uma forma de redescobrir o prazer da conversa 'pura'. Quando você não está preocupado com o seu ângulo na câmera, você tem muito mais largura de banda mental para realmente ouvir o que o outro tem a dizer.</p>

      <p class="mb-6">Se você tem se sentido isolado, lembre-se: sua tribo está a apenas uma conversa de distância. Não tenha medo de dar o primeiro 'oi'. Muitas vezes, a pessoa do outro lado está esperando exatamente pelo mesmo convite que você está hesitando em fazer.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    date: "06 Mai 2026",
    author: "Beatriz Franco",
    authorAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Beatriz&backgroundColor=c0aede",
    authorBio: "Socióloga e pesquisadora de dinâmicas interpessoais em ambientes virtuais.",
    popular: true
  },
  {
    title: "Guia da Comunidade: Como fazer amigos que duram no Papos",
    slug: "guia-comunidade-amigos-duradouros",
    excerpt: "Dicas práticas para transitar de um 'Oi, tudo bem?' para uma amizade significativa dentro da nossa plataforma.",
    content: `
      <p class="mb-6">O Papos não é apenas uma plataforma tecnológica; é um organismo vivo pulsando com vozes de todo o mundo. Nossa missão é ser um porto seguro para quem busca autenticidade. Transformar um encontro aleatório em uma amizade duradoura exige intenção e um pouco de técnica social. Aqui estão os segredos para construir laços fortes na nossa comunidade.</p>
      
      <h2 class="text-3xl font-black mt-12 mb-6">1. A Primeira Impressão é Auditiva</h2>
      <p class="mb-6">Como não temos fotos de perfil dominando a primeira interação, sua energia vocal é seu cartão de visitas. Chegue com um tom amigável e aberto. Um simples "Olá, boa tarde a todos! Como está o clima por aí?" pode parecer banal, mas estabelece imediatamente uma presença calorosa e convida outros a participarem da sua órbita social.</p>

      <h2 class="text-3xl font-black mt-12 mb-6">2. Domine a Arte da Curiosidade Genuína</h2>
      <p class="mb-6">As melhores amizades começam com curiosidade. Use as ferramentas do Papos para encontrar pessoas com interesses similares, mas não pare por aí. Pergunte sobre o 'porquê' das coisas. "Por que você escolheu morar nessa cidade?" ou "O que te fez se apaixonar por música clássica?" são perguntas que geram respostas profundas e apaixonadas.</p>

      <div class="my-10 p-8 border-2 border-dashed border-[#5865F2]/30 rounded-[2.5rem] bg-[#5865F2]/5 flex flex-col items-center text-center">
        <div class="w-16 h-16 bg-[#5865F2] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#5865F2]/40">
           <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h4 class="text-2xl font-black text-white mb-4">A Regra Fundamental: Respeito e Segurança</h4>
        <p class="text-zinc-400 max-w-xl text-lg leading-relaxed">Conexões só crescem em ambientes seguros. Se alguém reportar um comportamento inadequado, nossa equipe de moderação age imediatamente para proteger o coletivo. Seja o tipo de membro que você gostaria de encontrar.</p>
      </div>

      <h2 class="text-3xl font-black mt-12 mb-6">3. Consistência é o Ingrediente Mágico</h2>
      <p class="mb-6">Amizades raramente são formadas em um único encontro. Se você teve um papo legal com alguém, tente entrar nos mesmos horários no dia seguinte ou adicione a pessoa aos 'Amigos' para receber notificações quando ela estiver online. A familiaridade constrói confiança ao longo do tempo.</p>

      <p class="mb-6">Acreditamos que todo mundo tem uma história fascinante esperando para ser ouvida. O Papos é o palco dessa história. Respeite o espaço alheio, seja generoso com seus elogios e, acima de tudo, divirta-se. A próxima grande amizade da sua vida pode começar nos próximos cinco minutos.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    date: "05 Mai 2026",
    author: "Laura Mendes",
    authorAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Laura&backgroundColor=b6e3f4",
    authorBio: "Gestora de Comunidade no Papos há 3 anos, apaixonada por arquitetura social.",
    popular: true
  },
  {
    title: "Como fazer amigos online em 2026",
    slug: "como-fazer-amigos-online",
    excerpt: "Descubra as melhores dicas para superar a timidez e construir amizades verdadeiras no ambiente digital.",
    content: `
      <p class="mb-6">O cenário das amizades digitais mudou drasticamente nos últimos anos. Em 2026, não buscamos apenas números ou seguidores; buscamos conexões que resistam ao teste da realidade. Superar a timidez inicial de falar com estranhos é o primeiro e mais importante passo nessa jornada.</p>
      
      <h2 class="text-3xl font-black mt-12 mb-6">1. A Autenticidade como Ímã</h2>
      <p class="mb-6">A regra de ouro da internet: a autenticidade atrai as pessoas certas. Não tente criar um personagem ou uma versão "perfeita" de si mesmo. Mostre seus verdadeiros gostos, suas opiniões e até suas pequenas inseguranças. No Papos, a voz é o filtro supremo da verdade; ela revela quem você é de uma forma que um perfil escrito nunca conseguirá.</p>

      <h2 class="text-3xl font-black mt-12 mb-6">2. Participe de Comunidades de Nicho</h2>
      <p class="mb-6">Em vez de tentar agradar a todos, foque em quem compartilha suas paixões específicas. Se você ama jogos indies, procure salas de chat dedicadas a isso. Se ama culinária exótica, comece por aí. Iniciar uma conversa com um assunto em comum remove 90% do gelo inicial e dá substância ao diálogo.</p>

      <div class="my-10 p-8 bg-[#5865F2]/10 rounded-[2.5rem] border border-[#5865F2]/20 flex flex-col items-center text-center">
        <h4 class="text-2xl font-black text-white mb-4">Pronto para colocar isso em prática?</h4>
        <p class="text-zinc-400 mb-6 text-lg">Milhares de pessoas estão conversando e fazendo amizades agora mesmo.</p>
        <button class="px-10 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xl rounded-2xl transition-all hover:scale-105 shadow-xl cta-chat">
          Entrar no Chat Agora
        </button>
      </div>

      <h2 class="text-3xl font-black mt-12 mb-6">3. Segurança é a Base da Confiança</h2>
      <p class="mb-6">Nunca compartilhe informações sensíveis como endereço ou dados bancários logo no início. Construa a confiança camada por camada. No Papos, incentivamos conversas profundas dentro da plataforma, onde oferecemos ferramentas de segurança para que você se sinta confortável enquanto expande seu círculo social.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    date: "02 Mai 2026",
    author: "Equipe Papos",
    authorAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Team&backgroundColor=f1f4f9",
    authorBio: "Nossa equipe editorial dedicada a criar o melhor ambiente social da web.",
    popular: true
  },
  {
    title: "Melhores sites de chat para conhecer pessoas",
    slug: "melhores-sites-de-chat",
    excerpt: "Analisamos as tendências de 2026 e o que faz uma plataforma de chat ser realmente segura e divertida.",
    content: `
      <p class="mb-6">O mundo dos chats online evoluiu de simples janelas de texto para experiências imersivas de áudio e vídeo. Mas nem todos os sites são criados iguais. Avaliamos segurança, qualidade da comunidade e facilidade de uso para definir o que torna um site de chat digno do seu tempo.</p>
      
      <h2 class="text-3xl font-black mt-12 mb-6">O Declínio do Chat Anônimo de Texto</h2>
      <p class="mb-6">Sites que dependem apenas de texto anônimo estão perdendo espaço. O motivo? Falta de humanidade. É muito fácil ser tóxico quando você é apenas um nome em uma tela. A nova tendência é o <strong>Chat por Voz Moderado</strong>, onde a voz humaniza a interação e a moderação garante o respeito.</p>

      <div class="my-10 p-8 bg-gradient-to-br from-zinc-900 to-[#1e1f22] rounded-[2.5rem] border border-white/10 shadow-2xl">
        <h4 class="text-xl font-bold text-[#5865F2] mb-3 uppercase tracking-widest">Dica de Especialista</h4>
        <p class="text-zinc-300 text-lg leading-relaxed italic">"Sempre prefira plataformas que utilizam autenticação social. Isso garante que você está falando com pessoas reais que valorizam a própria reputação digital."</p>
      </div>
      
      <h2 class="text-3xl font-black mt-12 mb-6">Por que o Papos se destaca?</h2>
      <p class="mb-6">Ao contrário das plataformas tradicionais, o Papos foca na curadoria da experiência. Usamos algoritmos inteligentes para conectar você a pessoas que realmente têm algo a ver com você, reduzindo o tempo de "procura" e aumentando o tempo de "conversa de qualidade".</p>

      <div class="my-12 flex justify-center">
        <button class="flex items-center gap-4 px-10 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xl rounded-2xl transition-all shadow-[0_20px_50px_rgba(88,101,242,0.3)] hover:scale-105 group cta-chat">
          Conheça o Papos hoje
          <svg class="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    `,
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    date: "28 Abr 2026",
    author: "Laura Mendes",
    authorAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Laura&backgroundColor=b6e3f4",
    authorBio: "Gestora de Comunidade no Papos há 3 anos, apaixonada por arquitetura social.",
    popular: true
  },
  {
    title: "Como conversar com desconhecidos com segurança",
    slug: "como-conversar-com-seguranca",
    excerpt: "Privacidade e cuidado: o guia definitivo para você fazer amizades online sem correr riscos.",
    content: `
      <p class="mb-6">Fazer amigos na internet é maravilhoso, mas a sua segurança deve vir em primeiro lugar. Em 2026, com o avanço de tecnologias de IA e bots, é crucial saber com quem você está interagindo. Aqui estão regras indispensáveis para quem quer socializar tranquilamente.</p>
      
      <h2 class="text-3xl font-black mt-12 mb-6">O que NUNCA compartilhar</h2>
      <p class="mb-6">Parece básico, mas em conversas envolventes e emocionais, é fácil relaxar demais. Endereço completo, nome da sua escola ou trabalho local, dados bancários e senhas jamais devem ser compartilhados, nem mesmo com pessoas que pareçam extremamente confiáveis no início.</p>
      
      <div class="my-10 p-8 bg-[#5865F2]/10 rounded-[2.5rem] border border-[#5865F2]/20 flex flex-col items-center text-center">
        <h4 class="text-2xl font-black text-white mb-4">Comunidade Monitorada</h4>
        <p class="text-zinc-400 mb-6 text-lg">No Papos, investimos pesado em tecnologia de detecção de spam e comportamentos abusivos. Nossa moderação 24/7 garante que você possa focar no que importa: a conexão humana.</p>
      </div>

      <h2 class="text-3xl font-black mt-12 mb-6">Confie no seu instinto</h2>
      <p class="mb-6">Se algo parece estranho ou se a pessoa está te pressionando para mover a conversa para uma rede social privada muito rápido, dê um passo atrás. Amizades saudáveis respeitam o tempo e os limites de cada um. Use as ferramentas de 'Report' sempre que algo sair do tom.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    date: "15 Abr 2026",
    author: "Equipe de Segurança",
    authorAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Security&backgroundColor=ffd5dc",
    authorBio: "Especialistas em proteção de dados e segurança comunitária."
  },
  {
    title: "Apps e plataformas para conversar por voz",
    slug: "apps-conversar-por-voz",
    excerpt: "Saia do tédio do texto e descubra como as conexões através da voz são muito mais profundas.",
    content: `
      <p class="mb-6">Enquanto o texto pode ser mal interpretado e muitas vezes parece frio, a voz traz nuances, emoções e um calor humano que é impossível de replicar em letras de teclado. Em 2026, estamos vendo um renascimento do áudio como a forma preferida de conexão social autêntica.</p>
      
      <h2 class="text-3xl font-black mt-12 mb-6">A Evolução do Chat de Voz</h2>
      <p class="mb-6">Antigamente, chats de voz eram sinônimos de má qualidade e ruídos. Hoje, com áudio de alta fidelidade e cancelamento de ruído por IA, conversar online parece estar na mesma sala que a outra pessoa. Isso quebra as barreiras da distância física de uma forma mágica.</p>

      <div class="my-12 flex justify-center">
        <button class="group relative px-10 py-5 bg-zinc-900 border border-white/10 text-white hover:bg-white hover:text-black font-black text-xl rounded-2xl transition-all shadow-2xl hover:scale-105 cta-chat">
          EXPERIMENTAR CALL EM HD
          <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
        </button>
      </div>

      <h2 class="text-3xl font-black mt-12 mb-6">Quebrando a Barreira Inicial</h2>
      <p class="mb-6">Entrar em uma call com desconhecidos pode dar um frio na barriga. A dica de ouro é entrar como ouvinte primeiro, entender a 'vibe' da sala e então se apresentar puxando um assunto em comum que alguém mencionou. No Papos, nossas salas são organizadas por temas para facilitar justamente esse primeiro contato.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    date: "05 Abr 2026",
    author: "Equipe Papos",
    authorAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Papos&backgroundColor=d1d4f9",
    authorBio: "Desenvolvedores e entusiastas da revolução do áudio social."
  },
  {
    title: "5 Dicas contra o tédio online",
    slug: "dicas-contra-tedio-online",
    excerpt: "Cansado de rolar o feed infinitamente? Veja formas ativas de aproveitar seu tempo na internet.",
    content: `
      <p class="mb-6">O tédio online frequentemente vem de um consumo passivo de conteúdo (como rolar infinitamente redes sociais como TikTok ou Instagram). Esse tipo de atividade gera picos de dopamina rápidos, mas deixa uma sensação de vazio. O segredo para combater o tédio de verdade é se tornar um participante ativo na web.</p>
      
      <h2 class="text-3xl font-black mt-12 mb-6">1. Engaje em Discussões de Valor</h2>
      <p class="mb-6">Encontre tópicos que você domina ou que quer aprender e entre em chats sobre eles. A troca de ideias em tempo real ativa o cérebro de formas que um vídeo curto jamais conseguirá. O diálogo exige raciocínio e empatia, combatendo o tédio pela raiz.</p>

      <h2 class="text-3xl font-black mt-12 mb-6">2. Conheça Pessoas fora da sua "Bolha"</h2>
      <p class="mb-6">O algoritmo das redes sociais te mostra o que você já gosta. Conversar com pessoas de diferentes regiões, idades ou interesses expande sua visão de mundo. No Papos, você pode encontrar um pescador no Nordeste ou um designer em Portugal na mesma sala, o que garante conversas fascinantes e imprevisíveis.</p>
      
      <div class="my-10 p-8 bg-[#5865F2]/10 rounded-[2.5rem] border border-[#5865F2]/20 flex flex-col items-center text-center">
        <h4 class="text-2xl font-black text-white mb-4">Acabe com o tédio agora</h4>
        <p class="text-zinc-400 mb-6 text-lg">Encontre alguém legal para conversar em menos de 1 minuto e mude o seu dia.</p>
        <button class="px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xl rounded-xl transition-all hover:scale-105 cta-chat">
          Buscar Pareamento
        </button>
      </div>

      <h2 class="text-3xl font-black mt-12 mb-6">3. Aprenda algo Conversando</h2>
      <p class="mb-6">Muitas pessoas usam o chat para praticar idiomas ou debater hobbies. Transformar seu tempo de tédio em tempo de aprendizado social é a forma mais inteligente de usar a internet em 2026.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    date: "20 Mar 2026",
    author: "Rafael",
    authorAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rafael&backgroundColor=ffadad",
    authorBio: "Fundador do Papos e visionário de comunidades digitais."
  }
];
