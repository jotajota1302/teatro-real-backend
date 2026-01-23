# Desglose de Tareas - Gestión Interna Teatro Real (TEMPO + TOPS)
## Planificación Ejecutiva Completa

---

## 1. Desglose Detallado por Historia de Usuario

### HU-001: Crear Actividad en TEMPO
**Línea 5 - 19**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-001.1** | Diseño BD Actividades | Crear tablas: activities, activity_types, spaces, users | Backend/DBA | Ninguna | 8 | Must |
| **T-001.2** | API REST POST /activities | Endpoint crear actividad con validación obligatorios | Backend | T-001.1 | 12 | Must |
| **T-001.3** | Formulario crear actividad | Componente Angular con campos dinámicos | Frontend | T-001.1 | 10 | Must |
| **T-001.4** | Google Calendar sync | Integración llamada API Google Calendar al crear | Backend | T-001.2 | 10 | Should |
| **T-001.5** | Sistema notificaciones | Email/notificaciones internas automáticas | Backend | T-001.2 | 8 | Should |
| **T-001.6** | Tests unitarios API | JUnit 5 + Mockito para POST /activities | QA | T-001.2 | 6 | Must |
| **T-001.7** | Tests E2E formulario | TestCafe: crear actividad completo | QA | T-001.3 | 8 | Must |
| **T-001.8** | Documentación API | Swagger/OpenAPI endpoint POST | DevOps | T-001.2 | 2 | Should |

**Total HU-001**: 64 horas | **Duración**: 8 días

---

### HU-002: Consultar Agenda por Espacio
**Línea 21 - 32**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-002.1** | API GET /spaces/:id/activities | Endpoint lectura actividades por espacio | Backend | T-001.1 | 6 | Must |
| **T-002.2** | Componente agenda visual | Grid/tabla con actividades por espacio | Frontend | T-001.1 | 12 | Must |
| **T-002.3** | Filtros y búsqueda | Filtrar por fecha, tipo, responsable | Frontend | T-002.2 | 8 | Should |
| **T-002.4** | Vista cartelería digital | Pantalla pública de agenda (sin edición) | Frontend | T-002.2 | 8 | Should |
| **T-002.5** | Caché y optimización lectura | Implementar caché en BD y cliente | Backend | T-002.1 | 6 | Should |
| **T-002.6** | Tests unitarios API | JUnit: GET /spaces/:id/activities | QA | T-002.1 | 4 | Must |
| **T-002.7** | Tests UI agenda | Jasmine: renderizado, filtros | QA | T-002.2 | 6 | Must |

**Total HU-002**: 50 horas | **Duración**: 6 días

---

### HU-003: Crear Guión Técnico
**Línea 34 - 50**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-003.1** | Diseño BD Guiones | Tablas: scripts, acts, pasadas, scenes, tops, versions, audit_log | Backend/DBA | Ninguna | 10 | Must |
| **T-003.2** | Modelado jerárquico | Implementar Act→Pasada→Escena→Top con relaciones | Backend | T-003.1 | 8 | Must |
| **T-003.3** | Mecanismo lock/unlock | Exclusividad edición (mutex, timeout 30min) | Backend | T-003.1 | 10 | Must |
| **T-003.4** | API CRUD guiones | POST/GET/PUT /scripts con validaciones | Backend | T-003.1, T-003.2, T-003.3 | 14 | Must |
| **T-003.5** | UI editor jerárquico | Árbol expandible, drag-drop, columnas dinámicas | Frontend | T-003.1 | 16 | Must |
| **T-003.6** | Historial versionado | Snapshots, rollback, diff entre versiones | Backend | T-003.4 | 10 | Should |
| **T-003.7** | Adjuntos (partitura, planos) | Upload/download, validar tipos, límite tamaño | Backend/Frontend | T-003.4 | 8 | Should |
| **T-003.8** | Tests concurrencia | Validar lock exclusivo, timeout funcionan | QA | T-003.3 | 6 | Must |
| **T-003.9** | Tests UI editor | Crear/editar estructura, validar guardado | QA | T-003.5 | 8 | Must |

