import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Departamento } from '../../features/tempo/models/actividad.model';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private readonly API_URL = `${environment.apiUrl}/departamentos`;

  private departamentosSignal = signal<Departamento[]>([]);

  departamentos = this.departamentosSignal.asReadonly();

  constructor(private http: HttpClient) {
    this.loadDepartamentos().subscribe();
  }

  loadDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.API_URL).pipe(
      tap(departamentos => this.departamentosSignal.set(departamentos))
    );
  }

  getById(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.API_URL}/${id}`);
  }

  create(data: Partial<Departamento>): Observable<Departamento> {
    return this.http.post<Departamento>(this.API_URL, data);
  }

  update(id: number, data: Partial<Departamento>): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
