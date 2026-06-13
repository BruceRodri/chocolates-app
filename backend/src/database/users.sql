USE chocolates;

INSERT INTO usuarios (id_usuario, nombre_apellido, id_turno, cargo, username, password_hash, rol, activo) VALUES
(1, 'Fredy Montalvan', 1, 'Lead', 'fredy.montalvan', 'pbkdf2_sha256$120000$7139f658bb0a6eff7cbe4d7d65363fb0$2373b7f7f3637a0210ac6172dcf764193800f01fbfa1c907586b8fd4c513260e', 'admin', TRUE);

INSERT INTO controles_diarios (
    id_control,
    fecha_registro,
    id_usuario,
    id_turno,
    item_chocolate_tanque,
    item_corriendo,
    moldes_llenados,
    porcentaje_singles_banda,
    porcentaje_tanque_morcos,
    temper_unit_libras,
    porcentaje_tanque_pti,
    hopper_libras,
    porcentaje_chocolate_piso,
    total_peso_palet,
    bandejas_con_chocolate,
    producto_terminado_proceso,
    total_chocolate_sistema
) VALUES
(1, '2026-06-02 13:45:04', 1, 3, '10186', '21101', 300, 1.0000, 0.7000, 200.00, 0.8100, 120.00, 0.9000, 1900, 2, 3575, 6361.59599);

INSERT INTO stock (
    fecha_registro,
    id_turno,
    id_usuario,
    item_chocolate_tanque,
    item_corriendo,
    moldes_libras,
    banda_libras,
    morcos_libras,
    temper_libras,
    pti_libras,
    hopper_libras,
    piso_libras,
    devuelto_libras,
    bandejas_libras,
    proceso_libras
) VALUES
('2026-06-02 14:00:00', 3, 1, '10186', '21101', 257.24, 20.58, 3080.00, 200.00, 972.00, 120.00, 1710.00, 0.00, 30.00, 58.97);
