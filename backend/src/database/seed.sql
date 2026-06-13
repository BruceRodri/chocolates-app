USE chocolates;

INSERT INTO tipos_chocolate (id_tipo, nombre_tipo) VALUES
('10274', 'DARK'),
('10175', 'MILK'),
('10262', 'MILK'),
('10273', 'WHITE'),
('10175/10262', 'MILK'),
('10281', 'WHITE'),
('10186', 'MILK');

INSERT INTO tanques (nombre_tanque, capacidad_libras) VALUES
('Buffer - Morcos', 4400.00),
('Temper Unit', 200.00),
('PTI', 1200.00),
('Hopper', 100.00),
('TRAY WITH PIECES', 15.00);

INSERT INTO especificaciones_producto (
    item,
    descripcion,
    single_item,
    gramos_por_pieza,
    libras_pieza_chocolate,
    libras_pieza_arroz,
    piezas_caja,
    piezas_display,
    item_molde,
    total_moldes,
    unidades_por_molde,
    moldes_en_banda,
    piezas_singles_en_banda
) VALUES
('30844-Bulk400', 'FEA-Choc Bar-Milk-12g-Wrapped-Bulk 400 Pieces', '21127', 12.00, 0.0264600, 0.0000000, 400, 0, '70017', 384, 51, 24, 1224),
('30845-Bulk400', 'FEA-Choc Bar-Milk-Crunch-12g-Wrapped-Bulk 400 Pieces', '21128', 12.00, 0.0238100, 0.0026500, 400, 0, '70017', 384, 51, 24, 1224),
('30846-Bulk400', 'FEA-Choc Bar-Milk-12g-Wrapped-Vented-Bulk 400 Pieces', '21129', 12.00, 0.0264600, 0.0000000, 400, 0, '70017', 384, 51, 24, 1224),
('21127', 'FEA-Choc Bar-Milk-12g-Wrapped-Single Piece', '21127', 12.00, 0.0264600, 0.0000000, 200, 0, '70017', 384, 51, 24, 1224),
('30742-Case12', 'FEA-Choc Bar-Milk-35g-Wrapped-Display Box 24ct/Case12', '21077', 35.00, 0.0771600, 0.0000000, 288, 24, '70001', 384, 22, 24, 528),
('30744-Case12', 'FEA-Choc Bar-Milk-Crunch-35g-Wrapped-Display Box 24ct/Case12', '21079', 35.00, 0.0694500, 0.0077200, 288, 24, '70001', 384, 22, 24, 528),
('30747-Bulk216', 'FEA-Choc Bar-Milk-35g-Wrapped-Bulk 216 Pieces', '21077', 35.00, 0.0771600, 0.0000000, 216, 0, '70001', 384, 22, 24, 528),
('30748-Bulk216', 'FEA-Choc Bar-Milk-Crunch-35g-Wrapped-Bulk 216 Pieces', '21079', 35.00, 0.0694500, 0.0077200, 216, 0, '70001', 384, 22, 24, 528),
('30876-Case12', 'FEA-Choc Bar-Milk-Crunch-35g-Wrapped-Display Box 24ct AUS/Case12', '21144', 35.00, 0.0694500, 0.0077200, 288, 24, '70001', 384, 22, 24, 528),
('30877-Case12', 'FEA-Choc Bar-Milk-Crunch-35g-Wrapped-Display Box 24ct MEX/Case12', '21146', 35.00, 0.0694500, 0.0077200, 288, 24, '70001', 384, 22, 24, 528),
('30878-Case12', 'FEA-Choc Bar-Milk-35g-Wrapped-Display Box 24ct AUS/Case12', '21145', 35.00, 0.0771600, 0.0000000, 288, 24, '70001', 384, 22, 24, 528),
('30879-Case12', 'FEA-Choc Bar-Milk-35g-Wrapped-Display Box 24ct MEX/Case12', '21147', 35.00, 0.0771600, 0.0000000, 288, 24, '70001', 384, 22, 24, 528),
('30743-Case18', 'FEA-Choc Bar-Milk-60g-Wrapped-Display Box 10ct/Case18', '21078', 60.00, 0.1322800, 0.0000000, 180, 10, '70002', 384, 12, 24, 288),
('30745-Case18', 'FEA-Choc Bar-Milk-Crunch-60g-Wrapped-Display Box 10ct/Case18', '21080', 60.00, 0.1190500, 0.0132300, 180, 10, '70002', 384, 12, 24, 288),
('30759-Bulk100', 'FEA-Choc Bar-Milk-60g-Wrapped-Bulk 100 Pieces', '21078', 60.00, 0.1322800, 0.0000000, 100, 0, '70002', 384, 12, 24, 288),
('30767-Case6', 'FEA-Choc Bar-Milk-60g-Wrapped-Layflat Caddie 24ct/Case6', '21078', 60.00, 0.1322800, 0.0000000, 144, 24, '70002', 384, 12, 24, 288),
('30768-Case6', 'FEA-Choc Bar-Milk-Crunch-60g-Wrapped-Layflat Caddie 24ct/Case6', '21080', 60.00, 0.1190500, 0.0132300, 144, 24, '70002', 384, 12, 24, 288),
('30775-Bulk100', 'FEA-Choc Bar-Milk-Crunch-60g-Wrapped-Bulk 100 Pieces', '21080', 60.00, 0.1190500, 0.0132300, 100, 0, '70002', 384, 12, 24, 288),
('30880-Case18', 'FEA-Choc Bar-Milk-Crunch-60g-Wrapped-Display Box 10ct AUS/Case18', '21148', 60.00, 0.1190500, 0.0132300, 180, 10, '70002', 384, 12, 24, 288),
('30881-Case18', 'FEA-Choc Bar-Milk-Crunch-60g-Wrapped-Display Box 10ct MEX/Case18', '21149', 60.00, 0.1190500, 0.0132300, 180, 10, '70002', 384, 12, 24, 288),
('30882-Case 18', 'FEA-Choc Bar-Milk-60g-Wrapped-Display Box 10ct/Case18 AUS', '21150', 60.00, 0.1322800, 0.0000000, 180, 10, '70002', 384, 12, 24, 288),
('30883-Case18', 'FEA-Choc Bar-Milk-60g-Wrapped-Display Box 10ct MEX/Case18', '21151', 60.00, 0.1322800, 0.0000000, 180, 10, '70002', 384, 12, 24, 288),
('30886-Case4', 'FEA-Choc Bar-Milk-Crunch-60g-Wrapped-Display Box 10ct/Case4 CAN', '21153', 60.00, 0.1186900, 0.0131900, 40, 10, '70002', 384, 12, 24, 288),
('30887-Case4', 'FEA-Choc Bar-Milk-60g-Wrapped-Display Box 10ct/Case4 CAN', '21154', 60.00, 0.1318800, 0.0000000, 40, 10, '70002', 384, 12, 24, 288),
('21101', 'HER-Choc Bar-Milk-Almond-Zero Sugar-8.5g-Wrapped-Single Piece', '21101', 8.50, 0.0164900, 0.0000000, 0, 0, '70022', 384, 52, 24, 1248),
('30742-Case2', 'FEA-Choc Bar-Milk-35g-Wrapped-Display Box 24ct/Case2', '21077', 35.00, 0.0066139, 0.0000000, 48, 24, '70001', 384, 22, 24, 528);
