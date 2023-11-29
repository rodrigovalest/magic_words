<?php

function decodeJWT($jwt) {
    $secretKey = "123mudar";

    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        return null;
    }

    list($header, $payload, $signature) = $parts;
    $decodedHeader = json_decode(base64_decode($header), true);
    $decodedPayload = json_decode(base64_decode($payload), true);
    $expectedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", $secretKey, true));

    if ($signature !== $expectedSignature) {
        return null;
    }

    return $decodedPayload;
}

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$token;
$headers = getallheaders();

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    header('HTTP/1.1 200 OK');
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $token = isset($headers["Authorization"]) ? $headers["Authorization"] : null;

    if ($token == null) {
        echo json_encode(["message" => "token not found"]);
        http_response_code(401);
        exit();
    }

    $payload = decodeJWT($token);
    if ($payload == "") {
        echo json_encode(["message" => "invalid token"]);
        http_response_code(401);
        exit();
    }

    echo json_encode(["message" => "valid token"]);
    http_response_code(200);
    exit();
}

http_response_code(404);
