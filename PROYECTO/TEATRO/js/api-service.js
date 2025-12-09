/**
 * api-service.js - Servicio de API para TEATRO REAL
 * Gestiona todas las llamadas HTTP al backend
 */

// Configuración de la API
const API_CONFIG = {
  baseURL: 'http://localhost:8081/api',
  timeout: 5000
};

/**
 * Realiza una petición HTTP genérica
 * @param {string} endpoint - Ruta del endpoint
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {object} data - Datos a enviar (para POST/PUT)
 * @returns {Promise<any>} Respuesta del servidor
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Para DELETE sin contenido
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}

/**
 * ========================
 * SERVICIOS DE ESPACIOS
 * ========================
 */

/**
 * Obtiene todos los espacios
 * @returns {Promise<Array>} Lista de espacios
 */
async function getEspacios() {
  try {
    return await apiRequest('/tempo/espacios', 'GET');
  } catch (error) {
    console.error('Error al obtener espacios:', error);
    return [];
  }
}

/**
 * Obtiene espacios activos
 * @returns {Promise<Array>} Lista de espacios activos
 */
async function getEspaciosActivos() {
  try {
    return await apiRequest('/tempo/espacios/activos', 'GET');
  } catch (error) {
    console.error('Error al obtener espacios activos:', error);
    return [];
  }
}

/**
 * Obtiene un espacio por ID
 * @param {string} id - ID del espacio
 * @returns {Promise<Object>} Datos del espacio
 */
async function getEspacioById(id) {
  try {
    return await apiRequest(`/tempo/espacios/${id}`, 'GET');
  } catch (error) {
    console.error(`Error al obtener espacio ${id}:`, error);
    throw error;
  }
}

/**
 * Obtiene un espacio por nombre
 * @param {string} nombre - Nombre del espacio
 * @returns {Promise<Object>} Datos del espacio
 */
async function getEspacioByNombre(nombre) {
  try {
    return await apiRequest(`/tempo/espacios/nombre/${nombre}`, 'GET');
  } catch (error) {
    console.error(`Error al obtener espacio por nombre ${nombre}:`, error);
    throw error;
  }
}

/**
 * Crea un nuevo espacio
 * @param {Object} espacioData - Datos del espacio
 * @returns {Promise<Object>} Espacio creado
 */
async function createEspacio(espacioData) {
  try {
    return await apiRequest('/tempo/espacios', 'POST', espacioData);
  } catch (error) {
    console.error('Error al crear espacio:', error);
    throw error;
  }
}

/**
 * Actualiza un espacio existente
 * @param {string} id - ID del espacio
 * @param {Object} espacioData - Datos a actualizar
 * @returns {Promise<Object>} Espacio actualizado
 */
async function updateEspacio(id, espacioData) {
  try {
    return await apiRequest(`/tempo/espacios/${id}`, 'PUT', espacioData);
  } catch (error) {
    console.error(`Error al actualizar espacio ${id}:`, error);
    throw error;
  }
}

/**
 * Activa un espacio
 * @param {string} id - ID del espacio
 * @returns {Promise<Object>} Resultado de la operación
 */
async function activarEspacio(id) {
  try {
    return await apiRequest(`/tempo/espacios/${id}/activar`, 'PUT');
  } catch (error) {
    console.error(`Error al activar espacio ${id}:`, error);
    throw error;
  }
}

/**
 * Desactiva un espacio
 * @param {string} id - ID del espacio
 * @returns {Promise<Object>} Resultado de la operación
 */
async function desactivarEspacio(id) {
  try {
    return await apiRequest(`/tempo/espacios/${id}/desactivar`, 'PUT');
  } catch (error) {
    console.error(`Error al desactivar espacio ${id}:`, error);
    throw error;
  }
}

/**
 * Elimina un espacio
 * @param {string} id - ID del espacio
 * @returns {Promise<Object>} Resultado de la operación
 */
async function deleteEspacio(id) {
  try {
    return await apiRequest(`/tempo/espacios/${id}`, 'DELETE');
  } catch (error) {
    console.error(`Error al eliminar espacio ${id}:`, error);
    throw error;
  }
}

/**
 * ========================
 * SERVICIOS DE ACTIVIDADES
 * ========================
 */

/**
 * Obtiene todas las actividades
 * @returns {Promise<Array>} Lista de actividades
 */
async function getActividades() {
  try {
    return await apiRequest('/tempo/actividades', 'GET');
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    return [];
  }
}

/**
 * Obtiene una actividad por ID
 * @param {string} id - ID de la actividad
 * @returns {Promise<Object>} Datos de la actividad
 */
async function getActividadById(id) {
  try {
    return await apiRequest(`/tempo/actividades/${id}`, 'GET');
  } catch (error) {
    console.error(`Error al obtener actividad ${id}:`, error);
    throw error;
  }
}

