# Template: Corrección de Errores (Bugfix)

## Instrucciones de Uso
Usa esta template para reportar y solicitar la corrección de bugs.

---

## PROMPT

```
## Contexto del Proyecto

Sistema de Gestión del Teatro Real:
- **Backend:** Java 8 + Spring Boot 2.7.18
- **Frontend:** Angular 18.2 + TailwindCSS 3.4
- **Base de datos:** H2 (desarrollo) / PostgreSQL (producción)

---

## Reporte de Bug

### Título
[Descripción corta del bug]

### Severidad
[Crítico | Alto | Medio | Bajo]

### Módulo Afectado
[ADMIN | TEMPO | TOPS] - [Backend | Frontend | Ambos]

### Componente/Archivo
[Ruta del archivo o nombre del componente afectado]

---

## Descripción del Problema

### Comportamiento Esperado
[¿Qué debería pasar?]

### Comportamiento Actual
[¿Qué está pasando?]

### Pasos para Reproducir
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]
4. [Resultado erróneo]

---

## Información Técnica

### Error/Excepción (si aplica)
```
[Pegar stack trace o mensaje de error]
```

### Logs Relevantes
```
[Pegar logs del backend o consola del navegador]
```

### Request/Response (si aplica)
```json
// Request
{
  "url": "[URL]",
  "method": "[GET/POST/PUT/DELETE]",
  "body": {}
}

// Response
{
  "status": [código],
  "body": {}
}
```

### Capturas de Pantalla
[Describir o adjuntar si es un problema visual]

---

## Entorno

| Aspecto | Valor |
|---------|-------|
| Navegador | [Chrome/Firefox/Edge + versión] |
| Sistema Operativo | [Windows/Mac/Linux] |
| Versión Backend | [commit o versión] |
| Versión Frontend | [commit o versión] |

---

## Análisis Preliminar (si lo tienes)

### Causa Probable
[Tu hipótesis sobre qué está causando el bug]

### Archivos Relacionados
- `[ruta/archivo1.java]`
- `[ruta/archivo2.ts]`

### Posible Solución
[Si tienes una idea de cómo solucionarlo]

---

## Criterios de Aceptación para el Fix

- [ ] El bug ya no se reproduce
- [ ] No se introducen regresiones
- [ ] [Criterio específico del bug]
- [ ] Tests actualizados/añadidos si aplica
```

---

## Ejemplos

### Ejemplo 1: Error de Backend (500)

```
## Reporte de Bug

### Título
Error 500 al crear actividad con espacio inválido

### Severidad
Alto

### Módulo Afectado
TEMPO - Backend

### Componente/Archivo
`com.teatroreal.controller.ActividadController`

---

## Descripción del Problema

### Comportamiento Esperado
Al enviar un espacioId que no existe, debería devolver un error 400 Bad Request con mensaje descriptivo.

### Comportamiento Actual
Devuelve error 500 Internal Server Error sin mensaje útil.

### Pasos para Reproducir
1. Abrir Swagger UI
2. POST /api/actividades
3. Enviar body con espacioId: 9999 (no existe)
4. Recibir error 500

---

## Información Técnica

### Error/Excepción
```
javax.persistence.EntityNotFoundException: Unable to find com.teatroreal.domain.Espacio with id 9999
    at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl...
    at com.teatroreal.service.ActividadService.create(ActividadService.java:45)
```

### Request/Response
```json
// Request
{
  "url": "http://localhost:8080/api/actividades",
  "method": "POST",
  "body": {
    "titulo": "Test",
    "espacioId": 9999,
    "tipoActividadId": 1,
    "fecha": "2025-01-15",
    "horaInicio": "10:00",
    "horaFin": "12:00"
  }
}

