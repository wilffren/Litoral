/**
 * Constantes globales de la aplicación
 */

// URL base del API
export const API_BASE_URL = 'http://localhost:8000/api';

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE_MB: 10,
  ALLOWED_DOCUMENTS: ['pdf', 'doc', 'docx'],
  ALLOWED_IMAGES: ['jpg', 'jpeg', 'png', 'webp']
};

// Estados de convenio
export const ESTADOS_CONVENIO = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado'
} as const;

// Estados de vacante
export const ESTADOS_VACANTE = {
  ACTIVA: 'activa',
  CERRADA: 'cerrada',
  PAUSADA: 'pausada'
} as const;

// Estados de postulación
export const ESTADOS_POSTULACION = {
  ENVIADA: 'enviada',
  EN_REVISION: 'en_revision',
  SELECCIONADA: 'seleccionada',
  RECHAZADA: 'rechazada',
  RETIRADA: 'retirada'
} as const;

// Roles de usuario
export const ROLES = {
  EMPRESA: 'empresa',
  ESTUDIANTE: 'estudiante',
  ADMIN: 'admin',
  COORDINADOR_EXTENSION: 'coordinador_extension',
  JURIDICA: 'juridica',
  ACADEMICO: 'academico'
} as const;

// Modalidades de trabajo
export const MODALIDADES = {
  PRESENCIAL: 'Presencial',
  REMOTO: 'Remoto',
  HIBRIDO: 'Híbrido'
} as const;

// Tipos de contrato
export const TIPOS_CONTRATO = {
  APRENDIZAJE: 'Aprendizaje',
  PRACTICA: 'Práctica',
  PASANTIA: 'Pasantía'
} as const;

// Jornadas laborales
export const JORNADAS = {
  TIEMPO_COMPLETO: 'Tiempo Completo',
  MEDIO_TIEMPO: 'Medio Tiempo',
  POR_HORAS: 'Por Horas'
} as const;

// Ciudades principales de Colombia
export const CIUDADES_COLOMBIA = [
  'Barranquilla',
  'Bogotá',
  'Medellín',
  'Cali',
  'Cartagena',
  'Bucaramanga',
  'Pereira',
  'Santa Marta',
  'Cúcuta',
  'Manizales',
  'Ibagué',
  'Pasto',
  'Villavicencio',
  'Armenia',
  'Valledupar'
];

// Programas académicos
export const PROGRAMAS_ACADEMICOS = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Civil',
  'Ingeniería Electrónica',
  'Ingeniería Mecánica',
  'Administración de Empresas',
  'Contaduría Pública',
  'Economía',
  'Derecho',
  'Psicología',
  'Comunicación Social',
  'Diseño Gráfico',
  'Arquitectura',
  'Mercadeo y Publicidad'
];

// Rangos de salario
export const RANGOS_SALARIO = [
  { label: 'Menos de $1.000.000', min: 0, max: 1000000 },
  { label: '$1.000.000 - $1.500.000', min: 1000000, max: 1500000 },
  { label: '$1.500.000 - $2.000.000', min: 1500000, max: 2000000 },
  { label: '$2.000.000 - $3.000.000', min: 2000000, max: 3000000 },
  { label: 'Más de $3.000.000', min: 3000000, max: 999999999 }
];

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
  VALIDATION_ERROR: 'Por favor, corrige los errores en el formulario.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  SAVE: 'Los cambios se guardaron correctamente.',
  CREATE: 'Se creó el registro exitosamente.',
  UPDATE: 'Se actualizó el registro exitosamente.',
  DELETE: 'Se eliminó el registro exitosamente.',
  SEND: 'Se envió la información correctamente.'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50, 100]
};

// Tiempos de espera (en milisegundos)
export const TIMEOUTS = {
  NOTIFICATION: 3000,
  REDIRECT: 2000,
  DEBOUNCE: 500
};

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6'
};