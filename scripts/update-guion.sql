-- ============================================
-- SQL GENERADO AUTOMÁTICAMENTE DESDE WORD
-- Fecha: 2026-01-19T17:47:34.862Z
-- ============================================

-- INSTRUCCIONES:
-- 1. Copia este SQL completo
-- 2. Ve a Supabase > SQL Editor
-- 3. Pega y ejecuta
-- 4. Verifica los resultados

-- Primero obtenemos IDs necesarios
DO $$
DECLARE
  v_produccion_id UUID;
  v_guion_id UUID;
  v_acto_id UUID;
  v_escena_id UUID;
BEGIN
  -- Obtener producción Carmen
  SELECT id INTO v_produccion_id FROM teatro_real.producciones WHERE nombre ILIKE '%carmen%' LIMIT 1;
  IF v_produccion_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró la producción Carmen';
  END IF;

  -- Obtener guion
  SELECT id INTO v_guion_id FROM teatro_real.guiones WHERE produccion_id = v_produccion_id LIMIT 1;
  IF v_guion_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró guion para Carmen';
  END IF;

  RAISE NOTICE 'Producción: %, Guion: %', v_produccion_id, v_guion_id;
END $$;


-- ============================================
-- ACTO_I
-- Pasadas: 18
-- Escenas: 10
-- ============================================

-- PASADAS ACTO_I

-- Pasada: ME - VARAS
UPDATE teatro_real.pasada_items
SET descripcion = 'TELÓN NEGRO DE BOCA V-0 + TELÓN ACUSTICO MP- ABAJO EN COTA ESCENA
5 PARES DE PATAS NEGRAS ABAJO EN COTA ESCENA ABIERTAS A 18ms
PARRILA DE FOCOS V- (3 TIROS) EN POSICIÓN INICIAL INCLINADA 10º APROX.
CARTEL-VALLA PUBLICIDAD ACTO II MP- ARRIBA EN COTA ESCONDER
POSTE ALTA TENSIÓN V- ARRIBA EN COTA ESCONDER
PVC GRIS OSCURO V- + GASA NEGRA V- ABAJO EN COTA ESCENA
PANORAMAS CICLORAMA V- ABAJO EN COTA ESCENA
ELECTRICAS V- ARRIBA EN COTA ESCONDER
GIRATORIO EMBUTIDO EN VAGONES EN POSICIÓN PASADA 0º MARCA BLANCA
TORRES DE BOCA ABIERTAS A m
PUENTE DE BOCA EN COTA m',
    lugar = 'VARAS'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ME';


-- Pasada: PLATAF - VERDES 1-4 EN POSICIÓN AZULES 1-4
UPDATE teatro_real.pasada_items
SET descripcion = 'ROSAS 1-4 EN SU POSICIÓN, CON VAGONES ENCIMA (GIRATORIO EMBUTIDO) EN COTA -0.40 m
AZUL 5 EN SU POSICIÓN EN COTA 0m. AZULES 1-4 EN SU POSICIÓN EN COTA -4m',
    lugar = 'VERDES 1-4 EN POSICIÓN AZULES 1-4'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'PLATAF';


-- Pasada: FOSOS - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'FOSO ORQUESTA MEDIANO 2 1/5 PLATAFORMAS ABAJO EN COTA -2.50 m',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'FOSOS';


-- Pasada: ESCENA - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'TABLEROS SUELO BASE TEXTURIZADO PINTADOS MONTADOS Y SUJETOS SOBRE ROSAS + CORBATA
DUNAS FONDO CON MATORRALES MONTADAS. MATORRALES EN POSICIÓN DENTRO Y FUERA GIRATORIO
CARRA COMISARIA DE POLICIA MONTADA SOBRE GIRATORIO. PTAS Y VENTANAS CERRADAS.
CARRAS ACTOS 2, 3 y 4 ALMACENADAS EN CHÁCENA + 2 GUARDARRAILES',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - 1 CUERDA (CORISTA/FIGURANTE)
UPDATE teatro_real.pasada_items
SET descripcion = '28 SILLAS BLANCAS (8 DE METAL, 20 PLÁSTICO) + 3 MESAS BLANCAS EN MARCAS ESCENA (1 EN CARLOS CON TRUCO PIROTECNIA LATAS, OTRA EN LADO FELIPE CON CENICERO + RADIO CASETTE)
1 COLUMPIO CIRCULAR EN MARCA ESCENA FIJADO AL SUELO
MAQUINA VENDING AUTOMÁTICA CON LATAS EN DISPENSADOR Y 1 EN CAJÓN JUNTO MURO COMISARIA
MATORRALES VARIOS EN MARCAS ESCENA (Nos 10, 21, 25, 41, 43, 44, 46..) Y ZONA DE PETARDOS PREPARADA EN BOCA CARLOS.
DENTRO COMISARIA: PUERTAS CERRADAS, VENTANAS CERRADAS. PERSIANAS LADO CORTO MEDIO ABIERTAS. PARED LARGA 1/3 ABIERTAS
3 SILLAS CUERO JUNTO PARED. 1 MESA DEPACHO CON SILLÓN. CHAQUETA ZÚÑIGA COLGADA EN GANCHO PARED CORTA
SOBRE LA MESA: MÁQUINA ESCRIBIR CON FOLIO INSERTADO, VENTILADOR MESA, TELÉFONO, CARPETA CON DOCUMENTOS, PORTAFOLIOS, 2 BOLÍGRAFOS, EN AMBOS LADOS MÁQUINA ESCRIBIR. ESPOSAS EN EL PRIMER CAJÓN
PAQUETE DE CIGARRILLOS + MECHERO (MORALES)
HUMO AMBIENTE TODA LA FUNCIÓN AMBOS LADOS
POSICIÓN SILLAS Y MESAS ACTO I
POSICIÓN MATORRALES ACTO I MARCAS GRISES',
    lugar = '1 CUERDA (CORISTA/FIGURANTE)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: UTIL - LADO C.
UPDATE teatro_real.pasada_items
SET descripcion = 'MESA LADO CARLOS
BILLETES + CARTA (MICAELA)
8 TIRACHINAS + 2 ESPOSAS DE JUGUETE + 10 PISTOLAS DE JUGUETE
3 BICILETAS (BLANCA, NARANJA Y GRANATE) + 2 RIFLES
CARPETA CON DOCUMENTOS (DON JOSÉ)
PETARDOS FALSOS + MECHEROS (NIÑOS)
5 BOLÍGRAFOS NARANJAS
3 CARTAS DE LA MUERET DEL TAROT
RAMOS FLORES + ANILLO EN ESTUCHE
MOCHILA
CARTELES LETRAS NIÑOS ENTREACTOS EN 3 PILAS:
A ENTREACTO ENTRE 1 Y 2:  8A-14A (LUSTARD)​
B ENTREACTO ENTRE 2 Y 3: 1B-6B (LANUIT) 2024  / (DEUX SEMAIN) 2025
C  ENTREACTO ENTRE 3 Y 4: 1C-11C (QUELQUESJOU)
SILLAS + ESPEJOS CAMERINO TRANSFORMACIÓN
ATRILES CON LUZZ PARA INTERNO
LADO F.
MESA LADO FELIPE
10 PERIÓDICOS VARIOS + 5 REVISTAS VARIAS
15 CARTAS TAROT INCLUIDA CARTA MUERTE
6 TIRACHINAS + 6 PISTOLAS + BILLETES PESETAS + LATAS CERVEZA
12 PAQUETES CIGARRILLOS + MECHEROS
BOLSITA DE SANGRE. CONSOLA MANDO. FLOR ROJA PELO
BOTELLA CERVEZA MEDIO LLENA (ZÚÑIGA)
2 PARES DE MULETAS
2 BICICLETAS VERDES (NIÑOS)
CARTELES LETRAS NIÑOS ENTREACTOS EN 3 PILAS:
A ENTREACTO ENTRE 1 Y 2:  1A-7A (U N M O I S P)​
B ENTREACTO ENTRE 2 Y 3: 7B-14B (SUIVANTE) 2024 / (ESPLUSTARD) 2025
C ENTREACTO ENTRE 3 Y 4:  12C-21C (RSPLUSTARD) /
SILLAS + ESPEJOS CAMERINO TRANSFORMACION
ATRILES CON LUZ PARA INTERNO TROMPETAS',
    lugar = 'LADO C.'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'UTIL';


-- Pasada: ESCENA - SALA
UPDATE teatro_real.pasada_items
SET descripcion = 'CANAL 900 + PASILLOS AZULES + OJOS DE BUEY + MEM. 95 (5”) (PASADA)
LUZ ATRILES ORQUESTA + MTRO 100%
LÁMPARA + HERRADURA + MORTIERES FULL',
    lugar = 'SALA'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - PISTA MONÓLOO MADRE CARMEN PREPARADA
UPDATE teatro_real.pasada_items
SET descripcion = '2 CARROS CON TV MTRO.  + RETORNO ORQUESTA EN CADA HOMBRO
TV TORRES BOCA + PROSCENIOS EN NEGRO. CARRA COMISARÍA CONECTADA
SALA
PUBLICIDAD EN PANTALLAS LATERALES',
    lugar = 'PISTA MONÓLOO MADRE CARMEN PREPARADA'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'CHAQUETA ZÚÑIGA COLGADA EN GANCHO DENTRO CARRA COMISARÍA',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: CARAC - FELIPE
UPDATE teatro_real.pasada_items
SET descripcion = 'PAÑUELO ENSANGRENTADO PELEA CIGARRERAS
EN ESTA CELDA FALTA EL ALZADO DOSSIER IMPLANTACIÓN PROYECTOS TR CUANDO LO ENVIEN
PIE
TOP
E/M
DPTO. /
LUGAR
QUIÉN / QUÉ
UTILERÍA / SASTRERÍA / OBSERVACIONES
-12’',
    lugar = 'FELIPE'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'CARAC';


-- Pasada: ELEC - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'MEDIA SALA CIELO ETC´S 40% + MEM.  96 (7”)',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: AV - PROYECCIÓN CIELO
UPDATE teatro_real.pasada_items
SET descripcion = 'EN ESCENA
DENTRO COMISARIA
ZÚÑIGA + MORALES + ACTOR POLICÍA
GAFAS DE SOL + PISTOLAS + GORRAS POLICÍA
EN SILLAS
FUERA
TENORES + BAJOS CORO
EXTRA-SOPRANOS + MEZZOS CORO
PERIÓDICOS + REVISTAS
PREVENIDOS PARA ENTRAR
LADO C
MICAELA FONDO
CARTA EN SOBRE + BILLETES + BOLSA
F0
ACTRIZ MADRE DON JOSÉ
MANTILLA + PEINETA. FOTO DON JOSÉ
BARAJA CARTAS TAROT (CARTA MUERTE)
-1’ /
SALA O.K.',
    lugar = 'PROYECCIÓN CIELO'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'AV';


