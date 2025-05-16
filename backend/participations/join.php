<?php
session_start();
header('Content-Type: application/json');
require_once '../db/connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Non autorisé. Connectez-vous.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$annonce_id = $_POST['annonce_id'] ?? null;

if (!$annonce_id) {
    echo json_encode(['error' => 'ID de l’annonce manquant.']);
    exit;
}

// Empêche les doublons grâce à la contrainte UNIQUE
try {
    $stmt = $pdo->prepare("
        INSERT INTO participations (user_id, annonce_id)
        VALUES (:user_id, :annonce_id)
    ");
    $stmt->execute([
        'user_id' => $user_id,
        'annonce_id' => $annonce_id
    ]);

    echo json_encode(['message' => 'Vous avez rejoint cette activité.']);
} catch (PDOException $e) {
    // Erreur si déjà inscrit (viol UNIQUE KEY)
    if ($e->getCode() == 23000) {
        echo json_encode(['error' => 'Vous participez déjà à cette activité.']);
    } else {
        echo json_encode(['error' => 'Erreur lors de la participation.']);
    }
}

?>