// Interface principal de Usuario
export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  rol: 'empresa' | 'estudiante' | 'admin' | 'coordinador_extension' | 'juridica' | 'academico';
  estado: 'activo' | 'inactivo' | 'suspendido';
  permisos?: string[];
  perfil_id?: number; // ID del perfil según el rol (empresa_id, estudiante_id, etc)
  created_at?: string;
  updated_at?: string;
}

// DTO para login
export interface LoginDTO {
  email: string;
  password: string;
  remember?: boolean;
}

// DTO para registro
export interface RegistroDTO {
  nombre: string;
  email: string;
  password: string;
  password_confirmation: string;
  rol: 'empresa' | 'estudiante';
}

// Respuesta de autenticación
export interface AuthResponse {
  token: string;
  user: Usuario;
  expires_in?: number;
}

// Interface para cambio de contraseña
export interface CambioPasswordDTO {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Interface para recuperación de contraseña
export interface RecuperarPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

// Constantes de roles
export const ROLES = [
  'empresa',
  'estudiante',
  'admin',
  'coordinador_extension',
  'juridica',
  'academico'
] as const;

export type Rol = typeof ROLES[number];

// Permisos por rol
export const PERMISOS_POR_ROL: Record<Rol, string[]> = {
  empresa: [
    'crear_vacantes',
    'ver_postulaciones',
    'seleccionar_candidatos',
    'gestionar_convenio'
  ],
  estudiante: [
    'postular_vacantes',
    'ver_mis_postulaciones',
    'actualizar_perfil'
  ],
  admin: [
    'gestionar_usuarios',
    'gestionar_empresas',
    'gestionar_estudiantes',
    'gestionar_vacantes',
    'ver_reportes',
    'validar_documentos',
    'gestionar_convenios'
  ],
  coordinador_extension: [
    'gestionar_empresas',
    'gestionar_convenios',
    'ver_reportes',
    'validar_documentos'
  ],
  juridica: [
    'validar_documentos',
    'gestionar_convenios',
    'ver_reportes'
  ],
  academico: [
    'gestionar_estudiantes',
    'ver_reportes',
    'validar_perfiles'
  ]
};