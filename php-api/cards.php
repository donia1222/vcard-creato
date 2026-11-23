<?php
// ============================================================
//  VCard Creator · API (Lweb, versión 2 · 23/11/2026)
//  Vive en: https://web.lweb.ch/vcard/api/cards.php
//  Crear, editar y borrar: el navegador, directamente (CORS solo para vcard-creato*.vercel.app y localhost).
//  Leer la tarjeta: también la página de Vercel desde su servidor.
//
//  POST                         → crear tarjeta  → { id, url, editToken, card }
//  GET    ?id=xxx               → datos JSON (sin la clave)
//  GET    ?id=xxx&action=vcf    → descargar .vcf
//  PUT    ?id=xxx  (+ editToken en el cuerpo) → cambiar tarjeta
//  DELETE ?id=xxx  (+ editToken en el cuerpo) → borrar tarjeta
//
//  Credenciales: secure_config/db_credentials.php ['vcard'] (fuera de www, nunca en el repositorio).
//  La tabla se crea sola la primera vez (vcards.sql es solo referencia).
// ============================================================

declare(strict_types=1);

const VCARD_PUBLIC_URL = 'https://vcard-creato.vercel.app';
const PHOTO_MAX_BYTES  = 450 * 1024;   // foto ya reducida en el navegador; esto es el tope duro
const DESIGNS = ['classic', 'dark', 'ocean', 'rose', 'gradient', 'minimal', 'split', 'glass'];
const LIMITS  = ['name' => 120, 'company' => 120, 'title' => 120, 'phone' => 60, 'email' => 180, 'website' => 255, 'address' => 255];

require_once __DIR__ . '/../../_ratelimit.php';

header('X-Content-Type-Options: nosniff');

// El navegador llama aquí directamente (así el límite de peticiones cuenta por persona y no por
// el servidor de Vercel). Solo se aceptan las webs de VCard Creator y la de pruebas en local.
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('~^https://vcard-creato(-[a-z0-9-]+)?\.vercel\.app$~', $origen) || preg_match('~^http://(localhost|127\.0\.0\.1):\d+$~', $origen)) {
    header('Access-Control-Allow-Origin: ' . $origen);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $all = require __DIR__ . '/../../../../secure_config/db_credentials.php';
    $c = $all['vcard'] ?? null;
    if (!$c) jsonResponse(['error' => 'not_configured'], 503);
    $pdo = new PDO("mysql:host={$c['host']};dbname={$c['db']};charset=utf8mb4", $c['user'], $c['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $pdo->exec("SET time_zone = '+01:00'");
    asegurarTabla($pdo);
    return $pdo;
}

// La tabla de la versión 1 no tenía edit_token ni updated_at: se añaden si faltan.
function asegurarTabla(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `vcards` (
        `id` VARCHAR(20) NOT NULL, `name` VARCHAR(120) NOT NULL,
        `company` VARCHAR(120) DEFAULT NULL, `title` VARCHAR(120) DEFAULT NULL, `phone` VARCHAR(60) DEFAULT NULL,
        `email` VARCHAR(180) DEFAULT NULL, `website` VARCHAR(255) DEFAULT NULL, `address` VARCHAR(255) DEFAULT NULL,
        `photo` MEDIUMTEXT DEFAULT NULL, `design` VARCHAR(30) NOT NULL DEFAULT 'classic',
        `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`), KEY `idx_created_at` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $cols = array_column($pdo->query("SHOW COLUMNS FROM `vcards`")->fetchAll(), 'Field');
    if (!in_array('edit_token', $cols, true)) $pdo->exec("ALTER TABLE `vcards` ADD `edit_token` CHAR(64) DEFAULT NULL");
    if (!in_array('updated_at', $cols, true)) $pdo->exec("ALTER TABLE `vcards` ADD `updated_at` DATETIME DEFAULT NULL");
}

// Texto limpio, sin HTML escapado (eso lo hace quien lo pinta) y sin caracteres de control.
function txt($v, int $max): ?string {
    if (!is_string($v)) return null;
    $v = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v) ?? '');
    if ($v === '') return null;
    return mb_substr($v, 0, $max);
}

