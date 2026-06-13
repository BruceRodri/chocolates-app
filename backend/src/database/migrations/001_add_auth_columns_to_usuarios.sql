USE chocolates;

ALTER TABLE usuarios
    ADD COLUMN username VARCHAR(80) NULL UNIQUE,
    ADD COLUMN password_hash VARCHAR(255) NULL,
    ADD COLUMN rol ENUM('admin', 'operario') NOT NULL DEFAULT 'operario',
    ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE usuarios
SET
    username = CASE id_usuario
        WHEN 1 THEN 'fredy.montalvan'
        WHEN 2 THEN 'paula.ramos'
        WHEN 3 THEN 'emily.sanchez'
        WHEN 4 THEN 'cesar.bustamante'
        WHEN 5 THEN 'lisbeth.sepulveda'
        WHEN 6 THEN 'harold.sencys'
        WHEN 7 THEN 'marina.adair'
        WHEN 8 THEN 'mayra.ortega'
        ELSE CONCAT('usuario.', id_usuario)
    END,
    password_hash = CASE id_usuario
        WHEN 1 THEN 'pbkdf2_sha256$120000$2030ae7748d0266ee57f9561$d09b48df77eafca4125ade5422a71a0c4d087a5b663f033d942d45569f6fcb0b'
        WHEN 2 THEN 'pbkdf2_sha256$120000$8d3dbc1a8714b75cc4be8078$9e6991f80fae5d879fbc76ff27a215b36aaebd0155f07843f7523313b80ed8c0'
        WHEN 3 THEN 'pbkdf2_sha256$120000$a66bc1142625fe42ed788ed1$292723ac953be36493df484cde7b303a3bfd15e1e3cc4dd98ad9aebc55fc648e'
        WHEN 4 THEN 'pbkdf2_sha256$120000$778dc32c342b437053990009$87817a2a30c67cc174343717df0fe93c15ec1e26c1ef9d35753811bb47687f5e'
        WHEN 5 THEN 'pbkdf2_sha256$120000$223d4ecd3e0eb4739ec4a1fc$0225497aa10168b14b33179ef8a745f7ae01b6e63106e31f4a7ca2c5ded2c6bf'
        WHEN 6 THEN 'pbkdf2_sha256$120000$e789d2c74235dbff237f1c51$dc4a9da1357474bbf14cd312da298b4f6aa7d271d86f0aaf8190cc866cf1ce0f'
        WHEN 7 THEN 'pbkdf2_sha256$120000$8df2006d4c368609aef5cf93$f99dd782c5ec158752993bf387bb25cb79a1cbabf93e270fbd1a2dedb7c1002b'
        WHEN 8 THEN 'pbkdf2_sha256$120000$7511c97d188f4ab1a755e27f$6012afd724656d0278236f90c9e3e69a1823446152927115fa633a2231759117'
        ELSE 'pbkdf2_sha256$120000$2030ae7748d0266ee57f9561$d09b48df77eafca4125ade5422a71a0c4d087a5b663f033d942d45569f6fcb0b'
    END,
    rol = CASE id_usuario
        WHEN 1 THEN 'admin'
        ELSE 'operario'
    END,
    activo = TRUE;

ALTER TABLE usuarios
    MODIFY username VARCHAR(80) NOT NULL,
    MODIFY password_hash VARCHAR(255) NOT NULL;
