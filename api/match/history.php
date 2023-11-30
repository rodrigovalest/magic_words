<?php

require_once("../../credentials.php");
require_once("../token.php");

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$headers = getallheaders();

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Pegar dados do usuário a partir do token
    $token = isset($headers["Authorization"]) ? $headers["Authorization"] : null;
    
    if ($token == null) {
        echo json_encode(["message" => "token error"]);
        http_response_code(401);
        exit();
    }

    $payload = decodeJWT($token);
    if ($payload == "") {
        echo json_encode(["message" => "invalid token"]);
        http_response_code(401);
        exit();
    }
    $username = $payload["username"];

    $conn = mysqli_connect($servername, $dbusername, $dbpassword, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM users WHERE username = '$username';";
    $result = mysqli_query($conn, $sql);    
    if (!$result) {
        die("error: " . mysqli_error($conn));
    }
    $user = mysqli_fetch_assoc($result);


    // Selecionar historico de partidas do usuario
    $sql = "SELECT * FROM matches WHERE user_id = ". $user["id"] ." ORDER BY datetime DESC LIMIT 50";
    $result = mysqli_query($conn, $sql);
    
    if (!$result) {
        die("error: " . mysqli_error($conn));
    }

    $matches = [];
    if (mysqli_num_rows($result) > 0) {
        while ($match = mysqli_fetch_assoc($result)) {
            array_push($matches, $match);
        }
    }

    echo json_encode(["message" => "match history", "matches" => $matches]);
    exit();
}

http_response_code(404);
