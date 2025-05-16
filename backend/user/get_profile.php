<?php
// Démarre une session PHP pour accéder aux informations de l'utilisateur connecté
session_start();
// Définit l'en-tête HTTP pour spécifier que la réponse sera au format JSON
header('Content-Type: application/json');
// Inclut le fichier de connexion à la base de données
require_once '../db/connect.php';

// Vérifie si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Utilisateur non connecté']);
    exit;
}

// Récupère l'ID de l'utilisateur connecté
$user_id = $_SESSION['user_id'];

// Prépare une requête SQL pour récupérer les informations de l'utilisateur
$stmt = $pdo->prepare("SELECT id, username, email, city, sport_preference, created_at FROM users WHERE id = :user_id");
$stmt->execute(['user_id' => $user_id]);

// Récupère les données de l'utilisateur
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['error' => 'Utilisateur non trouvé']);
    exit;
}

// Retourne les données de l'utilisateur au format JSON
echo json_encode([
    'success' => true,
    'user' => $user
]); 