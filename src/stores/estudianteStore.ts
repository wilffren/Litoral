import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Estudiante, RegistroEstudianteDTO } from '../models/Estudiante';
import type { Vacante, Postulacion, FiltrosVacante } from '../models/Vacante';
import { estudianteService } from '../services/estudianteService';

/**
 * Store de estudiantes
 * Maneja el estado y operaciones relacionadas con estudiantes
 */
export const useEstudianteStore = defineStore('estudiante', () => {
  // Estado
  const estudiante = ref<Estudiante | null>(null);
  const vacantesDisponibles = ref<Vacante[]>([]);
  const misPostulaciones = ref<Postulacion[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const perfilCompleto = computed(() => {
    if (!estudiante.value) return false;
    
    return !!(
      estudiante.value.documento &&
      estudiante.value.nombre_completo &&
      estudiante.value.correo &&
      estudiante.value.telefono &&
      estudiante.value.programa_academico
    );
  });

  const postulacionesActivas = computed(() => {
    return misPostulaciones.value.filter(p => 
      p.estado === 'enviada' || p.estado === 'en_revision'
    );
  });

  const postulacionesSeleccionadas = computed(() => {
    return misPostulaciones.value.filter(p => p.estado === 'seleccionada');
  });

  /**
   * Registrar nuevo estudiante
   */
  const registrarEstudiante = async (data: RegistroEstudianteDTO) => {
    loading.value = true;
    error.value = null;
    
    try {
      estudiante.value = await estudianteService.registrar(data);
      return estudiante.value;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al registrar estudiante';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar perfil del estudiante
   */
  const cargarPerfil = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      estudiante.value = await estudianteService.obtenerPerfil(id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar perfil';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualizar perfil
   */
  const actualizarPerfil = async (id: number, data: Partial<Estudiante>) => {
    loading.value = true;
    error.value = null;
    
    try {
      estudiante.value = await estudianteService.actualizarPerfil(id, data);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al actualizar perfil';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Buscar vacantes disponibles
   */
  const buscarVacantes = async (filtros?: FiltrosVacante) => {
    loading.value = true;
    error.value = null;
    
    try {
      vacantesDisponibles.value = await estudianteService.buscarVacantes(filtros);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al buscar vacantes';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Postular a una vacante
   */
  const postularVacante = async (vacanteId: number, estudianteId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const postulacion = await estudianteService.postularVacante(vacanteId, estudianteId);
      misPostulaciones.value.unshift(postulacion);
      return postulacion;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al postular';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar mis postulaciones
   */
  const cargarMisPostulaciones = async (estudianteId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      misPostulaciones.value = await estudianteService.obtenerMisPostulaciones(estudianteId);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar postulaciones';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Retirar postulación
   */
  const retirarPostulacion = async (postulacionId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      await estudianteService.retirarPostulacion(postulacionId);
      misPostulaciones.value = misPostulaciones.value.filter(p => p.id !== postulacionId);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al retirar postulación';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Agregar experiencia laboral
   */
  const agregarExperiencia = async (estudianteId: number, experiencia: any) => {
    loading.value = true;
    error.value = null;
    
    try {
      const nuevaExperiencia = await estudianteService.agregarExperiencia(
        estudianteId,
        experiencia
      );
      
      if (estudiante.value) {
        if (!estudiante.value.experiencias) {
          estudiante.value.experiencias = [];
        }
        estudiante.value.experiencias.push(nuevaExperiencia);
      }
      
      return nuevaExperiencia;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al agregar experiencia';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Agregar idioma
   */
  const agregarIdioma = async (estudianteId: number, idioma: any) => {
    loading.value = true;
    error.value = null;
    
    try {
      const nuevoIdioma = await estudianteService.agregarIdioma(estudianteId, idioma);
      
      if (estudiante.value) {
        if (!estudiante.value.idiomas) {
          estudiante.value.idiomas = [];
        }
        estudiante.value.idiomas.push(nuevoIdioma);
      }
      
      return nuevoIdioma;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al agregar idioma';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Limpiar store
   */
  const reset = () => {
    estudiante.value = null;
    vacantesDisponibles.value = [];
    misPostulaciones.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // Estado
    estudiante,
    vacantesDisponibles,
    misPostulaciones,
    loading,
    error,
    
    // Computed
    perfilCompleto,
    postulacionesActivas,
    postulacionesSeleccionadas,
    
    // Acciones
    registrarEstudiante,
    cargarPerfil,
    actualizarPerfil,
    buscarVacantes,
    postularVacante,
    cargarMisPostulaciones,
    retirarPostulacion,
    agregarExperiencia,
    agregarIdioma,
    reset
  };
});