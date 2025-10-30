import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Usuario, LoginDTO, RegistroDTO } from '../models/Usuario';
import { authService } from '../services/authService';

/**
 * Store de autenticación
 * Maneja el estado de autenticación del usuario
 */
export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<Usuario | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.rol);
  const userName = computed(() => user.value?.nombre);

  /**
   * Inicializar store desde sessionStorage
   */
  const init = () => {
    const storedToken = authService.getToken();
    const storedUser = authService.getUser();
    
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = storedUser;
    }
  };

  /**
   * Iniciar sesión
   */
  const login = async (credentials: LoginDTO) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(credentials);
      token.value = response.token;
      user.value = response.user;
      return response;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al iniciar sesión';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Registrar nuevo usuario
   */
  const registrar = async (data: RegistroDTO) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.registrar(data);
      token.value = response.token;
      user.value = response.user;
      return response;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al registrar usuario';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    loading.value = true;
    
    try {
      await authService.logout();
    } finally {
      token.value = null;
      user.value = null;
      loading.value = false;
    }
  };

  /**
   * Actualizar datos del usuario en el store
   */
  const updateUser = (userData: Partial<Usuario>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData };
      sessionStorage.setItem('user', JSON.stringify(user.value));
    }
  };

  /**
   * Verificar si el usuario tiene un permiso
   */
  const hasPermission = (permiso: string): boolean => {
    return authService.hasPermission(permiso);
  };

  /**
   * Verificar si el usuario tiene un rol
   */
  const hasRole = (rol: string | string[]): boolean => {
    return authService.hasRole(rol);
  };

  /**
   * Obtener usuario actual del backend
   */
  const fetchCurrentUser = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      user.value = await authService.obtenerUsuarioActual();
      sessionStorage.setItem('user', JSON.stringify(user.value));
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al obtener usuario';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Inicializar al crear el store
  init();

  return {
    // Estado
    user,
    token,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    userRole,
    userName,
    
    // Acciones
    login,
    registrar,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    fetchCurrentUser,
    init
  };
});