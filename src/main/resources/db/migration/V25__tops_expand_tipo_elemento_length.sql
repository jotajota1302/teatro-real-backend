-- V19: ampliar longitud de tipo_elemento para soportar enum INSTRUCCION_TECNICA_PASADA

ALTER TABLE elementos_guion
ALTER COLUMN tipo_elemento TYPE VARCHAR(50);

