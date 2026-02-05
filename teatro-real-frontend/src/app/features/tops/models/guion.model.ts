// teatro-real-frontend/src/app/features/tops/models/guion.model.ts

/**
 * Modelos del módulo TOPS - Guiones Técnicos
 * Mapean los DTOs del backend (GuionResponse, GuionCompletoResponse)
 */

// ==================== Estados ====================

export type EstadoGuion = 'BORRADOR' | 'EN_EDICION' | 'VALIDADO' | 'PUBLICADO';

export type TipoElemento = 'TOP' | 'ENTRADA' | 'MUTIS' | 'INTERNO' | 'AVISO' | 'PASADA_ITEM' | 'INSTRUCCION_TECNICA_PASADA' | 'PLANO_ESCENARIO' | 'ANOTACION_LIBRE';

// ==================== Modelos para Lista (GuionResponse) ====================

/**
 * Guion resumido para listas y cards
 */
export interface Guion {
  id: string;
  temporada: string;
  produccionNombre: string;
  compania?: string;
  productor?: string;
  responsableEdicion?: string;
  directorEscena?: string;
  directorMusical?: string;
  subtitulo?: string;
  compositor?: string;
  version: number;
  versionNombre?: string;
  estado: EstadoGuion;
  locked: boolean;
  lockedByNombre?: string;
  lockedById?: string;
  lockedAt?: string;
  totalActos: number;
  totalTops: number;
  createdByNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Modelos para Editor (GuionCompletoResponse) ====================

/**
 * Guion completo con todo el árbol para el editor
 */
export interface GuionCompleto {
  id: string;
  temporada: string;
  produccionNombre: string;
  compania?: string;
  productor?: string;
  responsableEdicion?: string;
  directorEscena?: string;
  directorMusical?: string;
  subtitulo?: string;
  compositor?: string;
  version: number;
  versionNombre?: string;
  estado: EstadoGuion;
  locked: boolean;
  lockedByNombre?: string;
  lockedById?: string;
  lockedAt?: string;
  actos: Acto[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Acto dentro de un guion
 */
export interface Acto {
  id: string;
  nombre: string;
  orden: number;
  pasada: PasadaItem[];
  escenas: Escena[];
}

/**
 * Item de pasada (setup antes de cada acto)
 */
export interface PasadaItem {
  id: string;
  departamento?: string;
  lugar?: string;
  descripcion?: string;
  imagen?: string;
  orden: number;
}

/**
 * Escena dentro de un acto
 */
export interface Escena {
  id: string;
  nombre: string;
  duracion?: string;
  orden: number;
  elementos: ElementoGuion[];
}

/**
 * Elemento de guion (TOP, Evento, etc.)
 */
export interface ElementoGuion {
  id: string;
  tipoElemento: TipoElemento;
  numero?: string;
  refPagina?: string;
  refCompas?: string;
  refTimecode?: string;
  pagina?: string; // PIE formateado (refPagina/refCompas)
  departamento?: string;
  descripcion?: string;
  observaciones?: string;
  imagen?: string;
  colorHex?: string;
  orden: number;
}

// ==================== DTOs para Crear/Editar ====================

/**
 * Datos para crear/editar un guion
 */
export interface GuionFormData {
  temporada: string;
  produccionNombre: string;
  compania?: string;
  productor?: string;
  responsableEdicion?: string;
  directorEscena?: string;
  directorMusical?: string;
  subtitulo?: string;
  compositor?: string;
  versionNombre?: string;
}

/**
 * Datos para crear/editar un item de pasada
 */
export interface PasadaItemFormData {
  departamento?: string;
  lugar?: string;
  descripcion?: string;
  imagen?: string;
  orden?: number;
}

/**
 * Datos para crear/editar una escena
 */
export interface EscenaFormData {
  nombre: string;
  duracion?: string;
  orden?: number;
}

/**
 * Datos para crear/editar un elemento de guion
 * NOTA: Los campos se mapean al backend así:
 * - numero -> numeroTop
 * - descripcion -> encabezado
 * - observaciones -> contenido
 */
export interface ElementoGuionFormData {
  tipoElemento: TipoElemento;
  numero?: string;
  refPagina?: string;
  refCompas?: string;
  refTimecode?: string;
  departamento?: string;
  descripcion?: string;
  observaciones?: string;
  imagen?: string;
  colorHex?: string;
  orden?: number;
}

/**
 * Request para el backend (nombres de campos del backend)
 */
export interface ElementoGuionBackendRequest {
  tipoElemento: TipoElemento;
  numeroTop?: string;
  refPagina?: string;
  refCompas?: string;
  refTimecode?: string;
  departamento?: string;
  encabezado?: string;
  contenido?: string;
  imagen?: string;
  orden?: number;
}

/**
 * Convierte FormData del frontend a Request del backend
 */
export function toBackendRequest(data: ElementoGuionFormData): ElementoGuionBackendRequest {
  return {
    tipoElemento: data.tipoElemento,
    numeroTop: data.numero,
    refPagina: data.refPagina,
    refCompas: data.refCompas,
    refTimecode: data.refTimecode,
    departamento: data.departamento,
    encabezado: data.descripcion,
    contenido: data.observaciones,
    imagen: data.imagen,
    orden: data.orden
  };
}

/**
 * Datos para crear/editar un acto
 */
export interface ActoFormData {
  nombre: string;
  orden?: number;
}

// ==================== Colores de Departamento ====================

/**
 * Color configurado para un departamento en guiones
 */
export interface ColorDepartamento {
  id: string;
  departamento: string;
  colorHex: string;
  guionId: string;
}

// ==================== Utilidades ====================

/**
 * Verifica si el guion está bloqueado por otro usuario
 */
export function isLockedByOther(guion: Guion | GuionCompleto, currentUserId: string): boolean {
  return guion.locked && guion.lockedById !== currentUserId;
}

/**
 * Obtiene el color por defecto para un tipo de elemento
 * Basado en colores definidos en reglas-tops1.md
 */
export function getDefaultColorForTipo(tipo: TipoElemento): string {
  const colors: Record<TipoElemento, string> = {
    TOP: '#BDD6EE',                    // Azul claro - Instrucciones técnicas
    ENTRADA: '#FFE599',                 // Amarillo - Indicación Entrada
    MUTIS: '#FFFFFF',                   // Blanco - Indicación Mutis
    INTERNO: '#E2EFD9',                 // Verde claro - Indicación Interna
    INSTRUCCION_TECNICA_PASADA: '#BDD6EE',  // Azul claro
    PLANO_ESCENARIO: '#BDD6EE',         // Azul claro
    ANOTACION_LIBRE: '#FFFFFF',         // Blanco
    AVISO: '#FFC7CE',                    // Rosa claro - Avisos
    PASADA_ITEM: '#FFFFFF'              // Blanco
  };
  return colors[tipo] || '#FFFFFF';
}

/**
 * Labels para estados de guion
 */
export const ESTADO_LABELS: Record<EstadoGuion, string> = {
  BORRADOR: 'Borrador',
  EN_EDICION: 'En Edición',
  VALIDADO: 'Validado',
  PUBLICADO: 'Publicado'
};

/**
 * Labels para tipos de elemento
 */
export const TIPO_ELEMENTO_LABELS: Record<TipoElemento, string> = {
  TOP: 'TOP',
  ENTRADA: 'Entrada',
  MUTIS: 'Mutis',
  INTERNO: 'Interno',
  AVISO: 'Aviso',
  PASADA_ITEM: 'Pasada',
  INSTRUCCION_TECNICA_PASADA: 'Instr. Técnica',
  PLANO_ESCENARIO: 'Plano',
  ANOTACION_LIBRE: 'Anotación'
};