// Response
{
  "status": 500,
  "body": {
    "timestamp": "2025-12-11T10:30:00",
    "status": 500,
    "error": "Internal Server Error"
  }
}
```

---

## Análisis Preliminar

### Causa Probable
El servicio usa `getById()` que lanza excepción si no encuentra la entidad, pero no hay manejo de esta excepción.

### Archivos Relacionados
- `com/teatroreal/service/ActividadService.java`
- `com/teatroreal/exception/GlobalExceptionHandler.java`

### Posible Solución
1. Añadir `@ExceptionHandler(EntityNotFoundException.class)` en GlobalExceptionHandler
2. O usar `findById().orElseThrow()` con excepción personalizada

---

## Criterios de Aceptación para el Fix

- [ ] espacioId inválido devuelve 400 con mensaje "Espacio no encontrado"
- [ ] tipoActividadId inválido devuelve 400 con mensaje "Tipo de actividad no encontrado"
- [ ] El error incluye el ID que no se encontró
```

### Ejemplo 2: Error de Frontend (UI)

```
## Reporte de Bug

### Título
El calendario no muestra actividades después de cambiar de mes

### Severidad
Medio

### Módulo Afectado
TEMPO - Frontend

### Componente/Archivo
`src/app/features/tempo/calendario/calendario.component.ts`

---

## Descripción del Problema

### Comportamiento Esperado
Al navegar al mes siguiente/anterior, el calendario debería cargar las actividades de ese mes.

### Comportamiento Actual
El calendario queda vacío hasta que se recarga la página.

### Pasos para Reproducir
1. Ir a /tempo/calendario
2. Ver actividades del mes actual (funcionan)
3. Click en flecha "siguiente mes"
4. El calendario cambia de mes pero no muestra actividades
5. Recargar página: ahora sí aparecen

---

## Información Técnica

### Logs Relevantes
```
// Consola del navegador
[CalendarioComponent] Mes cambiado a: 2025-01
// No hay llamada HTTP después de esto
```

### Capturas de Pantalla
- Mes actual: Muestra 15 actividades correctamente
- Mes siguiente: Calendario vacío, no hay llamada a API

---

## Entorno

| Aspecto | Valor |
|---------|-------|
| Navegador | Chrome 120 |
| Sistema Operativo | Windows 11 |

---

## Análisis Preliminar

### Causa Probable
El evento `datesSet` de FullCalendar no está disparando la recarga de actividades, o el signal no se está actualizando.

### Archivos Relacionados
- `src/app/features/tempo/calendario/calendario.component.ts`
- `src/app/features/tempo/services/actividad.service.ts`

### Posible Solución
Verificar que el callback `datesSet` esté llamando a `loadActividades()` con las nuevas fechas.

---

## Criterios de Aceptación para el Fix

- [ ] Cambiar de mes carga actividades del nuevo rango
- [ ] Cambiar de vista (mes/semana/día) carga actividades correctamente
- [ ] No hay llamadas duplicadas a la API
- [ ] Se muestra loading mientras carga
```

### Ejemplo 3: Error de Validación

```
## Reporte de Bug

### Título
Se permite crear actividad con hora_fin anterior a hora_inicio

### Severidad
Medio

### Módulo Afectado
TEMPO - Backend y Frontend

### Componente/Archivo
- Backend: `com.teatroreal.dto.request.ActividadRequest`
- Frontend: `src/app/features/tempo/actividad/actividad-form/`

---

## Descripción del Problema

### Comportamiento Esperado
No debería permitirse crear una actividad donde horaFin < horaInicio.

### Comportamiento Actual
Se guarda la actividad sin validación.

### Pasos para Reproducir
1. Crear nueva actividad
2. Poner hora inicio: 14:00
3. Poner hora fin: 10:00
4. Guardar
5. Se guarda correctamente (no debería)

---

## Análisis Preliminar

### Causa Probable
Falta validación a nivel de DTO y formulario.

### Posible Solución
1. Backend: Añadir validador custom `@ValidTimeRange`
2. Frontend: Añadir validación en el FormGroup

---

## Criterios de Aceptación para el Fix

- [ ] Backend rechaza con 400 si horaFin <= horaInicio
- [ ] Frontend muestra error en el campo antes de enviar
- [ ] Mensaje de error claro: "La hora de fin debe ser posterior a la hora de inicio"
```
