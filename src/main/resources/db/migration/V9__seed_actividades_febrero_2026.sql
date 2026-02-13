-- ===============================================
-- V9: Actividades adicionales para semana 2-8 Febrero 2026
-- Más variedad de espacios y tipos de actividad
-- ===============================================

-- Lunes 2 de Febrero 2026
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-feb-001', 'Carmen - Ensayo Orquesta', 1, 'Ensayo orquestal para próxima producción', 'ta-ensayo-orquesta-005', 2, '2026-02-02', '09:00', '13:00', 'PENDIENTE', 'Carmen'),
    ('act-feb-002', 'El Lago de los Cisnes - Clase Ballet', 1, 'Clase técnica diaria', 'ta-ensayo-ballet-007', 4, '2026-02-02', '10:00', '12:00', 'PENDIENTE', 'El Lago de los Cisnes'),
    ('act-feb-003', 'Turandot - Ensayo Coro', 1, 'Ensayo de coro para Turandot', 'ta-ensayo-coro-006', 3, '2026-02-02', '15:00', '18:00', 'PENDIENTE', 'Turandot'),
    ('act-feb-004', 'Visita Grupo Escolar', 1, 'Visita guiada colegios', 'ta-visita-013', 5, '2026-02-02', '11:00', '13:00', 'PENDIENTE', NULL);

-- Martes 3 de Febrero 2026
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-feb-005', 'El Barbero de Sevilla - Ensayo Escénico', 1, 'Ensayo con movimiento', 'ta-ensayo-italiano-003', 1, '2026-02-03', '10:00', '14:00', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-feb-006', 'Carmen - Ensayo Piano Solistas', 1, 'Ensayo de arias principales', 'ta-ensayo-piano-004', 5, '2026-02-03', '10:00', '13:00', 'PENDIENTE', 'Carmen'),
    ('act-feb-007', 'El Lago de los Cisnes - Ensayo Pas de Deux', 1, 'Ensayo solistas ballet', 'ta-ensayo-ballet-007', 4, '2026-02-03', '15:00', '18:00', 'PENDIENTE', 'El Lago de los Cisnes'),
    ('act-feb-008', 'Mantenimiento Foso Orquesta', 1, 'Revisión sistema hidráulico', 'ta-mantenimiento-015', 1, '2026-02-03', '08:00', '10:00', 'PENDIENTE', NULL);

-- Miércoles 4 de Febrero 2026
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-feb-009', 'El Barbero de Sevilla - Prueba de Luces', 1, 'Ajuste iluminación acto I', 'ta-prueba-luces-010', 1, '2026-02-04', '09:00', '12:00', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-feb-010', 'Turandot - Ensayo Orquesta', 1, 'Lectura musical orquestal', 'ta-ensayo-orquesta-005', 2, '2026-02-04', '10:00', '14:00', 'PENDIENTE', 'Turandot'),
    ('act-feb-011', 'Carmen - Ensayo Coro', 1, 'Ensayo escenas corales', 'ta-ensayo-coro-006', 3, '2026-02-04', '16:00', '19:00', 'PENDIENTE', 'Carmen'),
    ('act-feb-012', 'El Lago de los Cisnes - Clase Técnica', 1, 'Clase diaria cuerpo de baile', 'ta-ensayo-ballet-007', 4, '2026-02-04', '10:00', '12:00', 'PENDIENTE', 'El Lago de los Cisnes'),
    ('act-feb-013', 'Grabación Promocional', 1, 'Grabación spot publicitario', 'ta-grabacion-014', 5, '2026-02-04', '14:00', '17:00', 'PENDIENTE', NULL);

