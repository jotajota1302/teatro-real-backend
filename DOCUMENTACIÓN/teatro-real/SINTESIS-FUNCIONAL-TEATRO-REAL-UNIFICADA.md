# Síntesis Funcional Unificada – Gestión Interna Teatro Real

## 1. Resumen Ejecutivo

El Teatro Real de Madrid necesita centralizar y modernizar su gestión interna con una plataforma digital integrada. Este sistema cubrirá la planificación de actividades (TEMPO), la coordinación técnica y escénica (TOPS) y la gestión de guiones técnicos, poniendo fin al uso disperso de Excel, Access y Google Calendar. El sistema mejorará la trazabilidad, eliminará duplicidades y facilitará la colaboración multidisciplinar, permitiendo trabajar de manera más eficiente, precisa y colaborativa.

## 2. Contexto Operativo

- **Usuarios objetivo:** Equipos técnicos, regiduría, equipos artísticos, personal administrativo y gestores.
- **Volumen Operativo:** Gestión simultánea de múltiples producciones (óperas, ballets, conciertos), coordinación de hasta 10 áreas, y logística asociada (Arganda).
- **Situación previa:** Herramientas no integradas, procesos manuales, duplicidad de información y baja trazabilidad.

---

## 3. Conceptos Clave

### Tops
Puntos de sincronización técnica que marcan momentos críticos de acción coordinada entre equipos técnicos/artísticos durante funciones, ensayos y operaciones logísticas.

### Tempo
El ritmo o cadencia que regula la operativa escénica, técnica y administrativa, asegurando que todos los equipos avancen “en tiempo y forma”.

---

## 4. Catálogo de Funcionalidades

### TEMPO – Planificación y Gestión de Actividades

| Código       | Funcionalidad                                                | Usuarios           | Frecuencia    | Notas clave                                              |
|--------------|-------------------------------------------------------------|--------------------|---------------|----------------------------------------------------------|
| F-TEMPO-001  | Registro de Actividades (producciones, ensayos, eventos…)   | Colaboradores, Admin | Continua      | Campos: título, tipo, espacio/ubicación, fechas, docs.   |
| F-TEMPO-002  | Configuración de espacios (salas y almacenes)               | Admin              | Setup inicial | Catálogo editable; incluye lista inicial de espacios.    |
| F-TEMPO-003  | Codificación de colores por tipo / espacio                  | Admin              | Setup inicial | Personalizable, códigos recomendados Teatro Real.        |
| F-TEMPO-004  | Gestión logística (Almacenes Arganda)                       | Colaboradores      | Según eventos | Registro: recogida/salida, fecha, camiones, ubicaciones. |
| F-TEMPO-005  | Alertas y notificaciones automáticas                        | Sistema            | Real-time     | Email/alertas internas por alta/cambio/baja actividad.   |
| F-TEMPO-006  | Integración Google Calendar                                 | Sistema            | Real-time     | Sincronización TEMPO→Google Calendar (bidireccional*).   |
| F-TEMPO-007  | Visualización en modo cartelería digital                    | Todos              | Permanente    | Página web/móvil/pantallas con agenda por sala/espacio.  |
| F-TEMPO-008  | Interfaz responsive                                         | Todos              | Continua      | Adaptación por dispositivo (desktop, tablet, móvil).     |

*Nota: Fuera de alcance funciones evaluables: suscripción a salas, pantallas especiales de escenario.*

---

### TOPS – Coordinación Técnica y Escénica

