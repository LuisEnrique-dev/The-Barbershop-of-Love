<?php
// 1. Configuración de la base de datos
$host = "localhost";
$dbname = "barberia_love";
$username = "root"; // Usuario por defecto de XAMPP
$password = "";     // Contraseña por defecto (vacía en XAMPP)

// 2. Recibir los datos enviados por fetch (JavaScript)
$json = file_get_contents('php://input');
$datos = json_decode($json, true);

if ($datos) {
    try {
        // 3. Conectar a la base de datos usando PDO
        $conexion = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // 4. Preparar la consulta SQL para evitar inyecciones (hackeos)
        $sql = "INSERT INTO citas (barbero, servicio, fecha, hora) VALUES (:barbero, :servicio, :fecha, :hora)";
        $stmt = $conexion->prepare($sql);

        // 5. Ejecutar la inserción con los datos recibidos
        $stmt->execute([
            ':barbero' => $datos['barbero'],
            ':servicio' => $datos['servicio'],
            ':fecha' => $datos['fecha'],
            ':hora' => $datos['hora']
        ]);

        // 6. Responder a JavaScript con éxito
        echo json_encode(["status" => "success", "message" => "Turno guardado en la base de datos"]);

    } catch(PDOException $e) {
        // Si la base de datos falla, enviar el error
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error de BD: " . $e->getMessage()]);
    }
} else {
    // Si no llegaron datos desde JavaScript
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No se recibieron datos"]);
}
?>