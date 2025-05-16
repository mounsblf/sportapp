<?php
header('Content-Type: application/json');
require_once '../db/connect.php';

$annonce_id = $_GET['annonce_id'] ?? null;

if (!$annonce_id) {
    echo json_encode(['error' => 'ID de l’annonce manquant.']);
    exit;
}

$stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM participations WHERE annonce_id = :id");
$stmt->execute(['id' => $annonce_id]);
$count = $stmt->fetch();

echo json_encode(['count' => $count['total'] ?? 0]);

?>