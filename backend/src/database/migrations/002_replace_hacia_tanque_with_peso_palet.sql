ALTER TABLE controles_diarios
    ADD COLUMN total_peso_palet DECIMAL(12,5) NOT NULL DEFAULT 0 AFTER porcentaje_chocolate_piso;

UPDATE controles_diarios SET total_peso_palet = 1900 WHERE total_peso_palet = 0;