-- Pasada: AV - FUERA PUBLICIDAD
UPDATE teatro_real.pasada_items
SET descripcion = 'DENTRO PROYECCIÓN MÓVILES
REG.
Q-LIGHT ORQUESTA
Afinación
Fin afinación',
    lugar = 'FUERA PUBLICIDAD'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'AV';


-- Pasada: AV - RING-RING + PINCHAR COMUNICADO MÓVILES
UPDATE teatro_real.pasada_items
SET descripcion = 'DENTRO RETORNO EN ESCENARIO
FUERA PROYECCIÓN MÓVILES
Fin aviso',
    lugar = 'RING-RING + PINCHAR COMUNICADO MÓVILES'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'AV';


-- Pasada: ELEC - FUERA SALA + 99 (5”)
UPDATE teatro_real.pasada_items
SET descripcion = 'EN FUERA SALA
E
FOSO F
MAESTRO
ENTRA MTRO.',
    lugar = 'FUERA SALA + 99 (5”)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: ELEC - PRIMERA PARTE (c. 1h 35’)
UPDATE teatro_real.pasada_items
SET descripcion = 'DENTRO LUZ SALUDO MTRO. / FUERA LUZ SALUDO MTRO.  + MEM. 99.5 (5”)',
    lugar = 'PRIMERA PARTE (c. 1h 35’)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: ELEC - MEM. 100 (4”)
UPDATE teatro_real.pasada_items
SET descripcion = '+ENTRA CAÑÓN SOBRE MADRE DELANTE TELÓN NEGRO
½ CUERPO 80%
VISUAL
100.7',
    lugar = 'MEM. 100 (4”)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: ELEC - MEM. 102 (5”)
UPDATE teatro_real.pasada_items
SET descripcion = 'MADRE EN EL CENTRO ESCENARIO',
    lugar = 'MEM. 102 (5”)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto I%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- ESCENAS ACTO_I

-- Escena: N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 1, 'N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)', 1
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 104 (3´)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 104 (3´)', 'FADE OUT CAÑÓN MADRE CUANDO SE METE ENTRE CORO
6//5/2
103
ENCENDER TV PROSCENIOS Y TORRES BOCA
6/5/3
M
FDO C
1 ACTRIZ MADRE
RECOGER BARAJA CARTAS TAROT
8/2/2
VISUAL
104', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 106 (15”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 106 (15”)', 'MORALES A PUNTO DE SALIR DE LA COMISARÍA
11/1/3
E
C4
MICAELA
CARTA EN SOBRE + BILLETES + BOLSA
11/3/1
105', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 108 (12”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 108 (12”)', 'ENTRADA MICAELA
14/4/2
106', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 110 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 110 (10”)', 'MICAELA HACIA MESA CENTRO
VISUAL
107', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 112 (5”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 112 (5”)', 'MORALES + MICAELA SE APARTAN DE MESA
20/2/4
109
M. E.', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 1:  VEL 65
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 1:  VEL 65', 'GIRATORIO SE MUEVE 90º EN SENTIDO HORARIO A POS 2 (1’ 05”)', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 114 (2’40”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 114 (2’40”)', '21/2/1
M
FDO F
MICAELA
22/2/1
E
C2
3 NIÑOS ACTORES
VAN CORRIENDO DENTRO COLUMPIO CIRCULAR
23/3/2
M
C
F
CORO MASCULINO + FEMENINO', 7
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°1: INTRODUCTION: “SUR LA PLACE, CHACUN PASSE…” (C. 6’)'
ON CONFLICT DO NOTHING;