**Total HU-003**: 90 horas | **Duración**: 11 días

---

### HU-004: Añadir Top al Guión
**Línea 52 - 65**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-004.1** | Modelo datos Top | Tabla tops con número único, compás, departamento | Backend/DBA | T-003.1 | 6 | Must |
| **T-004.2** | Validación unicidad Tops | Garantizar número único por producción | Backend | T-004.1 | 4 | Must |
| **T-004.3** | API CRUD Tops | POST/GET/PUT /scripts/:id/tops | Backend | T-003.4, T-004.1 | 10 | Must |
| **T-004.4** | UI elemento Top | Componente agregar/editar Top en editor | Frontend | T-003.5 | 8 | Must |
| **T-004.5** | Sub-Tops (números decimales) | Soporte 23.1, 23.2 dentro Top 23 | Frontend | T-004.4 | 4 | Should |
| **T-004.6** | Tests CRUD Tops | JUnit: crear, actualizar, validar unicidad | QA | T-004.3 | 6 | Must |
| **T-004.7** | Tests UI Tops | Jasmine: agregar, editar, eliminar Tops | QA | T-004.4 | 6 | Must |

**Total HU-004**: 44 horas | **Duración**: 6 días

---

### HU-005: Gestionar Logística Arganda
**Línea 67 - 79**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-005.1** | BD logística | Tablas: warehouse_movements, estado, material, camión | Backend/DBA | Ninguna | 8 | Must |
| **T-005.2** | API CRUD movimientos | POST/GET/PUT /logistics con auditoría completa | Backend | T-005.1 | 12 | Must |
| **T-005.3** | Validación datos obligatorios | Confirmar completitud antes de confirmar | Backend | T-005.2 | 4 | Must |
| **T-005.4** | UI gestión logística | Formulario recogida/salida, tracking | Frontend | T-005.1 | 10 | Must |
| **T-005.5** | Reportes logística | Exportar movimientos por período | Backend | T-005.2 | 6 | Should |
| **T-005.6** | Tests CRUD logística | JUnit: crear, validar, auditar movimientos | QA | T-005.2 | 6 | Must |
| **T-005.7** | Tests UI logística | Jasmine: completar formulario, validaciones | QA | T-005.4 | 6 | Must |

**Total HU-005**: 52 horas | **Duración**: 7 días

---

### HU-006: Gestionar Usuarios y Roles
**Línea 81 - 99**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-006.1** | Diseño BD RBAC | Tablas: users, roles, permissions, role_permissions | Backend/DBA | Ninguna | 10 | Must |
| **T-006.2** | Google OAuth2 | Integración login con Google Workspace | Backend/Security | Ninguna | 12 | Must |
| **T-006.3** | JWT tokens | Generación, refresh, revoke, validación | Backend/Security | T-006.2 | 6 | Must |
| **T-006.4** | RBAC middleware | Validar roles en cada endpoint (Authorization) | Backend/Security | T-006.1, T-006.3 | 8 | Must |
| **T-006.5** | API CRUD usuarios | POST/GET/PUT /users (Admin solo) | Backend | T-006.1 | 10 | Must |
| **T-006.6** | UI asignación roles | Panel admin: asignar/revocar roles | Frontend | T-006.1 | 8 | Must |
| **T-006.7** | Logout automático | Session timeout 30 min con warning | Backend | T-006.3 | 4 | Should |
| **T-006.8** | Tests autenticación | JUnit: login exitoso, fallido, token inválido | QA | T-006.2, T-006.3 | 6 | Must |
| **T-006.9** | Tests autorización | JUnit: validar denegación sin rol adecuado | QA | T-006.4 | 6 | Must |
| **T-006.10** | Tests UI gestión | Jasmine: CRUD usuarios, asignar roles | QA | T-006.5, T-006.6 | 8 | Must |

**Total HU-006**: 78 horas | **Duración**: 10 días

---

