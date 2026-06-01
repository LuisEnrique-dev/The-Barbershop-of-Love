<?php
$host = "localhost";
$dbname = "barberia_love";
$username = "root";
$password = "";

// Recibir el JSON enviado desde Contacto.js
$json = file_get_contents('php://input');
$datos = json_decode($json, true);

if ($datos) {
    try {
        $conexion = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Preparamos la consulta para insertar en la tabla de contactos
        $sql = "INSERT INTO contactos (correo, servicio_vip, notas) VALUES (:correo, :servicio, :notas)";
        $stmt = $conexion->prepare($sql);

        // Ejecutamos la consulta asociando los parámetros correspondientes
        $stmt->execute([
            ':correo'       => $datos['correo'],
            ':servicio'     => $datos['servicio'],
            ':notas'        => $datos['notas']
        ]);

        echo json_encode(["status" => "success", "message" => "Solicitud de contacto almacenada"]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error en la BD: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>