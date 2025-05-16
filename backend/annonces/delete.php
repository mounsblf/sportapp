<?php
session_start();
header('Content-Type: application/json');
require_once '../db/connect.php';

$user_id = $_SESSION['user_id'] ?? null;
$annonce_id = $_POST['annonce_id'] ?? null;

if (!$user_id || !$annonce_id) {
    echo json_encode(['error' => 'Requête invalide.']);
    exit;
}

// Supprimer seulement si l'annonce appartient à l'utilisateur
$stmt = $pdo->prepare("
    DELETE FROM annonces 
    WHERE id = :id AND user_id = :user_id
");

$success = $stmt->execute([
    'id' => $annonce_id,
    'user_id' => $user_id
]);

if ($success) {
    echo json_encode(['message' => 'Annonce supprimée avec succès.']);
} else {
    echo json_encode(['error' => 'Échec de la suppression.']);
}

?>