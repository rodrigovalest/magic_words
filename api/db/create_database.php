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

$sql = "use $dbname";
if (mysqli_query($conn, $sql)) {
    echo "Database selected successfully<br>";
} else {
    echo "Error creating database: " . mysqli_error($conn) . "<br>";
}

$sql = "CREATE TABLE User (
  id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
)";

if (mysqli_query($conn, $sql)) {
    echo "Table Comments created successfully<br>";
} else {
    echo "Error creating table: " . mysqli_error($conn) . "<br>";
}

mysqli_close($conn);
