import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

export interface LogisticaStatDto {
  programados: number;
  enTransito: number;
  completados: number;
  camionesHoy: number;
}

export interface OperacionLogisticaDto {
  id: number;
  nombre: string;
  estado: 'Programado' | 'En tránsito' | 'Completado' | 'Pendiente';
  estadoColor: string;
  icon: string;
  desde: string;
  hacia: string;
  fecha: string;
  hora: string;
  camiones: number;
  detalle: string;
  tipo?: string;
}

@Injectable({ providedIn: 'root' })
export class LogisticaService {
  private readonly summaryUrl = '/api/logistica/summary';
  private readonly operacionesUrl = '/api/logistica/operaciones';

  private readonly fallbackStats: LogisticaStatDto = {
    programados: 1,
    enTransito: 0,
    completados: 6,
    camionesHoy: 0
  };

  private readonly fallbackOperaciones: OperacionLogisticaDto[] = [
    {
      id: 1,
      nombre: 'Carmen',
      estado: 'Programado',
      estadoColor: '#F87171',
      icon: 'arrow_forward',
      desde: 'Arganda-Campa',
      hacia: 'Londres',
      fecha: '2026-01-30',
      hora: '12:00',
      camiones: 15,
      detalle: 'Salida internacional con escenografía completa',
      tipo: 'Cargas'
    },
    {
      id: 2,
      nombre: 'Tosca - Coproducción',
      estado: 'Completado',
      estadoColor: '#34D399',
      icon: 'arrow_back',
      desde: 'Teatro Liceu Barcelona',
      hacia: 'Arganda-Campa',
      fecha: '2025-12-10',
      hora: '22:00',
      camiones: 5,
      detalle: 'Llegada nocturna - descarga completa',
      tipo: 'Descargas'
    },
    {
      id: 3,
      nombre: 'La Traviata',
      estado: 'Pendiente',
      estadoColor: '#FBBF24',
      icon: 'departure_board',
      desde: 'Camerinos',
      hacia: 'Escenario Principal',
      fecha: '2026-01-25',
      hora: '08:00',
      camiones: 8,
      detalle: 'Traslado de vestuario y utilería',
      tipo: 'Transportes'
    }
  ];

  constructor(private readonly http: HttpClient) {}

  obtenerResumen(): Observable<LogisticaStatDto> {
    return this.http.get<LogisticaStatDto>(this.summaryUrl).pipe(
      catchError(() => of(this.fallbackStats))
    );
  }

  operacionesRecientes(): Observable<OperacionLogisticaDto[]> {
    return this.http.get<OperacionLogisticaDto[]>(this.operacionesUrl).pipe(
      catchError(() => of(this.fallbackOperaciones))
    );
  }
}
