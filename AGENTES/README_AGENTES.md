# Agentes del Teatro Real - Índice

## Visión General

Este directorio contiene los prompts para un ecosistema de agentes de IA diseñados para asistir en la gestión integral del Teatro Real de Madrid. Cada agente tiene un rol especializado y puede trabajar de forma independiente o coordinada con los demás.

---

## Agentes Disponibles

### 1. Agente Regidor
**Archivo:** `PROMPT_AGENTE_REGIDOR.md`

**Rol:** Coordinador técnico de escena y generador de guiones técnicos.

**Capacidades principales:**
- Crear guiones técnicos completos (estructura de actos, escenas, TOPs)
- Generar pasadas de preparación por departamento
- Documentar entradas, mutis, avisos y elementos escénicos
- Numerar y gestionar TOPs y sub-TOPs
- Exportar vistas por departamento

**Usuarios típicos:** Regidores, realizadores, coordinadores de escena

---

### 2. Agente Coordinador de Producción
**Archivo:** `PROMPT_AGENTE_COORDINADOR_PRODUCCION.md`

**Rol:** Planificador de actividades y gestor del módulo TEMPO.

**Capacidades principales:**
- Programar actividades en todos los espacios del teatro
- Detectar conflictos de espacio y recursos
- Gestionar el código de colores por tipo de actividad
- Coordinar con Google Calendar
- Generar alertas y notificaciones de cambios

**Usuarios típicos:** Coordinadores de producción, planificadores, administración

---

### 3. Agente Jefe de Departamento
**Archivo:** `PROMPT_AGENTE_JEFE_DEPARTAMENTO.md`

**Rol:** Asistente especializado para cada departamento técnico.

**Capacidades principales:**
- Filtrar guiones para mostrar solo TOPs del departamento
- Generar checklists pre-función
- Crear informes de carga de trabajo
- Comparar complejidad entre producciones
- Alertar sobre momentos críticos

**Departamentos:** M.E., MAQ., Útil., Elec., A/V., Sast., Carac.

**Usuarios típicos:** Jefes de departamento, técnicos senior

---

### 4. Agente Director Técnico
**Archivo:** `PROMPT_AGENTE_DIRECTOR_TECNICO.md`

**Rol:** Visión ejecutiva y estratégica de las operaciones técnicas.

**Capacidades principales:**
- Generar dashboards de temporada, producción y recursos
- Crear informes ejecutivos para dirección
- Analizar riesgos y capacidad
- Preparar documentación para coproducciones
- Comparar métricas entre producciones

**Usuarios típicos:** Director técnico, dirección general, administración

---

### 5. Agente Gestor de Almacenes
**Archivo:** `PROMPT_AGENTE_GESTOR_ALMACENES.md`

**Rol:** Gestión de logística y almacenes de Arganda.

**Capacidades principales:**
- Gestionar inventario de producciones almacenadas
- Planificar recogidas y envíos (nacionales e internacionales)
- Generar órdenes de transporte
- Controlar ocupación de Arganda-Campa y Arganda-Nave
- Coordinar documentación de aduanas

**Usuarios típicos:** Gestor de almacenes, logística, transportes

---

### 6. Agente Asistente IA
**Archivo:** `PROMPT_AGENTE_ASISTENTE_IA.md`

**Rol:** Capacidades transversales de inteligencia artificial.

**Capacidades principales:**
- Responder preguntas en lenguaje natural
- Predecir conflictos y problemas
- Sugerir optimizaciones de calendario y recursos
- Generar resúmenes inteligentes
- Detectar patrones en datos históricos
- Validar guiones técnicos automáticamente

**Usuarios típicos:** Todos los usuarios del sistema

---

## Mapa de Interacción entre Agentes

```
                    ┌─────────────────────┐
                    │   ASISTENTE IA      │
                    │  (Transversal)      │
                    └──────────┬──────────┘
                               │
                               │ Potencia a todos
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │                          │                          │
    ▼                          ▼                          ▼
┌─────────┐            ┌───────────────┐          ┌─────────────┐
│REGIDOR  │◄──────────►│  COORDINADOR  │◄────────►│  DIRECTOR   │
│ (TOPS)  │  Coordina  │  PRODUCCIÓN   │ Reporta  │   TÉCNICO   │
└────┬────┘            │   (TEMPO)     │          └──────┬──────┘
     │                 └───────┬───────┘                 │
     │                         │                         │
     │    ┌────────────────────┼────────────────┐        │
     │    │                    │                │        │
     │    ▼                    ▼                ▼        │
     │  ┌──────┐         ┌──────────┐     ┌─────────┐    │
     └─►│JEFES │         │ ESPACIOS │     │ALMACENES│◄───┘
        │DEPTO │         │(Teatro)  │     │(Arganda)│
        └──────┘         └──────────┘     └─────────┘
```

---

## Flujo de Trabajo Típico

### Para una nueva producción:

1. **Coordinador de Producción** programa las actividades en TEMPO
2. **Gestor de Almacenes** coordina la llegada del material
3. **Regidor** crea el guion técnico con TOPs
4. **Jefes de Departamento** consultan sus vistas filtradas
5. **Director Técnico** supervisa el estado general
6. **Asistente IA** proporciona predicciones y optimizaciones

### Para el día de función:

1. **Jefes de Departamento** usan checklists de verificación
2. **Regidor** consulta el guion durante la función
3. **Director Técnico** monitoriza el dashboard de estado
4. **Asistente IA** alerta sobre anomalías en tiempo real

---

## Uso de los Prompts

Cada archivo de prompt está diseñado para ser utilizado con un modelo de lenguaje (LLM). Para usar un agente:

1. Copia el contenido del archivo del agente deseado
2. Úsalo como "system prompt" o contexto inicial
3. Interactúa en lenguaje natural con preguntas o solicitudes
4. El agente responderá según su rol y capacidades

### Ejemplo de uso:

```
Sistema: [Contenido de PROMPT_AGENTE_REGIDOR.md]

Usuario: Necesito crear el guion técnico para Tosca, son 3 actos.

Agente: Voy a crear la estructura del guion técnico para Tosca...
```

---

## Personalización

Los prompts pueden personalizarse para:

- **Añadir espacios adicionales** del teatro
- **Modificar departamentos** según estructura real
- **Ajustar nomenclatura** si difiere de la estándar
- **Incluir información específica** de producciones recurrentes
- **Conectar con sistemas** existentes del teatro

---

## Evolución Futura

Agentes adicionales que podrían desarrollarse:

- **Agente de Vestuario**: Especializado en gestión de vestuario y cambios rápidos
- **Agente de Seguridad**: Gestión de riesgos y protocolos de emergencia
- **Agente de Comunicación**: Gestión de prensa y comunicaciones
- **Agente de Taquilla**: Integración con venta de entradas y ocupación
- **Agente de Formación**: Gestión de cursos y masterclasses

---

*Documentación del ecosistema de agentes - Teatro Real*
*Versión 1.0 - Noviembre 2025*
