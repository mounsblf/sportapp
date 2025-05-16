<?php
// Configuration pour renvoyer du JSON
header('Content-Type: application/json');

// Importer les configurations nécessaires
require_once '../config/config.php';
require_once '../config/database.php';

// Vérifier que nous avons un ID d'utilisateur
if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
    echo json_encode(['error' => 'ID utilisateur requis']);
    exit;
}

$userId = $_GET['user_id'];

// Créer une connexion à la base de données
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Vérifier la connexion
if ($conn->connect_error) {
    echo json_encode(['error' => 'Erreur de connexion à la base de données: ' . $conn->connect_error]);
    exit;
}

try {
    // Requête pour récupérer les annonces de l'utilisateur
    $sql = "SELECT a.*, u.username as auteur 
            FROM annonces a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.user_id = ? 
            ORDER BY a.date_creation DESC";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Erreur de préparation de la requête: " . $conn->error);
    }
    
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Récupérer toutes les annonces
    $annonces = [];
    while ($row = $result->fetch_assoc()) {
        $annonces[] = $row;
    }

    // Renvoyer les données au format JSON
    echo json_encode($annonces);

    // Fermer la connexion
    $stmt->close();
} catch (Exception $e) {
    // Capturer et afficher toute erreur pendant l'exécution
    echo json_encode(['error' => 'Erreur lors de la récupération des annonces: ' . $e->getMessage()]);
} finally {
    // Toujours fermer la connexion
    $conn->close();
}
?> 