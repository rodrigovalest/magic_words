<?php

require_once("../../credentials.php");
require_once("../token.php");

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$headers = getallheaders();

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Pegar dados da partida
    $json = file_get_contents("php://input");
    $data = json_decode($json);

    if ($data === NULL) {
        echo json_encode(["error" => "invalid data"]);
        exit();
    }

    $score = htmlspecialchars(stripslashes(trim($data->score)));
    $mode = htmlspecialchars(stripslashes(trim($data->mode)));

    if ($score === NULL || $mode === NULL) {
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

    // Insert da nova partida
    $sql = "INSERT INTO matches (user_id, score, mode) VALUES (" . $user["id"] . ", $score, '$mode');";
    if (!mysqli_query($conn, $sql)) {
        die("Error inserting new user");
    }

    // Selecionar essa nova partida
    $sql = "SELECT * FROM matches WHERE user_id = " . $user["id"] . " ORDER BY datetime DESC LIMIT 1;";
    $result = mysqli_query($conn, $sql);    
    if (!$result) {
        die("error: " . mysqli_error($conn));
    }
    $match = mysqli_fetch_assoc($result);


    // Criar relação entre partida e liga
    $sql = "SELECT leagues.* FROM leagues
        JOIN user_league ON leagues.id = user_league.league_id
        JOIN users ON users.id = user_league.user_id
        WHERE users.id = " . $user["id"] . ";";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        die("error: " . mysqli_error($conn));
    }
    
    $leagues = [];
    $num_leagues = mysqli_num_rows($result);

    if (mysqli_num_rows($result) > 0) {
        while ($league = mysqli_fetch_assoc($result)) {
            array_push($leagues, $league);

            $sql = "INSERT INTO match_league (match_id, league_id) VALUES (" . $match["id"] . ", " . $league["id"] . ");";
            if (!mysqli_query($conn, $sql)) {
                die("error: " . mysqli_error($conn));
            }
        }
    }

    echo json_encode(["message" => "register match successful", "user" => $user, "match" => $match, "leagues" => $leagues, "num_leagues" => $num_leagues]);
    exit();
}

http_response_code(404);
