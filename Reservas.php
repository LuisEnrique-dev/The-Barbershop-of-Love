<?php
// ==========================================
// 1. CONFIGURACIÓN DE LA CONEXIÓN (BD)
// ==========================================
$host = "localhost";
$db_name = "barberia_db"; // Cambia esto por el nombre de tu base de datos
$username = "root";        // Tu usuario de MySQL
$password = "";            // Tu contraseña de MySQL

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Si falla la conexión, enviamos el error en formato JSON para que el JS no se rompa
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]);
    exit;
}

// ==========================================
// 2. PROCESAMIENTO Y GUARDADO DEL TICKET
// ==========================================
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Recibir y limpiar los datos que vienen desde el JavaScript
    $nombre    = strip_tags(trim($_POST['nombre'] ?? ''));
    $barbero   = strip_tags(trim($_POST['barbero'] ?? ''));
    $servicio  = strip_tags(trim($_POST['servicio'] ?? ''));
    $fecha     = strip_tags(trim($_POST['fecha'] ?? ''));
    $hora      = strip_tags(trim($_POST['hora'] ?? ''));

    // Validar que ningún campo llegue vacío
    if (empty($nombre) || empty($barbero) || empty($servicio) || empty($fecha) || empty($hora)) {
        echo json_encode(["status" => "error", "message" => "Por favor, completa todos los campos del formulario."]);
        exit;
    }

    // A. Generar el número de ticket único (Ej: #MPUGFA5R-8223)
    $caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $parte1 = substr(str_shuffle($caracteres), 0, 8);
    $parte2 = rand(1000, 9999);
    $ticketNum = "#" . $parte1 . "-" . $parte2;

    // B. Formatear la fecha y hora para que sea compatible con el campo DATETIME de MySQL
    $hora_24 = date("H:i:s", strtotime($hora));
    $fecha_reserva = $fecha . " " . $hora_24;

    // C. Calcular la hora de vencimiento sumando exactamente 2 horas
    $vencimiento = date("Y-m-d H:i:s", strtotime($fecha_reserva . " +2 hours"));

    try {
        // Preparar la consulta SQL con marcadores de posición de PDO
        $sql = "INSERT INTO reservas (id_reserva, cliente, barbero, servicio, fecha_hora, vencimiento) 
                VALUES (:id_reserva, :cliente, :barbero, :servicio, :fecha_hora, :vencimiento)";
        
        $stmt = $conn->prepare($sql);

        // Unir las variables seguras a la consulta
        $stmt->bindParam(':id_reserva', $ticketNum);
        $stmt->bindParam(':cliente', $nombre);
        $stmt->bindParam(':barbero', $barbero);
        $stmt->bindParam(':servicio', $servicio);
        $stmt->bindParam(':fecha_hora', $fecha_reserva);
        $stmt->bindParam(':vencimiento', $vencimiento);

        // Ejecutar la inserción en la base de datos
        if ($stmt->execute()) {
            // Si todo sale bien, devolvemos los datos listos para pintar en el HTML
            echo json_encode([
                "status" => "success",
                "ticket" => $ticketNum,
                "cliente" => $nombre,
                "barbero" => $barbero,
                "servicio" => $servicio,
                "fecha" => $fecha,
                "hora" => $hora,
                "vencimiento" => $vencimiento
            ]);
        }
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error al guardar en la base de datos: " . $e->getMessage()]);
    }
} else {
    // Si alguien intenta entrar directamente al archivo PHP desde el navegador sin enviar datos
    echo json_encode(["status" => "error", "message" => "Acceso no permitido."]);
}
?>