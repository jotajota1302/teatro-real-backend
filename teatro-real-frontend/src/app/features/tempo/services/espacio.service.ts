// teatro-real-frontend/src/app/features/tempo/services/espacio.service.ts

import { Injectable, signal } from '@angular/core';
import { Observable, of, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Espacio } from '../models/actividad.model';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface TempoEspacioDto {
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
  private readonly baseUrl = '/api/espacios';
  private readonly fallbackEspacios: TempoEspacioDto[] = [
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
   * Carga todos los espacios disponibles.
   */
  loadEspacios(): Observable<Espacio[]> {
    this.loadingSignal.set(true);
    return this.api.get<ApiResponse<Espacio[]>>(this.baseUrl).pipe(
      map(response => response.data ?? []),
      catchError(() => {
        const fallback = this.fallbackEspacios as unknown as Espacio[];
        this.espaciosSignal.set(fallback);
        this.loadingSignal.set(false);
        return of(fallback);
      }),
      tap(espacios => {
        this.espaciosSignal.set(espacios);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Recupera los espacios diseñados para el nuevo dashboard TEMPO.
   */
  obtenerEspaciosResumen(): Observable<TempoEspacioDto[]> {
    return this.api.get<ApiResponse<TempoEspacioDto[]>>(this.baseUrl).pipe(
      map(result => (result.data && result.data.length ? result.data : this.fallbackEspacios)),
      catchError(() => of(this.fallbackEspacios))
    );
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
}
