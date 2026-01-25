import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map, catchError } from 'rxjs';

export interface LogisticaStatDto {
  programados: number;
  enTransito: number;
  completados: number;
  camionesHoy: number;
}

export interface OperacionLogisticaDto {
  id: string;
  nombre: string;
  estado: 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO';
  estadoColor: string;
  estadoLabel: string;
  icon: string;
  desde: string;
  hacia: string;
  fecha: string;
  hora: string;
  horaFin?: string;
  camiones: number;
  detalle: string;
  tipo?: string;
  tipoMovimiento?: 'ENTRADA' | 'SALIDA' | 'INTERNO';
  produccionNombre?: string;
}

export interface CrearOperacionDto {
  tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'INTERNO';
  produccionNombre: string;
  lugarOrigen: string;
  lugarDestino: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  numCamiones: number;
  descripcion?: string;
}

// Respuesta del backend (ActividadResponse)
interface ActividadResponse {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipoMovimiento: string;
  numCamiones: number;
  lugarOrigen: string;
  lugarDestino: string;
  produccionNombre: string;
  espacio?: { id: string; nombre: string };
  tipoActividad?: { id: string; nombre: string; colorHex: string };
}

@Injectable({ providedIn: 'root' })
export class LogisticaService {
  private readonly baseUrl = '/api/logistica';

  constructor(private readonly http: HttpClient) {}

  obtenerResumen(): Observable<LogisticaStatDto> {
    return this.http.get<LogisticaStatDto>(`${this.baseUrl}/summary`).pipe(
      catchError(this.handleError)
    );
  }

  operacionesRecientes(): Observable<OperacionLogisticaDto[]> {
    return this.http.get<ActividadResponse[]>(`${this.baseUrl}/operaciones`).pipe(
      map(ops => ops.map(op => this.mapToOperacion(op))),
      catchError(this.handleError)
    );
  }

  getCalendario(inicio: string, fin: string): Observable<OperacionLogisticaDto[]> {
    return this.http.get<ActividadResponse[]>(`${this.baseUrl}/calendario`, {
      params: { inicio, fin }
    }).pipe(
      map(ops => ops.map(op => this.mapToOperacion(op))),
      catchError(this.handleError)
    );
  }

  iniciarTransito(id: string): Observable<OperacionLogisticaDto> {
    return this.http.put<ActividadResponse>(`${this.baseUrl}/operaciones/${id}/iniciar-transito`, {}).pipe(
      map(op => this.mapToOperacion(op))
    );
  }

  completar(id: string): Observable<OperacionLogisticaDto> {
    return this.http.put<ActividadResponse>(`${this.baseUrl}/operaciones/${id}/completar`, {}).pipe(
      map(op => this.mapToOperacion(op))
    );
  }

  reiniciar(id: string): Observable<OperacionLogisticaDto> {
    return this.http.put<ActividadResponse>(`${this.baseUrl}/operaciones/${id}/reiniciar`, {}).pipe(
      map(op => this.mapToOperacion(op))
    );
  }

  crear(operacion: CrearOperacionDto): Observable<OperacionLogisticaDto> {
    return this.http.post<ActividadResponse>(`${this.baseUrl}/operaciones`, operacion).pipe(
      map(op => this.mapToOperacion(op))
    );
  }

  getAlmacenes(): Observable<{ id: number; nombre: string; ubicacion: string }[]> {
    return this.http.get<{ id: number; nombre: string; ubicacion: string }[]>(`${this.baseUrl}/almacenes`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error de conexión con el servidor';

    if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor. Verifique que el backend está en ejecución.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('LogisticaService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  private mapToOperacion(op: ActividadResponse): OperacionLogisticaDto {
    const estado = op.estado as 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO';

    // Colores según estado
    const estadoColors: Record<string, string> = {
      'PENDIENTE': '#FBBF24',   // Amarillo
      'EN_TRANSITO': '#3B82F6', // Azul
      'COMPLETADO': '#34D399'   // Verde
    };

    // Labels para mostrar
    const estadoLabels: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'EN_TRANSITO': 'En tránsito',
      'COMPLETADO': 'Completado'
    };

    // Iconos según tipo de movimiento
    const tipoIcons: Record<string, string> = {
      'ENTRADA': 'arrow_back',      // Recogida
      'SALIDA': 'arrow_forward',    // Salida
      'INTERNO': 'swap_horiz'       // Interno
    };

    // Tipos para filtros
    const tipoLabels: Record<string, string> = {
      'ENTRADA': 'Descargas',
      'SALIDA': 'Cargas',
      'INTERNO': 'Transportes'
    };

    return {
      id: op.id,
      nombre: op.produccionNombre || op.titulo,
      estado,
      estadoColor: estadoColors[estado] || '#6B7280',
      estadoLabel: estadoLabels[estado] || estado,
      icon: tipoIcons[op.tipoMovimiento] || 'local_shipping',
      desde: op.lugarOrigen || '',
      hacia: op.lugarDestino || '',
      fecha: op.fecha,
      hora: op.horaInicio,
      horaFin: op.horaFin,
      camiones: op.numCamiones || 0,
      detalle: op.descripcion || '',
      tipo: tipoLabels[op.tipoMovimiento] || 'Otros',
      tipoMovimiento: op.tipoMovimiento as 'ENTRADA' | 'SALIDA' | 'INTERNO',
      produccionNombre: op.produccionNombre
    };
  }
}
