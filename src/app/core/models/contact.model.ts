export interface ContactInfo {
  id: string;
  departamento: string;
  endereco: string;
  cidade: string;
  codigoPostal: string;
  pais: string;
  telefone: string;
  fax: string;
  email: string;
  horarioPt: string;
  horarioEn: string;
  horarioDe: string;
  latitude: number | null;
  longitude: number | null;
  sortOrder: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
