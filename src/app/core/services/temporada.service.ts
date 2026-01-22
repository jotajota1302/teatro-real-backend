import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Temporada } from '../../features/tempo/models/actividad.model';

@Injectable({ providedIn: 'root' })
export class TemporadaService {
  private readonly API_URL = `${environment.apiUrl}/temporadas`;

  private temporadasSignal = signal<Temporada[]>([]);
  private selectedTemporadaSignal = signal<Temporada | null>(null);

  temporadas = this.temporadasSignal.asReadonly();
  selectedTemporada = this.selectedTemporadaSignal.asReadonly();

  // Temporada activa (actual)
  temporadaActiva = computed(() =>
    this.temporadasSignal().find(t => t.activa) || null
  );

  constructor(private http: HttpClient) {
    this.loadTemporadas().subscribe();
  }

  loadTemporadas(): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(this.API_URL).pipe(
      tap(temporadas => {
        this.temporadasSignal.set(temporadas);
        // Seleccionar temporada activa por defecto
        const activa = temporadas.find(t => t.activa);
        if (activa && !this.selectedTemporadaSignal()) {
          this.selectedTemporadaSignal.set(activa);
        }
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
