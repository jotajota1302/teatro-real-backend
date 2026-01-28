// teatro-real-frontend/src/app/features/tempo/services/espacio.service.ts

import { Injectable, signal } from '@angular/core';
import { Observable, throwError, catchError, map, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { Espacio } from '../models/actividad.model';
import { environment } from '../../../../environments/environment';

// Respuesta del backend (EspacioResponse.java)
interface EspacioBackend {
  id: number;
  nombre: string;
  tipo: string;
  googleCalendarId?: string;
  color?: string;
  capacidad?: number;
  dimensiones?: string;
  ubicacion?: string;
  activo: boolean;
  orden?: number;
}

export interface TempoEspacioDto {
  id?: number;
  nombre: string;
  tipo: string;
  categoria: 'Salas' | 'Ensayo' | 'Talleres' | 'Almacenes' | 'Espacios';
  icon: string;
  disponible: boolean;
  descripcion: string;
  capacidad: string;
  dimensiones: string;
  accentColor: string;
  necesitaCalendario: boolean;
}

/**
 * Servicio para gestión CRUD de espacios (salas, almacenes, etc) módulo TEMPO.
 * Patrón: signals + métodos asíncronos.
 */
@Injectable({ providedIn: 'root' })
export class EspacioService {
  private espaciosSignal = signal<Espacio[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private readonly baseUrl = `${environment.apiUrl}/espacios`;

  error = this.errorSignal.asReadonly();

  // Datos de ejemplo para referencia (no se usan como fallback)
  private readonly ejemploEspacios: TempoEspacioDto[] = [
    {
      nombre: 'Escenario Principal',
      tipo: 'Escenario',
      categoria: 'Salas',
      icon: 'theater_comedy',
      disponible: false,
      descripcion: 'Escenario principal del Teatro Real con platea y parrilla completa',
      capacidad: '1746 PERS.',
      dimensiones: '24M X 18M',
      accentColor: '#0D2C54',
      necesitaCalendario: true
    },
    {
      nombre: 'Sala Gayarre',
      tipo: 'Sala de ensayos',
      categoria: 'Salas',
      icon: 'meeting_room',
      disponible: true,
      descripcion: 'Sala para ensayos y pequeñas producciones',
      capacidad: '200 PERS.',
      dimensiones: '15M X 12M',
      accentColor: '#0F5A33',
      necesitaCalendario: true
    },
    {
      nombre: 'Sala S.E.P.E.',
      tipo: 'Sala de ensayo',
      categoria: 'Salas',
      icon: 'music_note',
      disponible: true,
      descripcion: 'Sala de ensayos con réplica de escenario',
      capacidad: '100 PERS.',
      dimensiones: '20M X 15M',
      accentColor: '#7A1FDE',
      necesitaCalendario: true
    },
    {
      nombre: 'Salón Arrieta',
      tipo: 'Reuniones',
      categoria: 'Ensayo',
      icon: 'record_voice_over',
      disponible: true,
      descripcion: 'Sala de reuniones para equipos creativos',
      capacidad: '30 PERS.',
      dimensiones: '10M X 8M',
      accentColor: '#F3352E',
      necesitaCalendario: false
    },
    {
      nombre: 'Salón Falla',
      tipo: 'Conferencias',
      categoria: 'Ensayo',
      icon: 'book',
      disponible: true,
      descripcion: 'Sala de conferencias y eventos corporativos',
      capacidad: '150 PERS.',
      dimensiones: '18M X 12M',
      accentColor: '#2F9E44',
      necesitaCalendario: false
    },
    {
      nombre: 'Taller de Sastrería',
      tipo: 'Taller',
      categoria: 'Talleres',
      icon: 'construction',
      disponible: true,
      descripcion: 'Confección y mantenimiento de vestuario',
      capacidad: '20 PERS.',
      dimensiones: '12M X 10M',
      accentColor: '#E58B0F',
      necesitaCalendario: false
    },
    {
      nombre: 'Taller de Utilería',
      tipo: 'Taller',
      categoria: 'Talleres',
      icon: 'handyman',
      disponible: true,
      descripcion: 'Creación de atrezzo y utilería escénica',
      capacidad: '15 PERS.',
      dimensiones: '10M X 10M',
      accentColor: '#0D9C6F',
      necesitaCalendario: false
    },
    {
      nombre: 'Almacén de Vestuario',
      tipo: 'Almacén',
      categoria: 'Almacenes',
      icon: 'inventory_2',
      disponible: true,
      descripcion: 'Almacén organizado por producción',
      capacidad: '5000M²',
      dimensiones: '40M X 25M',
      accentColor: '#45126D',
      necesitaCalendario: false
    },
    {
      nombre: 'Almacén Arganda',
      tipo: 'Almacén',
      categoria: 'Almacenes',
      icon: 'storage',
      disponible: false,
      descripcion: 'Espacio de almacenaje para escenografías',
      capacidad: '3000M²',
      dimensiones: '35M X 15M',
      accentColor: '#0F5A33',
      necesitaCalendario: true
    }
  ];

  espacios = this.espaciosSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor(private api: ApiService) {}

  /**
   * Mapea la respuesta del backend al formato TempoEspacioDto del frontend.
   */
  private mapBackendToDto(e: EspacioBackend): TempoEspacioDto {
    // Determinar categoría según el tipo
    const tipoUpper = (e.tipo || '').toUpperCase();
    let categoria: TempoEspacioDto['categoria'] = 'Espacios';
    let icon = 'meeting_room';

    if (tipoUpper === 'SALA' || tipoUpper.includes('SALA')) {
      categoria = 'Salas';
      icon = 'theater_comedy';
    } else if (tipoUpper === 'ALMACEN' || tipoUpper.includes('ALMACEN')) {
      categoria = 'Almacenes';
      icon = 'inventory_2';
    } else if (tipoUpper === 'TALLER' || tipoUpper.includes('TALLER')) {
      categoria = 'Talleres';
      icon = 'construction';
    } else if (tipoUpper === 'CAMERINO' || tipoUpper.includes('CAMERINO')) {
      categoria = 'Ensayo';
      icon = 'checkroom';
    }

    return {
      id: e.id,
      nombre: e.nombre,
      tipo: e.tipo,
      categoria,
      icon,
      disponible: e.activo ?? true,
      descripcion: e.ubicacion || '',
      capacidad: e.capacidad ? `${e.capacidad} PERS.` : '',
      dimensiones: e.dimensiones || '',
      accentColor: e.color || '#0D2C54',
      necesitaCalendario: !!e.googleCalendarId
    };
  }

  /**
   * Carga todos los espacios disponibles.
   */
  loadEspacios(): Observable<Espacio[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    // El backend devuelve directamente un array, no un wrapper
    return this.api.get<EspacioBackend[]>(this.baseUrl).pipe(
      map(espacios => espacios as unknown as Espacio[]),
      tap(espacios => {
        this.espaciosSignal.set(espacios);
        this.loadingSignal.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.loadingSignal.set(false);
        const errorMsg = this.getErrorMessage(error);
        this.errorSignal.set(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Recupera los espacios diseñados para el nuevo dashboard TEMPO.
   */
  obtenerEspaciosResumen(): Observable<TempoEspacioDto[]> {
    this.errorSignal.set(null);
    // El backend devuelve directamente un array de EspacioBackend
    return this.api.get<EspacioBackend[]>(this.baseUrl).pipe(
      map(espacios => {
        if (espacios && espacios.length > 0) {
          return espacios.map(e => this.mapBackendToDto(e));
        }
        return [];
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMsg = this.getErrorMessage(error);
        this.errorSignal.set(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se puede conectar con el servidor. Verifique que el backend está en ejecución.';
    } else if (error.status === 404) {
      return 'Recurso no encontrado';
    } else if (error.status === 500) {
      return 'Error interno del servidor';
    }
    return error.error?.message || 'Error de conexión con el servidor';
  }

  /**
   * Devuelve un espacio por ID.
   */
  getById(id: number): Observable<Espacio> {
    return this.api.get<Espacio>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea nuevo espacio.
   */
  create(data: Partial<Espacio>): Observable<Espacio> {
    return this.api.post<Espacio>(this.baseUrl, data).pipe(
      tap(nuevo => {
        this.espaciosSignal.update(list => [...list, nuevo]);
      })
    );
  }

  /**
   * Actualiza un espacio existente.
   */
  update(id: number, data: Partial<Espacio>): Observable<Espacio> {
    return this.api.put<Espacio>(`${this.baseUrl}/${id}`, data).pipe(
      tap(updated => {
        this.espaciosSignal.update(list =>
          list.map(e => (e.id === id ? updated : e))
        );
      })
    );
  }

  /**
   * Elimina un espacio.
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.espaciosSignal.update(list => list.filter(e => e.id !== id));
      })
    );
  }

  /**
   * Mapea TempoEspacioDto al formato del backend (EspacioRequest)
   */
  private mapDtoToBackend(dto: Partial<TempoEspacioDto>): Partial<EspacioBackend> {
    // Extraer número de capacidad (ej: "200 PERS." -> 200)
    let capacidad: number | undefined;
    if (dto.capacidad) {
      const match = dto.capacidad.match(/(\d+)/);
      capacidad = match ? parseInt(match[1], 10) : undefined;
    }

    // Usar el tipo directamente (ya viene en formato backend: SALA, ALMACEN, TALLER, CAMERINO)
    const tipo = dto.tipo || 'SALA';

    return {
      nombre: dto.nombre,
      tipo,
      color: dto.accentColor,
      capacidad,
      dimensiones: dto.dimensiones,
      ubicacion: dto.descripcion,
      activo: dto.disponible ?? true,
      googleCalendarId: dto.necesitaCalendario ? 'pending' : undefined
    };
  }

  /**
   * Crea un espacio desde TempoEspacioDto y devuelve TempoEspacioDto.
   */
  createFromDto(dto: TempoEspacioDto): Observable<TempoEspacioDto> {
    const backendData = this.mapDtoToBackend(dto);
    return this.api.post<EspacioBackend>(this.baseUrl, backendData).pipe(
      map(created => this.mapBackendToDto(created))
    );
  }

  /**
   * Actualiza un espacio desde TempoEspacioDto y devuelve TempoEspacioDto.
   */
  updateFromDto(id: number, dto: TempoEspacioDto): Observable<TempoEspacioDto> {
    const backendData = this.mapDtoToBackend(dto);
    return this.api.put<EspacioBackend>(`${this.baseUrl}/${id}`, backendData).pipe(
      map(updated => this.mapBackendToDto(updated))
    );
  }
}
