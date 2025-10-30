import axios from 'axios';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Interceptor para agregar token de autenticación a cada petición
api.interceptors.request.use(
  (config) => {
    // Obtener token desde sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, devolverla tal cual
    return response;
  },
  (error) => {
    // Manejo de errores comunes
    if (error.response?.status === 401) {
      // Token inválido o expirado - redirigir a login
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Sin permisos
      console.error('No tienes permisos para realizar esta acción');
    }
    
    if (error.response?.status === 500) {
      // Error del servidor
      console.error('Error interno del servidor');
    }
    
    return Promise.reject(error);
  }
);

export default api;