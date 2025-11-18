<?php
echo "<h2>PHP PostgreSQL Check</h2>";
echo "PHP Version: " . phpversion() . "<br>";

// Check PDO drivers
echo "<h3>PDO Drivers:</h3>";
$drivers = PDO::getAvailableDrivers();
foreach ($drivers as $driver) {
    echo $driver . "<br>";
}

// Check loaded extensions
echo "<h3>Loaded Extensions:</h3>";
$extensions = get_loaded_extensions();
foreach ($extensions as $ext) {
    if (strpos($ext, 'pgsql') !== false || strpos($ext, 'pdo') !== false) {
        echo "<strong style='color: green;'>✅ $ext</strong><br>";
    }
}

// Test connection
echo "<h3>Connection Test:</h3>";
try {
    $pdo = new PDO('pgsql:host=test;dbname=test', 'user', 'pass');
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'could not find driver') !== false) {
        echo "<strong style='color: red;'>❌ PDO_PGSQL driver NOT FOUND</strong><br>";
    } else {
        echo "Connection error (but driver exists): " . $e->getMessage();
    }
}
