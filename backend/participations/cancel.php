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
    echo json_encode(['error' => 'ID de l’annonce requis.']);
    exit;
}

$stmt = $pdo->prepare("
    DELETE FROM participations
    WHERE user_id = :user_id AND annonce_id = :annonce_id
");

$success = $stmt->execute([
    'user_id' => $user_id,
    'annonce_id' => $annonce_id
]);

if ($success) {
    echo json_encode(['message' => 'Participation annulée avec succès.']);
} else {
    echo json_encode(['error' => 'Échec de l’annulation.']);
}

?>