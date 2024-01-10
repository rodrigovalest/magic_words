<?php

require_once("../../credentials.php");
require_once("../token.php");

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

    $league_name = htmlspecialchars(stripslashes(trim($data->league_name)));
    $league_senha = htmlspecialchars(stripslashes(trim($data->league_senha)));

    if ($league_name === NULL || $league_senha === NULL) {
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

    // Selecionar a liga
    $sql = "SELECT * FROM leagues WHERE name = '$league_name' and password = '$league_senha';";
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        die("error: " . mysqli_error($conn));
    }
    $league = mysqli_fetch_assoc($result);

    // Inserta relação liga e usuário
    if (mysqli_num_rows($result) > 0) {
        $sql = "INSERT INTO user_league (user_id, league_id) VALUES (" . $user["id"] . ", " . $league["id"] . ");";
        if (!mysqli_query($conn, $sql)) {
            die("Error inserting user in league");
        }
    } else {
        echo json_encode(["message" => "league doesn't exist"]);
        http_response_code(400);
        exit();
    }

    echo json_encode(["message" => "register user in league successful"]);
    exit();
}

http_response_code(404);
