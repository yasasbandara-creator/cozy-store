<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
// ... (rest of your code)
$servername = "localhost";
$username = "root"; // Default XAMPP username
$password = "";     // Default XAMPP password is empty
$dbname = "cozy_store_db"; // Replace with the name you chose in Step 3

// Create the connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// echo "Database connected successfully";
?>