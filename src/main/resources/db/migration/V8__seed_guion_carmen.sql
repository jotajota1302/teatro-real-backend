-- V8: Seed del guion de Carmen con datos de ejemplo
-- Este script crea un guion completo con actos, escenas y TOPs

-- Primero eliminamos datos existentes de TOPS (si los hay) para empezar limpio
DELETE FROM elementos_guion WHERE 1=1;
DELETE FROM pasada_items WHERE 1=1;
DELETE FROM escenas WHERE 1=1;
DELETE FROM actos WHERE 1=1;
DELETE FROM guiones WHERE 1=1;

-- Crear el guion de Carmen
INSERT INTO guiones (id, temporada, produccion_nombre, compania, director_escena, director_musical, compositor, subtitulo, version, estado, created_at, updated_at)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-000000000001',
    '2024/2025',
    'Carmen',
    'Teatro Real',
    'Calixto Bieito',
    'Pablo Heras-Casado',
    'Georges Bizet',
    'Ópera en cuatro actos',
    1,
    'BORRADOR',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ACTO I
INSERT INTO actos (id, guion_id, nombre, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000000010', 'a1b2c3d4-e5f6-7890-abcd-000000000001', 'ACTO I', 1);

-- Escenas del Acto I
INSERT INTO escenas (id, acto_id, nombre, duracion, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000000100', 'a1b2c3d4-e5f6-7890-abcd-000000000010', 'Plaza de Sevilla', '12 min', 1),
('a1b2c3d4-e5f6-7890-abcd-000000000101', 'a1b2c3d4-e5f6-7890-abcd-000000000010', 'Entrada de Carmen', '8 min', 2),
('a1b2c3d4-e5f6-7890-abcd-000000000102', 'a1b2c3d4-e5f6-7890-abcd-000000000010', 'Habanera', '5 min', 3);

-- TOPs del Acto I - Escena 1
INSERT INTO elementos_guion (id, escena_id, tipo_elemento, numero, ref_pagina, ref_compas, departamento, descripcion, observaciones, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000001001', 'a1b2c3d4-e5f6-7890-abcd-000000000100', 'TOP', '1', '1', '1', 'M.E.', 'Apertura de telón', 'Telón lento 8 segundos', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001002', 'a1b2c3d4-e5f6-7890-abcd-000000000100', 'TOP', '2', '1', '5', 'LUZ', 'Luz general escena plaza', 'State 1 - Luz día', 2),
('a1b2c3d4-e5f6-7890-abcd-000000001003', 'a1b2c3d4-e5f6-7890-abcd-000000000100', 'TOP', '3', '2', '12', 'SON', 'Ambiente plaza', 'Pista 01 - Murmullo gente', 3),
('a1b2c3d4-e5f6-7890-abcd-000000001004', 'a1b2c3d4-e5f6-7890-abcd-000000000100', 'TOP', '4', '3', '24', 'M.E.', 'Entrada soldados desde SR', 'Marcha militar', 4);

-- TOPs del Acto I - Escena 2
INSERT INTO elementos_guion (id, escena_id, tipo_elemento, numero, ref_pagina, ref_compas, departamento, descripcion, observaciones, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000001005', 'a1b2c3d4-e5f6-7890-abcd-000000000101', 'TOP', '5', '8', '1', 'LUZ', 'Cambio luz para entrada Carmen', 'State 2 - Foco cenital', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001006', 'a1b2c3d4-e5f6-7890-abcd-000000000101', 'TOP', '6', '8', '8', 'M.E.', 'Entrada Carmen desde SL', 'Por escalera', 2),
('a1b2c3d4-e5f6-7890-abcd-000000001007', 'a1b2c3d4-e5f6-7890-abcd-000000000101', 'TOP', '7', '9', '16', 'VID', 'Proyección fondo cigarreras', 'Video loop humo', 3);

-- TOPs del Acto I - Escena 3 (Habanera)
INSERT INTO elementos_guion (id, escena_id, tipo_elemento, numero, ref_pagina, ref_compas, departamento, descripcion, observaciones, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000001008', 'a1b2c3d4-e5f6-7890-abcd-000000000102', 'TOP', '8', '12', '1', 'LUZ', 'Luz especial Habanera', 'State 3 - Rojo tenue', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001009', 'a1b2c3d4-e5f6-7890-abcd-000000000102', 'TOP', '9', '12', '24', 'M.E.', 'Carmen lanza flor a Don José', 'Prop: rosa roja', 2),
('a1b2c3d4-e5f6-7890-abcd-000000001010', 'a1b2c3d4-e5f6-7890-abcd-000000000102', 'TOP', '10', '14', '48', 'LUZ', 'Blackout fin Habanera', 'Corte seco', 3);

-- ACTO II
INSERT INTO actos (id, guion_id, nombre, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000000020', 'a1b2c3d4-e5f6-7890-abcd-000000000001', 'ACTO II', 2);

-- Escenas del Acto II
INSERT INTO escenas (id, acto_id, nombre, duracion, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000000200', 'a1b2c3d4-e5f6-7890-abcd-000000000020', 'Taberna de Lillas Pastia', '15 min', 1),
('a1b2c3d4-e5f6-7890-abcd-000000000201', 'a1b2c3d4-e5f6-7890-abcd-000000000020', 'Canción del Torero', '6 min', 2);

-- TOPs del Acto II
INSERT INTO elementos_guion (id, escena_id, tipo_elemento, numero, ref_pagina, ref_compas, departamento, descripcion, observaciones, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000001011', 'a1b2c3d4-e5f6-7890-abcd-000000000200', 'TOP', '11', '20', '1', 'M.E.', 'Apertura cortina taberna', 'Cortina lateral SR', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001012', 'a1b2c3d4-e5f6-7890-abcd-000000000200', 'TOP', '12', '20', '4', 'LUZ', 'Luz taberna nocturna', 'State 4 - Velas y faroles', 2),
('a1b2c3d4-e5f6-7890-abcd-000000001013', 'a1b2c3d4-e5f6-7890-abcd-000000000200', 'TOP', '13', '21', '16', 'SON', 'Música gitana diegética', 'Pista 02 - Guitarra flamenca', 3),
('a1b2c3d4-e5f6-7890-abcd-000000001014', 'a1b2c3d4-e5f6-7890-abcd-000000000201', 'TOP', '14', '28', '1', 'LUZ', 'Foco Escamillo', 'Seguidor desde cabina', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001015', 'a1b2c3d4-e5f6-7890-abcd-000000000201', 'TOP', '15', '28', '32', 'M.E.', 'Entrada coro de admiradores', 'Desde SL y SR', 2);

-- ACTO III
INSERT INTO actos (id, guion_id, nombre, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000000030', 'a1b2c3d4-e5f6-7890-abcd-000000000001', 'ACTO III', 3);

-- Escenas del Acto III
INSERT INTO escenas (id, acto_id, nombre, duracion, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000000300', 'a1b2c3d4-e5f6-7890-abcd-000000000030', 'Montañas - Campamento', '18 min', 1),
('a1b2c3d4-e5f6-7890-abcd-000000000301', 'a1b2c3d4-e5f6-7890-abcd-000000000030', 'Escena de las cartas', '7 min', 2);

-- TOPs del Acto III
INSERT INTO elementos_guion (id, escena_id, tipo_elemento, numero, ref_pagina, ref_compas, departamento, descripcion, observaciones, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000001016', 'a1b2c3d4-e5f6-7890-abcd-000000000300', 'TOP', '16', '40', '1', 'M.E.', 'Cambio escenografía montaña', 'Rotación plataforma', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001017', 'a1b2c3d4-e5f6-7890-abcd-000000000300', 'TOP', '17', '40', '8', 'LUZ', 'Luz nocturna montaña', 'State 5 - Luna llena', 2),
('a1b2c3d4-e5f6-7890-abcd-000000001018', 'a1b2c3d4-e5f6-7890-abcd-000000000300', 'TOP', '18', '41', '24', 'VID', 'Proyección estrellas', 'Gobo rotativo', 3),
('a1b2c3d4-e5f6-7890-abcd-000000001019', 'a1b2c3d4-e5f6-7890-abcd-000000000301', 'TOP', '19', '48', '1', 'LUZ', 'Foco mesa cartas', 'State 6 - Ambiente ominoso', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001020', 'a1b2c3d4-e5f6-7890-abcd-000000000301', 'TOP', '20', '48', '16', 'SON', 'Efecto presagio muerte', 'Pista 03 - Reverb grave', 2);

-- ACTO IV
INSERT INTO actos (id, guion_id, nombre, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000000040', 'a1b2c3d4-e5f6-7890-abcd-000000000001', 'ACTO IV', 4);

-- Escenas del Acto IV
INSERT INTO escenas (id, acto_id, nombre, duracion, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000000400', 'a1b2c3d4-e5f6-7890-abcd-000000000040', 'Plaza de Toros - Exterior', '10 min', 1),
('a1b2c3d4-e5f6-7890-abcd-000000000401', 'a1b2c3d4-e5f6-7890-abcd-000000000040', 'Escena Final - Muerte de Carmen', '12 min', 2);

-- TOPs del Acto IV
INSERT INTO elementos_guion (id, escena_id, tipo_elemento, numero, ref_pagina, ref_compas, departamento, descripcion, observaciones, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000001021', 'a1b2c3d4-e5f6-7890-abcd-000000000400', 'TOP', '21', '55', '1', 'M.E.', 'Escenografía plaza de toros', 'Decorado bajando desde varas', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001022', 'a1b2c3d4-e5f6-7890-abcd-000000000400', 'TOP', '22', '55', '8', 'LUZ', 'Luz festiva exterior', 'State 7 - Sol tarde', 2),
('a1b2c3d4-e5f6-7890-abcd-000000001023', 'a1b2c3d4-e5f6-7890-abcd-000000000400', 'TOP', '23', '56', '16', 'SON', 'Ambiente plaza toros', 'Pista 04 - Multitud animada', 3),
('a1b2c3d4-e5f6-7890-abcd-000000001024', 'a1b2c3d4-e5f6-7890-abcd-000000000400', 'TOP', '24', '57', '32', 'M.E.', 'Desfile toreros', 'Entrada desde fondo', 4),
('a1b2c3d4-e5f6-7890-abcd-000000001025', 'a1b2c3d4-e5f6-7890-abcd-000000000401', 'TOP', '25', '62', '1', 'LUZ', 'Cambio dramático final', 'State 8 - Atardecer rojo', 1),
('a1b2c3d4-e5f6-7890-abcd-000000001026', 'a1b2c3d4-e5f6-7890-abcd-000000000401', 'TOP', '26', '64', '24', 'VID', 'Proyección sangre abstracta', 'Video crescendo', 2),
('a1b2c3d4-e5f6-7890-abcd-000000001027', 'a1b2c3d4-e5f6-7890-abcd-000000000401', 'TOP', '27', '65', '48', 'SON', 'Grito multitud corrida', 'Pista 05 - Ole', 3),
('a1b2c3d4-e5f6-7890-abcd-000000001028', 'a1b2c3d4-e5f6-7890-abcd-000000000401', 'TOP', '28', '68', '64', 'M.E.', 'Carmen cae', 'Coreografía muerte', 4),
('a1b2c3d4-e5f6-7890-abcd-000000001029', 'a1b2c3d4-e5f6-7890-abcd-000000000401', 'TOP', '29', '69', '72', 'LUZ', 'Blackout final', 'Fade 5 segundos', 5),
('a1b2c3d4-e5f6-7890-abcd-000000001030', 'a1b2c3d4-e5f6-7890-abcd-000000000401', 'TOP', '30', '70', '80', 'M.E.', 'Cierre telón final', 'Telón lento', 6);

-- Pasada del Acto I (setup inicial)
INSERT INTO pasada_items (id, acto_id, departamento, lugar, descripcion, orden) VALUES
('a1b2c3d4-e5f6-7890-abcd-000000002001', 'a1b2c3d4-e5f6-7890-abcd-000000000010', 'M.E.', 'Escenario', 'Decorado plaza Sevilla montado', 1),
('a1b2c3d4-e5f6-7890-abcd-000000002002', 'a1b2c3d4-e5f6-7890-abcd-000000000010', 'LUZ', 'Varas', 'State 0 - Preshow', 2),
('a1b2c3d4-e5f6-7890-abcd-000000002003', 'a1b2c3d4-e5f6-7890-abcd-000000000010', 'SON', 'PA', 'Sistema encendido, niveles verificados', 3),
('a1b2c3d4-e5f6-7890-abcd-000000002004', 'a1b2c3d4-e5f6-7890-abcd-000000000010', 'VID', 'Proyectores', 'Proyectores calibrados, standby', 4);
