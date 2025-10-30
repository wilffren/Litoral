import api from '../api/axios.config';
import type {
  Estudiante,
  RegistroEstudianteDTO,
  ExperienciaLaboral,
  EducacionInformal,
  Idioma,
  Herramienta
} from '../models/Estudiante';
import type { Vacante, Postulacion, FiltrosVacante } from '../models/Vacante';

/**
 * Servicio para gestión de estudiantes
 * Maneja todas las operaciones relacionadas con estudiantes
 */
export const estudianteService = {
  /**
   * Registrar un nuevo estudiante
   */
  async registrar(data: RegistroEstudianteDTO): Promise<Estudiante> {
    const response = await api.post('/estudiantes', data);
    return response.data;
  },

  /**
   * Obtener perfil del estudiante
   */
  async obtenerPerfil(id: number): Promise<Estudiante> {
    const response = await api.get(`/estudiantes/${id}`);
    return response.data;
  },

  /**
   * Actualizar perfil del estudiante
   */
  async actualizarPerfil(id: number, data: Partial<Estudiante>): Promise<Estudiante> {
    const response = await api.put(`/estudiantes/${id}`, data);
    return response.data;
  },

  /**
   * Obtener todos los estudiantes (solo admin)
   */
  async obtenerTodos(filtros?: {
    search?: string;
    programa?: string;
    semestre?: number;
  }): Promise<Estudiante[]> {
    const response = await api.get('/estudiantes', { params: filtros });
    return response.data;
  },

  // === EXPERIENCIA LABORAL ===

  /**
   * Agregar experiencia laboral
   */
  async agregarExperiencia(
    estudianteId: number,
    experiencia: Omit<ExperienciaLaboral, 'id' | 'estudiante_id'>
  ): Promise<ExperienciaLaboral> {
    const response = await api.post(
      `/estudiantes/${estudianteId}/experiencias`,
      experiencia
    );
    return response.data;
  },

  /**
   * Actualizar experiencia laboral
   */
  async actualizarExperiencia(
    experienciaId: number,
    data: Partial<ExperienciaLaboral>
  ): Promise<ExperienciaLaboral> {
    const response = await api.put(`/experiencias/${experienciaId}`, data);
    return response.data;
  },

  /**
   * Eliminar experiencia laboral
   */
  async eliminarExperiencia(experienciaId: number): Promise<void> {
    await api.delete(`/experiencias/${experienciaId}`);
  },

  // === EDUCACIÓN INFORMAL ===

  /**
   * Agregar educación informal
   */
  async agregarEducacion(
    estudianteId: number,
    educacion: Omit<EducacionInformal, 'id' | 'estudiante_id'>
  ): Promise<EducacionInformal> {
    const response = await api.post(
      `/estudiantes/${estudianteId}/educacion-informal`,
      educacion
    );
    return response.data;
  },

  /**
   * Eliminar educación informal
   */
  async eliminarEducacion(educacionId: number): Promise<void> {
    await api.delete(`/educacion-informal/${educacionId}`);
  },

  // === IDIOMAS ===

  /**
   * Agregar idioma
   */
  async agregarIdioma(
    estudianteId: number,
    idioma: Omit<Idioma, 'id' | 'estudiante_id'>
  ): Promise<Idioma> {
    const response = await api.post(`/estudiantes/${estudianteId}/idiomas`, idioma);
    return response.data;
  },

  /**
   * Eliminar idioma
   */
  async eliminarIdioma(idiomaId: number): Promise<void> {
    await api.delete(`/idiomas/${idiomaId}`);
  },

  // === HERRAMIENTAS ===

  /**
   * Agregar herramienta
   */
  async agregarHerramienta(
    estudianteId: number,
    herramienta: Omit<Herramienta, 'id' | 'estudiante_id'>
  ): Promise<Herramienta> {
    const response = await api.post(
      `/estudiantes/${estudianteId}/herramientas`,
      herramienta
    );
    return response.data;
  },

  /**
   * Eliminar herramienta
   */
  async eliminarHerramienta(herramientaId: number): Promise<void> {
    await api.delete(`/herramientas/${herramientaId}`);
  },

  // === VACANTES Y POSTULACIONES ===

  /**
   * Buscar vacantes disponibles
   */
  async buscarVacantes(filtros?: FiltrosVacante): Promise<Vacante[]> {
    const response = await api.get('/vacantes', { params: filtros });
    return response.data;
  },

  /**
   * Obtener detalle de una vacante
   */
  async obtenerVacante(vacanteId: number): Promise<Vacante> {
    const response = await api.get(`/vacantes/${vacanteId}`);
    return response.data;
  },

  /**
   * Postularse a una vacante
   */
  async postularVacante(vacanteId: number, estudianteId: number): Promise<Postulacion> {
    const response = await api.post('/postulaciones', {
      vacante_id: vacanteId,
      estudiante_id: estudianteId
    });
    return response.data;
  },

  /**
   * Obtener mis postulaciones
   */
  async obtenerMisPostulaciones(estudianteId: number): Promise<Postulacion[]> {
    const response = await api.get(`/estudiantes/${estudianteId}/postulaciones`);
    return response.data;
  },

  /**
   * Retirar postulación
   */
  async retirarPostulacion(postulacionId: number): Promise<void> {
    await api.delete(`/postulaciones/${postulacionId}`);
  }
};