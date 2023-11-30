<?php

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

function decodeJWT($jwt) {
    $secretKey = "123mudar";

    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        return null;
    }

    list($header, $payload, $signature) = $parts;
    $decodedHeader = json_decode(base64_decode($header), true);
    $decodedPayload = json_decode(base64_decode($payload), true);
    $expectedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", $secretKey, true));

    if ($signature !== $expectedSignature) {
        return null;
    }

    return $decodedPayload;
}
