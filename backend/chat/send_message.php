<?php
// Endpoint pour envoyer un message dans le chat d'une annonce
session_start();
header('Content-Type: application/json');
require_once '../db/connect.php';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Vous devez être connecté pour envoyer des messages']);
    exit;
}

// Récupérer les données
$user_id = $_SESSION['user_id'];
$annonce_id = isset($_POST['annonce_id']) ? intval($_POST['annonce_id']) : 0;
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Vérifier les données
if ($annonce_id <= 0) {
    echo json_encode(['success' => false, 'error' => 'ID de l\'annonce invalide']);
    exit;
}

if (empty($message)) {
    echo json_encode(['success' => false, 'error' => 'Le message ne peut pas être vide']);
    exit;
}

// Vérifier que l'annonce existe
$checkAnnonce = $pdo->prepare("SELECT id FROM annonces WHERE id = ?");
$checkAnnonce->execute([$annonce_id]);
if (!$checkAnnonce->fetch()) {
    echo json_encode(['success' => false, 'error' => 'Annonce introuvable']);
    exit;
}

try {
    // Enregistrer le message
    $stmt = $pdo->prepare("
        INSERT INTO chat_messages (annonce_id, user_id, message)
        VALUES (?, ?, ?)
    ");
    $result = $stmt->execute([$annonce_id, $user_id, $message]);

    if ($result) {
        // Récupérer l'ID du message inséré
        $message_id = $pdo->lastInsertId();
        
        // Récupérer le nom d'utilisateur
        $userStmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
        $userStmt->execute([$user_id]);
        $username = $userStmt->fetchColumn();
        
        // Retourner le message avec des données supplémentaires
        echo json_encode([
            'success' => true, 
            'message' => [
                'id' => $message_id,
                'annonce_id' => $annonce_id,
                'user_id' => $user_id,
                'username' => $username,
                'message' => $message,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'enregistrement du message']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erreur de base de données: ' . $e->getMessage()]);
} 