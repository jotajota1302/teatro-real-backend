import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';

export interface AuditLog {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  userId: number | null;
  userEmail: string | null;
  timestamp: string;
  diffJson: string | null;
}

/**
 * Panel de historial de cambios para guiones
 * Muestra el audit log de un guión con acciones: CREATE, UPDATE, DELETE, REORDER, LOCK, UNLOCK
 */
@Component({
  selector: 'app-audit-log-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DatePipe
  ],
  template: `
    <div class="audit-log-panel bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Header -->
      <div class="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 class="font-semibold text-gray-800 text-sm flex items-center gap-2">
          <mat-icon class="!text-lg text-gray-500">history</mat-icon>
          Historial de cambios
        </h3>
        <button mat-icon-button
                (click)="loadAuditLog()"
                [disabled]="loading()"
                matTooltip="Actualizar">
          <mat-icon class="!text-lg">refresh</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="p-3 max-h-80 overflow-y-auto">
        @if (loading()) {
          <div class="flex justify-center py-4">
            <mat-spinner diameter="24"></mat-spinner>
          </div>
        } @else if (error()) {
          <div class="text-center py-4 text-red-500 text-sm">
            {{ error() }}
          </div>
        } @else if (logs().length === 0) {
          <div class="text-center py-4 text-gray-400 text-sm">
            No hay registros de cambios
          </div>
        } @else {
          <div class="space-y-2">
            @for (log of logs(); track log.id) {
              <div class="flex items-start gap-3 p-2 rounded hover:bg-gray-50 text-xs">
                <!-- Icono de acción -->
                <div class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                     [class]="getActionClass(log.action)">
                  <mat-icon class="!text-sm">{{ getActionIcon(log.action) }}</mat-icon>
                </div>

                <!-- Contenido -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-800">{{ getActionLabel(log.action) }}</span>
                    <span class="text-gray-400">·</span>
                    <span class="text-gray-500">{{ log.entityType }}</span>
                  </div>
                  <div class="text-gray-500 mt-0.5">
                    {{ log.userEmail || 'Sistema' }}
                  </div>
                  <div class="text-gray-400 mt-0.5">
                    {{ log.timestamp | date:'dd/MM/yyyy HH:mm' }}
                  </div>

                  <!-- Diff (si existe) -->
                  @if (log.diffJson && showDiff()) {
                    <details class="mt-1">
                      <summary class="text-blue-600 cursor-pointer hover:underline">
                        Ver cambios
                      </summary>
                      <pre class="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">{{ formatDiff(log.diffJson) }}</pre>
                    </details>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Footer -->
      @if (logs().length > 0) {
        <div class="p-2 border-t border-gray-200 text-center">
          <button class="text-xs text-blue-600 hover:text-blue-800"
                  (click)="toggleShowDiff()">
            {{ showDiff() ? 'Ocultar detalles' : 'Mostrar detalles' }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .audit-log-panel {
      min-width: 280px;
    }
  `]
})
export class AuditLogPanelComponent implements OnInit {
  private http = inject(HttpClient);

  @Input() guionId!: string;

  logs = signal<AuditLog[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showDiff = signal(false);

  ngOnInit(): void {
    this.loadAuditLog();
  }

  loadAuditLog(): void {
    if (!this.guionId) return;

    this.loading.set(true);
    this.error.set(null);

    this.http.get<AuditLog[]>(`${environment.apiUrl}/tops/audit/guion/${this.guionId}`).subscribe({
      next: (logs) => {
        // Ordenar por fecha descendente
        this.logs.set(logs.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading audit log:', err);
        this.error.set('Error al cargar historial');
        this.loading.set(false);
      }
    });
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      'CREATE': 'add_circle',
      'UPDATE': 'edit',
      'DELETE': 'delete',
      'REORDER': 'swap_vert',
      'LOCK': 'lock',
      'UNLOCK': 'lock_open',
      'EXECUTE': 'play_arrow'
    };
    return icons[action] || 'info';
  }

  getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      'CREATE': 'Creado',
      'UPDATE': 'Modificado',
      'DELETE': 'Eliminado',
      'REORDER': 'Reordenado',
      'LOCK': 'Bloqueado',
      'UNLOCK': 'Desbloqueado',
      'EXECUTE': 'Ejecutado'
    };
    return labels[action] || action;
  }

  getActionClass(action: string): string {
    const classes: Record<string, string> = {
      'CREATE': 'bg-green-100 text-green-600',
      'UPDATE': 'bg-blue-100 text-blue-600',
      'DELETE': 'bg-red-100 text-red-600',
      'REORDER': 'bg-purple-100 text-purple-600',
      'LOCK': 'bg-orange-100 text-orange-600',
      'UNLOCK': 'bg-gray-100 text-gray-600',
      'EXECUTE': 'bg-cyan-100 text-cyan-600'
    };
    return classes[action] || 'bg-gray-100 text-gray-600';
  }

  formatDiff(diffJson: string): string {
    try {
      const parsed = JSON.parse(diffJson);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return diffJson;
    }
  }

  toggleShowDiff(): void {
    this.showDiff.update(v => !v);
  }
}
