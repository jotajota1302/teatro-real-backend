export type TipoActividadCalendario =
  | 'FUNCION'
  | 'ENSAYO_PIANO'
  | 'ENSAYO_MUSICAL'
  | 'ENSAYO_TECNICO'
  | 'MONTAJE'
  | 'DESMONTAJE'
  | 'EVENTO_EXTERNO'
  | 'RESERVA'
  | 'PAUSA_TECNICA'
  | 'LIMPIEZA'
  | 'DISPONIBLE'
  | 'OTRO';

export type EstadoActividadCalendario = 'PROVISIONAL' | 'CONFIRMADA' | 'CANCELADA';

export interface ActividadCalendario {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  espacioId: number;
  tipo: TipoActividadCalendario;
  estado: EstadoActividadCalendario;
  titulo: string;
  detalle?: string;
  /** Color hexadecimal del tipo de actividad (para estilos dinámicos) */
  colorHex?: string;
}

export interface FranjaCalendario {
  horaInicio: string;
  horaFin: string;
  actividadesPorEspacio: Record<number, ActividadCalendario[]>;
}

export type NombreDia =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo';

export interface DiaCalendario {
  nombre: NombreDia;
  fecha: string;
  franjas: FranjaCalendario[];
}

export interface SemanaCalendario {
  numeroSemana: number;
  anioSemana: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'PROVISIONAL' | 'DEFINITIVA';
  dias: DiaCalendario[];
}

export interface EspacioCalendario {
  id: number;
  nombre: string;
  codigo: string;
}

