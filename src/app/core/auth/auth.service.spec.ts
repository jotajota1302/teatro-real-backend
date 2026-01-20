import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Usuario, AuthResponse, PermisoModulo } from './auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const usuarioSample: Usuario = {
    id: '1',
    email: 'test@teatro.com',
    nombre: 'Sandra',
    rol: {
      id: 11,
      nombre: 'ADMIN',
      descripcion: 'Administrador',
      permisos: ['all']
    },
    activo: true,
  };

  const authResponse: AuthResponse = {
    token: 'FAKETOKEN',
    usuario: usuarioSample,
  };

  const permisosModulo: PermisoModulo[] = [
    { id: 1, usuarioId: '1', modulo: 'TEMPO', nivelAcceso: 'COMPLETO' },
    { id: 2, usuarioId: '1', modulo: 'ADMIN', nivelAcceso: 'LECTURA' }
  ];

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Limpiar localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('loginWithGoogle redirige correctamente', () => {
    const originalHref = window.location.href;
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: ''
    });
    service.loginWithGoogle();
    expect(window.location.href).toContain('/auth/google');
    window.location.href = originalHref;
  });

  it('setAuth almacena token y usuario en localStorage/signals', () => {
    // método privado, probamos vía handleAuthCallback
    service['setAuth'](authResponse.token, authResponse.usuario);
    expect(localStorage.getItem('auth_token')).toBe(authResponse.token);
    expect(JSON.parse(localStorage.getItem('auth_user')!)).toEqual(authResponse.usuario);
    expect(service.currentUser()).toEqual(authResponse.usuario);
    expect(service.getToken()).toBe(authResponse.token);
  });

  it('logout limpia signals y localStorage y navega a /auth/login', () => {
    service['setAuth'](authResponse.token, authResponse.usuario);
    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('isAdmin/etc calcula roles correctamente', () => {
    service['setAuth'](authResponse.token, authResponse.usuario);
    expect(service.isAdmin()).toBeTrue();
    expect(service.isGestor()).toBeTrue();
    expect(service.isOperador()).toBeTrue();
    expect(service.isVisualizador()).toBeFalse();
  });

  it('hasRole funciona según roles', () => {
    service['setAuth'](authResponse.token, authResponse.usuario);
    expect(service.hasRole(['ADMIN'])).toBeTrue();
    expect(service.hasRole(['OPERADOR'])).toBeFalse();
    expect(service.hasRole(['VISUALIZADOR', 'GESTOR'])).toBeFalse();

    // Cambia el usuario
    const usuarioVis: Usuario = {
      ...usuarioSample,
      rol: { ...usuarioSample.rol, nombre: 'VISUALIZADOR' }
    };
    service['setAuth']('token', usuarioVis);
    expect(service.hasRole(['VISUALIZADOR'])).toBeTrue();
    expect(service.isVisualizador()).toBeTrue();
    expect(service.isGestor()).toBeFalse();
  });

  it('loadPermisosModulo setea permisos y canAccessModule/canWriteModule funciona', () => {
    service['setAuth'](authResponse.token, authResponse.usuario);
    // Simular el response de permisos
    service['loadPermisosModulo']();
    const req = httpMock.expectOne('/api/usuarios/me/permisos-modulo');
    req.flush(permisosModulo);
    expect(service.canAccessModule('TEMPO')).toBeTrue();
    expect(service.canAccessModule('ADMIN')).toBeTrue();
    expect(service.canWriteModule('TEMPO')).toBeTrue();
    expect(service.canWriteModule('ADMIN')).toBeFalse();
  });

  it('handleAuthCallback obtiene usuario y dispara setAuth y loadPermisosModulo', () => {
    let emitted = false;
    service.handleAuthCallback('token123').subscribe(resp => {
      expect(resp).toEqual(authResponse);
      emitted = true;
    });

    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    req.flush(authResponse);

    // Simular llamada a loadPermisosModulo interna
    const reqPerm = httpMock.expectOne('/api/usuarios/me/permisos-modulo');
    reqPerm.flush(permisosModulo);
    expect(emitted).toBeTrue();
    expect(service.currentUser()).toEqual(authResponse.usuario);
  });

  it('persistencia: carga desde localStorage al iniciar', () => {
    localStorage.setItem('auth_token', authResponse.token);
    localStorage.setItem('auth_user', JSON.stringify(authResponse.usuario));
    // El servicio lo lee en constructor.
    const srv2 = TestBed.inject(AuthService);
    // Simular backend permisos
    const reqPerm = httpMock.expectOne('/api/usuarios/me/permisos-modulo');
    reqPerm.flush(permisosModulo);
    expect(srv2.currentUser()).toEqual(authResponse.usuario);
    expect(srv2.getToken()).toBe(authResponse.token);
  });
});
