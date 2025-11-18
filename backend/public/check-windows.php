<?php
echo "<h2>Windows PHP Configuration</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "PHP Ini File: " . php_ini_loaded_file() . "<br>";
echo "Extension Dir: " . ini_get('extension_dir') . "<br>";

echo "<h3>PDO Drivers:</h3>";
foreach (PDO::getAvailableDrivers() as $driver) {
    echo $driver . "<br>";
}

echo "<h3>Checking PostgreSQL DLL files:</h3>";
$ext_dir = ini_get('extension_dir');
$files = ['php_pdo_pgsql.dll', 'php_pgsql.dll'];
foreach ($files as $file) {
    if (file_exists($ext_dir . '\\' . $file)) {
        echo "✅ $file - FOUND<br>";
    } else {
        echo "❌ $file - NOT FOUND<br>";
    }
}
