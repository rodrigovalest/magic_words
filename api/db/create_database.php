<?php

require('credentials.php');

$conn = mysqli_connect($servername, $username, $password);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "CREATE DATABASE $dbname";
if (mysqli_query($conn, $sql)) {
    echo "Database created successfully<br>";
} else {
    echo "Error creating database: " . mysqli_error($conn) . "<br>";
}

$sql = "USE $dbname";
if (mysqli_query($conn, $sql)) {
    echo "Database selected successfully<br>";
} else {
    echo "Error selecting database: " . mysqli_error($conn) . "<br>";
}


$sql = "CREATE TABLE users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);";

if (mysqli_query($conn, $sql)) {
    echo "User table created successfully<br>";
} else {
    echo "Error creating schema: " . mysqli_error($conn) . "<br>";
}


$sql = "CREATE TABLE leagues (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_owner_id INTEGER NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_owner_id) REFERENCES users (id)
);";

if (mysqli_query($conn, $sql)) {
    echo "Rank table created successfully<br>";
} else {
    echo "Error creating schema: " . mysqli_error($conn) . "<br>";
}


$sql = "CREATE TABLE matches (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    league_id INTEGER,
    score INTEGER NOT NULL,
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (league_id) REFERENCES leagues (id)
);";

if (mysqli_query($conn, $sql)) {
    echo "Match table created successfully<br>";
} else {
    echo "Error creating schema: " . mysqli_error($conn) . "<br>";
}

mysqli_close($conn);
