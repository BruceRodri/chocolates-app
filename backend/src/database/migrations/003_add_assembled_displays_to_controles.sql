USE chocolates;

ALTER TABLE controles_diarios
  ADD COLUMN assembled_displays INT NOT NULL DEFAULT 0 AFTER producto_terminado_proceso,
  ADD COLUMN displays_libras DECIMAL(12,5) DEFAULT 0 AFTER proceso_libras;

DROP VIEW IF EXISTS vista_balance_chocolate;

CREATE OR REPLACE VIEW vista_balance_chocolate AS
SELECT
    c.id_control,
    c.fecha_registro,
    u.nombre_apellido AS usuario,
    c.id_usuario,
    c.id_turno AS turno,
    c.item_chocolate_tanque,
    tc.nombre_tipo AS tipo_chocolate,
    c.item_corriendo AS item,
    p.descripcion,
    ROUND(c.moldes_llenados * p.unidades_por_molde * p.libras_pieza_chocolate, 5) AS libras_en_moldes,
    ROUND(c.porcentaje_singles_banda / 100 * p.piezas_singles_en_banda * p.libras_pieza_chocolate, 5) AS libras_banda,
    ROUND(c.porcentaje_tanque_morcos / 100 * morcos.capacidad_libras, 5) AS libras_tanque_morcos,
    c.temper_unit_libras AS libras_temper_unit,
    ROUND(c.porcentaje_tanque_pti / 100 * pti.capacidad_libras, 5) AS libras_tanque_pti,
    c.hopper_libras AS libras_hopper,
    ROUND(c.porcentaje_chocolate_piso / 100 * c.total_peso_palet, 5) AS libras_chocolate_piso,
    ROUND(c.bandejas_con_chocolate * tray.capacidad_libras, 5) AS libras_bandejas,
    ROUND(c.producto_terminado_proceso * p.libras_pieza_chocolate * p.piezas_caja, 5) AS libras_producto_en_proceso,
    ROUND(c.assembled_displays * p.piezas_display * p.libras_pieza_chocolate, 5) AS libras_displays,
    ROUND(
        (c.moldes_llenados * p.unidades_por_molde * p.libras_pieza_chocolate) +
        (c.porcentaje_singles_banda / 100 * p.piezas_singles_en_banda * p.libras_pieza_chocolate) +
        (c.porcentaje_tanque_morcos / 100 * morcos.capacidad_libras) +
        c.temper_unit_libras +
        (c.porcentaje_tanque_pti / 100 * pti.capacidad_libras) +
        c.hopper_libras +
        (c.porcentaje_chocolate_piso / 100 * c.total_peso_palet) +
        (c.bandejas_con_chocolate * tray.capacidad_libras) +
        (c.producto_terminado_proceso * p.libras_pieza_chocolate * p.piezas_caja) +
        (c.assembled_displays * p.piezas_display * p.libras_pieza_chocolate), 5
    ) AS total_chocolate_fisico,
    c.total_chocolate_sistema,
    GREATEST(0, ROUND(
        ((c.moldes_llenados * p.unidades_por_molde * p.libras_pieza_chocolate) +
        (c.porcentaje_singles_banda / 100 * p.piezas_singles_en_banda * p.libras_pieza_chocolate) +
        (c.porcentaje_tanque_morcos / 100 * morcos.capacidad_libras) +
        c.temper_unit_libras +
        (c.porcentaje_tanque_pti / 100 * pti.capacidad_libras) +
        c.hopper_libras +
        (c.porcentaje_chocolate_piso / 100 * c.total_peso_palet) +
        (c.bandejas_con_chocolate * tray.capacidad_libras) +
        (c.producto_terminado_proceso * p.libras_pieza_chocolate * p.piezas_caja) +
        (c.assembled_displays * p.piezas_display * p.libras_pieza_chocolate)) - c.total_chocolate_sistema, 5
    )) AS cantidad_a_agregar_al_sistema,
    GREATEST(0, ROUND(
        c.total_chocolate_sistema - ((c.moldes_llenados * p.unidades_por_molde * p.libras_pieza_chocolate) +
        (c.porcentaje_singles_banda / 100 * p.piezas_singles_en_banda * p.libras_pieza_chocolate) +
        (c.porcentaje_tanque_morcos / 100 * morcos.capacidad_libras) +
        c.temper_unit_libras +
        (c.porcentaje_tanque_pti / 100 * pti.capacidad_libras) +
        c.hopper_libras +
        (c.porcentaje_chocolate_piso / 100 * c.total_peso_palet) +
        (c.bandejas_con_chocolate * tray.capacidad_libras) +
        (c.producto_terminado_proceso * p.libras_pieza_chocolate * p.piezas_caja) +
        (c.assembled_displays * p.piezas_display * p.libras_pieza_chocolate)), 5
    )) AS cantidad_a_retirar_del_sistema
FROM controles_diarios c
JOIN usuarios u ON c.id_usuario = u.id_usuario
JOIN tipos_chocolate tc ON c.item_chocolate_tanque = tc.id_tipo
JOIN especificaciones_producto p ON c.item_corriendo = p.item
JOIN tanques morcos ON morcos.nombre_tanque = c.tanque_morcos
JOIN tanques pti ON pti.nombre_tanque = c.tanque_pti
JOIN tanques tray ON tray.nombre_tanque = c.tanque_bandejas;
