<?php
header('Content-Type: application/json');
require_once '../db/connect.php';

try {
    $stmt = $pdo->query("
        SELECT 
            a.id, a.titre, a.description, a.lieu, a.date_activite, 
            a.sport, a.places_max, a.user_id, u.username AS auteur
        FROM annonces a
        JOIN users u ON a.user_id = u.id
        WHERE a.date_activite >= CURDATE()
        ORDER BY a.date_activite ASC
    ");

    $annonces = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($annonces);
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur lors de la récupération des annonces.']);
}

?>