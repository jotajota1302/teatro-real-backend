// core/auth/auth.models.ts

/** Modelo de Usuario para autenticación con roles v2 */
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  avatarUrl?: string;
  rol: Rol;
  departamento?: Departamento;
  activo: boolean;
  ultimoAcceso?: Date;
}

/** Tipo de rol estricto v2 */
export type RolNombre = 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'VISUALIZADOR';

export interface Rol {
  id: number;
  nombre: RolNombre;
  descripcion: string;
  permisos: string[];
}

/** Respuesta de login/auth */
export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

/** Permisos por módulo */
export type Modulo = 'TEMPO' | 'TOPS' | 'ADMIN';
export type NivelAcceso = 'LECTURA' | 'ESCRITURA' | 'COMPLETO' | 'NINGUNO';

export interface PermisoModulo {
  id: number;
  usuarioId: string;
  modulo: Modulo;
  nivelAcceso: NivelAcceso;
}

// Departamento mínimo (definición alineada a interfaces v2)
export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  ambito: string;
  colorHex?: string;
  descripcion?: string;
  jefeId?: string;
  jefe?: Usuario;
  personalIds?: string[];
  personal?: Usuario[];
}
