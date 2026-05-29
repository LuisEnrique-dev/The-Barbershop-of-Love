<?php
// =========================================================================
// 1. CONFIGURACIÓN Y CONEXIÓN A LA BASE DE DATOS
// =========================================================================
$host = "localhost";
$db_name = "barberia_db";
$username = "root"; // Tu usuario de MySQL (por defecto en XAMPP es root)
$password = "";     // Tu contraseña de MySQL (por defecto en XAMPP está vacía)

try {
    // Creamos la conexión usando PDO con soporte para caracteres especiales (UTF-8)
    $conexion = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    
    // Configurar PDO para que lance excepciones en caso de errores de SQL
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch(PDOException $e) {
    // Si la conexión falla, detiene la ejecución y muestra el error
    die("Error crítico de conexión a la base de datos: " . $e->getMessage());
}


// =========================================================================
// 2. PROCESAMIENTO DEL FORMULARIO (MÉTODO POST)
// =========================================================================
// Validamos si el archivo está recibiendo datos enviados desde el formulario HTML
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Recogemos los datos y los limpiamos para evitar textos maliciosos o scripts (XSS)
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $servicio = htmlspecialchars(trim($_POST['servicio']));
    $mensaje = htmlspecialchars(trim($_POST['mensaje']));

    // Validamos estrictamente que el usuario no haya enviado campos vacíos
    if (!empty($email) && !empty($servicio) && !empty($mensaje)) {
        try {
            // Preparamos la consulta SQL utilizando marcadores de posición (:email, etc.)
            // Esto evita por completo los ataques de Inyección SQL (SQL Injection)
            $sql = "INSERT INTO reservas (email, servicio, mensaje) VALUES (:email, :servicio, :mensaje)";
            $stmt = $conexion->prepare($sql);

            // Vinculamos las variables limpias a los marcadores de la consulta SQL
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':servicio', $servicio);
            $stmt->bindParam(':mensaje', $mensaje);

            // Ejecutamos la consulta en la base de datos
            if ($stmt->execute()) {
                // Si se guardó con éxito, muestra un mensaje flotante y regresa al inicio
                echo "<script>
                        alert('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo.');
                        window.location.href = 'index.html'; 
                      </script>";
                exit();
            } else {
                echo "Hubo un problema inesperado al guardar la información en el sistema.";
            }

        } catch (PDOException $e) {
            // Muestra el error de SQL si algo falla durante la inserción
            echo "Error al insertar los datos en la tabla: " . $e->getMessage();
        }
    } else {
        // Si por alguna razón saltaron la validación del HTML y enviaron algo vacío
        echo "<script>
                alert('Por favor, rellena todos los campos obligatorios del formulario.');
                window.history.back();
              </script>";
        exit();
    }
} else {
    // Si alguien intenta entrar a 'contacto.php' escribiendo la URL directamente en el navegador,
    // el sistema los expulsará automáticamente redireccionándolos a la página de inicio.
    header("Location: index.html");
    exit();
}
?>