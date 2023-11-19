<?php

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

function generateToken() {
    $token = bin2hex(random_bytes(16));
    return $token;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = "esseehumtoken";
    echo json_encode(['token' => $token]);
} else {
    echo json_encode(['error' => 'Metodo nao permitido']);
    http_response_code(405);
}
