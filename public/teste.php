
<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<h2>Diagnóstico</h2>";

echo "PHP: " . PHP_VERSION . "<br><br>";

$arquivos = [
    'Composer' => '../vendor/autoload.php',
    'Laravel Bootstrap' => '../bootstrap/app.php',
    'Platform Check' => '../vendor/composer/platform_check.php',
    'Middleware Inertia' => '../app/Http/Middleware/HandleInertiaRequests.php',
    'Middleware Appearance' => '../app/Http/Middleware/HandleAppearance.php',
    'Middleware Admin' => '../app/Http/Middleware/IsAdmin.php',
];

foreach ($arquivos as $nome => $caminho) {
    echo $nome . ': ' .
        (file_exists(__DIR__ . '/' . $caminho) ? 'EXISTE' : 'NÃO EXISTE')
        . '<br>';
}

echo '<hr>';

try {
    require '../vendor/autoload.php';
    echo "Composer: OK<br>";

    $app = require '../bootstrap/app.php';
    echo "Laravel Bootstrap: OK<br>";

} catch (Throwable $e) {
    echo "<h3>ERRO:</h3>";
    echo "<pre>" . htmlspecialchars(
        $e->getMessage() . "\n" .
        $e->getFile() . "\nLinha: " . $e->getLine()
    ) . "</pre>";
}
