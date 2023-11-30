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
    // Pegar dados da partida
    $json = file_get_contents("php://input");
    $data = json_decode($json);

    if ($data === NULL) {
        echo json_encode(["error" => "invalid data"]);
        exit();
    }

    $weekly = htmlspecialchars(stripslashes(trim($data->weekly)));
    $mode = htmlspecialchars(stripslashes(trim($data->mode)));

    if ($weekly === NULL || ($mode !== "random" && $mode !== "stairs" && $mode != "any")) {
        echo json_encode(["error" => "invalid data"]);
        http_response_code(401);
        exit();
    }

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

    // Selecionar top partidas de acordo com os filtros
    $conn = mysqli_connect($servername, $dbusername, $dbpassword, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    if (!$weekly && $mode == "any") {
        $sql = "SELECT * FROM matches ORDER BY score DESC LIMIT 50";
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

        echo json_encode(["message" => "matches not weekly any mode", "matches" => $matches]);
        exit();
    }
}

http_response_code(404);