function website(?string $v): ?string {
    if ($v === null) return null;
    if (!preg_match('~^https?://~i', $v)) $v = 'https://' . $v;
    return filter_var($v, FILTER_VALIDATE_URL) ? $v : null;
}

function photo($v): ?string {
    if (!is_string($v) || $v === '') return null;
    if (!preg_match('~^data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$~', $v, $m)) jsonResponse(['error' => 'photo_invalid'], 400);
    $bin = base64_decode($m[2], true);
    if ($bin === false || strlen($bin) > PHOTO_MAX_BYTES) jsonResponse(['error' => 'photo_too_big'], 413);
    $f = new finfo(FILEINFO_MIME_TYPE);
    if (!in_array($f->buffer($bin), ['image/jpeg', 'image/png', 'image/webp'], true)) jsonResponse(['error' => 'photo_invalid'], 400);
    return $v;
}

function leerCuerpo(): array {
    $raw = file_get_contents('php://input', false, null, 0, 900 * 1024);
    $b = json_decode($raw ?: '', true);
    if (!is_array($b)) jsonResponse(['error' => 'bad_json'], 400);
    return $b;
}

function datos(array $b): array {
    $d = [];
    foreach (LIMITS as $k => $max) $d[$k] = txt($b[$k] ?? null, $max);
    if (!$d['name']) jsonResponse(['error' => 'name_required'], 400);
    if ($d['email'] && !filter_var($d['email'], FILTER_VALIDATE_EMAIL)) jsonResponse(['error' => 'email_invalid'], 400);
    $d['website'] = website($d['website']);
    $d['photo'] = photo($b['photo'] ?? null);
    $d['design'] = in_array($b['design'] ?? '', DESIGNS, true) ? $b['design'] : 'classic';
    return $d;
}

