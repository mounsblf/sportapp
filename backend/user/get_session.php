<?php
/**
 * Endpoint pour récupérer les informations de session de l'utilisateur actuel
 * Retourne les données utilisateur si connecté, sinon indique que l'utilisateur n'est pas connecté
 */
session_start();
header('Content-Type: application/json');

// Vérifier si l'utilisateur est connecté
if (isset($_SESSION['user_id'])) {
    // L'utilisateur est connecté, renvoyer les informations
    echo json_encode([
        'logged_in' => true,
        'user_id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'] ?? 'Utilisateur'
    ]);
} else {
    // L'utilisateur n'est pas connecté
    echo json_encode([
        'logged_in' => false
    ]);
}
?> 