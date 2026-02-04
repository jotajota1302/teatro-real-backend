import { Injectable } from '@angular/core';

/**
 * Servicio de validaciones para elementos de guiones TOPS
 * Implementa las mismas reglas que el backend
 * Usado para validaciones en tiempo real en la UI
 */
@Injectable({
  providedIn: 'root'
})
export class ValidacionService {

  // Patrones regex según especificación
  private readonly PIE_PATTERN = /^\d+\/\d+\/\d+$/;
  private readonly TOP_EM_PATTERN = /^\d+(\.\d+)?$/;

  // Departamentos válidos - Catálogo fijo según reglas
  private readonly DEPARTAMENTOS_VALIDOS = [
    'M.E.',      // Maquinaria
    'MAQ.',      // Maquillaje
    'Útil.',     // Utilería
    'Elec.',     // Eléctrica
    'A/V.',      // Audio/Video
    'Sast',      // Sastrería
    'Carac',     // Caracterización
    'Otros'      // Otros
  ];

  constructor() { }

  /**
   * Valida que PIE tenga formato x/y/z
   *
   * @param pie Referencia PIE (Página/Compás/Timecode)
   * @returns {valido: boolean, error?: string}
   */
  validarPIE(pie: string | null | undefined): { valido: boolean; error?: string } {
    if (!pie || pie.trim() === '') {
      return { valido: false, error: 'PIE es obligatorio' };
    }

    const pieTrimmed = pie.trim();
    if (!this.PIE_PATTERN.test(pieTrimmed)) {
      return {
        valido: false,
        error: `PIE debe tener formato x/y/z (ej: 4/5/4). Recibido: ${pieTrimmed}`
      };
    }

    return { valido: true };
  }

  /**
   * Valida que TOP E/M tenga formato n o n.m
   *
   * @param topEM Número TOP (ej: 120 o 120.5)
   * @returns {valido: boolean, error?: string}
   */
  validarTopEM(topEM: string | null | undefined): { valido: boolean; error?: string } {
    if (!topEM || topEM.trim() === '') {
      return { valido: false, error: 'TOP E/M es obligatorio' };
    }

    const topTrimmed = topEM.trim();
    if (!this.TOP_EM_PATTERN.test(topTrimmed)) {
      return {
        valido: false,
        error: `TOP E/M debe ser n o n.m (ej: 120 o 120.5). Recibido: ${topTrimmed}`
      };
    }

    return { valido: true };
  }

  /**
   * Valida que departamento sea de lista autorizada
   *
   * @param departamento Nombre del departamento
   * @returns {valido: boolean, error?: string}
   */
  validarDepartamento(departamento: string | null | undefined): { valido: boolean; error?: string } {
    if (!departamento || departamento.trim() === '') {
      return { valido: true }; // Opcional
    }

    const deptTrimmed = departamento.trim();
    if (!this.DEPARTAMENTOS_VALIDOS.includes(deptTrimmed)) {
      return {
        valido: false,
        error: `Departamento debe ser uno de: ${this.DEPARTAMENTOS_VALIDOS.join(', ')}. Recibido: ${deptTrimmed}`
      };
    }

    return { valido: true };
  }

  /**
   * Valida que encabezado no esté vacío
   *
   * @param encabezado Texto del encabezado
   * @returns {valido: boolean, error?: string}
   */
  validarEncabezadoObligatorio(encabezado: string | null | undefined): { valido: boolean; error?: string } {
    if (!encabezado || encabezado.trim() === '') {
      return { valido: false, error: 'Encabezado es obligatorio' };
    }

    return { valido: true };
  }

  /**
   * Valida rich-text: permite solo bold, viñetas, colores negro/rojo
   *
   * @param richText Texto con formato
   * @returns {valido: boolean, error?: string}
   */
  validarRichText(richText: string | null | undefined): { valido: boolean; error?: string } {
    if (!richText || richText.trim() === '') {
      return { valido: true }; // Permitir vacío
    }

    // Por ahora validación permisiva
    // Futuro: validar que solo contenga <b>, <i>, <ul>, <li>, estilos color negro/rojo
    return { valido: true };
  }

  /**
   * Formatea PIE desde componentes individuales
   *
   * @param pagina Número de página
   * @param compas Número de compás
   * @param timecode Timecode
   * @returns String formateado "x/y/z" o null si alguno es null
   */
  formatearPIE(pagina: string | number | null | undefined,
               compas: string | number | null | undefined,
               timecode: string | number | null | undefined): string | null {
    if (pagina === null || pagina === undefined ||
        compas === null || compas === undefined ||
        timecode === null || timecode === undefined) {
      return null;
    }

    return `${pagina}/${compas}/${timecode}`;
  }

  /**
   * Parsea PIE desde formato "x/y/z"
   *
   * @param pieFormateado String en formato "x/y/z"
   * @returns {pagina: string, compas: string, timecode: string} o null si formato inválido
   */
  parsearPIE(pieFormateado: string | null | undefined): { pagina: string; compas: string; timecode: string } | null {
    if (!pieFormateado || pieFormateado.trim() === '') {
      return null;
    }

    const parts = pieFormateado.trim().split('/');
    if (parts.length !== 3) {
      return null;
    }

    return {
      pagina: parts[0].trim(),
      compas: parts[1].trim(),
      timecode: parts[2].trim()
    };
  }

  /**
   * Obtiene lista de departamentos válidos
   *
   * @returns Array de departamentos
   */
  getDepartamentosValidos(): string[] {
    return [...this.DEPARTAMENTOS_VALIDOS];
  }
}