// La versión 1 guardaba el texto escapado como HTML («Firma &amp; Co»): se deshace al leer.
function dec(array $row): array {
    foreach (array_keys(LIMITS) as $k) if (is_string($row[$k] ?? null)) $row[$k] = html_entity_decode($row[$k], ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return $row;
}

function publica(array $row): array {
    $row = dec($row);
    return [
        'id' => $row['id'], 'name' => $row['name'], 'company' => $row['company'], 'title' => $row['title'],
        'phone' => $row['phone'], 'email' => $row['email'], 'website' => $row['website'], 'address' => $row['address'],
        'photo' => $row['photo'], 'design' => $row['design'], 'createdAt' => $row['created_at'],
    ];
}

function idValido(): string {
    $id = $_GET['id'] ?? '';
    if (!is_string($id) || !preg_match('/^[a-f0-9]{12}$/', $id)) jsonResponse(['error' => 'id_invalid'], 400);
    return $id;
}

// Escapado de vCard 3.0 (RFC 2426): barra, coma, punto y coma y saltos de línea.
function v(string $s): string {
    return str_replace(["\\", ",", ";", "\n"], ["\\\\", "\\,", "\\;", "\\n"], $s);
}

function buildVCF(array $c): string {
    $c = dec($c);
    $l = ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' . v($c['name']), 'N:' . v($c['name']) . ';;;;'];
    if ($c['company']) $l[] = 'ORG:' . v($c['company']);
    if ($c['title'])   $l[] = 'TITLE:' . v($c['title']);
    if ($c['phone'])   $l[] = 'TEL;TYPE=CELL:' . v($c['phone']);
    if ($c['email'])   $l[] = 'EMAIL;TYPE=INTERNET:' . v($c['email']);
    if ($c['website']) $l[] = 'URL:' . $c['website'];
    if ($c['address']) $l[] = 'ADR;TYPE=WORK:;;' . v($c['address']) . ';;;;';
    if ($c['photo'] && preg_match('~^data:image/(jpeg|png|webp);base64,(.+)$~s', $c['photo'], $m)) {
        $l[] = 'PHOTO;ENCODING=b;TYPE=' . ($m[1] === 'png' ? 'PNG' : 'JPEG') . ':' . $m[2];
    }
    $l[] = 'NOTE:' . v('Erstellt mit VCard Creator von Lweb · ' . VCARD_PUBLIC_URL . '/card/' . $c['id']);
    $l[] = 'END:VCARD';
    return implode("\r\n", $l) . "\r\n";
}

function tokenOk(array $row, array $b): bool {
    $t = $b['editToken'] ?? '';
    return is_string($t) && $row['edit_token'] && preg_match('/^[a-f0-9]{48}$/', $t) && hash_equals($row['edit_token'], hash('sha256', $t));
}

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($metodo === 'POST') {
        rateLimit('vcard_crear', 8, 600);
        $d = datos(leerCuerpo());
        $id = bin2hex(random_bytes(6));
        $token = bin2hex(random_bytes(24));
        $st = db()->prepare("INSERT INTO vcards (id, name, company, title, phone, email, website, address, photo, design, edit_token)
                             VALUES (:id, :name, :company, :title, :phone, :email, :website, :address, :photo, :design, :tok)");
        $st->execute([':id' => $id, ':tok' => hash('sha256', $token)] + array_combine(array_map(fn($k) => ":$k", array_keys($d)), array_values($d)));
        $row = db()->query("SELECT * FROM vcards WHERE id = " . db()->quote($id))->fetch();
        jsonResponse(['id' => $id, 'url' => VCARD_PUBLIC_URL . '/card/' . $id, 'editToken' => $token, 'card' => publica($row)], 201);
    }

    if ($metodo === 'GET') {
        rateLimit('vcard_leer', 600, 60);   // la página de la tarjeta lee desde los servidores de Vercel (IP compartida)
        $id = idValido();
        $st = db()->prepare("SELECT * FROM vcards WHERE id = :id LIMIT 1");
        $st->execute([':id' => $id]);
        $row = $st->fetch();
        if (!$row) jsonResponse(['error' => 'not_found'], 404);
        if (($_GET['action'] ?? '') === 'vcf') {
            $fn = trim(preg_replace('/[^A-Za-z0-9]+/', '_', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $row['name']) ?: 'kontakt'), '_') ?: 'kontakt';
            header('Content-Type: text/vcard; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . $fn . '.vcf"');
            header('Cache-Control: no-store');
            echo buildVCF($row);
            exit;
        }
        jsonResponse(publica($row));
    }

    if ($metodo === 'PUT' || $metodo === 'DELETE') {
        rateLimit('vcard_editar', 30, 600);
        $id = idValido();
        $b = leerCuerpo();
        $st = db()->prepare("SELECT * FROM vcards WHERE id = :id LIMIT 1");
        $st->execute([':id' => $id]);
        $row = $st->fetch();
        if (!$row) jsonResponse(['error' => 'not_found'], 404);
        if (!tokenOk($row, $b)) jsonResponse(['error' => 'forbidden'], 403);
        if ($metodo === 'DELETE') {
            db()->prepare("DELETE FROM vcards WHERE id = :id")->execute([':id' => $id]);
            jsonResponse(['deleted' => true]);
        }
        $d = datos($b);
        $sets = implode(', ', array_map(fn($k) => "`$k` = :$k", array_keys($d)));
        db()->prepare("UPDATE vcards SET $sets, updated_at = NOW() WHERE id = :id")
            ->execute([':id' => $id] + array_combine(array_map(fn($k) => ":$k", array_keys($d)), array_values($d)));
        $st->execute([':id' => $id]);
        jsonResponse(['id' => $id, 'url' => VCARD_PUBLIC_URL . '/card/' . $id, 'card' => publica($st->fetch())]);
    }

    jsonResponse(['error' => 'method_not_allowed'], 405);
} catch (Throwable $e) {
    error_log('vcard: ' . $e->getMessage());
    jsonResponse(['error' => 'server_error'], 500);
}
