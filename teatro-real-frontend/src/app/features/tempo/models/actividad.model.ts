// teatro-real-frontend/src/app/features/tempo/models/actividad.model.ts

/**
 * Modelo principal de actividad para el módulo TEMPO.
 * Incluye todos los campos y relaciones actualizados según el Plan v2.
 */

export interface Actividad {
  /** Identificador único de la actividad */
  id: string;
  /** Título de la actividad */
  titulo: string;
  /** Tipo de actividad (relación) */
  tipoActividad: TipoActividad;
  /** Espacio relacionado donde se desarrolla la actividad */
  espacio: Espacio;
  /** Fecha de la actividad (ISO date: yyyy-MM-dd) */
  fecha: string;
  /** Hora de inicio (HH:mm) */
  horaInicio: string;
  /** Hora de fin (HH:mm) */
  horaFin: string;
  /** Departamento responsable (opcional) */
  departamento?: Departamento;
  /** Notas libres (opcional) */
  notas?: string;
  /** NUEVO v2: Id de temporada asociada (opcional) */
  temporadaId?: number;
  /** NUEVO v2: Temporada asociada (opcional) */
  temporada?: Temporada;
  /** NUEVO v2: Descripción ampliada (opcional) */
  descripcion?: string;
  // ----- Campos específicos para actividades de almacén -----
  /** Tipo de movimiento de almacén */
  tipoMovimiento?: 'RECOGIDA' | 'SALIDA';
  /** Número de camiones asignados */
  numCamiones?: number;
  /** Lugar de origen para traslado */
  lugarOrigen?: string;
  /** Lugar de destino para traslado */
  lugarDestino?: string;
  /** Nombre de la producción implicada (opcional) */
  produccionNombre?: string;
  /** Estado logístico de la actividad de almacén */
  estado?: 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO';
  // ----- Documentos asociados -----
  /** Listado de documentos relacionados (local o Drive Intranet) */
  documentos?: ActividadDocumento[];
  // ----- Información de auditoría -----
  createdBy?: Usuario;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Documento asociado a la actividad, compatible con doble origen.
 */
export interface ActividadDocumento {
  id: number;
  actividadId: string;
  nombre: string;
  url: string;
  origen: 'LOCAL' | 'DRIVE_INTRANET';
  driveFileId?: string; // Solo si es Drive
  orden: number;
}

/**
 * Datos para creación/edición de actividades.
 */
export interface ActividadFormData {
  titulo: string;
  tipoActividadId: number;
  espacioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  departamentoId?: number;
  notas?: string;
  // NUEVO v2:
  temporadaId?: number;
  descripcion?: string;
  // Opcionales de almacén:
  tipoMovimiento?: 'RECOGIDA' | 'SALIDA';
  numCamiones?: number;
  lugarOrigen?: string;
  lugarDestino?: string;
  produccionNombre?: string;
}

/**
 * Espacio: sala, almacén, escenario... donde se ubica la actividad.
 */
export interface Espacio {
  id: number;
  nombre: string;
  tipo: 'SALA' | 'ALMACEN';
  googleCalendarId?: string;
  capacidad?: number;
  ubicacion?: string;
  activo: boolean;
  orden: number;
  // NUEVO v2:
  color?: string;
  dimensiones?: string;
}

/**
 * Tipología de la actividad (ensayo, función, montaje, etc.)
 */
export interface TipoActividad {
  id: number;
  nombre: string;
  colorHex: string;
  aplicaA: 'SALA' | 'ALMACEN' | 'AMBOS';
  descripcion?: string;
  orden: number;
}

/**
 * Departamento responsable, con ampliaciones v2 (jefe, personal).
 */
export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  ambito: string;
  colorHex?: string;
  // NUEVO v2:
  descripcion?: string;
  jefeId?: string;
  jefe?: Usuario;
  personalIds?: string[];
  personal?: Usuario[];
}

/**
 * Temporada del teatro ("2024/2025", etc.).
 */
export interface Temporada {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}

/**
 * Filtro para búsquedas/calendario de actividades TEMPO
 */
export interface CalendarioFilter {
  espacioId?: number;
  tipoActividadId?: number;
  departamentoId?: number;
  temporadaId?: number;
  fechaInicio: string;
  fechaFin: string;
}

/**
 * Rol de usuario para tipado en DepartamentoFormComponent y otros lugares.
 */
export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: any[];
}

/**
 * Usuario básico (importar de auth.models si aplica, aquí solo para tipado mínimo)
 */
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatarUrl?: string;
  rol: Rol;
}
