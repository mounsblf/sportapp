<?php
session_start();
header('Content-Type: application/json');
require_once '../db/connect.php';

$user_id = $_SESSION['user_id'] ?? null;
$annonce_id = $_GET['annonce_id'] ?? null;

if (!$user_id || !$annonce_id) {
    echo json_encode(['participe' => false]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT id FROM participations
    WHERE user_id = :user_id AND annonce_id = :annonce_id
");
$stmt->execute([
    'user_id' => $user_id,
    'annonce_id' => $annonce_id
]);

$participe = $stmt->fetch() ? true : false;
echo json_encode(['participe' => $participe]);

?>