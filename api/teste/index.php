<?php

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$token;
$headers = getallheaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $token = isset($headers['Authorization']) ? $headers['Authorization'] : null;

    if ($token) {
        echo json_encode(["message" => "token founded", "token" => $token]);
    } else {
        // echo json_encode(["message" => "token not found", "token" => $token]);
        http_response_code(403);
    }

    exit();
}
