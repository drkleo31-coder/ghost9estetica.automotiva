export interface GhostService {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  focusLabel: string;
  image: string;
  imageAlt: string;
  video?: string;
  videoLabel?: string;
}

export interface GalleryFrame {
  id: string;
  number: string;
  title: string;
  category: string;
  caption: string;
  image: string;
  imageAlt: string;
  span: 'wide' | 'standard';
}

export const BRAND_INFO = {
  name: 'GHOST 9',
  fullName: 'GHOST 9 Estética Automotiva',
  city: 'Limeira - SP',
  logoPath: '/assets/aistudio/IMG_5559_167737bf.png',
  whatsappNumber: '5519995396647',
  whatsappDisplay: '+55 19 99539-6647',
  whatsappBaseUrl: 'https://wa.me/5519995396647',
  instagramHandle: '@ghost9_estetica.automotiva',
  instagramUrl: 'https://www.instagram.com/ghost9_estetica.automotiva/',
  studioCredit: 'SHARK CODER',
} as const;

export const VIDEO_ASSETS = {
  polimento: '/assets/aistudio/snapinsta-1795224888524_aa41db63.mp4',
  heroWalkaround: '/assets/hero-ghost9-web.mp4',
  detalhamento: '/assets/aistudio/snapinsta-1795224758815_8591732d.mp4',
} as const;

export const HERO_MEDIA = {
  poster: '/assets/hero-ghost9-poster.webp',
  posterAlt: 'Primeiro frame real do carro preto no estúdio GHOST 9 com acabamento brilhante',
  video: VIDEO_ASSETS.heroWalkaround,
  videoLabel: 'Apresentação real de veículo preto com acabamento brilhante em estúdio',
} as const;

export const TRANSFORMATION_MEDIA = {
  beforeImage: '/src/assets/images/transform_before_paint_1795225246727.jpg',
  beforeAlt: 'Imagem demonstrativa de pintura automotiva escura com marcas circulares e micro-riscos sob luz de inspeção',
  afterImage: '/src/assets/images/transform_after_paint_1795225248115.jpg',
  afterAlt: 'Imagem demonstrativa de pintura automotiva escura com acabamento espelhado e reflexos nítidos de estúdio',
} as const;

export const CONFIRMED_SERVICES: readonly GhostService[] = [
  {
    id: 'polimento-automotivo',
    number: '01',
    title: 'Polimento Automotivo',
    subtitle: 'Cuidado com a pintura e acabamento',
    description:
      'Trabalho dedicado à uniformidade visual do verniz, devolvendo definição às linhas da carroceria e realçando o contraste da pintura.',
    focusLabel: 'Verniz · Vídeo Real em Estúdio',
    image: '/src/assets/images/service_polishing_1795225248024.jpg',
    imageAlt: 'Registro de polimento técnico na lateral de veículo em estúdio',
    video: VIDEO_ASSETS.polimento,
    videoLabel: 'Profissional realizando polimento na lateral de um carro',
  },
  {
    id: 'correcao-de-pintura',
    number: '02',
    title: 'Correção de Pintura',
    subtitle: 'Valorização visual da superfície',
    description:
      'Atuação direcionada sobre marcas superficiais, hologramas e opacidades aparentes para restaurar a clareza e a leitura limpa da pintura.',
    focusLabel: 'Nivelamento · Clareza',
    image: '/src/assets/images/transform_after_paint_1795225248115.jpg',
    imageAlt: 'Imagem demonstrativa de capô preto após correção de pintura com reflexo contínuo de LED',
  },
  {
    id: 'espelhamento',
    number: '03',
    title: 'Espelhamento',
    subtitle: 'Brilho profundo e reflexão nítida',
    description:
      'Refino voltado à máxima profundidade óptica da superfície, criando reflexos límpidos e destaque absoluto para o desenho do automóvel.',
    focusLabel: 'Reflexo · Profundidade',
    image: '/src/assets/images/service_espelhamento_1795225248823.jpg',
    imageAlt: 'Imagem demonstrativa de lateral de cupê preto com acabamento espelhado e reflexo vermelho',
  },
  {
    id: 'vitrificacao',
    number: '04',
    title: 'Vitrificação',
    subtitle: 'Proteção dedicada à pintura',
    description:
      'Camada protetora aplicada sobre a superfície preparada para auxiliar na preservação do brilho e no cuidado contínuo da pintura.',
    focusLabel: 'Proteção · Superfície',
    image: '/src/assets/images/service_vitrificacao_1795225248571.jpg',
    imageAlt: 'Imagem demonstrativa de gotículas de água sobre pintura preta protegida sob luz vermelha',
  },
  {
    id: 'detalhamento-completo',
    number: '05',
    title: 'Detalhamento Completo',
    subtitle: 'Atenção minuciosa ponto a ponto',
    description:
      'Inspeção e cuidado criterioso de faróis, vincos, emblemas, frisos, rodas, pinças e áreas de difícil acesso para um conjunto coeso.',
    focusLabel: 'Precisão · Vídeo Real em Estúdio',
    image: '/src/assets/images/hero_black_supercar_1795225247300.jpg',
    imageAlt: 'Registro de trabalho de detalhamento na região do farol',
    video: VIDEO_ASSETS.detalhamento,
    videoLabel: 'Profissional trabalhando na região do farol',
  },
  {
    id: 'higienizacao-interna',
    number: '06',
    title: 'Higienização Interna',
    subtitle: 'Limpeza e cuidado com a cabine',
    description:
      'Cuidado minucioso com bancos, painéis, console, volante e revestimentos internos, preservando o toque e a apresentação original do interior.',
    focusLabel: 'Cabine · Revestimentos',
    image: '/src/assets/images/service_interior_1795225249014.jpg',
    imageAlt: 'Imagem demonstrativa de cabine esportiva escura higienizada com acabamento em couro e Alcântara',
  },
] as const;

