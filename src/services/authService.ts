import api from '../api/axios.config';
import type {
  LoginDTO,
  RegistroDTO,
  AuthResponse,
  Usuario,
  CambioPasswordDTO,
  RecuperarPasswordDTO,
  ResetPasswordDTO
} from '../models/Usuario';

/**
 * Servicio de autenticación y gestión de usuarios
 */
export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    // Guardar token y usuario en sessionStorage
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   */
  async registrar(data: RegistroDTO): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    
    // Guardar token y usuario en sessionStorage
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Limpiar sessionStorage siempre, incluso si falla la petición
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  },

  /**
   * Obtener usuario actual
   */
  async obtenerUsuarioActual(): Promise<Usuario> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  },

  /**
   * Obtener usuario desde sessionStorage
   */
  getUser(): Usuario | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Obtener token desde sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem('token');
  },

  /**
   * Cambiar contraseña
   */
  async cambiarPassword(data: CambioPasswordDTO): Promise<void> {
    await api.post('/auth/change-password', data);
  },

  /**
   * Solicitar recuperación de contraseña
   */
  async recuperarPassword(data: RecuperarPasswordDTO): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Restablecer contraseña con token
   */
  async resetPassword(data: ResetPasswordDTO): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  hasPermission(permiso: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    return user.permisos.includes(permiso);
  },

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(rol: string | string[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    if (Array.isArray(rol)) {
      return rol.includes(user.rol);
    }
    
    return user.rol === rol;
  },

  /**
   * Refrescar token
   */
  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh');
    
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  }
};