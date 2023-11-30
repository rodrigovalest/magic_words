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

    // Pegar ligas que o usuário está participando
    $sql = "SELECT leagues.* from leagues, user_league 
        WHERE user_league.league_id = leagues.id AND user_league.user_id = ". $user["id"] .";";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        die("error: " . mysqli_error($conn));
    }

    $leagues = [];
    if (mysqli_num_rows($result) > 0) {
        while ($league = mysqli_fetch_assoc($result)) {
            array_push($leagues, $league);
        }
    }

    echo json_encode(["message" => "all user leagues", "leagues" => $leagues]);
    exit();
}

http_response_code(404);