| Código        | Funcionalidad                                              | Usuarios              | Frecuencia       | Notas clave                                             |
|---------------|-----------------------------------------------------------|-----------------------|------------------|---------------------------------------------------------|
| F-TOPS-001    | Guion técnico completo (actos, pasadas, escenas, Tops)    | Colaboradores, Admin  | Ciclo producción | Estructura jerárquica con referencias a partitura, docs.|
| F-TOPS-002    | Codificación departamentos técnicos                       | Admin                 | Setup inicial    | Código estándar: M.E., MAQ., Útil., Elec., AV, etc.     |
| F-TOPS-003    | Estructura guion: actos → pasadas → escenas → elementos   | Colaboradores         | Ciclo producción | Secuencia navegable.                                    |
| F-TOPS-004    | Registro de pasadas: acciones/preparativos pre-acto       | Colaboradores         | Ciclo producción | Por acto/departamento.                                  |
| F-TOPS-005    | Registro y gestión de Tops (número, compás, depto, desc.) | Colaboradores         | Ciclo producción | Únicos por producción, posibilidad “sub-Tops” (ej: 23.1)|
| F-TOPS-006    | Registro de otras acciones/tipos específicos              | Colaboradores         | Ciclo producción | Mutis, entradas, avisos, internos, etc.                 |
| F-TOPS-007    | Control edición bloqueada (1 editor por guion)            | Sistema               | Continua         | Previene edición simultánea/conflictos en documento.     |
| F-TOPS-008    | Historial de cambios y versionado                         | Todos                 | Continua         | Log de ediciones, exportación en Word, vista historial.  |
| F-TOPS-009    | Múltiples vistas (global, por Tops, departamento)         | Todos                 | Continua         | Búsqueda, filtrado, exportación.                        |
| F-TOPS-010    | Visualización optimizada en tablets/móviles               | Todos                 | Continua         | Interfaz usable en ensayo/salón técnico.                |

---

### Administración y Seguridad

| Código        | Funcionalidad                           | Usuarios         | Notas clave                                       |
|---------------|----------------------------------------|------------------|--------------------------------------------------|
| F-ADM-001     | Gestión de usuarios                    | Admin            | Crear, editar, desactivar.                       |
| F-ADM-002     | Roles/permisos                         | Admin            | Admin, colaborador (edición), consulta (lectura). |
| F-ADM-003     | Autenticación Google OAuth             | Todos            | Uso obligatorio de cuenta Google                  |
| F-ADM-004     | Configuración de parámetros y colores  | Admin            | Todos los parámetros personalizables por admin.   |
| F-ADM-005     | Infraestructura                        | Todos            | Preferente Google Cloud; on-premise opcional.     |
| F-ADM-006     | Integraciones                          | Admin            | Google Calendar, Gmail para alertas y login.      |

---

## 5. Flujos de Uso Identificados

- **Registro y difusión de actividad**: Alta de actividad → asignación color → alerta automática → sincronización calendario(s) → visible en agenda/cartelería/móviles.
- **Gestión logística Arganda**: Registro recogida/salida → control de estados de operación → alerta de registros incompletos → auditoría.
- **Edición de guión técnico**: Usuario abre guion (bloqueo) → añade actos/pasadas/escenas/Tops → se guarda historial → se exporta cuando necesario.
- **Coordinación ensayo/función**: Regidor accede a guion en tablet → visualiza y marca Tops en tiempo real → historial registra cada acción.
- **Administración usuarios/roles**: Alta/baja/edición usuarios/roles, cambio de permisos y parámetros.

---

## 6. Reglas de Negocio

- **RN-001**: Unicidad de Tops dentro de cada producción.
- **RN-002**: Solo un usuario edita un guion técnico a la vez.
- **RN-003**: Notificación automática a responsables ante cambios relevantes (actividad, espacio, horario).
- **RN-004**: Integración agenda con Google Calendar, sincronización automática.
- **RN-005**: Parámetros de colores, espacios y visualización configurables por el admin.
- **RN-006**: No solapamiento de actividades por espacio y horario; alerta y prevención activa.
- **RN-007**: Trazabilidad logística en almacenes Arganda (fechas, camiones, ubicaciones, estados).
- **RN-008**: Los informes y exportaciones documentan los responsables y timestamp.
- **RN-009**: Validación estricta de datos obligatorios antes de confirmar operaciones logísticas.
- **RN-010**: El historial de cambios es permanente y permite auditoría completa.

---

## 7. Integraciones y Dependencias

- **Google Calendar**: Sincronización en tiempo real de actividades / agenda.
- **Gmail (Google Workspace)**: Login y notificaciones.
- **Google Cloud**: Infraestructura preferente (alternativa: on-premise recomendada por NTT DATA).
- **Datos**: Catálogos de espacios, departamentos y tipos de actividad actualizables.
- **Otras**: Documentos adjuntos (planos, dossieres, partituras).

---

## 8. Entidades y Datos Gestionados

