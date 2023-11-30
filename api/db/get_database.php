<?php
require("../../credentials.php");

$conn = mysqli_connect($servername, $dbusername, $dbpassword, $dbname);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$temparray = array();

$sqlselect = "SELECT * FROM users";
$result = mysqli_query($conn, $sqlselect);
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        array_push($temparray, $row); //save your data into array
    }
}
echo json_encode($temparray);
