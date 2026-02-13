-- Reinicia el contador de IDs para evitar colisiones con los seeds antiguos
ALTER TABLE departamentos ALTER COLUMN id RESTART WITH 1000;