| Entidad     | Descripción                                 | Operaciones                           |
|-------------|---------------------------------------------|---------------------------------------|
| Actividad   | Producción, evento, ensayo o tarea agendada | Crear, Leer, Modificar, Eliminar      |
| Espacio     | Sala física o almacén Arganda               | Crear, Leer, Modificar, Desactivar    |
| Guion       | Documento técnico de producción             | Crear, Leer, Modificar, Exportar, Auditar|
| Top         | Punto de sincronía técnica (guion)          | Crear, Leer, Modificar, Eliminar      |
| Usuario     | Cuenta individual con rol                   | Crear, Leer, Modificar, Desactivar    |
| Rol         | Permisos de acceso                          | Crear, Leer, Modificar                |

**Informes y salidas:**  
- Agenda diaria por espacio
- Guion/tops (global, por departamento, histórica)
- Logística (recogidas/salidas)  
- Historial de cambios, exportación a Word

---

## 9. Parámetros de Configuración Clave

| Parámetro     | Descripción                               | Valores posibles              | Impacto                      |
|---------------|-------------------------------------------|-------------------------------|------------------------------|
| Codificación  | Color por tipo de actividad/espacio/top   | Tabla parametrizable          | Visualización y alertas      |
| Tipos espacio | Categoría (Sala / Almacén)                | Lista editable                | Campos y permisos asociados  |
| Roles/permisos| Perfiles de usuario                       | Admin / Colaborador / Consulta| Control de acceso            |
| Visualización | Vista de agenda / cartelera / responsive  | Filtros, modos acceso         | UX y adaptabilidad           |
| Edición       | Exclusiva por guion técnico               | Sí/No                         | Control de concurrencia      |
| Logística     | Estados: Planificada, Confirmada, Completa| Editable por responsables     | Seguimiento y trazabilidad   |

**Paleta de colores recomendada Teatro Real:**  
- Rojo principal: #C8102E | Fondo: #FFFFFF | Negro: #232323  
- Amarillo acento: #FFD700 | Gris claro: #F5F5F5 | Gris medio: #4A4A4A

---

## 10. Limitaciones y Restricciones

- **Solo usuario Google**: Acceso restringido por autenticación Google Workspace.
- **Un editor por guion**: No edición multiusuario simultánea.
- **Jerarquía estructural fija**: Actos → Pasadas → Escenas → Tops.
- **Soporte logístico Arganda**: Foco solo en almacenes propios; no se consideran otros almacenes externos.
- **Integración externa**: Solo Google Calendar y Gmail, no previsto otros sistemas en esta fase.
- **Migración de datos históricos**: Fuera de alcance actual (no incluye limpieza ni importación de Excel/Access previos).
- **Funciones fuera de alcance**: Suscripción a salas para alertas, visualización especial en pantallas escenario.

---

## 11. Glosario de Términos

| Término               | Definición                                                                             |
|-----------------------|----------------------------------------------------------------------------------------|
| Top                   | Orden técnica sincronizada; instrucción que dispara una acción escénica/técnica        |
| Tempo                 | Ritmo global operativo; cadencia de todas las actividades del teatro                   |
| Guion Técnico         | Documento central que orquesta acciones y Tops en una producción                       |
| Pasada                | Conjunto de acciones o preparativos inmediatos previos a acto o escena                 |
| Acto/Escena           | Estructura jerárquica de la obra/división del guion                                    |
| Espacio               | Cualquier sala, almacén o recinto operativo asignable                                  |
| M.E., MAQ., Útil., etc.| Códigos para cada departamento técnico/artístico                                       |
| Agenda / Cartelería   | Visualización digital (web/móviles) de la programación diaria por espacio              |
| Sub-Top               | Acción subdividida dentro de un Top principal (ejemplo: 23.1, 23.2)                    |

---

## 12. Referencias Cruzadas

- TR- Requisitos Generales v1.2 (documentación oficial Teatro Real)
- Contexto Gestión Interna del Teatro (documentos Excel y Word en DOC_INICIAL)
- Ejemplos y granularidad práctica: CALENDARIO 2025.xlsx, TEMPO - Temporada 2025-2026.xlsx
- Guion Regiduría CARMEN

---

