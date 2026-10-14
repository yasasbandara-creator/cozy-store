<?php
// Include your connection file
require 'db_connect.php';

// Query the database for all products
$sql = "SELECT id, name, description, price, stock_quantity, image_url FROM products";
$result = $conn->query($sql);

$products = array();

// If we have results, add them to the array
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// Send the array back to the frontend as JSON data
header('Content-Type: application/json');
echo json_encode($products);
?>