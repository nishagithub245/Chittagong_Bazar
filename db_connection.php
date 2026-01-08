<?php
$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "chittagongbazaar";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
<<<<<<< HEAD
?>
=======
?>
>>>>>>> a687de12aced35edeb0458ccd9576321e6308929
