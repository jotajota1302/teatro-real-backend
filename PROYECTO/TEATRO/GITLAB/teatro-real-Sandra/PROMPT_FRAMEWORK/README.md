# Teatro Real - Framework de Prompts para Desarrollo

Este directorio contiene **templates estructuradas** para solicitar desarrollos de forma consistente y alineada con la arquitectura del proyecto.

> **Nota:** Los prompts generados con estas templates se guardan en `../PROMPTS/`

## Índice de Templates

| Template | Descripción | Uso |
|----------|-------------|-----|
| [PROMPT_BACKEND.md](./PROMPT_BACKEND.md) | Desarrollo de APIs y servicios Spring Boot | Endpoints, entidades, servicios |
| [PROMPT_FRONTEND.md](./PROMPT_FRONTEND.md) | Desarrollo de componentes Angular | Componentes, servicios, vistas |
| [PROMPT_FEATURE.md](./PROMPT_FEATURE.md) | Desarrollo fullstack de funcionalidades | Features completas end-to-end |
| [PROMPT_BUGFIX.md](./PROMPT_BUGFIX.md) | Corrección de errores | Debugging y fixes |

## Cómo Usar las Templates

1. **Copia la template** correspondiente al tipo de desarrollo
2. **Rellena las secciones** con los detalles específicos
3. **Incluye el contexto** relevante (archivos, requisitos)
4. **Especifica criterios de aceptación** claros

## Convenciones del Proyecto

### Backend (Spring Boot 2.7.18 + Java 8)
- Paquete base: `com.teatroreal`
- Estructura: `controller/`, `service/`, `repository/`, `domain/`, `dto/`
- Anotaciones: `javax.*` (NO `jakarta.*`)
- Documentación: SpringDoc OpenAPI 1.7.0

### Frontend (Angular 18.2)
- Standalone components
- Signals para estado reactivo
- TailwindCSS para estilos
- Estructura: `core/`, `shared/`, `features/`, `layout/`

## Módulos del Sistema

| Módulo | Backend | Frontend | Descripción |
|--------|---------|----------|-------------|
| **ADMIN** | `/api/usuarios`, `/api/departamentos` | `features/admin/` | Usuarios, roles, configuración |
| **TEMPO** | `/api/actividades`, `/api/espacios` | `features/tempo/` | Calendario, actividades |
| **TOPS** | `/api/guiones`, `/api/elementos` | `features/tops/` | Guiones técnicos, TOPs |

## Referencias

- [Síntesis de Requisitos](../DOC_GENERADA/SINTESIS_REQUISITOS_FINAL.md)
- [Plan de Implementación](../DOC_GENERADA/PLAN_IMPLEMENTACION_COMPLETO.md)
- [Plan Backend](../DOC_GENERADA/PLAN_IMPLEMENTACION_BACKEND.md)
- [Plan Frontend](../DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND.md)
- [Guía de Estilos](../DOC_GENERADA/GUIA_ESTILOS_TEATRO.md)
