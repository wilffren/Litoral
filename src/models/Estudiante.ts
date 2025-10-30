// Interface principal de Estudiante
export interface Estudiante {
  id?: number;
  documento: string;
  tipo_documento: 'CC' | 'TI' | 'CE' | 'PA';
  nombre_completo: string;
  fecha_nacimiento: string;
  grupo_etnico?: string;
  discapacidad?: string;
  sexo: 'M' | 'F' | 'Otro';
  correo: string;
  telefono: string;
  programa_academico: string;
  semestre: number;
  disponibilidad_horaria: string;
  perfil_laboral: string;
  experiencias?: ExperienciaLaboral[];
  educacion_informal?: EducacionInformal[];
  idiomas?: Idioma[];
  herramientas?: Herramienta[];
  created_at?: string;
  updated_at?: string;
}

// Interface para experiencia laboral
export interface ExperienciaLaboral {
  id?: number;
  estudiante_id?: number;
  empresa: string;
  cargo: string;
  fecha_inicio: string;
  fecha_fin?: string;
  actualmente_trabaja?: boolean;
  descripcion?: string;
}

// Interface para educación informal
export interface EducacionInformal {
  id?: number;
  estudiante_id?: number;
  curso: string;
  institucion: string;
  fecha_finalizacion: string;
  duracion_horas?: number;
  certificado?: boolean;
}

// Interface para idiomas
export interface Idioma {
  id?: number;
  estudiante_id?: number;
  idioma: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
}

// Interface para herramientas tecnológicas
export interface Herramienta {
  id?: number;
  estudiante_id?: number;
  nombre: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto';
  categoria: 'Programación' | 'Diseño' | 'Ofimática' | 'Análisis' | 'Otro';
}

// DTO para registro de estudiante
export interface RegistroEstudianteDTO {
  documento: string;
  tipo_documento: 'CC' | 'TI' | 'CE' | 'PA';
  nombre_completo: string;
  fecha_nacimiento: string;
  grupo_etnico?: string;
  discapacidad?: string;
  sexo: 'M' | 'F' | 'Otro';
  correo: string;
  telefono: string;
  programa_academico: string;
  semestre: number;
  disponibilidad_horaria: string;
  perfil_laboral: string;
}

// Constantes
export const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'PA'] as const;
export const GRUPOS_ETNICOS = [
  'Ninguno',
  'Indígena',
  'Afrodescendiente',
  'Raizal',
  'Palenquero',
  'ROM (Gitano)',
  'Otro'
] as const;

export const NIVELES_IDIOMA = ['Básico', 'Intermedio', 'Avanzado', 'Nativo'] as const;
export const NIVELES_HERRAMIENTA = ['Básico', 'Intermedio', 'Avanzado', 'Experto'] as const;