### HU-007: Configurar Parámetros Sistema
**Línea 101 - 111**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-007.1** | BD parámetros | Tabla config_params: clave, valor, tipo | Backend/DBA | Ninguna | 4 | Must |
| **T-007.2** | API configuración | GET/PUT /admin/config con validaciones | Backend | T-007.1 | 8 | Must |
| **T-007.3** | Paleta de colores | Configurar códigos RGB por tipo/espacio | Backend | T-007.1 | 4 | Must |
| **T-007.4** | UI panel admin | Interfaz editar colores, espacios, departamentos | Frontend | T-007.1 | 12 | Must |
| **T-007.5** | Validación parámetros | Rango valores, formato, restricciones | Backend | T-007.2 | 4 | Should |
| **T-007.6** | Tests API config | JUnit: GET/PUT, validar cambios persisten | QA | T-007.2 | 4 | Must |
| **T-007.7** | Tests UI config | Jasmine: modificar parámetros, guardar | QA | T-007.4 | 4 | Must |

**Total HU-007**: 40 horas | **Duración**: 5 días

---

### HU-008: Visualizar Guión en Tablets/Móviles
**Línea 113 - 124**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-008.1** | Diseño responsive | Breakpoints móvil: <768px, tablet: 768-1024px | Frontend | T-003.5 | 8 | Must |
| **T-008.2** | Optimización carga | Lazy loading, compresión de datos, caché local | Frontend | T-003.5 | 10 | Should |
| **T-008.3** | Modo offline básico | Service Worker, almacenar guión localmente | Frontend | T-008.2 | 12 | Could |
| **T-008.4** | Táctil interactivo | Gestos swipe, zoom, táctil para marcar Tops | Frontend | T-008.1 | 8 | Must |
| **T-008.5** | Tests responsive | Jasmine + Protractor: verificar múltiples resoluciones | QA | T-008.1 | 6 | Must |
| **T-008.6** | Tests performance móvil | Medir LCP, FID, CLS en tablets/móviles | QA | T-008.2 | 6 | Should |

**Total HU-008**: 50 horas | **Duración**: 7 días

---

### HU-009: Exportar Guión a Word
**Línea 126 - 138**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-009.1** | Librería exportación | Integrar Apache POI o docx4j para generar .docx | Backend | T-003.1 | 8 | Must |
| **T-009.2** | Plantilla Word | Diseñar estructura documento: actos, pasadas, Tops, timestamps | Backend | T-009.1 | 6 | Must |
| **T-009.3** | API exportación | GET /scripts/:id/export?format=word | Backend | T-003.4, T-009.1 | 6 | Must |
| **T-009.4** | UI botón descargar | Componente descarga en Editor | Frontend | T-009.3 | 4 | Must |
| **T-009.5** | Tests API exportación | JUnit: generar .docx, validar estructura | QA | T-009.3 | 6 | Must |
| **T-009.6** | Tests UI descarga | Jasmine: clic botón, descarga archivo | QA | T-009.4 | 4 | Must |

**Total HU-009**: 34 horas | **Duración**: 4 días

---

### HU-010: Recibir Notificaciones de Cambios
**Línea 140 - 150**

| T-ID | Tarea | Descripción | Rol Responsable | Dependencias | Estimación (h) | Prioridad |
|------|-------|-------------|-----------------|--------------|----------------|-----------|
| **T-010.1** | Eventos sistema | Event listener/publish-subscribe para cambios | Backend | T-001.1 | 6 | Must |
| **T-010.2** | WebSocket real-time | Conexión bidireccional para actualizaciones vivo | Backend | T-010.1 | 10 | Must |
| **T-010.3** | Notificaciones UI | Toast/banner cuando llegan cambios | Frontend | T-010.2 | 6 | Must |
| **T-010.4** | Filtrado notificaciones | Usuario elige qué eventos recibe | Frontend | T-010.3 | 4 | Should |
| **T-010.5** | Tests WebSocket | JUnit: conectar, enviar/recibir eventos | QA | T-010.2 | 6 | Must |
| **T-010.6** | Tests UI notificaciones | Jasmine: mostrar, descartar toasts | QA | T-010.3 | 4 | Must |

