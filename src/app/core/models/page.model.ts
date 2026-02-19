export interface PageTranslation {
  id: string;
  idioma: 'PT' | 'EN' | 'DE' | 'CS';
  titulo: string;
  conteudo: string;
  excerto: string;
  metaTitulo: string;
  metaDescricao: string;
  metaKeywords: string;
  ogImageUrl: string;
}

export interface SitePage {
  id: string;
  slug: string;
  tipo: 'INSTITUTIONAL' | 'NEWS' | 'EVENT' | 'SERVICE' | 'FAQ' | 'LANDING';
  estado: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  template: string;
  sortOrder: number;
  parentId: string | null;
  featuredImageId: string | null;
  publishedAt: string | null;
  translations: PageTranslation[];
  createdAt: string;
  updatedAt: string;
}
