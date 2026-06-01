<?php
// Informar al navegador y a JS que la respuesta es JSON puro
header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$dbname = "barberia_love";
$username = "root";
$password = "";

$json = file_get_contents('php://input');
$datos = json_decode($json, true);

if ($datos && !empty($datos['nombre']) && !empty($datos['reseña']) && isset($datos['calificacion'])) {
    try {
        $conexion = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "INSERT INTO reseñas (nombre, reseña, calificacion) VALUES (:nombre, :resena, :calificacion)";
        $stmt = $conexion->prepare($sql);

        $stmt->execute([
            ':nombre'       => $datos['nombre'],
            ':resena'       => $datos['reseña'], 
            ':calificacion' => intval($datos['calificacion'])
        ]);

        echo json_encode(["status" => "success", "message" => "Reseña guardada correctamente."]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error de BD: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos incompletos o inválidos en el servidor."]);
}
?>