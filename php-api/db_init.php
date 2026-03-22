<?php
// ============================================================
//  db_init.php — Ejecutar UNA VEZ para crear la tabla
//  Luego borrar o proteger con .htaccess
//  Acceder a: https://web.lweb.ch/vcar/api/db_init.php
// ============================================================

require_once __DIR__ . '/config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `vcards` (
            `id`         VARCHAR(20)   NOT NULL PRIMARY KEY,
            `name`       VARCHAR(120)  NOT NULL,
            `company`    VARCHAR(120)  DEFAULT NULL,
            `title`      VARCHAR(120)  DEFAULT NULL,
            `phone`      VARCHAR(60)   DEFAULT NULL,
            `email`      VARCHAR(180)  DEFAULT NULL,
            `website`    VARCHAR(255)  DEFAULT NULL,
            `address`    VARCHAR(255)  DEFAULT NULL,
            `photo`      MEDIUMTEXT    DEFAULT NULL,
            `created_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    echo json_encode(['ok' => true, 'message' => 'Tabla vcards creada correctamente.']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
