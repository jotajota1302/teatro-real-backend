-- ===============================================
-- V4: Actividades de ejemplo para testing
-- Temporada 2025-2026
-- ===============================================

-- Producción 1: La Traviata (Enero 2026)
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-traviata-001', 'La Traviata - Montaje', 1, 'Montaje de escenografía para La Traviata', 'ta-montaje-008', 1, '2026-01-15', '08:00', '20:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-002', 'La Traviata - Prueba de Luces', 1, 'Ajuste de iluminación', 'ta-prueba-luces-010', 1, '2026-01-16', '10:00', '18:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-003', 'La Traviata - Ensayo Orquesta', 1, 'Ensayo orquestal', 'ta-ensayo-orquesta-005', 2, '2026-01-17', '10:00', '14:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-004', 'La Traviata - Ensayo Coro', 1, 'Ensayo coral', 'ta-ensayo-coro-006', 3, '2026-01-17', '16:00', '20:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-005', 'La Traviata - Ensayo Italiano', 1, 'Ensayo musical completo', 'ta-ensayo-italiano-003', 1, '2026-01-18', '10:00', '14:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-006', 'La Traviata - Ensayo General', 1, 'Ensayo general con vestuario', 'ta-ensayo-general-002', 1, '2026-01-19', '18:00', '22:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-007', 'La Traviata - Función Estreno', 1, 'Estreno de temporada', 'ta-funcion-001', 1, '2026-01-20', '20:00', '23:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-008', 'La Traviata - Función', 1, 'Segunda función', 'ta-funcion-001', 1, '2026-01-22', '20:00', '23:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-009', 'La Traviata - Función', 1, 'Tercera función', 'ta-funcion-001', 1, '2026-01-24', '20:00', '23:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-010', 'La Traviata - Función Matinée', 1, 'Función de tarde', 'ta-funcion-001', 1, '2026-01-25', '18:00', '21:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-011', 'La Traviata - Función', 1, 'Cuarta función', 'ta-funcion-001', 1, '2026-01-26', '20:00', '23:00', 'PENDIENTE', 'La Traviata'),
    ('act-traviata-012', 'La Traviata - Desmontaje', 1, 'Desmontaje de producción', 'ta-desmontaje-009', 1, '2026-01-27', '08:00', '18:00', 'PENDIENTE', 'La Traviata');

-- Producción 2: El Barbero de Sevilla (Febrero 2026)
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-barbero-001', 'El Barbero de Sevilla - Montaje', 1, 'Montaje de escenografía', 'ta-montaje-008', 1, '2026-02-01', '08:00', '20:00', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-barbero-002', 'El Barbero de Sevilla - Ensayo Piano', 1, 'Ensayo con piano de solistas', 'ta-ensayo-piano-004', 5, '2026-02-02', '10:00', '14:00', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-barbero-003', 'El Barbero de Sevilla - Ensayo Orquesta', 1, 'Ensayo orquestal', 'ta-ensayo-orquesta-005', 2, '2026-02-03', '10:00', '14:00', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-barbero-004', 'El Barbero de Sevilla - Ensayo General', 1, 'Ensayo general', 'ta-ensayo-general-002', 1, '2026-02-04', '18:00', '22:00', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-barbero-005', 'El Barbero de Sevilla - Función Estreno', 1, 'Estreno', 'ta-funcion-001', 1, '2026-02-05', '20:00', '22:30', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-barbero-006', 'El Barbero de Sevilla - Función', 1, 'Segunda función', 'ta-funcion-001', 1, '2026-02-07', '20:00', '22:30', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-barbero-007', 'El Barbero de Sevilla - Función Matinée', 1, 'Función familiar', 'ta-funcion-001', 1, '2026-02-08', '12:00', '14:30', 'PENDIENTE', 'El Barbero de Sevilla');

-- Actividades de logística/almacén
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, tipo_movimiento, num_camiones, lugar_origen, lugar_destino, produccion_nombre) VALUES
    ('act-log-001', 'Carga Escenografía La Traviata', 1, 'Carga de escenografía en Arganda', 'ta-montaje-008', 6, '2026-01-14', '08:00', '14:00', 'PENDIENTE', 'SALIDA', 3, 'Almacén Arganda', 'Teatro Real', 'La Traviata'),
    ('act-log-002', 'Descarga Escenografía La Traviata', 1, 'Descarga en teatro', 'ta-montaje-008', 6, '2026-01-14', '16:00', '22:00', 'PENDIENTE', 'ENTRADA', 3, 'Almacén Arganda', 'Teatro Real', 'La Traviata'),
    ('act-log-003', 'Retorno Escenografía La Traviata', 1, 'Retorno a almacén', 'ta-desmontaje-009', 6, '2026-01-27', '20:00', '23:59', 'PENDIENTE', 'ENTRADA', 3, 'Teatro Real', 'Almacén Arganda', 'La Traviata');

-- Eventos especiales
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado) VALUES
    ('act-evento-001', 'Gala Benéfica Fundación', 1, 'Gala anual de la Fundación del Teatro Real', 'ta-evento-012', 1, '2026-02-14', '20:00', '23:30', 'PENDIENTE'),
    ('act-evento-002', 'Visita Institucional', 1, 'Visita de autoridades', 'ta-visita-013', 1, '2026-01-28', '11:00', '13:00', 'PENDIENTE'),
    ('act-evento-003', 'Grabación Documental', 1, 'Grabación para TVE', 'ta-grabacion-014', 1, '2026-01-21', '09:00', '12:00', 'PENDIENTE');

-- Mantenimiento programado
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, notas) VALUES
    ('act-mant-001', 'Mantenimiento Sistema de Vuelo', 1, 'Revisión anual sistema de tramoya', 'ta-mantenimiento-015', 1, '2026-01-28', '08:00', '14:00', 'PENDIENTE', 'Requiere cierre de sala principal'),
    ('act-mant-002', 'Mantenimiento Iluminación', 1, 'Revisión focos y circuitos', 'ta-mantenimiento-015', 1, '2026-01-29', '08:00', '14:00', 'PENDIENTE', 'Verificar reguladores DMX');

-- Ensayos de ballet paralelos
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-ballet-001', 'El Lago de los Cisnes - Ensayo', 1, 'Ensayo cuerpo de baile', 'ta-ensayo-ballet-007', 4, '2026-01-20', '10:00', '14:00', 'PENDIENTE', 'El Lago de los Cisnes'),
    ('act-ballet-002', 'El Lago de los Cisnes - Ensayo', 1, 'Ensayo pas de deux', 'ta-ensayo-ballet-007', 4, '2026-01-21', '10:00', '14:00', 'PENDIENTE', 'El Lago de los Cisnes'),
    ('act-ballet-003', 'El Lago de los Cisnes - Ensayo', 1, 'Ensayo acto III', 'ta-ensayo-ballet-007', 4, '2026-01-22', '10:00', '14:00', 'PENDIENTE', 'El Lago de los Cisnes'),
    ('act-ballet-004', 'El Lago de los Cisnes - Ensayo General', 1, 'Ensayo general en sala', 'ta-ensayo-general-002', 1, '2026-02-10', '10:00', '14:00', 'PENDIENTE', 'El Lago de los Cisnes');
