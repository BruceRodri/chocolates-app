CREATE DATABASE IF NOT EXISTS chocolates;
USE chocolates;

CREATE TABLE tipos_chocolate (
    id_tipo VARCHAR(20) PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tanques (
    nombre_tanque VARCHAR(50) PRIMARY KEY,
    capacidad_libras DECIMAL(10, 2) NOT NULL,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY,
    nombre_apellido VARCHAR(100) NOT NULL,
    id_turno INT NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'operario') NOT NULL DEFAULT 'operario',
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE especificaciones_producto (
    item VARCHAR(50) PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    single_item VARCHAR(50) NOT NULL,
    gramos_por_pieza DECIMAL(10, 2) NOT NULL,
    libras_pieza_chocolate DECIMAL(10, 7) NOT NULL,
    libras_pieza_arroz DECIMAL(10, 7) NOT NULL,
    piezas_caja INT NOT NULL,
    piezas_display INT NOT NULL,
    item_molde VARCHAR(50) NOT NULL,
    total_moldes INT NOT NULL,
    unidades_por_molde INT NOT NULL,
    moldes_en_banda INT NOT NULL,
    piezas_singles_en_banda INT NOT NULL,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE controles_diarios (
    id_control INT AUTO_INCREMENT PRIMARY KEY,
    fecha_registro DATETIME NOT NULL,
    id_usuario INT NOT NULL,
    id_turno INT NOT NULL,
    item_chocolate_tanque VARCHAR(20) NOT NULL,
    tanque_morcos VARCHAR(50) NOT NULL DEFAULT 'Buffer - Morcos',
    tanque_pti VARCHAR(50) NOT NULL DEFAULT 'PTI',
    tanque_bandejas VARCHAR(50) NOT NULL DEFAULT 'TRAY WITH PIECES',
    item_corriendo VARCHAR(50) NOT NULL,
    moldes_llenados INT NOT NULL,
    porcentaje_singles_banda DECIMAL(5,2) NOT NULL,
    porcentaje_tanque_morcos DECIMAL(5,2) NOT NULL,
    temper_unit_libras DECIMAL(10,2) NOT NULL,
    porcentaje_tanque_pti DECIMAL(5,2) NOT NULL,
    hopper_libras DECIMAL(10,2) NOT NULL,
    porcentaje_chocolate_piso DECIMAL(5,2) NOT NULL,
    total_peso_palet DECIMAL(12,5) NOT NULL DEFAULT 0,
    bandejas_con_chocolate INT NOT NULL,
    producto_terminado_proceso INT NOT NULL,
    assembled_displays INT NOT NULL DEFAULT 0,
    total_chocolate_sistema DECIMAL(12,5) NOT NULL,
    moldes_libras DECIMAL(12,5) DEFAULT 0,
    banda_libras DECIMAL(12,5) DEFAULT 0,
    morcos_libras DECIMAL(12,5) DEFAULT 0,
    temper_libras DECIMAL(12,5) DEFAULT 0,
    pti_libras DECIMAL(12,5) DEFAULT 0,
    piso_libras DECIMAL(12,5) DEFAULT 0,
    devuelto_libras DECIMAL(12,5) DEFAULT 0,
    bandejas_libras DECIMAL(12,5) DEFAULT 0,
    proceso_libras DECIMAL(12,5) DEFAULT 0,
    displays_libras DECIMAL(12,5) DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (item_chocolate_tanque) REFERENCES tipos_chocolate(id_tipo),
    FOREIGN KEY (tanque_morcos) REFERENCES tanques(nombre_tanque),
    FOREIGN KEY (tanque_pti) REFERENCES tanques(nombre_tanque),
    FOREIGN KEY (tanque_bandejas) REFERENCES tanques(nombre_tanque),
    FOREIGN KEY (item_corriendo) REFERENCES especificaciones_producto(item)
);

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

CREATE TABLE IF NOT EXISTS stock (
    id_stock INT AUTO_INCREMENT PRIMARY KEY,
    fecha_registro DATETIME NOT NULL,
    id_turno INT NOT NULL,
    id_usuario INT NOT NULL,
    item_chocolate_tanque VARCHAR(20) NOT NULL,
    item_corriendo VARCHAR(50),
    moldes_libras DECIMAL(12,5) DEFAULT 0,
    banda_libras DECIMAL(12,5) DEFAULT 0,
    morcos_libras DECIMAL(12,5) DEFAULT 0,
    temper_libras DECIMAL(12,5) DEFAULT 0,
    pti_libras DECIMAL(12,5) DEFAULT 0,
    hopper_libras DECIMAL(12,5) DEFAULT 0,
    piso_libras DECIMAL(12,5) DEFAULT 0,
    devuelto_libras DECIMAL(12,5) DEFAULT 0,
    bandejas_libras DECIMAL(12,5) DEFAULT 0,
    proceso_libras DECIMAL(12,5) DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (item_chocolate_tanque) REFERENCES tipos_chocolate(id_tipo)
);
