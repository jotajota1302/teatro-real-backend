// teatro-real-frontend/src/app/core/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Servicio de abstracción HTTP para consumo de APIs REST con tipado seguro.
 * Ofrece métodos genéricos y helpers para blob/download, típico en Angular enterprise.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Resuelve la URL completa. Si la URL empieza con /api, usa el baseUrl del environment.
   */
  private resolveUrl(url: string): string {
    if (url.startsWith('/api')) {
      // Reemplaza /api con la URL base del environment (que ya termina en /api)
      return url.replace('/api', this.baseUrl);
    }
    return url;
  }

  /**
   * GET tipado
   */
  get<T>(url: string, params?: any): Observable<T> {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    return this.http.get<T>(this.resolveUrl(url), { params: httpParams });
  }

  /**
   * POST tipado
   * Nota: Este método SOLO soporta 'observe: body'. Si necesitas otra opción, usa HttpClient directamente.
   */
  post<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: HttpParams | { [param: string]: string | string[] }; observe?: 'body'; responseType?: 'json'; }
  ): Observable<T> {
    return this.http.post<T>(this.resolveUrl(url), body, options);
  }

  /**
   * PUT tipado
   * Nota: Este método SOLO soporta 'observe: body'. Si necesitas otra opción, usa HttpClient directamente.
   */
  put<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: HttpParams | { [param: string]: string | string[] }; observe?: 'body'; responseType?: 'json'; }
  ): Observable<T> {
    return this.http.put<T>(this.resolveUrl(url), body, options);
  }

  /**
   * DELETE tipado
   * Nota: Este método SOLO soporta 'observe: body'. Si necesitas otra opción, usa HttpClient directamente.
   */
  delete<T>(
    url: string,
    options?: { headers?: HttpHeaders; params?: HttpParams | { [param: string]: string | string[] }; observe?: 'body'; responseType?: 'json'; }
  ): Observable<T> {
    return this.http.delete<T>(this.resolveUrl(url), options);
  }

  /**
   * Descarga blobs/binary (Excel, PDF, etc.).
   */
  downloadBlob(url: string, params?: any): Observable<Blob> {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    return this.http.get(this.resolveUrl(url), { params: httpParams, responseType: 'blob' });
  }
}