-- Jueves 5 de Febrero 2026
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-feb-014', 'El Barbero de Sevilla - Ensayo Pregeneral', 1, 'Ensayo completo sin público', 'ta-ensayo-general-002', 1, '2026-02-05', '10:00', '14:00', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-feb-015', 'Carmen - Ensayo Escénico', 1, 'Ensayo de actos I y II', 'ta-ensayo-italiano-003', 5, '2026-02-05', '10:00', '13:00', 'PENDIENTE', 'Carmen'),
    ('act-feb-016', 'Turandot - Ensayo Piano', 1, 'Ensayo solistas con piano', 'ta-ensayo-piano-004', 3, '2026-02-05', '15:00', '18:00', 'PENDIENTE', 'Turandot'),
    ('act-feb-017', 'El Lago de los Cisnes - Ensayo General', 1, 'Ensayo coreografía acto II', 'ta-ensayo-ballet-007', 4, '2026-02-05', '10:00', '14:00', 'PENDIENTE', 'El Lago de los Cisnes');

-- Viernes 6 de Febrero 2026
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-feb-018', 'El Barbero de Sevilla - Función', 1, 'Tercera función de temporada', 'ta-funcion-001', 1, '2026-02-06', '20:00', '22:30', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-feb-019', 'Carmen - Ensayo Orquesta', 1, 'Ensayo completo con orquesta', 'ta-ensayo-orquesta-005', 2, '2026-02-06', '10:00', '14:00', 'PENDIENTE', 'Carmen'),
    ('act-feb-020', 'Turandot - Ensayo Coro', 1, 'Ensayo coro completo', 'ta-ensayo-coro-006', 3, '2026-02-06', '10:00', '13:00', 'PENDIENTE', 'Turandot'),
    ('act-feb-021', 'El Lago de los Cisnes - Clase', 1, 'Clase técnica', 'ta-ensayo-ballet-007', 4, '2026-02-06', '10:00', '12:00', 'PENDIENTE', 'El Lago de los Cisnes'),
    ('act-feb-022', 'Conferencia Musicológica', 1, 'Charla sobre ópera barroca', 'ta-evento-012', 5, '2026-02-06', '17:00', '19:00', 'PENDIENTE', NULL);

-- Sábado 7 de Febrero 2026
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-feb-023', 'El Barbero de Sevilla - Función Matinée', 1, 'Función de tarde', 'ta-funcion-001', 1, '2026-02-07', '18:00', '20:30', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-feb-024', 'Carmen - Ensayo Italiano', 1, 'Repaso musical completo', 'ta-ensayo-italiano-003', 2, '2026-02-07', '10:00', '14:00', 'PENDIENTE', 'Carmen'),
    ('act-feb-025', 'Visita Guiada Especial', 1, 'Tour tras bastidores', 'ta-visita-013', 5, '2026-02-07', '11:00', '13:00', 'PENDIENTE', NULL),
    ('act-feb-026', 'El Lago de los Cisnes - Ensayo', 1, 'Ensayo general acto III', 'ta-ensayo-ballet-007', 4, '2026-02-07', '10:00', '14:00', 'PENDIENTE', 'El Lago de los Cisnes');

-- Domingo 8 de Febrero 2026
INSERT INTO actividades (id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id, fecha, hora_inicio, hora_fin, estado, produccion_nombre) VALUES
    ('act-feb-027', 'El Barbero de Sevilla - Función Dominical', 1, 'Función especial familias', 'ta-funcion-001', 1, '2026-02-08', '12:00', '14:30', 'PENDIENTE', 'El Barbero de Sevilla'),
    ('act-feb-028', 'Turandot - Ensayo Piano', 1, 'Ensayo solistas', 'ta-ensayo-piano-004', 5, '2026-02-08', '10:00', '13:00', 'PENDIENTE', 'Turandot'),
    ('act-feb-029', 'Mantenimiento Sistema Audio', 1, 'Revisión equipos de sonido', 'ta-mantenimiento-015', 2, '2026-02-08', '08:00', '10:00', 'PENDIENTE', NULL),
    ('act-feb-030', 'Concierto Familiar', 1, 'Concierto didáctico para niños', 'ta-evento-012', 3, '2026-02-08', '11:00', '12:30', 'PENDIENTE', NULL);
