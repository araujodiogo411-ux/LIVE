
export enum Category {
  CIENCIA = 'Ciência',
  SEDES = 'Sedes',
  TECNOLOGIA = 'Tecnologia',
  FILMES = 'Filmes',
  SERIES = 'Séries e Programas',
  EVENTOS = 'Eventos',
  PARCERIAS = 'Parcerias'
}

export interface Comment {
  id: string;
  text: string;
  createdAt: number;
}

export interface Reactions {
  [emoji: string]: number;
}

export interface Post {
  id: string;
  title: string;
  category: Category;
  content: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'audio' | 'pdf' | 'none';
  createdAt: number;
  author: string;
  views: number;
  comments: Comment[];
  reactions: Reactions;
  status: 'published' | 'draft';
}

export type ViewState = 'home' | 'category' | 'privacy' | 'terms' | 'admin';
