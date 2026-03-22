<?php
// ============================================================
//  cards.php — API principal
//  Subir a: https://web.lweb.ch/vcar/api/cards.php
//
//  POST /cards.php               → crear tarjeta
//  GET  /cards.php?id=xxx        → obtener datos JSON
//  GET  /cards.php?id=xxx&action=vcf  → descargar .vcf
// ============================================================

// ── CORS — SIEMPRE LO PRIMERO, antes de cualquier output ──
// Acepta cualquier origen (ajusta si quieres restringir)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Max-Age: 86400');

// Responde inmediatamente al preflight OPTIONS y termina
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php';

// ── DB connection ─────────────────────────────────────────
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }
    return $pdo;
}

// ── JSON response helper ──────────────────────────────────
function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Generate short unique ID ──────────────────────────────
function generateId(): string {
    return substr(bin2hex(random_bytes(8)), 0, 12);
}

// ── Sanitize string ───────────────────────────────────────
function clean(?string $val): ?string {
    if ($val === null || trim($val) === '') return null;
    return htmlspecialchars(trim($val), ENT_QUOTES, 'UTF-8');
}

// ── Generate VCF content ──────────────────────────────────
function buildVCF(array $card): string {
    $lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:' . $card['name'],
    ];
    if ($card['company']) $lines[] = 'ORG:' . $card['company'];
    if ($card['title'])   $lines[] = 'TITLE:' . $card['title'];
    if ($card['phone'])   $lines[] = 'TEL:' . $card['phone'];
    if ($card['email'])   $lines[] = 'EMAIL:' . $card['email'];
    if ($card['website']) $lines[] = 'URL:' . $card['website'];
    if ($card['address']) $lines[] = 'ADR:;;' . $card['address'] . ';;;;';

    // Embed photo (base64 data URL → VCF)
    if (!empty($card['photo'])) {
        if (preg_match('/^data:image\/(jpeg|png|webp|gif);base64,(.+)$/s', $card['photo'], $m)) {
            $type = strtoupper($m[1]) === 'JPEG' ? 'JPEG' : 'PNG';
            $lines[] = 'PHOTO;ENCODING=b;TYPE=' . $type . ':' . $m[2];
        }
    }

    $lines[] = 'NOTE:Tarjeta creada en ' . APP_BASE_URL;
    $lines[] = 'END:VCARD';

    return implode("\r\n", $lines);
}

// ════════════════════════════════════════════════════════════
//  POST — crear tarjeta
// ════════════════════════════════════════════════════════════
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);

    if (empty($body['name']) || trim($body['name']) === '') {
        jsonResponse(['error' => 'El nombre es obligatorio'], 400);
    }

    $id = generateId();

    try {
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO vcards (id, name, company, title, phone, email, website, address, photo)
            VALUES (:id, :name, :company, :title, :phone, :email, :website, :address, :photo)
        ");
        $stmt->execute([
            ':id'      => $id,
            ':name'    => clean($body['name']),
            ':company' => clean($body['company'] ?? null),
            ':title'   => clean($body['title']   ?? null),
            ':phone'   => clean($body['phone']   ?? null),
            ':email'   => clean($body['email']   ?? null),
            ':website' => clean($body['website'] ?? null),
            ':address' => clean($body['address'] ?? null),
            ':photo'   => $body['photo'] ?? null,   // base64, sin sanitize
        ]);

        $cardUrl = APP_BASE_URL . '/card/' . $id;

        jsonResponse([
            'id'   => $id,
            'url'  => $cardUrl,
            'card' => [
                'id'      => $id,
                'name'    => clean($body['name']),
                'company' => clean($body['company'] ?? null),
                'title'   => clean($body['title']   ?? null),
                'phone'   => clean($body['phone']   ?? null),
                'email'   => clean($body['email']   ?? null),
                'website' => clean($body['website'] ?? null),
                'address' => clean($body['address'] ?? null),
                'photo'   => $body['photo'] ?? null,
            ],
        ], 201);

    } catch (PDOException $e) {
        jsonResponse(['error' => 'Error al guardar la tarjeta'], 500);
    }
}

// ════════════════════════════════════════════════════════════
//  GET — obtener tarjeta / descargar VCF
// ════════════════════════════════════════════════════════════
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = preg_replace('/[^a-f0-9]/i', '', $_GET['id'] ?? '');

    if (empty($id)) {
        jsonResponse(['error' => 'ID requerido'], 400);
    }

    try {
        $db   = getDB();
        $stmt = $db->prepare("SELECT * FROM vcards WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $card = $stmt->fetch();

        if (!$card) {
            jsonResponse(['error' => 'Tarjeta no encontrada'], 404);
        }

        // Descargar VCF
        if (isset($_GET['action']) && $_GET['action'] === 'vcf') {
            $filename = preg_replace('/\s+/', '_', $card['name']) . '_tarjeta.vcf';
            header('Content-Type: text/vcard; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            echo buildVCF($card);
            exit;
        }

        // Devolver JSON (sin foto para ahorrar payload — el frontend la tiene en la tarjeta pública)
        unset($card['photo']); // quitar foto del JSON general si es muy pesada
        jsonResponse($card);

    } catch (PDOException $e) {
        jsonResponse(['error' => 'Error del servidor'], 500);
    }
}

// Método no soportado
jsonResponse(['error' => 'Método no permitido'], 405);