export const GALLERY_FRAMES: readonly GalleryFrame[] = [
  {
    id: 'frame-01',
    number: '01',
    title: 'Composição de Estúdio',
    category: 'Referência Visual · Exterior',
    caption: 'Cena demonstrativa de iluminação lateral e reflexos em carroceria escura. Espaço preparado para acervo oficial GHOST 9.',
    image: '/src/assets/images/hero_black_supercar_1795225247300.jpg',
    imageAlt: 'Referência visual de esportivo preto em estúdio com luz vermelha',
    span: 'wide',
  },
  {
    id: 'frame-02',
    number: '02',
    title: 'Leitura de Verniz e Roda',
    category: 'Referência Visual · Espelhamento',
    caption: 'Contraste entre superfície espelhada, conjunto de freios e iluminação cênica vermelha.',
    image: '/src/assets/images/service_espelhamento_1795225248823.jpg',
    imageAlt: 'Referência visual de lateral preta espelhada e roda esportiva',
    span: 'standard',
  },
  {
    id: 'frame-03',
    number: '03',
    title: 'Tensão Superficial',
    category: 'Referência Visual · Vitrificação',
    caption: 'Estudo visual de proteção de pintura sob luz direcional de inspeção.',
    image: '/src/assets/images/service_vitrificacao_1795225248571.jpg',
    imageAlt: 'Referência visual de superfície automotiva protegida com gotículas',
    span: 'standard',
  },
  {
    id: 'frame-04',
    number: '04',
    title: 'Atmosfera da Cabine',
    category: 'Referência Visual · Interior',
    caption: 'Apresentação de revestimentos internos com acabamento fosco limpo e costura aparente.',
    image: '/src/assets/images/service_interior_1795225249014.jpg',
    imageAlt: 'Referência visual de interior automotivo higienizado',
    span: 'standard',
  },
  {
    id: 'frame-05',
    number: '05',
    title: 'Processo de Refino',
    category: 'Referência Visual · Polimento',
    caption: 'Registro ilustrativo de etapa técnica de polimento em cabine controlada.',
    image: '/src/assets/images/service_polishing_1795225248024.jpg',
    imageAlt: 'Referência visual de polimento automotivo em estúdio escuro',
    span: 'wide',
  },
] as const;
