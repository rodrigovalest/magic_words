<?php

require_once("../../credentials.php");

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

function generateJWT($payload) {
    $secretKey = "123mudar";

    $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
    $header = base64_encode($header);

    $payload = json_encode($payload);
    $payload = base64_encode($payload);

    $signature = hash_hmac('sha256', "$header.$payload", $secretKey, true);
    $signature = base64_encode($signature);

    $jwt = "$header.$payload.$signature";

    return $jwt;
}

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json = file_get_contents("php://input");
    $data = json_decode($json);

    if ($data === NULL) {
        echo json_encode(["error" => "invalid data"]);
        exit();
    }

    $username = htmlspecialchars(stripslashes(trim($data->username)));
    $password = htmlspecialchars(stripslashes(trim($data->password)));

    if ($username === NULL || $password === NULL) {
        echo json_encode(["error" => "invalid data"]);
        http_response_code(401);
        exit();
    }

    $conn = mysqli_connect($servername, $dbusername, $dbpassword, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $username = mysqli_real_escape_string($conn, $username);
    $password = mysqli_real_escape_string($conn, $password);

    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password';";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        die("error: " . mysqli_error($conn));
    }

    if (mysqli_num_rows($result) != 1) {
        echo json_encode(["message" => "invalid credentials"]);
        http_response_code(401);
        exit();
    }

    $payload = [
        "iss" => "magicwords",
        "username" => $username,
        "exp" => time() + 3600
    ];
    $token = generateJWT($payload);

    echo json_encode(["message" => "valid credentials", "data" => $token]);
    exit();
}

http_response_code(404);
