<?php
// 1. Datos de tu base de datos
$host     = "localhost";
$dbname   = "barberia_estilo_db"; 
$username = "root";              
$password = "";                  

try {
    $conexion = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        // 2. Recibir los datos que vienen desde tu formulario HTML
        $nombre       = htmlspecialchars($_POST['nombre']);
        $reseña       = htmlspecialchars($_POST['reseña']); // Este lee el name="reseña" de tu HTML
        $calificacion = isset($_POST['calificacion']) ? intval($_POST['calificacion']) : 5;
        
        // 3. La consulta SQL (Cambiamos :reseña por :resena sin eñe)
        $sql = "INSERT INTO opiniones (nombre, reseña, calificacion) VALUES (:nombre, :resena, :calificacion)";
        $stmt = $conexion->prepare($sql);
        
        // 4. Vincular los datos (Mira cómo :resena coincide exactamente con el de arriba)
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':resena', $reseña); 
        $stmt->bindParam(':calificacion', $calificacion);
        
        // 5. Guardar y regresar a la página principal
        if ($stmt->execute()) {
            echo "<script>
                    alert('¡Gracias por tu opinión! Tu reseña ha sido guardada.');
                    window.location.href = './'; 
                  </script>";
        }
    }
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}

$conexion = null;
?>