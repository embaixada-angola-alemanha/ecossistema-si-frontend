export interface SiteEvent {
  id: string;
  tituloPt: string;
  tituloEn: string;
  tituloDe: string;
  tituloCs: string;
  descricaoPt: string;
  descricaoEn: string;
  descricaoDe: string;
  descricaoCs: string;
  localPt: string;
  localEn: string;
  dataInicio: string;
  dataFim: string | null;
  imageId: string | null;
  estado: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  tipoEvento: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
