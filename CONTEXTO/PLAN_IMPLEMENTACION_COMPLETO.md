# Teatro Real - Plan de Implementación Completo
## Fullstack: Angular 18 + Spring Boot 2.7 + PostgreSQL
  
---
**Proyecto:** Gestión Interna del Teatro Real
**Fecha:** 2025-12-11
**Última actualización:** 2025-12-20 (Frontend v2) / 2025-01-13 (Backend v2)
**Stack Tecnológico:**
- **Frontend:** Angular 18.2 + Angular Material 18 + TailwindCSS 3.4
- **Backend:** Spring Boot 2.7.18 + Java 8
- **Base de datos:** PostgreSQL 16 (H2 para desarrollo)
- **Autenticación:** OAuth 2.0 con Google (fase posterior)
- **Documentación API:** SpringDoc OpenAPI 1.7.0

> **Nota:** Se ha optado por Java 8 + Spring Boot 2.7.18 por compatibilidad.
> Migración a Java 21 + Spring Boot 3.x planificada para fase posterior.

---

## 1. Resumen del Proyecto

### 1.1 Módulos a Desarrollar

| Módulo | Descripción | Complejidad |
|--------|-------------|-------------|
| **ADMIN** | Usuarios, 4 roles (ADMIN, GESTOR, OPERADOR, VISUALIZADOR), departamentos (jefe + personal), temporadas, permisos por módulo (TEMPO, TOPS, ADMIN), colores de elementos TOPS | Media |
| **TEMPO** | Actividades, calendario (mensual/semanal/diario), landing semanal estilo Excel, espacios (salas y almacenes), estados de almacén (PENDIENTE → EN_TRANSITO → COMPLETADO), documentos (Local / Drive intranet), cartelería por sala y cartelería global, sincronización Google Calendar | Media-Alta |
| **TOPS** | Guiones técnicos asociados a temporadas, TOPs, pasadas, editor jerárquico con estilos tipo Word, elementos con colores configurables, adjuntos (Local / Drive intranet), vistas global/TOPs/departamento, historial de cambios | Alta |

