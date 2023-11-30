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
    // Pegar nome da liga e filtros para mostrar
    $json = file_get_contents("php://input");
    $data = json_decode($json);

    if ($data === NULL) {
        echo json_encode(["error" => "invalid data"]);
        exit();
    }

    $league_name = htmlspecialchars(stripslashes(trim($data->league_name)));
    $weekly = htmlspecialchars(stripslashes(trim($data->weekly)));
    $mode = htmlspecialchars(stripslashes(trim($data->mode)));

    if ($league_name == NULL || $weekly === NULL || ($mode !== "random" && $mode !== "stairs" && $mode != "any")) {
        echo json_encode(["error" => "invalid data"]);
        http_response_code(401);
        exit();
    }

    // Validar token
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
        $sql = "SELECT matches.* FROM matches, match_league, leagues
            WHERE matches.id = match_league.match_id AND leagues.id = match_league.league_id 
            ORDER BY matches.score DESC LIMIT 50;";
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
        
    if (!$weekly && $mode != "any") {
        $sql = "SELECT matches.* FROM matches, match_league, leagues 
            WHERE matches.id = match_league.match_id AND leagues.id = match_league.league_id AND mode = '$mode' 
            ORDER BY score DESC LIMIT 50";

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

        echo json_encode(["message" => "matches not weekly with mode $mode", "matches" => $matches]);
        exit();
    }

    if ($weekly && $mode == "any") {
        $sql = "SELECT matches.* FROM matches, match_league, leagues
            WHERE matches.id = match_league.match_id AND leagues.id = match_league.league_id AND WEEK(datetime) = WEEK(NOW()) ORDER BY score DESC LIMIT 50";
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

        echo json_encode(["message" => "matches weekly any mode", "matches" => $matches]);
        exit();
    }
        
    if ($weekly && $mode != "any") {
        $sql = "SELECT matches.* FROM matches, match_league, leagues
            WHERE mode = '$mode' AND matches.id = match_league.match_id AND leagues.id = match_league.league_id AND WEEK(datetime) = WEEK(NOW())
            ORDER BY score DESC LIMIT 50";

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

        echo json_encode(["message" => "matches weekly with mode $mode", "matches" => $matches]);
        exit();
    }
}

http_response_code(404);