**Total HU-010**: 36 horas | **Duración**: 5 días

---

## 2. Resumen Ejecutivo de Tareas

| Métrica | Valor |
|---------|-------|
| **Total Historias de Usuario** | 10 |
| **Total Tareas Identificadas** | 68 |
| **Horas Estimadas Totales** | 562 horas |
| **Duración en Semanas** | 18 semanas |
| **Tareas Must Have** | 52 (76%) |
| **Tareas Should Have** | 14 (21%) |
| **Tareas Could Have** | 2 (3%) |
| **FTE Recomendado** | 9 personas |

---

## 3. Timeline de Sprints (PLANIFICACIÓN COMIENZA EN LÍNEA 155)

### **Sprint 0: Setup e Infraestructura (Semana 1)**
- **Duración**: 5 días | **Horas**: 40h
- Google OAuth2 setup
- Setup Google Cloud / On-premise
- Inicialización repositorio Git
- Configuración CI/CD pipeline
- **Go/No-Go**: Entorno listo para desarrollo

### **Sprint 1: Base Autenticación y TEMPO v1 (Semanas 2-3)**
- **Duración**: 10 días | **Horas**: 90h
- RBAC, OAuth2, JWT (T-006.1, T-006.2, T-006.3)
- API crear actividades (T-001.1, T-001.2)
- Parámetros sistema (T-007.1, T-007.2)
- **Go/No-Go**: Autenticación funcional + 1 actividad creada

### **Sprint 2: TEMPO Avanzado y Logística (Semanas 4-5)**
- **Duración**: 10 días | **Horas**: 85h
- UI TEMPO, lectura agenda (T-001.3, T-002.1, T-002.2)
- Filtros y cartelería (T-002.3, T-002.4)
- Logística Arganda (T-005.1, T-005.2, T-005.4)
- Google Calendar sync (T-001.4)
- **Go/No-Go**: Agenda visualizada + logística registrada

### **Sprint 3: Configuración y Notificaciones (Semanas 6-7)**
- **Duración**: 10 días | **Horas**: 80h
- UI admin parámetros (T-007.4)
- Sistema notificaciones (T-001.5)
- WebSocket eventos reales (T-010.1, T-010.2)
- CRUD usuarios, roles (T-006.5, T-006.6)
- Testing completo HU-001 a HU-005
- **Go/No-Go**: Panel admin funcional + notificaciones activas

### **Sprint 4-5: Editor Guiones v1 (Semanas 8-12) — HITO CRÍTICO**
- **Duración**: 20 días | **Horas**: 180h
- BD y lock/unlock (T-003.1, T-003.2, T-003.3)
- API CRUD y UI editor jerárquico (T-003.4, T-003.5)
- Historial y adjuntos (T-003.6, T-003.7)
- Modelo Tops y API (T-004.1, T-004.2, T-004.3)
- Testing concurrencia y UI (T-003.8, T-003.9, T-004.6, T-004.7)
- **Go/No-Go**: Editor de guiones estable + Tops únicos + lock exclusivo validado

### **Sprint 6: Tops Completos y Mobile (Semana 13-14)**
- **Duración**: 10 días | **Horas**: 75h
- UI Tops y sub-Tops (T-004.4, T-004.5)
- Diseño responsive + interactividad táctil (T-008.1, T-008.4)
- Tests responsive (T-008.5)
- Notificaciones en UI (T-010.3, T-010.4)
- **Go/No-Go**: Guion editable en tablet + Tops navegables

### **Sprint 7: Exportación y Performance (Semana 15)**
- **Duración**: 5 días | **Horas**: 55h
- Exportación a Word (T-009.1, T-009.2, T-009.3, T-009.4)
- Optimización y performance móvil (T-008.2, T-008.6)
- Caché optimización (T-002.5)
- **Go/No-Go**: Exportación .docx funciona + performance <3s carga

