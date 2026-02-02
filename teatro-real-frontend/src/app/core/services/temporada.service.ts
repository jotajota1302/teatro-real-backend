import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Temporada } from '../../features/tempo/models/actividad.model';

@Injectable({ providedIn: 'root' })
export class TemporadaService {
  private readonly API_URL = `${environment.apiUrl}/temporadas`;

  private temporadasSignal = signal<Temporada[]>([]);
  private selectedTemporadaSignal = signal<Temporada | null>(null);

  // Mock data para desarrollo sin backend
  private readonly mockTemporadas: Temporada[] = [
    {
      id: 1,
      nombre: '2024/2025',
      fechaInicio: '2024-09-01',
      fechaFin: '2025-07-31',
      activa: true
    },
    {
      id: 2,
      nombre: '2023/2024',
      fechaInicio: '2023-09-01',
      fechaFin: '2024-07-31',
      activa: false
    }
  ];

  temporadas = this.temporadasSignal.asReadonly();
  selectedTemporada = this.selectedTemporadaSignal.asReadonly();

  temporadaActiva = computed(() =>
    this.temporadasSignal().find(t => t.activa) || null
  );

  // Flag para saber si ya se cargaron las temporadas
  private loaded = false;

  constructor(private http: HttpClient) {
    // NO cargar automáticamente en constructor - usar lazy load
    // Los componentes que necesiten temporadas llamarán loadTemporadas() o ensureLoaded()
  }

  /**
   * Asegura que las temporadas estén cargadas (lazy load).
   * Ideal para llamar desde componentes antes de usar temporadas.
   */
  ensureLoaded(): void {
    if (!this.loaded && this.temporadasSignal().length === 0) {
      this.loadTemporadas().subscribe();
    }
  }

  loadTemporadas(): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(this.API_URL).pipe(
      tap(temporadas => {
        this.loaded = true;
        this.temporadasSignal.set(temporadas);
        const activa = temporadas.find(t => t.activa);
        if (activa && !this.selectedTemporadaSignal()) {
          this.selectedTemporadaSignal.set(activa);
        }
      }),
      catchError(() => {
        // Fallback a mock data cuando no hay backend
        this.loaded = true;
        this.temporadasSignal.set(this.mockTemporadas);
        const activa = this.mockTemporadas.find(t => t.activa);
        if (activa) {
          this.selectedTemporadaSignal.set(activa);
        }
        return of(this.mockTemporadas);
      })
    );
  }

  selectTemporada(temporada: Temporada): void {
    this.selectedTemporadaSignal.set(temporada);
  }

  create(data: Partial<Temporada>): Observable<Temporada> {
    return this.http.post<Temporada>(this.API_URL, data);
  }

  update(id: number, data: Partial<Temporada>): Observable<Temporada> {
    return this.http.put<Temporada>(`${this.API_URL}/${id}`, data);
  }

  setActiva(id: number): Observable<Temporada> {
    return this.http.put<Temporada>(`${this.API_URL}/${id}/activar`, {});
  }
}
