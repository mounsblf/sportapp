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

// Récupère les données envoyées par le formulaire
$username = $_POST['username'] ?? null;
$email = $_POST['email'] ?? null;
$city = $_POST['city'] ?? '';
$sport_preference = $_POST['sport_preference'] ?? '';
$current_password = $_POST['current_password'] ?? null;
$new_password = $_POST['new_password'] ?? null;

// Vérification des données requises
if (!$username || !$email) {
    echo json_encode(['error' => 'Nom d\'utilisateur et e-mail obligatoires']);
    exit;
}

// Vérification si le nom d'utilisateur existe déjà (excluant l'utilisateur actuel)
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username AND id != :user_id");
$stmt->execute(['username' => $username, 'user_id' => $user_id]);
if ($stmt->fetch()) {
    echo json_encode(['error' => 'Ce nom d\'utilisateur est déjà utilisé']);
    exit;
}

// Vérification si l'email existe déjà (excluant l'utilisateur actuel)
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email AND id != :user_id");
$stmt->execute(['email' => $email, 'user_id' => $user_id]);
if ($stmt->fetch()) {
    echo json_encode(['error' => 'Cet e-mail est déjà utilisé']);
    exit;
}

// Si un changement de mot de passe est demandé, vérifier l'ancien mot de passe
if ($new_password) {
    if (!$current_password) {
        echo json_encode(['error' => 'Mot de passe actuel requis pour changer de mot de passe']);
        exit;
    }
    
    // Vérifier que le mot de passe actuel est correct
    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!password_verify($current_password, $user['password'])) {
        echo json_encode(['error' => 'Mot de passe actuel incorrect']);
        exit;
    }
}

// Préparation de la requête de mise à jour
if ($new_password) {
    // Mise à jour avec nouveau mot de passe
    $hashedPassword = password_hash($new_password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("
        UPDATE users 
        SET username = :username, email = :email, password = :password, city = :city, sport_preference = :sport_preference
        WHERE id = :user_id
    ");
    $params = [
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword,
        'city' => $city,
        'sport_preference' => $sport_preference,
        'user_id' => $user_id
    ];
} else {
    // Mise à jour sans changer le mot de passe
    $stmt = $pdo->prepare("
        UPDATE users 
        SET username = :username, email = :email, city = :city, sport_preference = :sport_preference
        WHERE id = :user_id
    ");
    $params = [
        'username' => $username,
        'email' => $email,
        'city' => $city,
        'sport_preference' => $sport_preference,
        'user_id' => $user_id
    ];
}

// Exécute la requête de mise à jour
try {
    $stmt->execute($params);
    
    // Met à jour le nom d'utilisateur dans la session si changé
    if ($_SESSION['username'] !== $username) {
        $_SESSION['username'] = $username;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Profil mis à jour avec succès',
        'username' => $username
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
    ]);
} 