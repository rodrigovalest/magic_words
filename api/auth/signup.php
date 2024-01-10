<?php

require_once("../../credentials.php");

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json = file_get_contents("php://input");
    $data = json_decode($json);

    if ($data === NULL) {
        echo json_encode(["error" => "invalid data"]);
        http_response_code(401);
        exit();
    }

    $username = htmlspecialchars(stripslashes(trim($data->username)));
    $email = htmlspecialchars(stripslashes(trim($data->email)));
    $password = htmlspecialchars(stripslashes(trim($data->password)));

    if ($username === NULL || $email === NULL || $password === NULL) {
        echo json_encode(["error" => "invalid data"]);
        http_response_code(401);
        exit();
    }

    $conn = mysqli_connect($servername, $dbusername, $dbpassword, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $username = mysqli_real_escape_string($conn, $username);
    $email = mysqli_real_escape_string($conn, $email);
    $password = mysqli_real_escape_string($conn, $password);

    $sql = "SELECT * FROM users WHERE username = '$username' OR email = '$email';";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        die("error: " . mysqli_error($conn));
    }

    if (mysqli_num_rows($result) != 0) {
        echo json_encode(["message" => "invalid credentials"]);
        http_response_code(401);
        exit();
    }

    $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password');";
    if (!mysqli_query($conn, $sql)) {
        die("Error inserting new user");
    }

    echo json_encode(["message" => "success saving new user"]);
    exit();
}

http_response_code(404);