-- Escena: N°2: MARCHE ET CHOEUR DES GAMINS:  “AVEC LA GARDE MONTANTE…” (C. 3’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 2, 'N°2: MARCHE ET CHOEUR DES GAMINS:  “AVEC LA GARDE MONTANTE…” (C. 3’)', 2
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 116 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 116 (20”)', 'GIRATORIO LLEGANDO A POSICIÓN
32/1/1
E
F3
1 NIÑO
PISTOLA JUGUETE + SOMBRERO COWBOY
32/1/1
INT
LADO CARLOS
2 TROMPETAS INTERNAS
CARRO CON TV +RETORNO
2 ATRILES CON LUZ
32/2/2
E
C4
1 NIÑA
PISTOLA JUGUETE
32/3/1
E
C2
1 NIÑO
ESCOPETA
33/1/1
E
FDO C
GRUPO 1B NIÑOS (7)
LINTERNA, PISTOLAS, TIRACHINAS
33/1/1
E
F2
GRUPO 1A NIÑOS (4)
TIRACHINAS
33/2/4
E
C1
1 NIÑO
BICICLETA NARANJA
33/4/2
E
C3
GRUPO 4 NIÑOS (5)
PISTOLAS, TIRACHINAS, 1 PETARDO
33/5/4
E
F1
1 NIÑO
1 BICICLETA VERDE
33/6/1
E
F4
GRUPO 3 NIÑOS (4)
PISTOLAS, TIRACHINAS
34/1/4
E
C2
1 NIÑA
BICICLETA BLANCA + PISTOLA
34/3/1
E
C2
GRUPO 2 NIÑOS (2)
PISTOLAS, TIRACHINAS
34/4/4
E
F4
1 NIÑA
BICICLETA VERDE + PISTOLA
34/4/4
E
FDO C
1 NIÑA
BICICLETA ROJA + PISTOLA
36/3/4
M
C4
1 NIÑO GRITANDO Y CORRIENDO
37/1/5
M
C4
1 NIÑA GRITANDO Y CORRIENDO
37/4/5
M
C4
1 NIÑA GRITANDO Y CORRIENDO
38/3/5
114
ZÚÑIGA DISPARA PISTOLA: ACTIVAR EFECTO PIROTÉCNICO MESA: LATAS SALEN VOLANDO
UTILERO DESDE HOMBRO CARLOS DELANTE', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°2: MARCHE ET CHOEUR DES GAMINS:  “AVEC LA GARDE MONTANTE…” (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 120 (15”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 120 (15”)', 'ENTRADA DON JOSÉ
38/4/1
E
C1
DON JOSÉ
1 CARPETA CON DOCUMENTOS
PAQUETE CIGARRILLOS CON MECHERO
41/1/1
INT
LADO CARLOS
2 TROMPETAS INTERNAS
CARRO CON TV +RETORNO
2 ATRILES CON LUZ
41/3/1
M
F2
ZÚÑIGA + MORALES
RECOGER PISTOLA FOGUEO Y CAMBIARLA POR FALSA
44/2/1
116
ACTIVAR EFECTO PIROTÉCNICO EN MATORRAL PROSCENIO CARLOS: ESTALLAN 8 PETARDOS
UTILERO DESDE HOMBRO CARLOS DELANTE', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°2: MARCHE ET CHOEUR DES GAMINS:  “AVEC LA GARDE MONTANTE…” (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 124 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 124 (10”)', '44/4/2
M
F5, F4
30 NIÑOS
RECOGER ARMAS UTILERÍA', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°2: MARCHE ET CHOEUR DES GAMINS:  “AVEC LA GARDE MONTANTE…” (C. 3’)'
ON CONFLICT DO NOTHING;


-- Escena: N°3: CHŒUR ET SCÈNE:  “ LA CLOCHE A SONNÉ…” (C. 6’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 3, 'N°3: CHŒUR ET SCÈNE:  “ LA CLOCHE A SONNÉ…” (C. 6’)', 3
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 126 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 126 (20”)', '48/1/1
INT
LADO FELIPE
CAMPANA INTERNA
CARRO CON TV +RETORNO
2 ATRILES CON LUZ
48/1/1
E
F3 F2
EXTRA-SOPRANOS + MEZZOS CORO
CIGARRILLOS + MECHEROS
48/2/5
E
C2,C3,C4
CORO MASCULINO
1 CUERDA
49/1/2
E
C3
1 ACTOR ENAMORADO
CAJITA CON ANILLO + RAMO FLORES + GAFAS SOL
50/3/1
E
F3 F4
CORO FEMENINO + 2 ACTRICES + 3 NIÑAS
CIGARRILOS + MECHEROS
52/1/3
127', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°3: CHŒUR ET SCÈNE:  “ LA CLOCHE A SONNÉ…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 132 (7”-14”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 132 (7”-14”)', 'PAREJITA     DELNATE CTRO
56/2/2
128', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°3: CHŒUR ET SCÈNE:  “ LA CLOCHE A SONNÉ…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 136 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 136 (10”)', 'SOLDADO LEVANTA RADIO
57/3/4
130', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°3: CHŒUR ET SCÈNE:  “ LA CLOCHE A SONNÉ…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 2: VEL 64
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 2: VEL 64', 'GIRATORIO SE MUEVE 43º EN SENTIDO ANTIHORARIO A POS 3(40”)', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°3: CHŒUR ET SCÈNE:  “ LA CLOCHE A SONNÉ…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 138 (40”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 138 (40”)', '58/3/2
E
F4
ZÚÑIGA
1 BOTELLA CERVEZA + GAFAS SOL + PISTOLA
60/2/2
M
FDO C
1 ACTOR + 1 ACTRIZ (ENAMORADOS)
CAMBIO VESTUARIO :
ACTOR A POLICIA 20’
ACTRIZ MAQUILLAJE HERIDA PELEA 19’
60/3/5
E
FDO F
CARMEN
1 FLOR ROJA EN EL PELO
61/3/4
131', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°3: CHŒUR ET SCÈNE:  “ LA CLOCHE A SONNÉ…” (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 140 (1’30”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 140 (1’30”)', 'ENTRADA CARMEN', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°3: CHŒUR ET SCÈNE:  “ LA CLOCHE A SONNÉ…” (C. 6’)'
ON CONFLICT DO NOTHING;


-- Escena: N°4: HABANERA: " L' AMOUR EST UN OISEAU REBELLE…" (C. 5’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 4, 'N°4: HABANERA: " L'' AMOUR EST UN OISEAU REBELLE…" (C. 5’)', 4
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 142 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 142 (10”)', 'INICIO CANTO HABANERA
72/1/1
E
C3
ACTRIZ MADRE DON JOSÉ
MANTILLA + PEINETA
CARTA MUERTE TAROT
73/1/1
135', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°4: HABANERA: " L'' AMOUR EST UN OISEAU REBELLE…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 146 (7”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 146 (7”)', 'DON JO´SE RODILLAS RECOGE PAPELES', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°4: HABANERA: " L'' AMOUR EST UN OISEAU REBELLE…" (C. 5’)'
ON CONFLICT DO NOTHING;


-- Escena: N°5: SCÈNE: " CARMEN! SUR TES PAS NOUS NOUS PRESSONS TOUS!…" (C. 2’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 5, 'N°5: SCÈNE: " CARMEN! SUR TES PAS NOUS NOUS PRESSONS TOUS!…" (C. 2’)', 5
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 150 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 150 (20”)', 'VISIÓN MADRE
76/3/2
139
M. E.', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°5: SCÈNE: " CARMEN! SUR TES PAS NOUS NOUS PRESSONS TOUS!…" (C. 2’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 3: VEL 24
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 3: VEL 24', 'GIRATORIO SE MUEVE 133º EN SENTIDO HORARIO A POS. 3 (4’ 20”)', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°5: SCÈNE: " CARMEN! SUR TES PAS NOUS NOUS PRESSONS TOUS!…" (C. 2’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 154 (40”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 154 (40”)', '76/3/4
M
FDO F
ZÚÑIGA + MORALES
M
FONDO F
CORO GENERAL FIG + NIÑOS + ACTRIZ
RECOGER 4 SILLAS PLÁSTICO + BOTELLA CERVEZA
CORO FEMENINO CAMBIO VESTUARIO 10’
TRABAJADORAS FÁBRICA
76/5/5
M
F2
CARMEN
76/5/6
E
C3
MICAELA
BOLSA CON CARTA + BILLETES
CORRIENDO', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°5: SCÈNE: " CARMEN! SUR TES PAS NOUS NOUS PRESSONS TOUS!…" (C. 2’)'
ON CONFLICT DO NOTHING;


-- Escena: N°6: RÉCITATIF ET DUO: "PARLE MOI DE MA MÈRE!…" (C. 10’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 6, 'N°6: RÉCITATIF ET DUO: "PARLE MOI DE MA MÈRE!…" (C. 10’)', 6
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 160 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 160 (10”)', 'FINAL GIRO. DON JOSÉ ENTRA COMISARIA
86/3/3
143', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°6: RÉCITATIF ET DUO: "PARLE MOI DE MA MÈRE!…" (C. 10’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 162 (15”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 162 (15”)', 'MICAELA ENTRA EN COMISARÍA
93/3/3
144', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°6: RÉCITATIF ET DUO: "PARLE MOI DE MA MÈRE!…" (C. 10’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 164 (14”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 164 (14”)', 'MUTIS MICAELA
93/3/5
M
FDO F
MICAELA
CORRIENDO
94
VISUAL
145
M. E.', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°6: RÉCITATIF ET DUO: "PARLE MOI DE MA MÈRE!…" (C. 10’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 4 (A): VEL 30
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 4 (A): VEL 30', 'GIRATORIO SE MUEVE 16º SENTIDO HORARIO (30”) Y CON TOP 146  AUMENTANDO VELOCIDAD CONTINUA GIRO
DON JOSÉ LEE CARTA
PINCHAR EFECTO AUDIO GRABADO LECTURA CARTA VOZ MADRE', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°6: RÉCITATIF ET DUO: "PARLE MOI DE MA MÈRE!…" (C. 10’)'
ON CONFLICT DO NOTHING;


-- Escena: N°7: CHŒUR:  "AU SECOURS! AU SECOURS!…" (C. 3’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 7, 'N°7: CHŒUR:  "AU SECOURS! AU SECOURS!…" (C. 3’)', 7
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 4 (B): VEL 180GIRATORIO AUMENTA VELOCIDAD Y CONTINUA 114º SENTIDO HORARIO A POS 4 EN 40”
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 4 (B): VEL 180GIRATORIO AUMENTA VELOCIDAD Y CONTINUA 114º SENTIDO HORARIO A POS 4 EN 40”', '', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°7: CHŒUR:  "AU SECOURS! AU SECOURS!…" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 166 (30”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 166 (30”)', '98/1/5
INT
FDO FELIPE
CORO FEMENINO
CARRO CON TV +RETORNO
1 ATRIL CON LUZ + PODIO MTRO.
98/2/5
E
F3
F4
GRUPO 1 CORO FEMENINO + ACTRIZ
GRUPO 2 CORO FEMENINO + ACTRIZ
PAÑUELO ENSANGRENTADO
98/4/2
M
FDO F
ACTRIZ MADRE DON JOSÉ
100/2/1
147', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°7: CHŒUR:  "AU SECOURS! AU SECOURS!…" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 168 ( 7”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 168 ( 7”)', 'FINAL GIRO
102/2/5
E
C4
ZÚÑIGA + MORALES + 2 ACTORES POLICÍAS CORRIENDO
GAFAS DE SOL + PISTOLA
104/3/1
M
F4
MORALES +DON JOSÉ + 1 ACTOR POLICÍA
110/2/1
M
FONDO F
FONDO C
CORO FEMENINO + 2 ACTRICES
110/4/5
E
F4
MORALES +DON JOSÉ + CARMEN +1 ACTOR POLICÍA', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°7: CHŒUR:  "AU SECOURS! AU SECOURS!…" (C. 3’)'
ON CONFLICT DO NOTHING;


-- Escena: N°8: RECITATIF, CHANSON: " TRALA LA LA LA, COUPE MOI, BRÛLE MOI…" (C. 3’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 8, 'N°8: RECITATIF, CHANSON: " TRALA LA LA LA, COUPE MOI, BRÛLE MOI…" (C. 3’)', 8
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 170 (5”-10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 170 (5”-10”)', 'CARMEN CTRO ESCENARIO CANTA
113/4/1
150
M. E.', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°8: RECITATIF, CHANSON: " TRALA LA LA LA, COUPE MOI, BRÛLE MOI…" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 5: VEL 80
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 5: VEL 80', 'GIRATORIO SE MUEVE 84º EN SENTIDO ANTIHORARIO A POS 5
(1’ 20”)', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°8: RECITATIF, CHANSON: " TRALA LA LA LA, COUPE MOI, BRÛLE MOI…" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 172 (9”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 172 (9”)', '114/4/5
M
C4
ZÚÑIGA+ MORALES + 2 ACTORES POLICÍAS', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°8: RECITATIF, CHANSON: " TRALA LA LA LA, COUPE MOI, BRÛLE MOI…" (C. 3’)'
ON CONFLICT DO NOTHING;


-- Escena: N°9: RÉCITATIF, CHANSON ET DUO: "PRÈS DES REMPARTS …" (C. 5’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 9, 'N°9: RÉCITATIF, CHANSON ET DUO: "PRÈS DES REMPARTS …" (C. 5’)', 9
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 176 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 176 (10”)', 'CASI FIN GIRO', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°9: RÉCITATIF, CHANSON ET DUO: "PRÈS DES REMPARTS …" (C. 5’)'
ON CONFLICT DO NOTHING;


-- Escena: N°10: FINAL: "VOICI L'ORDRE; PARTEZ ET FAITES BONNE …" (C. 3’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 10, 'N°10: FINAL: "VOICI L''ORDRE; PARTEZ ET FAITES BONNE …" (C. 3’)', 10
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 6(A): VEL 20
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 6(A): VEL 20', 'GIRATORIO SE MUEVE 8º EN SENTIDO HORARIO 25” Y CON TOP 154 AUMENTANDO VELOCIDAD CONTINÚA GIRO', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°10: FINAL: "VOICI L''ORDRE; PARTEZ ET FAITES BONNE …" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 180 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 180 (20”)', '136/2/3
154
M. E.', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°10: FINAL: "VOICI L''ORDRE; PARTEZ ET FAITES BONNE …" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 6 (B): MAX VELOCIDAD
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 6 (B): MAX VELOCIDAD', 'GIRATORIO AUMENTA VELOCIDAD AL MÁXIMO Y CONTINUA 106ª EN SENTIDO HORARIO 30” A POS 6
CORTE MTRO
155
M. E.
BAJA TELÓN NEGRO BOCA V-0 + TELÓN ACÚSTICO V A COTA ESCENA (VEL. MAX)
NEGRO TV PROSCENIOS Y TORRES BOCA', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°10: FINAL: "VOICI L''ORDRE; PARTEZ ET FAITES BONNE …" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 184 (0”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 184 (0”)', 'FOSO ORQUESTA + ATRIL MTRO INCLUIDOS
TELÓN ABAJO
156', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°10: FINAL: "VOICI L''ORDRE; PARTEZ ET FAITES BONNE …" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 186 (5”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 186 (5”)', 'VUELVE LUZ ATRILES FOSO ORQ
LUZ DETRÁS PARA CAMBIO
TELÓN ABAJO
M
F/C
DON JOSÉ + MORALES + ZÚÑIGA +2 ACTORES POLICÍAS
+ CARMEN
PARA CAMBIO RÁPIDO
1 ACTOR SE CAMBIA CONDUCTOR FURGONETA
CAMBIO VESTUARIO CARMEN ACTO II 2’
CAMBIO
RÁPIDO A ACTO II EN SILENCIO
2’
200
M. E.
SUBIR PVC FONDO V-  + TUL NEGRO V- A COTA PASO CARRAS', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°10: FINAL: "VOICI L''ORDRE; PARTEZ ET FAITES BONNE …" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 7: MOVER GIRATORIO A POSICIÓN PASADA ACTO 2º POS. 7
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 7: MOVER GIRATORIO A POSICIÓN PASADA ACTO 2º POS. 7', 'BAJAR PVC FONDO V- + GASA NEGRA V-  A COTA ESCENA
BAJA CARTEL-ANUNCIO V- COTA ESCENA
APARTAR DUNAS FONDO PARA PASO CARRAS
SACAR CARRA COMISARÍA POLICIA A CHÁCENA
COLOCAR CARRA BAR CARRETERA EN MARCA DENTRO GIRATORIO
RECOLOCAR DUNAS FONDO INICIO ACTO II
COLOCAR GUARDARRAIL PEQUEÑO EN MARCA ESCENA FDO C
COLOCAR MATORRALES ACTO II
FIJAR CARTEL-ANUNCIO AL SUELO
CONECTAR CARRA BAR + CARTEL ANUNCIO
RETIRAR TODAS LAS MESAS Y SILAS DE PLÁSTICO
+ COLUMPIO GIRATORIO
RECOLOCAR MATORRALES ACTO II MARCAS MARRONES
CAMBIO RÁPIDO A ACTO II', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto I%'
AND e.nombre = 'N°10: FINAL: "VOICI L''ORDRE; PARTEZ ET FAITES BONNE …" (C. 3’)'
ON CONFLICT DO NOTHING;


-- ============================================
-- ACTO_II
-- Pasadas: 7
-- Escenas: 7
-- ============================================

-- PASADAS ACTO_II

-- Pasada: ME - VARAS
UPDATE teatro_real.pasada_items
SET descripcion = 'TELÓN NEGRO DE BOCA V-0 +  TELÓN ACUSTICO MP- ABAJO EN COTA ESCENA
5 PARES DE PATAS NEGRAS ABAJO EN COTA ESCENA ABIERTAS A 18ms
PARRILA DE FOCOS V- (3 TIROS) EN POSICIÓN INICIAL ACTO II
CARTEL-VALLA PUBLICIDAD ACTO II MP- AIBAJO EN COTA ESCENA
POSTE ALTA TENSIÓN V- ARRIBA EN COTA ESCONDER
PVC GRIS OSCURO V- + GASA NEGRA V- ABAJO EN COTA ESCENA
PANORAMAS CICLORAMA V- ABAJO EN COTA ESCENA
GIRATORIO EMBUTIDO EN VAGONES EN POSICIÓN PASADA ACTO II CON CARRA BAR ENCIMA POS. 7
TORRES DE BOCA ABIERTAS A m
PUENTE DE BOCA EN COTA m',
    lugar = 'VARAS'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto II%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ME';


-- Pasada: PLATAF - VERDES 1-4 EN POSICIÓN AZULES 1-4
UPDATE teatro_real.pasada_items
SET descripcion = 'ROSAS 1-4 EN SU POSICIÓN, CON VAGONES ENCIMA (GIRATORIO EMBUTIDO) EN COTA -0.40 m
AZUL 5 EN SU POSICIÓN EN COTA 0m. AZULES 1-4 EN SU POSICIÓN EN COTA -4m',
    lugar = 'VERDES 1-4 EN POSICIÓN AZULES 1-4'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto II%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'PLATAF';


-- Pasada: FOSOS - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'FOSO ORQUESTA MEDIANO 2 1/5 PLATAFORMAS ABAJO EN COTA -2.50 m',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto II%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'FOSOS';


-- Pasada: ESCENA - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'TABLEROS SUELO BASE TEXTURIZADO PINTADOS MONTADOS Y SUJETOS SOBRE ROSAS + CORBATA
DUNAS FONDO CON MATORRALES MONTADAS. MATORRALES EN POSICIÓN DENTRO Y FUERA GIRATORIO
CARRA BAR DE CARRETERA MONTADA SOBRE GIRATORIO. PTAS Y VENTANAS CERRADAS .
CARRAS ACTOS 1, 3 y 4 ALMACENADAS EN CHÁCENA + 1 GUARDARRAIL GRANDE
GUARDARRAIL PEQUEÑO MONTADO EN MARCA ESCENA
VALLA PUBLICITARIA MONTADA EN MARCA ESCENA FONDO FELIPE',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto II%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - POSICIÓN MATORRALES MARCAS MARRONES
UPDATE teatro_real.pasada_items
SET descripcion = 'FUERA CARRA BAR: 1 SILLA JUNTO ESCALÓN PUERTA
MONTÍCULOS MATORRALES 6,5,1, 4 3, JUNTO MUROS CARRA BAR. GUARDARRAIL PEQUEÑO EN FONDO MARCA ESCENA
DENTRO DEL GIRATORIO MONTÍCULOS 7,17,27,29,45,1-6
DENTRO CARRA BAR: 2 SILLAS ROJAS, 1 BOTELLA VODKA LLENA CON 2 VASOS EN MESA ROJA ENTRE SILLAS
SÓFÁ ROJO CORRIDO CONTRA MURO LARGO, CUADRO ENCIMA. 1 MESA ROJA
DELANTE CON 2 VASOS CRISTAL.  CORTINA ROJA EN PUERTA ENTRADA
MATORRALES FONDO DELANTE CICLORAMA. CARTEL ANUNCIO CON LUZ EN MARCA ESCENA
HUMO AMBIENTE TODA LA FUNCIÓN AMBOS LADOS
LADO C.
1 BOLSA GRANDE CUERO CON BANDERILLAS (ESCAMILLO)
MOCHILA CON CAMISA BLANCA Y CHAQUETA MILITAR  CON 2 FLORES UNA EN CADA BOLSILLO + ANILLO (DON JOSÉ)
CARTA MUERTE TAROT (ACTRIZ MADRE)
1 ATRIL CON LUZ + PODIO MTRO INTERNO CORO MASCULINO + DON JOSÉ
LADO F.
CAJA ROJA CON 6 BOTELLAS DE VODKA LLENAS (MERCEDES)
1 BOTELLA VODLA LLENA (FRASQUITA)
FONDO FELIPE: F4 FURGONETA CON BATERÍA CARGADA.EN LA GUANTERA. CAPUCHA, CUERDA Y MAPA',
    lugar = 'POSICIÓN MATORRALES MARCAS MARRONES'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto II%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - SALA
UPDATE teatro_real.pasada_items
SET descripcion = 'CANAL 900 + PASILLOS AZULES + OJOS DE BUEY + MEM. (PASADA)
LUZ ATRILES ORQUESTA + MTRO 100%',
    lugar = 'SALA'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto II%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = '2 CARROS CON TV MTRO.  + RETORNO ORQUESTA EN CADA HOMBRO
TV TORRES BOCA + PROSCENIOS EN NEGRO. CARRA BAR CARRETERA CONECTADA. VALLA PUBLICITARIA CONECTADA',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto II%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- ESCENAS ACTO_II

-- Escena: N°11: CHANSON: " LES TRINGLES DES SISTRES TINTAIENT…" (C. 4’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 11, 'N°11: CHANSON: " LES TRINGLES DES SISTRES TINTAIENT…" (C. 4’)', 11
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 206 (6”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 206 (6”)', '141/4/4
202
ENCENDER TV TORRES BOCA + PROSCENIOS
CARMEN ABRE PUERTA BAR', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°11: CHANSON: " LES TRINGLES DES SISTRES TINTAIENT…" (C. 4’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 208 (12”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 208 (12”)', '143/1/1
E
F5
FRASQUITA
MERCEDES
CAJA PLÁSTICO ROJA CON 6 BOTELLAS VODKA
1 BOTELLA VODKA LLENA DE AGUA
143/1/4
205
M. E.', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°11: CHANSON: " LES TRINGLES DES SISTRES TINTAIENT…" (C. 4’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 8A: VEL 90
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 8A: VEL 90', 'GIRATORIO SE MUEVE 100º EN SENTIDO IHORARIO A POS 8
(1’) EN DOS FASES', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°11: CHANSON: " LES TRINGLES DES SISTRES TINTAIENT…" (C. 4’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 210 (6”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 210 (6”)', '144/1/1
206
M. E.', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°11: CHANSON: " LES TRINGLES DES SISTRES TINTAIENT…" (C. 4’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 8B: GIRATORIO AUMENTA VELOCIDAD A 150 HASTA POSICIÓN 8
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 8B: GIRATORIO AUMENTA VELOCIDAD A 150 HASTA POSICIÓN 8', '145/2/1
207', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°11: CHANSON: " LES TRINGLES DES SISTRES TINTAIENT…" (C. 4’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 214 (6”-12”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 214 (6”-12”)', 'CASI FIN GIRO', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°11: CHANSON: " LES TRINGLES DES SISTRES TINTAIENT…" (C. 4’)'
ON CONFLICT DO NOTHING;


-- Escena: N°12: CHŒUR: " VIVAT, VIVAT LE TORERO!…" (C. 2’
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 12, 'N°12: CHŒUR: " VIVAT, VIVAT LE TORERO!…" (C. 2’', 12
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 9: VEL 123
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 9: VEL 123', 'GIRATORIO SE MUEVE 235º EN SENTIDO HORARIO A POS. 9
(1’ 30”)', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°12: CHŒUR: " VIVAT, VIVAT LE TORERO!…" (C. 2’'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 218 ((10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 218 ((10”)', '', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°12: CHŒUR: " VIVAT, VIVAT LE TORERO!…" (C. 2’'
ON CONFLICT DO NOTHING;


-- Escena: N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 13, 'N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)', 13
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 222 (8”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 222 (8”)', 'ENTRADA ESCAMILLO + CASI FIN GIRO
163/1/1
E
C4
ESCAMILLO
1 BOLSA CUERO CON BANDERILLAS
TRAJE AMARILLO
166/1/3
213', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 224 (7”-14”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 224 (7”-14”)', 'ESCAMILLO COGE BANDERILLAS
166/4/3
215
M. E.', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 10:  VEL 110
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 10:  VEL 110', 'GIRATORIO SE MUEVE 125º EN SENTIDO HORARIO A POS. 10 (50”)
170/1/2
216
GIRATORIO SUBE A VELOCIDAD  150 (AUMENTA EN FIG 37)', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 226 (30”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 226 (30”)', '171/1(2
217', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 228 (5”-14”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 228 (5”-14”)', 'CASI FIN GIRO
179/1/2
219', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 230 (18”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 230 (18”)', 'PREPARACIÓN ENTRADA CAMIONETA
179/2/3
E
F4
FURGONETA CONDUCIDA POR 1 ACTOR
REMENDADO (GAFAS DE SOL)
EN GUANTERA: CUERDA, MAPA, CAPUCHA NEGRA
APLAUSOS
M
FDO C
CORO MASCULINO +  ACTOR POLICÍA + ESCAMILLO
+ ACTOR CONDUCTOR CORRIENDO
CAMBIO VESTUARIO A CONTRABANDISTAS 11’
EN CAMERINOS
180
VISUAL
220', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 232 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 232 (20”)', 'PORTAZO PTA BAR
186 /1
M
F3
ZÚÑIGA + MORALES', 7
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°13: COUPLETS: "VOTRE TOAST, JE PEUX VOUS LE RENDRE…" (C. 5’)'
ON CONFLICT DO NOTHING;


-- Escena: N°14: RECITATIF ET QUINTETTE: "NOUS AVONS EN TÊTE UNE AFFAIRE!…" (C. 5’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 14, 'N°14: RECITATIF ET QUINTETTE: "NOUS AVONS EN TÊTE UNE AFFAIRE!…" (C. 5’)', 14
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 11: VEL. 45
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 11: VEL. 45', 'GIRATORIO SE MUEVE 92º EN SENTIDO HO RARIO A POS. 11 (2’)
892
800
°
892
°
800
°', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°14: RECITATIF ET QUINTETTE: "NOUS AVONS EN TÊTE UNE AFFAIRE!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 234 (18”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 234 (18”)', '196/2/2
225', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°14: RECITATIF ET QUINTETTE: "NOUS AVONS EN TÊTE UNE AFFAIRE!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 236 (12”-10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 236 (12”-10”)', 'CARMEN SALE POR LA PTA BAR
204/1/1
227', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°14: RECITATIF ET QUINTETTE: "NOUS AVONS EN TÊTE UNE AFFAIRE!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 238 (5”-10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 238 (5”-10”)', 'FIN GIRO', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°14: RECITATIF ET QUINTETTE: "NOUS AVONS EN TÊTE UNE AFFAIRE!…" (C. 5’)'
ON CONFLICT DO NOTHING;


-- Escena: N°15: CHANSON:  "HALTE LÀ! QUI VA LÀ!...” (C. 1’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 15, 'N°15: CHANSON:  "HALTE LÀ! QUI VA LÀ!...” (C. 1’)', 15
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 12:  VEL 110
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 12:  VEL 110', 'GIRATORIO SE MUEVE 168º EN SENTIDO HORARIO A POS. 12 (1’30”)
892
°
10
60
°', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°15: CHANSON:  "HALTE LÀ! QUI VA LÀ!...” (C. 1’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 242 (40”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 242 (40”)', '217/3/4
M
F3
FRASQUITA + MERCEDES + DANCAIRO + REMENDADO
217/4/4
E
FDO C
DON JOSÉ
ANILLO PUESTO
MOCHILA CON CAMISA BLANCA Y CHAQUETA MILITAR CON 2 FLORES UNA EN CADA BOLSILLO
217/5/4
233', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°15: CHANSON:  "HALTE LÀ! QUI VA LÀ!...” (C. 1’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 244 (8”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 244 (8”)', 'CASI FIN GIRO', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°15: CHANSON:  "HALTE LÀ! QUI VA LÀ!...” (C. 1’)'
ON CONFLICT DO NOTHING;


-- Escena: N°16: DUO: "JE VAIS DANSER EN VOTRE HONNEUR…" (C. 15’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 16, 'N°16: DUO: "JE VAIS DANSER EN VOTRE HONNEUR…" (C. 15’)', 16
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 246 (8”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 246 (8”)', '224/4/3
INT
FDO C
2 TROMPETAS
2 ATRILES CON LUZ
CARRO CON TV + RETORNO ORQ
233/2/1
E
C4
ACTRIZ MADRE DON JOSÉ
MANTILLA, PEINETA, CARTAS TAROT
SE ESCONDER DETRÁS CARRA BAR
234/3/5
SEÑAL
DETRÁS CARRA BAR
ACTRIZ MADRE DON JOSÉ
AVISAR MADRE PARA QUE AVANCE
235/1/1
238', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°16: DUO: "JE VAIS DANSER EN VOTRE HONNEUR…" (C. 15’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 250 (40“)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 250 (40“)', '236/4/4/3
240
M. E.', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°16: DUO: "JE VAIS DANSER EN VOTRE HONNEUR…" (C. 15’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 13: VEL. 48
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 13: VEL. 48', 'GIRATORIO SE MUEVE 100º EN SENTIDO HORARIO A POS. 13 (1’30”)', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°16: DUO: "JE VAIS DANSER EN VOTRE HONNEUR…" (C. 15’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 254 (45”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 254 (45”)', '238/4/1
241', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°16: DUO: "JE VAIS DANSER EN VOTRE HONNEUR…" (C. 15’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 258 (14”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 258 (14”)', 'CASI FIN GIRO
238/4/3
M
F4
ACTRIZ MADRE DON JOSÉ
LLEVA 1 FLOR ROJA QUE SE QUEDA PARA SIGUIENTE ENTRADA', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°16: DUO: "JE VAIS DANSER EN VOTRE HONNEUR…" (C. 15’)'
ON CONFLICT DO NOTHING;


-- Escena: N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 17, 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)', 17
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 14: VEL.70
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 14: VEL.70', 'GIRATORIO SE MUEVE 125º SENTIDO ANTIHORARIO A POS. 14 (1’20”)
249/1/4
244
M. E.
GIRATORIO SUBE A VELOCIDAD 115
(AUMENTA VELOCIDAD EN FIG 115)', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 262 (12”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 262 (12”)', '249/3/2
E
C4
3 CORISTAS
249/3/3
E
C4 C5
DANCAIRO + REMENDADO
CORO MASCULINO + FEMENINO CONTRABANDISTAS
249/4/2
E
F4 F5
FRASQUITA + MERCEDES
CORO MASCULINO Y FEMENINO CONTRABANDISTAS
+ ACTOR FURGONETA
250/2/1
247', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 264 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 264 (20”)', 'CASI FIN GIRO
250/3/3
E
F1
5 CORISTAS
264/1/4
E
C4
ACTRIZ MADRE DON JOSE
VA A SENTARSE EN SILLA PTA BAR SIN SER VISTA (LA OCULTA EL CORO)
1 FLOR ROJA
267/1/3
M
FDO C
FURGONETA CONDUCIDA POR ACTOR + ZÚÑIGA DENTRO
QUEDA DETRÁS DE LA CARRA BAR
1035
°
271/1/2
249', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 270 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 270 (10”)', 'FINAL CANTO. MUTIS CORO
272
M
FDO F
CORO GENERAL
FRASQUITA + MERCEDES + DANCAIRO + REMENDADO
4 SOLISTAS CAMBIO ACTO 3 DURANTE PAUSA
CORTE MTRO
250
M. E.
BAJA TELÓN NEGRO BOCA V-0 + TELÓN ACÚSTICO V A COTA ESCENA (VEL. MAX)
NEGRO TV PROSCENIOS Y TORRES BOCA', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 272 (0”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 272 (0”)', 'FOSO ORQUESTA + ATRIL MTRO INCLUIDOS
TELÓN ABAJO
251', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 273 (5”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 273 (5”)', 'LUZ DETRÁS PARA CAMBIO
TELÓN ABAJO
M
C/F
CARMEN + DON JOSÉ
ACTRIZ MADRE
2 SOLISTAS CAMBIO ACTO 3 DURANTE PAUSA
PAUSA – 25’
CAMBIO
A ACTO III DURANTE PAUSA
300
M. E.
SUBIR PVC FONDO V- + TUL NEGRO V- A COTA PASO CARRAS
GIRATORIO: INICIO PAUSA RESETEAR GIRATORIO A 0 (LA MARCA + CERCANA ES 1080°) .', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 15: MOVER A 30° SENTIDO HORARIO PARA MONTAR CARRA ALMACÉN. DESPUÉS, GIRAR A 120° SENTIDO HORARIO PARA EMPEZAR EL ACTO III. POS. 15
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 15: MOVER A 30° SENTIDO HORARIO PARA MONTAR CARRA ALMACÉN. DESPUÉS, GIRAR A 120° SENTIDO HORARIO PARA EMPEZAR EL ACTO III. POS. 15', 'BAJAR PVC FONDO V- + GASA NEGRA V-  A COTA ESCENA
SUBIR CARTEL-ANUNCIO V- COTA ESCENA
APARTAR DUNAS FONDO PARA PASO CARRAS
SACAR CARRA BAR A CHÁCENA
COLOCAR CARRA ALMACEN EN MARCA DENTRO GIRATORIO
RECOLOCAR DUNAS FONDO INICIO ACTO II
COLOCAR GUARDARRAIL GRANDE EN MARCA ESCENA FDO CENTRO
COLOCAR MATORRALES ACTO III', 7
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 274 (7”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 274 (7”)', 'CONECTAR CARRA ALMACÉN
COLOCAR CAMIONETA EN POSICIÓN ACTO III
COLOCAR UTILERÍA PEQUEÑA ACTO III
RECOLOCAR MATORRALES ACTO III MARCAS VERDES
CAMBIO RÁPIDO A ACTO II
EN ESTA CELDA FALTA PLANTA DOSSIER IMPLANTACIÓN PROYECTOS TR CUANDO LO ENVIEN', 8
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto II%'
AND e.nombre = 'N°17: FINAL:  "HOLLA! CARMEN! HOLLA!…" (C. 5’)'
ON CONFLICT DO NOTHING;


-- ============================================
-- ACTO_III
-- Pasadas: 20
-- Escenas: 6
-- ============================================

-- PASADAS ACTO_III

-- Pasada: ME - VARAS
UPDATE teatro_real.pasada_items
SET descripcion = 'TELÓN NEGRO DE BOCA V-0  +TELÓN ACUSTICO MP- ABAJO EN COTA ESCENA
5 PARES DE PATAS NEGRAS ABAJO EN COTA ESCENA ABIERTAS A 18ms
PARRILA DE FOCOS V- (3 TIROS) EN POSICIÓN INICIAL ACTO III
CARTEL-VALLA PUBLICIDAD ACTO II MP- ARRIBA EN COTA ESCONDER
POSTE ALTA TENSIÓN V- ARRIBA EN COTA ESCONDER
PVC GRIS OSCURO V- + GASA NEGRA V- ABAJO EN COTA ESCENA
PANORAMAS CICLORAMA V- ABAJO EN COTA ESCENA
GIRATORIO EMBUTIDO EN VAGONES EN POSICIÓN PASADA ACTO III CON CARRA ALMACÉN ENCIMA POS. 15
TORRES DE BOCA ABIERTAS A m
PUENTE DE BOCA EN COTA m',
    lugar = 'VARAS'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ME';


-- Pasada: PLATAF - VERDES 1-4 EN POSICIÓN AZULES 1-4
UPDATE teatro_real.pasada_items
SET descripcion = 'ROSAS 1-4 EN SU POSICIÓN, CON VAGONES ENCIMA (GIRATORIO EMBUTIDO) EN COTA -0.40 m
AZUL 5 EN SU POSICIÓN EN COTA 0m. AZULES 1-4 EN SU POSICIÓN EN COTA -4m',
    lugar = 'VERDES 1-4 EN POSICIÓN AZULES 1-4'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'PLATAF';


-- Pasada: FOSOS - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'FOSO ORQUESTA MEDIANO 2 1/5 PLATAFORMAS ABAJO EN COTA -2.50 m',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'FOSOS';


-- Pasada: ESCENA - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'TABLEROS SUELO BASE TEXTURIZADO PINTADOS MONTADOS Y SUJETOS SOBRE ROSAS + CORBATA
DUNAS FONDO CON MATORRALES MONTADAS. MATORRALES EN POSICIÓN DENTRO Y FUERA GIRATORIO
CARRA ALMACÉN MONTADA SOBRE GIRATORIO. PTA Y VENTANAS CERRADAS.
CARRAS ACTOS 1, 2 y 4 ALMACENADAS EN CHÁCENA + 1 GUARDARRAIL PEQUEÑO
GUARDARRAIL GRANDE MONTADO EN MARCA ESCENA FONDO CENTRO',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - PUERTA ALMACÉN BLOQUEADA CON CADENA.
UPDATE teatro_real.pasada_items
SET descripcion = 'FURGONETA DELANTE CASETA ALMACÉN (LLAVES DENTRO).  2 BACLAVAS
GUARDARRAIL GRANDE EN FONDO MARCA ESCENA
BIDÓN METÁLICO CON CARTAS TAROT (CABALLERO COPAS, REY BASTOS, RUEDA FORTUNA, AMANTES, MUERTE) JUNTO MURO CASETA ALMACÉN.
MATORRALES DENTRO GIRATORIO 4,9,20,21,26,31,50,51….
CASETA ALMACÉN EN MARCA ESCENA. DENTRO:
Dentro (contra la pared izquierda al entrar):
• Una caja de madera larga con tres cuartos cubiertos con lona, ​​dos sillas apiladas una encima de otra y varios    sacos de cemento. Apoyado en:
[A] Sten, Marrón Oscuro Kalishnakov, Marrón Claro Kalisnakov, DBK, Rifle, LBK, Sten, Sten, LBK
• Rifle contra la pared del cobertizo
• Bidón
• Bidón de gasolina
• Cubo metálico
• 2 neumáticos
• Botella de agua para Micaela
• Bidón de aceite
• Palé de madera con caja, cajón, regadera y la Caja 10 [que es una caja de cigarrillos] cubierta con una lona
En el suelo, al entrar:
• Caja 1 [Armas pequeñas]
con 2 escorpiones y una pistola encima [A]
• Caja 2 [Caja] con 2 escorpiones encima, una botella de vodka [llena] y 2 vasos de chupito
• 3 botellas
• 2 botellas
• Caja 3 [Armas grandes] con 2 escorpiones [A] encima de la
Caja 4 [cerrada]
Detrás de las cajas 3 y 4 hay 10 cartones de cigarrillos.
• 5 botellas de alcohol.
• Caja 5 [caja de alcohol].
• Caja 8 [caja de cigarrillos vacía].
• Caja 6 [caja de alcohol].
• Caja 7 [caja de alcohol].
• Caja 9 [caja de cigarrillos] con 10 cartones al frente.
LADO C.
CAMERINO TRANSFORMACIÓN CORO 3-4
1 BOLSA CON DINERO
GAFAS + CADENA CON CRUCIFIJO MICAELA
ATRILES CON LUZ PARA INTERNO
LADO F.
CAMERINO TRANSFORMACIÓN CORO 3-4
NAVAJA DON JOSÉ + RIFLE. BALACLAVAS
PAQUETE CIGARRILOS + MECHERO ESCAMILLO
POSICIÓN MATORRALES ACTO III MARCAS VERDES',
    lugar = 'PUERTA ALMACÉN BLOQUEADA CON CADENA.'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - SALA
UPDATE teatro_real.pasada_items
SET descripcion = 'CANAL 900 + PASILLOS AZULES + OJOS DE BUEY + MEM. 275 (5”) (PASADA)
LUZ ATRILES ORQUESTA + MTRO 100%
LÁMPARA + HERRADURA + MORTIERES FULL. CARRA ALMACEN CONECTADA SOBRE GIRATORIO',
    lugar = 'SALA'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - TV TORRES BOCA + PROSCENIOS EN NEGRO
UPDATE teatro_real.pasada_items
SET descripcion = '2 CARROS CON TV MTRO.  + RETORNO ORQUESTA EN CADA HOMBRO
SALA
PUBLICIDAD EN PANTALLAS LATERALES',
    lugar = 'TV TORRES BOCA + PROSCENIOS EN NEGRO'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - PIE
UPDATE teatro_real.pasada_items
SET descripcion = 'TOP
E/M
DPTO. /
LUGAR
QUIÉN / QUÉ
UTILERÍA / SASTRERÍA / OBSERVACIONES
-12’',
    lugar = 'PIE'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ELEC - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'MEDIA SALA CIELO ETC´S 40% + MEM. 1.2 (10”)',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: AV - PROYECCIÓN CIELO
UPDATE teatro_real.pasada_items
SET descripcion = '-1’ /
SALA O.K.',
    lugar = 'PROYECCIÓN CIELO'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'AV';


-- Pasada: AV - FUERA PUBLICIDAD
UPDATE teatro_real.pasada_items
SET descripcion = 'DENTRO PROYECCIÓN MÓVILES
REG.
Q-LIGHT ORQUESTA
Afinación
Fin afinación',
    lugar = 'FUERA PUBLICIDAD'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'AV';


-- Pasada: AV - RING-RING + PINCHAR COMUNICADO MÓVILES
UPDATE teatro_real.pasada_items
SET descripcion = 'DENTRO RETORNO EN ESCENARIO
FUERA PROYECCIÓN MÓVILES
Fin aviso',
    lugar = 'RING-RING + PINCHAR COMUNICADO MÓVILES'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'AV';


-- Pasada: ELEC - FUERA SALA + MEM. 278 (10”)
UPDATE teatro_real.pasada_items
SET descripcion = 'EN FUERA SALA
E
FOSO F
MAESTRO
ENTRA MTRO.',
    lugar = 'FUERA SALA + MEM. 278 (10”)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: ELEC - DENTRO LUZ SALUDO MTRO. + MEM. 279 (5”)
UPDATE teatro_real.pasada_items
SET descripcion = '/ FUERA LUZ SALUDO MTRO.
EN ESCENA
FURGONETA
ZÚÑIGA DETRÁS MALETERO
DANCAIRO + DON JOSÉ + REMENDADO EN FURGONETA + 1 ACTOR
CAPUCHA PUESTA + ATADO CON CUERDA
RIFLE + NAVAJA
PREV
LADO F
MERCEDES + FRASQUITA
CORO GENERAL
2 BACLAVAS ENVUELTAS
1 RIFLE + 1 NAVAJA
F0
7 NIÑOS (2024) / 10 NIÑOS (2025)
CARTELES 7B-14B (SUIVANTE)
CARTELES (ESPLUSTARD)
LADO C
CORO GENERAL
1 ACTOR POLICÍA
BOLSA CON BILLETES
C0
6 NIÑOS (2024) / 10 NIÑOS (2025)
CARTELES 1B-6B (LANUIT)
CARTELES (DEUX SEMAIN)
SEGUNDA PARTE (c. 1H )',
    lugar = 'DENTRO LUZ SALUDO MTRO. + MEM. 279 (5”)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: ELEC - MEM. 280 (5”)
UPDATE teatro_real.pasada_items
SET descripcion = 'INICIO MÚSICA
273/4/3
300.6',
    lugar = 'MEM. 280 (5”)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: ELEC - MEM. 300 (12”)
UPDATE teatro_real.pasada_items
SET descripcion = 'ENTRADA NIÑOS DELANTE TELÓN
273/4/3
E
F0
7 NIÑOS (2024)
10 NIÑOS (2025)
CARTELES 7B-14B (SUIVANTE)
CARTELES (ESPLUSTARD)
C0
6 NIÑOS (2024)
10 NIÑOS (2025)
CARTELES 1B-6B (LANUIT)
CARTELES (DEUX SEMAIN)
274/2/1
300.7',
    lugar = 'MEM. 300 (12”)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: ELEC - MEM. 302 (6”)
UPDATE teatro_real.pasada_items
SET descripcion = 'NIÑOS EN POSICIÓN DESPUÉS CRUCE
274/3/4
300.8',
    lugar = 'MEM. 302 (6”)'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: ELEC - INICIO MUTIS NIÑOS
UPDATE teatro_real.pasada_items
SET descripcion = 'CAÑÓN A NIÑA CENTRO ESCENARIO + MEM. 304 (5”-10”)',
    lugar = 'INICIO MUTIS NIÑOS'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- Pasada: UTIL - 274/4/2
UPDATE teatro_real.pasada_items
SET descripcion = 'BOCANADA HUMO MDG ENTRE FURGONETA Y TELÓN BOCA
M
F0
6 NIÑOS / 9 NIÑOS
RECOGER CARTELES​
C0
7 NIÑOS / 10 NIÑOS
RECOGER CARTELES​
274/4/4
300.9',
    lugar = '274/4/2'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'UTIL';


-- Pasada: ELEC - MEM. 306  (7”) + FADE OUT CAÑÓN NIÑA
UPDATE teatro_real.pasada_items
SET descripcion = 'FINAL ENTR´ACTE
Final 274
M
F0
1 NIÑA
RECOGER CARTEL',
    lugar = 'MEM. 306  (7”) + FADE OUT CAÑÓN NIÑA'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto III%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ELEC';


-- ESCENAS ACTO_III

-- Escena: N°18: INTRODUCTION (SEPTUOR ET CHŒUR): "ECOUTE, ÉCOUTE, COMPAGNON ÉCOUTE!…" (C. 6’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 18, 'N°18: INTRODUCTION (SEPTUOR ET CHŒUR): "ECOUTE, ÉCOUTE, COMPAGNON ÉCOUTE!…" (C. 6’)', 18
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 16: VEL. 90
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 16: VEL. 90', 'GIRATORIO SE MUEVE 90º SENTIDO ANTIHORARIO A POS 16 (1’)
275/1/2/4
302
SUBE TELÓN NEGRO BOCA V-0 + TELÓN ACÚSTICO V A COTA ESCONDER
(VEL. MAX)
241/5/3
E
FDO F
MERCEDES + FRASQUITA
2 BACLAVAS
242/2/1
E
F4 F5
GRUPO CORO GENERAL CONTRABANDISTAS
C4 C5
GRUPO CORO GENERAL CONTRABANDISTAS
276/5/2
303', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°18: INTRODUCTION (SEPTUOR ET CHŒUR): "ECOUTE, ÉCOUTE, COMPAGNON ÉCOUTE!…" (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 308 (12”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 308 (12”)', 'CASI FIN GIRO
ENCENDER TV TORRES BOCA Y PROSCENIOS
277/2/1
304', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°18: INTRODUCTION (SEPTUOR ET CHŒUR): "ECOUTE, ÉCOUTE, COMPAGNON ÉCOUTE!…" (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 310 (6”-12”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 310 (6”-12”)', 'INICIO CANTO
278/1/2
E
C4
1 ACTOR POLICÍA
BOLSA CON DINERO
278 VISUAL
305', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°18: INTRODUCTION (SEPTUOR ET CHŒUR): "ECOUTE, ÉCOUTE, COMPAGNON ÉCOUTE!…" (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 312 (8”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 312 (8”)', 'SACAN A ZÚÑIGA FUERA FURGONETA
290/1/2
M
F2
1 ACTOR POLICÍA + ZÚÑIGA
ACTOR SE CAMBIA A TORERO ACTO 4 19’
290/1/2
306
M. E.', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°18: INTRODUCTION (SEPTUOR ET CHŒUR): "ECOUTE, ÉCOUTE, COMPAGNON ÉCOUTE!…" (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 17: VEL. 60
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 17: VEL. 60', 'GIRATORIO SE MUEVE 42º SENTIDO ANTIHORARIO A POS. 17 (40”)
294/1/3
307', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°18: INTRODUCTION (SEPTUOR ET CHŒUR): "ECOUTE, ÉCOUTE, COMPAGNON ÉCOUTE!…" (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 316 (30”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 316 (30”)', 'CASI FIN GIRO. MUTIS CORO
294/1/3
M
FDO F
CORO GENERAL CONTRABANDISTAS EN GRUPOS
FRASQQUITA + MERCEDES +DANCAIRO + REMENDADO QUEDAN DENTRO CASETA ALMACÉN', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°18: INTRODUCTION (SEPTUOR ET CHŒUR): "ECOUTE, ÉCOUTE, COMPAGNON ÉCOUTE!…" (C. 6’)'
ON CONFLICT DO NOTHING;


-- Escena: N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 19, 'N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)', 19
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 320 (6”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 320 (6”)', '299/2/1
M
FDO F
DON JOSÉ
RIFLE + NAVAJA
308/2/4
311', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 324 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 324 (10”)', 'CARMEN SOLA
309/4/1
E
FDO F
ACTRIZ MADRE DON JOSÉ
309/4/5/4
313', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 326 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 326 (10”)', 'ENTRADA MADRE
310/3/2
315', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 328 (40”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 328 (40”)', 'CARMEN AVANZA HACIA BOCA CARLOS
312/2/4
316', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 330 (6”-12”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 330 (6”-12”)', 'FRASQUITA Y MERCEDES SALEN CASETA
312/2/4
AVISO
CASETA
SEÑAL A FRASQUITA + MERCEDES PARA QUE SALGAN
CON BOTELLA VODKA + 2 VASOS CRISTAL
312/3/4
M
C2
ACTRIZ MADRE DON JOSÉ
CARTA MUERTE TAROT
315/2/4
E
FDO F
DON JOSÉ
RIFLE + NAVAJA
316
DIÁLOGO
“Nous avons”
320
M. E.', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 18: VEL. 65º
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 18: VEL. 65º', 'GIRATORIO SE MUEVE 102º EN SENTIDO ANTIHORARIO A POS. 18
(1’30”)', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 332 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 332 (20”)', '316 “Carmen!”
E
C4
C3
TENORES + BAJOS CORO + 2 SOPRANOS CONTRABANDISTAS
316 final hablado
E
F4
F5
SOPANOS + MEZZOS CONTRABANDISTAS', 7
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°19: TRIO DES CARTES: " MÊLONS! MÊLONS! COUPONS! COUPONS!…" (C. 7’)'
ON CONFLICT DO NOTHING;


-- Escena: N°20: MORCEAU D' ENSEMBLE: "QUANT AU DOUANIER, C'EST NOTRE AFFAIRE…" (C. 4’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 20, 'N°20: MORCEAU D'' ENSEMBLE: "QUANT AU DOUANIER, C''EST NOTRE AFFAIRE…" (C. 4’)', 20
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 334 ((8”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 334 ((8”)', 'CASI FIN GIRO
334/1/3
M
F4
FURGONETA CON DANCAIRO + REMENDADO + CONDUCTOR DENTRO
334/1/3
325', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°20: MORCEAU D'' ENSEMBLE: "QUANT AU DOUANIER, C''EST NOTRE AFFAIRE…" (C. 4’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 336 (15”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 336 (15”)', 'MICAELA HACIA PTA CASETA
3342/1
M
FDO F
CORO GENERAL CONTRABANDISTAS
FRASQUITA + MERCEDES
RECOGER UTILERÍA QUE LLEVAN
FDO C
CORO GENERAL CONTRABANDISTAS
RECOGER UTILERÍA QUE LLEVAN
335/2/1
M
FDO F
CARMEN
335/4/3
M
FDO F
DON JOSÉ', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°20: MORCEAU D'' ENSEMBLE: "QUANT AU DOUANIER, C''EST NOTRE AFFAIRE…" (C. 4’)'
ON CONFLICT DO NOTHING;


-- Escena: N°21: AIR: "JE DIS QUE RIEN NE M' ÉPOUVANTE…" (C. 6’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 21, 'N°21: AIR: "JE DIS QUE RIEN NE M'' ÉPOUVANTE…" (C. 6’)', 21
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 338 (30”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 338 (30”)', 'MICAELA AVANZA DENTRO CASETA
342/4/2
E
C5
DON JOSÉ (SE ESCONDE DETRÁS CASETA ALMACÉN)
RIFLE + NAVAJA
344/1/1/3
330
M. E.', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°21: AIR: "JE DIS QUE RIEN NE M'' ÉPOUVANTE…" (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 19: VEL. 19-20
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 19: VEL. 19-20', 'GIRATORIO SE MUEVE 43.5 º EN SENTIDO ANTIHORARIO A POS 19
(1’30”)', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°21: AIR: "JE DIS QUE RIEN NE M'' ÉPOUVANTE…" (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 340 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 340 (20”)', '345/4/1
332', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°21: AIR: "JE DIS QUE RIEN NE M'' ÉPOUVANTE…" (C. 6’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 342 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 342 (10”)', 'CASI FIN GIRO', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°21: AIR: "JE DIS QUE RIEN NE M'' ÉPOUVANTE…" (C. 6’)'
ON CONFLICT DO NOTHING;


-- Escena: N°22: DUO: " JE SUIS ESCAMILLO, TORERO DE GRENADE…" (C. 3’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 22, 'N°22: DUO: " JE SUIS ESCAMILLO, TORERO DE GRENADE…" (C. 3’)', 22
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 20: VEL. 108
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 20: VEL. 108', 'GIRATORIO SE MUEVE 105.5 º EN SENTIDO HORARIO A POS. 20
(1’30”)', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°22: DUO: " JE SUIS ESCAMILLO, TORERO DE GRENADE…" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 344 (20”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 344 (20”)', '363/3/2
E
C4 C5
CARMEN + DANCAIRO + REMENDADO + 1 ACTOR + FRASQUITA
+ MERCEDES
+ CORO GENERAL CONTRABANDISTAS
CORRIENDO
F5
CORO GENERAL CONTRABANDISTAS
363/3/2
338', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°22: DUO: " JE SUIS ESCAMILLO, TORERO DE GRENADE…" (C. 3’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 348 (6”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 348 (6”)', 'FIN GIRO', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°22: DUO: " JE SUIS ESCAMILLO, TORERO DE GRENADE…" (C. 3’)'
ON CONFLICT DO NOTHING;


-- Escena: N°23: FINAL: " HOLLA! HOLLA! JOSÉ!…" (C. 8’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 23, 'N°23: FINAL: " HOLLA! HOLLA! JOSÉ!…" (C. 8’)', 23
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 354 (15”-30”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 354 (15”-30”)', 'CAMBIO A AMARILLO
381/2/1
INT
FDO C
ESCAMILLO
1 ATRIL CON LUZ
CARRO CON TV + RETORNO ORQ
DESPUÉS INTERNO CAMBIO A TORERO 6’
381/4/1
M
FDO C
MERCESDES + FRASQUITA + DANCAIRO + REMENDADO
CORO GENERAL CONTRABANDISTAS + 1 ACTOR
CAMBIO RÁPIDO VESTUARIO ACTO IV 2’
382/2/1
M
FDO F
DON JOSÉ + MICAELA
CORTE MTRO
343
M. E.
BAJA TELÓN NEGRO BOCA V-0 A COTA ESCENA (VEL. MAX)
NEGRO TV PROSCENIOS Y TORRES BOCA', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°23: FINAL: " HOLLA! HOLLA! JOSÉ!…" (C. 8’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 358 (0”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 358 (0”)', 'FORO ORQUESTA + ATRIL MTRO INCLUIDOS
TELÓN ABAJO
344', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°23: FINAL: " HOLLA! HOLLA! JOSÉ!…" (C. 8’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 360 (5”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 360 (5”)', 'VUELVE LUZ ATRILES FOSO
LUZ DETRÁS PARA CAMBIO
M
FDO C
CARMEN
CAMBIO RÁPIDO VESTUARIO ACTO IV 2’
ESCENARIO LIBRE
CAMBIO
RÁPIDO A ACTO IV EN SILENCIO
2’
400
M. E.
SUBIR PVC FONDO V- + TUL NEGRO V- A COTA PASO CARRAS', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°23: FINAL: " HOLLA! HOLLA! JOSÉ!…" (C. 8’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 21: MOVER GIRATORIO A POSICIÓN PASADA ACTO 4º POS. 21
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 21: MOVER GIRATORIO A POSICIÓN PASADA ACTO 4º POS. 21', 'BAJAR PVC FONDO V- + GASA NEGRA V- A COTA ESCENA
BAJA POSTE ALTA TENSIÓN V- A COTA ESCENA
APARTAR DUNAS FONDO PARA PASO CARRAS
SACAR CARRA ALMACÉN A CHÁCENA
COLOCAR CARRA CAMERINO TORERO EN MARCA DENTRO GIRATORIO
RECOLOCAR DUNAS FONDO INICIO ACTO IV
RETIRAR GUARDARRAIL GRANDE A CHÁCENAA
COLOCAR MATORRALES ACTO IV
CONECTAR CARRA CAMERINO
RETIRAR UTILERÍA ACTO III
COLOCAR PUESTO VENTA AMBULANTE EN MARCA ESCENA
RECOLOCAR MATORRALES ACTO IV MARCAS BLANCAS
CAMBIO RÁPIDO A ACTO II', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto III%'
AND e.nombre = 'N°23: FINAL: " HOLLA! HOLLA! JOSÉ!…" (C. 8’)'
ON CONFLICT DO NOTHING;


-- ============================================
-- ACTO_IV
-- Pasadas: 8
-- Escenas: 2
-- ============================================

-- PASADAS ACTO_IV

-- Pasada: ME - VARAS
UPDATE teatro_real.pasada_items
SET descripcion = 'TELÓN NEGRO DE BOCA V-0   TELÓN ACUSTICO MP- ABAJO EN COTA ESCENA
5 PARES DE PATAS NEGRAS ABAJO EN COTA ESCENA ABIERTAS A 18ms
PARRILA DE FOCOS V- (3 TIROS) EN POSICIÓN INICIAL ACTO III
CARTEL-VALLA PUBLICIDAD ACTO II MP- ARRIBA EN COTA ESCONDER
POSTE ALTA TENSIÓN V- ABAJO EN COTA ESCENA
PVC GRIS OSCURO V- + GASA NEGRA V- ABAJO EN COTA ESCENA
PANORAMAS CICLORAMA V- ABAJO EN COTA ESCENA
GIRATORIO EMBUTIDO EN VAGONES EN POSICIÓN PASADA ACTO IV CON CARRA HOTELENCIMA
TORRES DE BOCA ABIERTAS A m
PUENTE DE BOCA EN COTA m',
    lugar = 'VARAS'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto IV%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ME';


-- Pasada: PLATAF - VERDES 1-4 EN POSICIÓN AZULES 1-4
UPDATE teatro_real.pasada_items
SET descripcion = 'ROSAS 1-4 EN SU POSICIÓN, CON VAGONES ENCIMA (GIRATORIO EMBUTIDO) EN COTA -0.40 m
AZUL 5 EN SU POSICIÓN EN COTA 0m. AZULES 1-4 EN SU POSICIÓN EN COTA -4m',
    lugar = 'VERDES 1-4 EN POSICIÓN AZULES 1-4'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto IV%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'PLATAF';


-- Pasada: FOSOS - Sin lugar
UPDATE teatro_real.pasada_items
SET descripcion = 'FOSO ORQUESTA MEDIANO 2 1/5 PLATAFORMAS ABAJO EN COTA -2.50 m',
    lugar = ''
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto IV%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'FOSOS';


-- Pasada: ESCENA - POSTE ALTA TENSIÓN EN ESCENA SUJETO
UPDATE teatro_real.pasada_items
SET descripcion = 'TABLEROS SUELO BASE TEXTURIZADO PINTADOS MONTADOS Y SUJETOS SOBRE ROSAS + CORBATA
DUNAS FONDO CON MATORRALES MONTADAS. MATORRALES EN POSICIÓN DENTRO Y FUERA GIRATORIO
CARRA ALMACÉN MONTADA SOBRE GIRATORIO. PTAS Y VENTANAS CERRADAS.
CARRAS ACTOS 1, 2 y 4 ALMACENADAS EN CHÁCENA + 2 GUARDARRAILES',
    lugar = 'POSTE ALTA TENSIÓN EN ESCENA SUJETO'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto IV%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - 6 abanicos negros
UPDATE teatro_real.pasada_items
SET descripcion = 'CARRA HOTEL EN MARCA ESCENA. DENTRO: 4 SILLAS GRANDES + 1 SILLA PEQUEÑA Y ESPEJO EN LA PARED. 3 CUADROS TOREROS. APLIQUES LUZ
MONTÍCULOS MATORRALES ALREDEDOR ESCALON CARRA HOTEL
PUESTO AMBULANTE VENTA EN LADO FELIPE ESCENA
El sombrero de copa de cada pila de sombreros
2 abanicos rojos
3 bufandas [Naranja, Crema floreada, Naranja marrón]
3 flores con pinzas de cocodrilo
1 gafas de sol
2 guitarras
Todos los vestidos
MONTÍCULOS MATORRALES DENTRO GIRATORIO 10, 18, 20, 21, 24, 26, 54….
LADO C.
BILLETES PESETAS (CORO)
FLORES Y ABANICOS
ALMOHADILLA PARA MUÑECA SASTRE + AGUJA GRANDE E HILO + CHAQUETA TORERO + DEDAL
CINTA METRICA
LADO F.
BILLETES PESETAS (CORO)
5 CARTELES CORRIDAS PARA AUTÓGRAFOS
5 BOLÍGRAFOS PARA AUTÓGRAFOS
ATRIL CON LUZ + PODIO MTRO PARA INTERNO
Ç
POSICIÓN MATORRALES ACTO IV MARCAS BLANCAS + PUESTO VENTA AMBULANTE',
    lugar = '6 abanicos negros'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto IV%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - SALA
UPDATE teatro_real.pasada_items
SET descripcion = 'CANAL 900 + PASILLOS AZULES + OJOS DE BUEY + MEM. 360 (5”)(PASADA)
LUZ ATRILES ORQUESTA + MTRO 100%
LÁMPARA + HERRADURA + MORTIERES FULL. CARRA HOTEL CONECTADA SOBRE GIRATORIO',
    lugar = 'SALA'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto IV%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - TV TORRES BOCA + PROSCENIOS EN NEGRO
UPDATE teatro_real.pasada_items
SET descripcion = '2 CARROS CON TV MTRO.  + RETORNO ORQUESTA EN CADA HOMBRO
SALA
PUBLICIDAD EN PANTALLAS LATERALES',
    lugar = 'TV TORRES BOCA + PROSCENIOS EN NEGRO'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto IV%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- Pasada: ESCENA - CAMBIO HECHO
UPDATE teatro_real.pasada_items
SET descripcion = 'COLOCAR DETRÁS TELÓN
CORO GENERAL +9 NIÑOS + 2 ACTRICES
ZÚÑIGA + MORALES
GAFAS DE SOL + GORRA
CARRA ACTO 4
CAMERINO
CARMEN
+ ESCAMILLO + 2 ACTORES TOREROS
ANILLO
PREVENIDOS
F0
10 NIÑOS
CARTELES 12C-21C (RSPLUSTARD)
C0
ACTOR SASTRE
11 NIÑOS
ALMOHADILLA PARA MUÑECA SASTRE + AGUJA GRANDE E HILO + CHAQUETA TORERO  + DEDAL + CINTA METRICA
CARTELES 1C-11C (QUELQUESJOU)',
    lugar = 'CAMBIO HECHO'
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%Acto IV%'
)
AND UPPER(REPLACE(departamento, '.', '')) = 'ESCENA';


-- ESCENAS ACTO_IV

-- Escena: N°24: CHŒUR: " A DEUX CUARTOS!…" (C. 2’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 24, 'N°24: CHŒUR: " A DEUX CUARTOS!…" (C. 2’)', 24
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 412 (0.1”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 412 (0.1”)', '394/2/4
M
F2
CARRO PUESTO VENTA AMBULANTE + 2 ACTRICES EMPUJANDO
394/5/5
E
FDO C
22 NIÑOS CORRIENDO
ARMAS COWBOY
1 FOTO + BOLÍGRAFO AUTÓGRAFO', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°24: CHŒUR: " A DEUX CUARTOS!…" (C. 2’)'
ON CONFLICT DO NOTHING;


-- Escena: N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)
INSERT INTO teatro_real.escenas (acto_id, numero, nombre, orden)
SELECT a.id, 25, 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)', 25
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 22: VEL. 105
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 22: VEL. 105', 'GIRATORIO SE MUEVE 232º EN SENTIDO ANTIHORARIO A POS. 22 EN(2’)', 1
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 418 (1’ 26”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 418 (1’ 26”)', '406/2/5
M
FDO F
2 ACTORES TOREROS
408/2/4
407', 2
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 420 (5”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 420 (5”)', 'NIÑOS ENTRAN CAMERINO TORERO
414/2/2
409', 3
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 422 (25”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 422 (25”)', 'NIÑOS SALEN CAMERINO TORERO
DÚO CARMEN-ESCAMILLO
414/3/1
E
F2
FRASQUITA + MERCEDES
QUEDAN DETRÁS PTA CAMERINO
418/3/1
M
F3
ESCAMILLO
419
M
CALLES F
CORO GENERAL + NIÑOS + ACTORES+ MORALES + ZÚÑIGA
420/3/1
413
M. E.', 4
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: GIRO 23:  VEL. 100
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'GIRO 23:  VEL. 100', 'GIRA TORIO SE MUEVE 218º SENTIDO ANTIHORARIO A POS. 23 (1’50”)', 5
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 424 (85”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 424 (85”)', '422/3/5
M
FELIPE
FRASQUITA + MERCEDES
422/4/1
E
FDO C
DON JOSÉ
VA A ESCONDERSE DETRÁS CARRA CAMERIN
VISUAL
422
415', 6
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 426 (30”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 426 (30”)', 'CAMERINO EN LADO CARLOS
Nº 26 DUO ET CHOEUR FINAL. “C´EST TOI! C´EST MOI!” (C. 11’)
423/4/4
418', 7
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 428 (30”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 428 (30”)', 'GIRO TERMINADO
427/3/3
420
M. E.
PARRILLA DE FOCOS V- SE INCLINA 45º A POS FINAL (3’)
431/3/1
435/2/1
437/3/2
439/1/2
INT
FDO
FELIPE
CORO GENERAL + CORO NIÑOS
PODIO MTRO + ATRIL CON LUZ
CARRO CON TV + RETORNO
431/3/1
421', 8
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 430 (3’)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 430 (3’)', '437/2/5
E
FDO C
ACTRIZ MADRE DON JOSÉ
CARTA MUERTE TAROT
441/3/2
424', 9
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 431 (10’)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 431 (10’)', 'CORTE MTRO
425
M. E.
BAJA TELÓN NEGRO BOCA V-0 + TELÓN ACÚSTICO V A COTA ESCENA (VEL. MAX)
NEGRO TV PROSCENIOS Y TORRES BOCA', 10
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 432 (0”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 432 (0”)', 'ATRILES FOSO INCLUIDOS
TELÓN ABAJO
M
CARMEN + DON JOSÉ + ACTRIZ MADRE
COLOCAR CORO + ACTORES PARA SALUDOS
TELÓN ABAJO
426
M. E.
SUBE PARRILA FOCOS V- A COTA ESCENA (DESHACER TOP ANTERIOR) RÁPIDO
PREPARACIÓN SALUDOS', 11
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 434 (5”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 434 (5”)', 'VUELVE LUZ ATRILES FOSO + MTRO
SALUDOS
427
M. E.
SUBE TELÓN NEGRO BOCA V-0 + TELÓN ACÚSTICO V A COTA ESCONDER (VEL. MAX)', 12
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 436 (2”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 436 (2”)', '428', 13
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 438 (2”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 438 (2”)', '429', 14
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 440 (2”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 440 (2”)', '430', 15
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 441 (5”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 441 (5”)', '431', 16
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 441.5 (5”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 441.5 (5”)', 'FINAL SALUDOS
432
M. E.
BAJA TELÓN NEGRO BOCA V-0 + TELÓN ACÚSTICO V A COTA ESCENA   (VEL. MAX)', 17
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 442 (3”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 442 (3”)', 'TELÓN ABAJO
433', 18
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;

-- Elemento: MEM. 444 (10”)
INSERT INTO teatro_real.elementos_guion (escena_id, tipo, numero, observaciones, descripcion, orden)
SELECT e.id, 'TOP', '0', 'MEM. 444 (10”)', 'LEYENDA
C
CARLOS
STAGE LEFT / COUR
F
FELIPE
STAGE RIGHT / JARDIN
FDO.
FONDO
UPSTAGE
ÓPERA
PALACIO
DOWNSTAGE
BOCA
PROSCENIUM
0
HUECO DE TELÓN
HOUSE CURTAIN AREA
1, 2
1ª CAJA, 2ª CAJA
1st, WING, 2nd. WING
PTA.
PUERTA
DOOR
E
ENTRADA
ENTRANCE ON STAGE
M
MUTIS
EXIT OFF STAGE
INT
INTERNO
BEHIND THE SCENE
TOP
TOP
GENERAL CUE
VIS.
A VISTA
VISUAL CUE
MECÁNICA ESCÉNICA
FLYING / PLATFORM
MAQUINARIA
STAGEHAND
UTILERÍA
PROPS
ELECTRICIDAD
LIGHTING
CAÑÓN
FOLLOW SPOT
AUDIOVISUALES
AUDIOVISUALS
SASTRERÍA
WARDROBE
MEM.
MEMORIA
LIGHTING CUE
V
VARA
BAR
MP
MOTOR PUNTUAL
POINT HOIST', 19
FROM teatro_real.escenas e
JOIN teatro_real.actos a ON e.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%Acto IV%'
AND e.nombre = 'N°25: CHŒUR ET SCÈNE: " LES VOICI, LES VOICI, VOICI LA QUADRILLE!….” (C. 7’)'
ON CONFLICT DO NOTHING;


-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar pasadas
SELECT
  a.nombre as acto,
  COUNT(*) as total_pasadas,
  SUM(LENGTH(pi.descripcion)) as total_chars
FROM teatro_real.pasada_items pi
JOIN teatro_real.actos a ON pi.acto_id = a.id
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
GROUP BY a.nombre
ORDER BY a.nombre;

-- Verificar escenas
SELECT
  a.nombre as acto,
  COUNT(DISTINCT e.id) as total_escenas,
  COUNT(eg.id) as total_elementos
FROM teatro_real.actos a
JOIN teatro_real.guiones g ON a.guion_id = g.id
JOIN teatro_real.producciones p ON g.produccion_id = p.id
LEFT JOIN teatro_real.escenas e ON e.acto_id = a.id
LEFT JOIN teatro_real.elementos_guion eg ON eg.escena_id = e.id
WHERE p.nombre ILIKE '%carmen%'
GROUP BY a.nombre
ORDER BY a.nombre;
