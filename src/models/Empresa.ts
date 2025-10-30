// Interface principal de Empresa
export interface Empresa {
  id?: number;
  nombre: string;
  nit: string;
  correo_institucional: string;
  telefono: string;
  representante_legal: string;
  sector_economico: string;
  direccion: string;
  ciudad: string;
  tiene_convenio?: boolean;
  estado_convenio?: 'pendiente' | 'aprobado' | 'rechazado';
  created_at?: string;
  updated_at?: string;
}

// DTO para registro de empresa (Data Transfer Object)
export interface RegistroEmpresaDTO {
  nombre: string;
  nit: string;
  correo_institucional: string;
  telefono: string;
  representante_legal: string;
  sector_economico: string;
  direccion: string;
  ciudad: string;
}

// Interface para convenio
export interface Convenio {
  id?: number;
  empresa_id: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  documentos: DocumentoConvenio[];
  fecha_inicio?: string;
  fecha_fin?: string;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface para documentos del convenio
export interface DocumentoConvenio {
  id?: number;
  tipo: 'RUT' | 'CAMARA_COMERCIO' | 'CEDULA_REPRESENTANTE' | 'FORMATO_CONVENIO';
  nombre_archivo: string;
  url?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  observaciones?: string;
}

// Opciones para sectores económicos
export const SECTORES_ECONOMICOS = [
  'Tecnología',
  'Manufactura',
  'Servicios',
  'Comercio',
  'Construcción',
  'Agricultura',
  'Salud',
  'Educación',
  'Turismo',
  'Transporte',
  'Financiero',
  'Otro'
] as const;

export type SectorEconomico = typeof SECTORES_ECONOMICOS[number];