### 1.2 Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                   Angular 18.2 + Material 18                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐ │
│  │  Auth   │  │  TEMPO  │  │  TOPS   │  │       Admin         │ │
│  │ Module  │  │ Module  │  │ Module  │  │      Module         │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └──────────┬──────────┘ │
│       │            │            │                   │            │
│       └────────────┴────────────┴───────────────────┘            │
│                              │                                   │
│                    HTTP / WebSocket                              │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                          BACKEND                                 │
│                  Spring Boot 2.7.18 + Java 8                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    REST Controllers                          ││
│  │  /api/auth  │  /api/actividades  │  /api/guiones  │  /api/* ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                      Services                                ││
│  │  AuthService │ ActividadService │ GuionService │ GCalService││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Repositories (JPA)                        ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                       PostgreSQL 16                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ usuarios │  │actividad │  │ guiones  │  │ elementos_guion  │ │
│  │  roles   │  │ espacios │  │  actos   │  │    adjuntos      │ │
│  │  deptos  │  │  tipos   │  │ escenas  │  │   historial      │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                    INTEGRACIONES                                 │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  Google Calendar │  │      Gmail       │                     │
│  │   (sync events)  │  │  (notifications) │                     │
│  └──────────────────┘  └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Estructura de Repositorios

### Opción A: Monorepo (Recomendada para equipo pequeño)
```
teatro-real/
├── backend/                    # Spring Boot
│   ├── pom.xml
│   └── src/
├── frontend/                   # Angular
│   ├── package.json
│   └── src/
├── docker-compose.yml          # Desarrollo local
├── README.md
└── docs/
    └── ...
```

### Opción B: Repositorios Separados
```
teatro-real-backend/            # Repo 1
teatro-real-frontend/           # Repo 2
```

---

## 3. Plan de Sprints

### Vista General

| Sprint | Duración | Backend | Frontend | Entregable |
|--------|----------|---------|----------|------------|
| **0** | 0.5 sem | Setup proyecto | Setup proyecto | Entorno listo |
| **1** | 1 sem | Auth + DB | Auth + Layout | Login funcional |
| **2** | 1.5 sem | TEMPO API | TEMPO UI | Calendario básico |
| **3** | 2 sem | TOPS API | TOPS UI | Editor guiones |
| **4** | 1 sem | Integraciones | Integraciones | Google Calendar, Export |
| **5** | 1 sem | Testing + Deploy | Testing + Deploy | MVP completo |

**Total: ~7 semanas**

---

## 4. Sprint 0: Setup (3-4 días)

### 4.1 Tareas Backend
| Tarea | Horas | Responsable |
|-------|-------|-------------|
| Crear proyecto Spring Boot 3.2 + Maven | 2h | Backend |
| Configurar estructura de paquetes | 2h | Backend |
| Docker Compose (PostgreSQL + pgAdmin) | 2h | Backend |
| Configurar Flyway + primera migración | 2h | Backend |
| Configurar application.yml (dev/prod) | 2h | Backend |
| **Subtotal Backend** | **10h** | |

### 4.2 Tareas Frontend
| Tarea | Horas | Responsable |
|-------|-------|-------------|
| Crear proyecto Angular 18 standalone | 2h | Frontend |
| Configurar Angular Material | 2h | Frontend |
| Configurar TailwindCSS | 2h | Frontend |
| Estructura de carpetas | 2h | Frontend |
| Environment files | 1h | Frontend |
| Proxy config para desarrollo | 1h | Frontend |
| **Subtotal Frontend** | **10h** | |

### 4.3 Entregables Sprint 0
- [x] Backend arranca sin errores
- [x] Frontend arranca sin errores
- [x] PostgreSQL corriendo en Docker
- [x] Conexión Backend ↔ DB verificada
- [x] Proxy Frontend → Backend funcionando

---

## 5. Sprint 1: Autenticación + Layout (1 semana)

### 5.1 Tareas Backend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| Migración V1: usuarios, roles, departamentos | 4h | Flyway |
| Entidades JPA: Usuario, Rol, Departamento | 4h | Domain |
| SecurityConfig + OAuth2 Google | 8h | Security |
| AuthController (login, callback, me, logout) | 4h | Controller |
| JWT Token generation/validation | 4h | Security |
| Tests de autenticación | 4h | Tests |
| **Subtotal Backend** | **28h** | |

### 5.2 Tareas Frontend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| AuthService con signals | 4h | Service |
| Auth Guard + Role Guard | 3h | Guards |
| Auth Interceptor (JWT) | 3h | Interceptor |
| Página de Login | 4h | Component |
| Main Layout (sidebar + header) | 8h | Layout |
| Sidebar con navegación | 4h | Component |
| Header con usuario/logout | 4h | Component |
| Tests de auth | 4h | Tests |
| **Subtotal Frontend** | **34h** | |

### 5.3 Entregables Sprint 1
- [x] Login con Google funcional
- [x] JWT generado y validado
- [x] Layout principal visible
- [x] Navegación entre módulos (vacíos)
- [x] Logout funcional

---

## 6. Sprint 2: Módulo TEMPO (1.5 semanas)

### 6.1 Tareas Backend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| Migración V2: espacios, tipos, actividades | 4h | Flyway |
| Entidades JPA: Espacio, TipoActividad, Actividad | 6h | Domain |
| Repositorios TEMPO | 4h | Repository |
| CRUD EspacioService | 4h | Service |
| CRUD TipoActividadService | 3h | Service |
| CRUD ActividadService | 8h | Service |
| Filtros y búsqueda actividades | 6h | Service |
| Controllers TEMPO | 8h | Controller |
| Google Calendar Service (básico) | 10h | Integration |
| Tests TEMPO | 6h | Tests |
| **Subtotal Backend** | **59h** | |

### 6.2 Tareas Frontend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| Modelos TypeScript TEMPO | 3h | Models |
| ActividadService | 4h | Service |
| EspacioService | 2h | Service |
| TipoActividadService | 2h | Service |
| Componente Calendario (FullCalendar) | 12h | Component |
| Vista mensual | 4h | Component |
| Vista semanal | 4h | Component |
| Dialog crear/editar actividad | 8h | Dialog |
| Filtros por espacio/tipo | 6h | Component |
| Lista de espacios (admin) | 4h | Component |
| Form espacio (admin) | 4h | Component |
| Lista tipos actividad (admin) | 3h | Component |
| Form tipo actividad (admin) | 3h | Component |
| Tests TEMPO | 6h | Tests |
| **Subtotal Frontend** | **65h** | |

### 6.3 Entregables Sprint 2
- [x] Calendario visual con actividades
- [x] Crear/editar/eliminar actividades
- [x] Filtrar por espacio y tipo
- [x] Colores por tipo de actividad
- [x] CRUD de espacios (admin)
- [x] CRUD de tipos de actividad (admin)

---

## 7. Sprint 3: Módulo TOPS (2 semanas)

### 7.1 Tareas Backend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| Migración V3: guiones, actos, escenas, elementos | 6h | Flyway |
| Entidades JPA: Guion, Acto, Escena, Elemento, Adjunto | 10h | Domain |
| Repositorios TOPS | 6h | Repository |
| GuionService (CRUD + bloqueo) | 10h | Service |
| Operaciones jerárquicas (crear acto/escena/elemento) | 10h | Service |
| Reordenar elementos (drag & drop API) | 6h | Service |
| Vistas (completa, tops, departamento) | 8h | Service |
| HistorialService (auditoría) | 6h | Service |
| Controllers TOPS | 10h | Controller |
| Tests TOPS | 8h | Tests |
| **Subtotal Backend** | **80h** | |

### 7.2 Tareas Frontend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| Modelos TypeScript TOPS | 4h | Models |
| GuionService | 6h | Service |
| ElementoService | 4h | Service |
| Lista de guiones | 6h | Component |
| Detalle guion (metadata) | 4h | Component |
| Form crear/editar guion | 6h | Component |
| Editor principal | 16h | Component |
| Panel de Acto (expandible) | 8h | Component |
| Panel de Escena | 8h | Component |
| Elemento item (TOP, E, M, etc.) | 8h | Component |
| Tabla de Pasada | 10h | Component |
| Dialog crear/editar TOP | 12h | Dialog |
| Drag & drop para reordenar | 10h | Feature |
| Indicador de bloqueo | 4h | Component |
| Vista solo TOPs | 6h | Component |
| Vista por departamento | 6h | Component |
| Tests TOPS | 10h | Tests |
| **Subtotal Frontend** | **128h** | |

### 7.3 Entregables Sprint 3
- [x] Lista de guiones con filtros
- [x] Crear nuevo guion con metadata
- [x] Editor jerárquico (actos → escenas → elementos)
- [x] Tabla de pasada funcional
- [x] Crear/editar TOPs con todos los campos
- [x] Drag & drop para reordenar
- [x] Bloqueo de edición exclusivo
- [x] Vistas filtradas (global, tops, departamento)

---

## 8. Sprint 4: Integraciones (1 semana)

### 8.1 Tareas Backend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| Google Calendar sync completo | 12h | Integration |
| Webhook para cambios en tiempo real | 6h | WebSocket |
| ExportWordService (Apache POI) | 10h | Service |
| NotificationService (email) | 6h | Service |
| Tests de integración | 6h | Tests |
| **Subtotal Backend** | **40h** | |

### 8.2 Tareas Frontend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| WebSocketService | 6h | Service |
| Actualización en tiempo real | 6h | Feature |
| Descarga exportación Word | 3h | Feature |
| Dashboard con widgets | 10h | Component |
| Notificaciones (snackbar/toast) | 4h | Component |
| Modo Cartelería | 8h | Component |
| Tests de integración | 6h | Tests |
| **Subtotal Frontend** | **43h** | |

### 8.3 Entregables Sprint 4
- [x] Sincronización con Google Calendar
- [x] Updates en tiempo real (WebSocket)
- [x] Exportar guion a Word
- [x] Dashboard con actividades del día
- [x] Notificaciones de cambios
- [x] Modo cartelería funcional

---

## 9. Sprint 5: Testing + Deploy (1 semana)

### 9.1 Tareas Backend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| Tests unitarios adicionales | 6h | Tests |
| Tests de integración con Testcontainers | 6h | Tests |
| Documentación OpenAPI/Swagger | 4h | Docs |
| Dockerfile + optimización | 4h | DevOps |
| Configuración producción | 4h | Config |
| Scripts de migración de datos | 4h | Scripts |
| **Subtotal Backend** | **28h** | |

### 9.2 Tareas Frontend
| Tarea | Horas | Detalle |
|-------|-------|---------|
| Tests unitarios adicionales | 6h | Tests |
| Tests E2E (Playwright) | 8h | Tests |
| Responsive / Mobile fixes | 6h | UI |
| Accesibilidad (a11y) | 4h | UI |
| Optimización bundle | 4h | Build |
| Configuración producción | 2h | Config |
| **Subtotal Frontend** | **30h** | |

### 9.3 Entregables Sprint 5
- [x] Cobertura de tests > 70%
- [x] Documentación API completa
- [x] Build de producción optimizado
- [x] Docker images listas
- [x] Responsive en tablet/móvil
- [x] MVP completo y funcional

---

## 10. Resumen de Estimación

### 10.1 Por Componente

| Componente | Horas |
|------------|-------|
| **Backend (Spring Boot)** | 245h |
| **Frontend (Angular)** | 310h |
| **Total Desarrollo** | **555h** |

### 10.2 Por Sprint

| Sprint | Backend | Frontend | Total |
|--------|---------|----------|-------|
| Sprint 0: Setup | 10h | 10h | 20h |
| Sprint 1: Auth + Layout | 28h | 34h | 62h |
| Sprint 2: TEMPO | 59h | 65h | 124h |
| Sprint 3: TOPS | 80h | 128h | 208h |
| Sprint 4: Integraciones | 40h | 43h | 83h |
| Sprint 5: Testing + Deploy | 28h | 30h | 58h |
| **TOTAL** | **245h** | **310h** | **555h** |

### 10.3 Por Módulo Funcional

| Módulo | Horas | % del Total |
|--------|-------|-------------|
| Setup + Infraestructura | 20h | 4% |
| Autenticación + Layout | 62h | 11% |
| TEMPO (Calendario) | 124h | 22% |
| TOPS (Guiones) | 208h | 37% |
| Integraciones | 83h | 15% |
| Testing + Deploy | 58h | 10% |

---

## 11. Equipo Recomendado

### Opción A: Equipo Mínimo (1 persona fullstack)
- **Duración:** ~14-16 semanas (3.5-4 meses)
- **Dedicación:** 40h/semana
- **Perfil:** Senior con experiencia en Angular + Spring Boot

### Opción B: Equipo Pequeño (2 personas)
- **Duración:** ~7-8 semanas (2 meses)
- **Dedicación:** 40h/semana cada uno
- **Perfiles:**
  - 1 Backend Senior (Spring Boot)
  - 1 Frontend Senior (Angular)

### Opción C: Equipo Completo (3-4 personas)
- **Duración:** ~5-6 semanas
- **Perfiles:**
  - 1 Backend Senior
  - 1 Frontend Senior
  - 1 Fullstack Mid
  - 1 QA (opcional)

---

## 12. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Complejidad editor TOPS | Alta | Alto | Prototipo temprano, iteraciones |
| Integración Google Calendar | Media | Medio | Spike técnico en Sprint 0 |
| Cambios de requisitos | Media | Medio | Sprints cortos, demos frecuentes |
| Rendimiento con muchos TOPs | Baja | Medio | Paginación, lazy loading |

---

## 13. Checklist de Inicio

### Antes de Sprint 0
- [x] Acceso a repositorio Git (GitHub)
- [ ] Credenciales Google Cloud (OAuth) - fase posterior
- [x] H2 Database para desarrollo (incluido)
- [ ] PostgreSQL para producción
- [x] Node.js 18+ instalado
- [x] Java 8 (JDK 1.8) instalado
- [x] IDE configurado (VS Code)

### Datos de Prueba
- [ ] Excel TEMPO 2025-2026 disponible
- [ ] Guion CARMEN disponible
- [ ] Lista de espacios confirmada
- [ ] Lista de tipos de actividad confirmada
- [ ] Lista de departamentos confirmada

---

## 14. Comandos de Desarrollo

### Backend
```bash
# Desarrollo (Windows)
cd teatro-real-backend
mvnw.cmd spring-boot:run

# Desarrollo (Linux/Mac)
cd teatro-real-backend
./mvnw spring-boot:run

# Tests
mvnw.cmd test

# Build
mvnw.cmd clean package -DskipTests

# El backend arranca en http://localhost:8080
# Swagger UI en http://localhost:8080/swagger-ui.html
```

### Frontend
```bash
# Desarrollo
cd teatro-real-frontend
npm install
npm start  # http://localhost:4200

# Tests
npm test

# Build producción
npm run build

# Watch mode (desarrollo)
npm run watch
```

### Docker Compose (desarrollo local)
```bash
# Levantar todo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## 15. URLs de Desarrollo

| Servicio | URL |
|----------|-----|
| Frontend Angular | http://localhost:4200 |
| Backend API | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| H2 Console (dev) | http://localhost:8080/h2-console |
| PostgreSQL (prod) | localhost:5432 |

### Credenciales H2 (Desarrollo)
- **JDBC URL:** jdbc:h2:mem:teatroreal
- **Usuario:** sa
- **Password:** (vacío)

---

## 16. Definición de "Done"

Una funcionalidad está **completa** cuando:

1. ✅ Código implementado y funcionando
2. ✅ Tests unitarios escritos (cobertura > 70%)
3. ✅ Código revisado (code review)
4. ✅ Sin errores en consola/logs
5. ✅ Documentación actualizada (si aplica)
6. ✅ Demo al Product Owner
7. ✅ Merge a rama principal

---

## 17. Próximos Pasos Inmediatos

1. **Confirmar stack tecnológico** ✅
   - Angular 18 + Spring Boot 3 + PostgreSQL

2. **Crear repositorio**
   - Decidir monorepo vs repos separados
   - Configurar .gitignore, README

3. **Sprint 0: Setup**
   - Crear proyectos base
   - Configurar Docker Compose
   - Verificar conexiones

4. **Sprint 1: Auth**
   - Configurar OAuth con Google
   - Implementar login completo

---

---

## 18. Roadmap de Migración Futura

### Fase 1 (Actual): Java 8 + Spring Boot 2.7.18
- Desarrollo completo de funcionalidades
- Estabilización y testing
- Despliegue en producción

### Fase 2 (Futura): Migración a Java 17/21 + Spring Boot 3.x
- Actualizar Java de 8 a 17 (mínimo para Spring Boot 3)
- Migrar dependencias javax.* a jakarta.*
- Actualizar springdoc-openapi a versión 2.x
- Testing completo post-migración

---

*Plan de Implementación Completo - Teatro Real*
*Angular 18.2 + Spring Boot 2.7.18 + Java 8*
*Fecha: 2025-12-11*
*Estimación Total: 555 horas (~7 semanas con equipo de 2)*