/**
 * Obtiene actividades por espacio
 * @param {string} espacioId - ID del espacio
 * @returns {Promise<Array>} Lista de actividades
 */
async function getActividadesByEspacio(espacioId) {
  try {
    return await apiRequest(`/tempo/actividades/espacio/${espacioId}`, 'GET');
  } catch (error) {
    console.error(`Error al obtener actividades del espacio ${espacioId}:`, error);
    return [];
  }
}

/**
 * Obtiene actividades por responsable
 * @param {string} responsable - Nombre del responsable
 * @returns {Promise<Array>} Lista de actividades
 */
async function getActividadesByResponsable(responsable) {
  try {
    return await apiRequest(`/tempo/actividades/responsable/${responsable}`, 'GET');
  } catch (error) {
    console.error(`Error al obtener actividades del responsable ${responsable}:`, error);
    return [];
  }
}

/**
 * Obtiene actividades en un rango de fechas
 * @param {string} inicio - Fecha de inicio (ISO 8601)
 * @param {string} fin - Fecha de fin (ISO 8601)
 * @returns {Promise<Array>} Lista de actividades
 */
async function getActividadesByRango(inicio, fin) {
  try {
    return await apiRequest(`/tempo/actividades/rango?inicio=${inicio}&fin=${fin}`, 'GET');
  } catch (error) {
    console.error('Error al obtener actividades por rango:', error);
    return [];
  }
}

/**
 * Crea una nueva actividad
 * @param {Object} actividadData - Datos de la actividad
 * @returns {Promise<Object>} Actividad creada
 */
async function createActividad(actividadData) {
  try {
    return await apiRequest('/tempo/actividades', 'POST', actividadData);
  } catch (error) {
    console.error('Error al crear actividad:', error);
    throw error;
  }
}

/**
 * Actualiza una actividad existente
 * @param {string} id - ID de la actividad
 * @param {Object} actividadData - Datos a actualizar
 * @returns {Promise<Object>} Actividad actualizada
 */
async function updateActividad(id, actividadData) {
  try {
    return await apiRequest(`/tempo/actividades/${id}`, 'PUT', actividadData);
  } catch (error) {
    console.error(`Error al actualizar actividad ${id}:`, error);
    throw error;
  }
}

/**
 * Modifica el horario de una actividad
 * @param {string} id - ID de la actividad
 * @param {string} nuevoInicio - Nuevo horario de inicio (ISO 8601)
 * @param {string} nuevoFin - Nuevo horario de fin (ISO 8601)
 * @returns {Promise<Object>} Actividad actualizada
 */
async function modificarHorarioActividad(id, nuevoInicio, nuevoFin) {
  try {
    return await apiRequest(
      `/tempo/actividades/${id}/horario?nuevoInicio=${nuevoInicio}&nuevoFin=${nuevoFin}`,
      'PUT'
    );
  } catch (error) {
    console.error(`Error al modificar horario de actividad ${id}:`, error);
    throw error;
  }
}

/**
 * Elimina una actividad
 * @param {string} id - ID de la actividad
 * @returns {Promise<Object>} Resultado de la operación
 */
async function deleteActividad(id) {
  try {
    return await apiRequest(`/tempo/actividades/${id}`, 'DELETE');
  } catch (error) {
    console.error(`Error al eliminar actividad ${id}:`, error);
    throw error;
  }
}

/**
 * ========================
 * FUNCIONES DE UTILIDAD
 * ========================
 */

/**
 * Verifica la disponibilidad del backend
 * @returns {Promise<boolean>} true si el backend está disponible
 */
async function checkBackendAvailability() {
  try {
    await apiRequest('/tempo/espacios', 'GET');
    return true;
  } catch (error) {
    console.warn('Backend no disponible:', error.message);
    return false;
  }
}

/**
 * Obtiene un resumen del estado actual del teatro
 * @returns {Promise<Object>} Resumen con conteos
 */
async function getResumen() {
  try {
    const espacios = await getEspacios();
    const actividades = await getActividades();
    
    return {
      totalEspacios: espacios.length,
      espaciosActivos: espacios.filter(e => e.activo).length,
      totalActividades: actividades.length,
      actividadesPendientes: actividades.filter(a => !a.sincronizadaGoogleCalendar).length
    };
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    return null;
  }
}

// Exportar funciones para uso global
window.APIService = {
  // Espacios
  getEspacios,
  getEspaciosActivos,
  getEspacioById,
  getEspacioByNombre,
  createEspacio,
  updateEspacio,
  activarEspacio,
  desactivarEspacio,
  deleteEspacio,
  
  // Actividades
  getActividades,
  getActividadById,
  getActividadesByEspacio,
  getActividadesByResponsable,
  getActividadesByRango,
  createActividad,
  updateActividad,
  modificarHorarioActividad,
  deleteActividad,
  
  // Utilidad
  checkBackendAvailability,
  getResumen
};
