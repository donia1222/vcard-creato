<?php
// ============================================================
//  config.php — Subir a: https://web.lweb.ch/vcar/api/
//  NO exponer públicamente (está fuera del webroot si es posible)
// ============================================================

define('DB_HOST', 'localhost');
define('DB_NAME', 'lweb_vcards');   // cambia por tu DB name
define('DB_USER', 'lweb_user');     // cambia por tu DB user
define('DB_PASS', 'TU_PASSWORD');   // cambia por tu DB password
define('DB_CHARSET', 'utf8mb4');

// URL pública de tu app Next.js (para los links de la tarjeta)
define('APP_BASE_URL', 'https://vcard.lweb.ch');  // cambia por tu dominio

// Orígenes permitidos para CORS
define('ALLOWED_ORIGINS', [
    'https://vcard.lweb.ch',
    'http://localhost:3000',
]);
