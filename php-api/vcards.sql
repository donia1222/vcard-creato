-- ============================================================
--  vcards.sql — Estructura de la base de datos
--  Importar en phpMyAdmin o con:
--  mysql -u usuario -p nombre_db < vcards.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS `vcards` (
    `id`         VARCHAR(20)   NOT NULL,
    `name`       VARCHAR(120)  NOT NULL,
    `company`    VARCHAR(120)  DEFAULT NULL,
    `title`      VARCHAR(120)  DEFAULT NULL,
    `phone`      VARCHAR(60)   DEFAULT NULL,
    `email`      VARCHAR(180)  DEFAULT NULL,
    `website`    VARCHAR(255)  DEFAULT NULL,
    `address`    VARCHAR(255)  DEFAULT NULL,
    `photo`      MEDIUMTEXT    DEFAULT NULL,
    `created_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email`      (`email`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
