<?php
header('Content-Type: application/json');
require_once '../db/connect.php';

$annonce_id = $_GET['annonce_id'] ?? null;

if (!$annonce_id) {
    echo json_encode(['error' => 'ID manquant.']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT u.username
    FROM participations p
    JOIN users u ON p.user_id = u.id
    WHERE p.annonce_id = :id
");
$stmt->execute(['id' => $annonce_id]);
$participants = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo json_encode($participants);

?>