<?php

header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$dbname = "barberia_love";
$username = "root";
$password = "";

try {

    $conexion = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );

    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT nombre, reseña, calificacion
            FROM reseñas
            ORDER BY id DESC";

    $stmt = $conexion->prepare($sql);
    $stmt->execute();

    $reseñas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($reseñas);

} catch(PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);

}
?>