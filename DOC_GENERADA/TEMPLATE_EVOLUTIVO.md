# Template: Evolutivo (Feature Request)

> Usa este template para solicitar un evolutivo claro, completo y listo para implementar en el frontend (Angular 18.2, standalone components, Signals, Tailwind, Angular Material).

## 1. Título corto
Ej.: Filtro por sala en Calendario (TEMPO)

## 2. Resumen ejecutivo (1-2 frases)
Qué se quiere y por qué es importante.

## 3. Objetivo
Descripción breve del objetivo funcional y del valor para el usuario o negocio.

## 4. Contexto / Antecedentes
- Módulo / ruta: (p. ej. features/tempo -> calendario)
- Estado actual (qué hay implementado)
- Dependencias con otras tareas o endpoints backend

## 5. Alcance (qué incluye / qué queda fuera)
- Incluye: (lista)
- No incluye: (lista)

## 6. User story(s)
- Principal: "Como [rol], quiero [acción] para [beneficio]".
- Historias adicionales o variantes si aplica.

## 7. Prioridad
- baja / normal / alta / bloqueante

## 8. Criterios de aceptación (AC) — imprescindibles y testables
1. AC-1: Descripción clara y verificable.
2. AC-2: ...
- Indicar pruebas manuales o parámetros para e2e.

## 9. Permisos / Guards
- Guard requerido: (authGuard / modulePermissionGuard / roleGuard)
- data esperada: p. ej. { modulo: 'TEMPO' } o roles: ['ADMIN']

## 10. API / Backend (si aplica)
- Endpoint(s):
  - GET /api/ejemplo?param=X — request/response ejemplo (JSON)
  - POST /api/ejemplo — request/response ejemplo (JSON)
- Comportamiento esperado en errores (timeouts, 401, 403)
- ¿Se requiere añadir o modificar endpoints? Sí/No. Si sí, especificar contrato.

## 11. Mock de datos (ejemplos JSON)
- Lista de ejemplo para pruebas y desarrollo.

## 12. Componentes a crear / modificar (nombres y paths sugeridos)
- Nuevo: features/tempo/calendario/filtro-salas.component.ts (standalone)
- Modificar: features/tempo/calendario/calendario.component.ts

## 13. Diseño y UI
- Controles: (select, chips, checkbox, modal, etc.)
- Bibliotecas: Angular Material, Tailwind (clases sugeridas)
- Texto visibles (labels, placeholders, tooltips)
- Comportamiento: (persistencia en query params, animaciones, estado vacío)

## 14. Internationalization (i18n)
- Claves y textos a extraer:
  - calendario.filtro.sala = "Sala"
  - calendario.filtro.todas = "Todas"

## 15. Accesibilidad
- Requisitos ARIA, order tab, focus management, contraste, VO support

## 16. Tests requeridos
- Unitarios:
  - Servicio: tests para signals y lógica de filtrado
  - Componente: renderizado y eventos
- E2E:
  - Flujo principal (seleccionar sala, comprobar eventos)
- Coverage mínima deseada (si aplica)

## 17. Entregables
- Código (componentes, servicios, tests)
- PR con descripción y commit message claro
- Notas de QA / pasos para probar
- Si aplica: cambios en documentación (CHANGELOG, README del módulo)

## 18. Branch / PR (opcional)
- Branch sugerido: feature/tempo-filtro-salas
- Base: develop / main (indicar cuál)

## 19. Estimación y deadline
- Estimación: pequeña / media / grande (horas o días)
- Fecha objetivo (si aplica)

## 20. Checklist de desarrollo
- [ ] Crear componente standalone
- [ ] Implementar signals / computed / servicio
- [ ] Consumir endpoint y gestionar errores
- [ ] Añadir estilos con Tailwind / MatFormField
- [ ] Tests unitarios
- [ ] Tests e2e
- [ ] Documentar i18n
- [ ] Abrir PR con descripción y screenshots

## 21. Notas adicionales / Adjuntos
- Enlaces a mockups, capturas, especificaciones, o tickets relacionados.

---

## Ejemplo rellenado (resumen)

Título: Filtro por sala en Calendario (TEMPO)  
Resumen: Añadir un select para filtrar eventos por sala en la vista de Calendario para que el gestor vea solo la ocupación de una sala.  
Módulo / ruta: features/tempo -> calendario  
User story: Como gestor de sala quiero filtrar actividades por sala para visualizar solo la ocupación de una sala concreta.  
Prioridad: Normal  
Criterios de aceptación:
- Aparece MatSelect "Sala" encima del calendario.
- Seleccionando una sala se muestran solo eventos con matching espacioId.
- Opción "Todas" restaura todos los eventos.
- El filtro persiste en query param ?sala=ID y al navegar dentro de TEMPO.
Permisos: modulePermissionGuard data: { modulo: 'TEMPO' }  
Endpoint: GET /api/espacios -> [{id,nombre}], GET /api/actividades?espacioId=ID (si existe).  
Mocks:
[
  { "id": "s1", "nombre": "Sala Principal" },
  { "id": "s2", "nombre": "Sala 2" }
]  
Componentes: crear filtro-salas.component.ts (standalone), modificar CalendarioComponent  
UI: MatFormField + MatSelect, label "Sala", tailwind classes: "mb-4 flex items-center gap-4"  
Tests: unit + e2e (selección y renderizado de eventos)  
Estimación: 2 días

---

Copia este archivo y rellénalo cuando quieras pedir un evolutivo. Si quieres que implemente este ejemplo ahora, cambia a Act mode y pegalo completo; puedo generar el código, tests y abrir un PR según tus indicaciones.
