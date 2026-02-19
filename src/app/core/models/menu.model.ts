export interface MenuItem {
  id: string;
  parentId: string | null;
  labelPt: string;
  labelEn: string;
  labelDe: string;
  labelCs: string;
  url: string;
  pageId: string | null;
  sortOrder: number;
  openNewTab: boolean;
  icon: string;
  activo: boolean;
}

export interface Menu {
  id: string;
  nome: string;
  localizacao: 'HEADER' | 'FOOTER' | 'SIDEBAR';
  activo: boolean;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}
