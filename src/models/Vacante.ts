// Interface principal de Vacante
export interface Vacante {
  id?: number;
  empresa_id: number;
  codigo_unico: string;
  programa_academico: string;
  perfil_cargo: string;
  descripcion: string;
  requisitos?: string;
  cantidad: number;
  salario: number;
  modalidad: 'Presencial' | 'Remoto' | 'Híbrido';
  tipo_contrato: 'Aprendizaje' | 'Práctica' | 'Pasantía';
  jornada: 'Tiempo Completo' | 'Medio Tiempo' | 'Por Horas';
  fecha_limite: string;
  estado: 'activa' | 'cerrada' | 'pausada';
  ubicacion?: string;
  postulaciones_count?: number;
  empresa?: {
    id: number;
    nombre: string;
    ciudad: string;
    sector_economico: string;
  };
  created_at?: string;
  updated_at?: string;
}

// DTO para crear vacante
export interface CrearVacanteDTO {
  empresa_id: number;
  programa_academico: string;
  perfil_cargo: string;
  descripcion: string;
  requisitos?: string;
  cantidad: number;
  salario: number;
  modalidad: 'Presencial' | 'Remoto' | 'Híbrido';
  tipo_contrato: 'Aprendizaje' | 'Práctica' | 'Pasantía';
  jornada: 'Tiempo Completo' | 'Medio Tiempo' | 'Por Horas';
  fecha_limite: string;
  ubicacion?: string;
}

// Interface para postulación
export interface Postulacion {
  id?: number;
  vacante_id: number;
  estudiante_id: number;
  estado: 'enviada' | 'en_revision' | 'seleccionada' | 'rechazada' | 'retirada';
  fecha_postulacion?: string;
  fecha_respuesta?: string;
  observaciones?: string;
  vacante?: Vacante;
  estudiante?: {
    id: number;
    nombre_completo: string;
    correo: string;
    telefono: string;
    programa_academico: string;
    semestre: number;
  };
  created_at?: string;
  updated_at?: string;
}

// Interface para filtros de búsqueda de vacantes
export interface FiltrosVacante {
  programa_academico?: string;
  modalidad?: string;
  ubicacion?: string;
  salario_min?: number;
  salario_max?: number;
  tipo_contrato?: string;
  estado?: string;
  empresa_id?: number;
  search?: string;
}

// Constantes
export const MODALIDADES = ['Presencial', 'Remoto', 'Híbrido'] as const;
export const TIPOS_CONTRATO = ['Aprendizaje', 'Práctica', 'Pasantía'] as const;
export const JORNADAS = ['Tiempo Completo', 'Medio Tiempo', 'Por Horas'] as const;
export const ESTADOS_VACANTE = ['activa', 'cerrada', 'pausada'] as const;
export const ESTADOS_POSTULACION = [
  'enviada',
  'en_revision',
  'seleccionada',
  'rechazada',
  'retirada'
] as const;