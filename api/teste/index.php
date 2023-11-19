<?php

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$token;
$test;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $test = "options";
    $token = $_SERVER['HTTP_AUTHORIZATION'];

    header('HTTP/1.1 200 OK');
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $test = "get";

    if ($token) {
        echo json_encode(["mensagem" => "Token presente: $token", "test" => $test]);
    } else {
        echo json_encode(["error" => "Token nao encontrado: $token", "test" => $test]);
    }
}
