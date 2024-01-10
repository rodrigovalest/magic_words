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

    $name = htmlspecialchars(stripslashes(trim($data->name)));
    $password = htmlspecialchars(stripslashes(trim($data->password)));

    if ($name === NULL || $password === NULL) {
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

    // Limpa inputs do front
    $name = mysqli_real_escape_string($conn, $name);
    $password = mysqli_real_escape_string($conn, $password);

    // Inserta nova liga
    $sql = "INSERT INTO leagues (name, user_owner_id, password) VALUES ('$name', " . $user["id"] . ", '$password');";
    if (!mysqli_query($conn, $sql)) {
        die("Error inserting new user");
    }

    echo json_encode(["message" => "register new league successful"]);
    exit();
}

http_response_code(404);
