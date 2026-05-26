<?php
// 1. Datos de configuración de tu servidor local (MySQL)
$host     = "localhost";
$dbname   = "barberia_db";
$username = "root";  // Usuario por defecto en XAMPP
$password = "";      // Contraseña por defecto en XAMPP (vacía)

try {
    // 2. Crear la conexión con la base de datos
    $conexion = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 3. Validar que la solicitud venga del formulario (Método POST)
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        // Recalcar que tu HTML usa 'email' en lugar de 'correo'
        $nombre  = htmlspecialchars($_POST['nombre']);
        $correo  = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL); 
        $mensaje = htmlspecialchars($_POST['mensaje']);
        
        // 4. Preparar la consulta SQL para insertar en la tabla 'reservas'
        $sql = "INSERT INTO reservas (nombre, correo, mensaje) VALUES (:nombre, :correo, :mensaje)";
        $stmt = $conexion->prepare($sql);
        
        // Vinculamos las variables de forma segura
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':mensaje', $mensaje);
        
        // 5. Ejecutar y mostrar alerta de éxito personalizada para la Barbería
        if ($stmt->execute()) {
            echo "<script>
                    alert('¡Tu solicitud de reserva ha sido enviada! Nos comunicaremos contigo pronto.');
                    window.location.href = 'index.html'; // Cambia 'index.html' por el nombre de tu archivo principal si es diferente
                  </script>";
        } else {
            echo "Hubo un problema al procesar tu reserva.";
        }
    }
} catch (PDOException $e) {
    // Nota: En un entorno real en línea, es mejor no mostrar el $e->getMessage() final
    echo "Error en la conexión con la barbería: " . $e->getMessage();
}

// Cerrar la conexión limpia
$conexion = null;
?>