### **Sprint 8: Testing Integral y Fixes (Semana 16-17)**
- **Duración**: 10 días | **Horas**: 70h
- Tests E2E completos
- Regresión testing todas las funcionalidades
- Performance testing
- Seguridad audit
- Documentación Swagger completa
- **Go/No-Go**: 95% tests pasando, 0 críticos pendientes

### **Sprint 9: Go-Live y Operacionalización (Semana 18)**
- **Duración**: 5 días | **Horas**: 20h
- Deploy a producción
- Sesión formación usuarios
- Monitoreo post-go-live
- **Go/No-Go**: Sistema en vivo, usuarios operando

---

## 4. Equipo Recomendado

**Composición Total: 9 FTE | 18 semanas**

| Rol | Cantidad | FTE | Responsabilidad |
|-----|----------|-----|-----------------|
| **Project Manager** | 1 | 1.0 | Planificación, coordinación, riesgos |
| **Backend Lead** | 1 | 1.0 | Arquitectura, APIs, DB |
| **Backend Developer** | 1 | 1.0 | Implementación APIs, integraciones |
| **Security Engineer** | 1 | 0.5 | OAuth2, JWT, RBAC, auditoría |
| **Frontend Lead** | 1 | 1.0 | Arquitectura UI, componentes |
| **Frontend Developer** | 1 | 1.0 | Implementación UI, responsive |
| **QA Lead** | 1 | 0.5 | Plan testing, estrategia QA |
| **QA Automation** | 1 | 1.0 | Tests unitarios, E2E, performance |
| **DBA / DevOps** | 1 | 0.5 | BD design, infra, CI/CD |

---

## 5. Matriz RACI por Rol

| Responsabilidad | Backend | Frontend | QA | DBA | Security | DevOps | PM |
|-----------------|---------|----------|-----|-----|----------|--------|-----|
| Diseño BD | C | I | I | **R** | C | I | C |
| APIs REST | **R** | C | C | I | A | I | C |
| UI Componentes | I | **R** | C | I | I | I | C |
| Autenticación | A | C | C | I | **R** | I | C |
| Testing | C | C | **R** | I | I | I | C |
| Seguridad | C | I | I | I | **R** | A | C |
| Deploy | I | I | I | I | I | **R** | C |
| Documentación | C | C | C | I | I | **R** | A |

**Leyenda**: R=Responsable | A=Accountable | C=Consultado | I=Informado

---

## 6. Ruta Crítica y Dependencias

```
Sprint 0: Setup Infraestructura
    ↓
Sprint 1: T-006 (Auth) → T-001.1 (BD Activities)
    ↓
Sprint 2: T-001.2 (API) → T-002 (UI Agenda)
    ↓
Sprint 3: T-001.4 (Calendar), T-005 (Logistics), T-010 (Notifications)
    ↓
Sprint 4-5: T-003.1 (BD Scripts) → T-003.4 (API) → T-004 (Tops) [CRÍTICO]
    ↓
Sprint 6: T-008 (Responsive), T-010.3 (UI Notifications)
    ↓
Sprint 7: T-009 (Export Word)
    ↓
Sprint 8: Testing Integral
    ↓
Sprint 9: Go-Live
```

**Hito Bloqueante**: Sprint 4-5 (Editor de Guiones)
- Sin esta funcionalidad, el proyecto no es viable
- Requiere precisión en lock exclusivo y validaciones

---

## 7. Resumen Ejecutivo Final

**Proyecto**: Gestión Interna Teatro Real (TEMPO + TOPS)
**Duración**: 18 semanas
**Inversión**: 562 horas / 9 FTE
**Riesgo**: Medio-Alto (complejidad lock/concurrencia)
**Status**: Listo para planificación ejecutiva

El desglose completo de tareas está organizado por Historia de Usuario, con estimaciones realistas basadas en complejidad técnica. La planificación de Sprints asegura entrega incremental de valor y mitigación temprana de riesgos técnicos clave.
