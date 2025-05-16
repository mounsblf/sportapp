<?php

header('Content-Type: application/json');
require_once '../db/connect.php';

//recuperation des donnee post
$username = $_POST['username'] ?? null;
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;
$city = $_POST['city'] ?? '';
$city_lat = $_POST['city_lat'] ?? null;
$city_lng = $_POST['city_lng'] ?? null;
$sport = $_POST['sport'] ?? '';

//verification de la base
if(!$username || !$email || !$password){
    echo json_encode(['error' => 'Champs obligatoires manquants.']);
    exit;
}

//Verifie si l'email ou le pseudo exist deja 
// Prépare une requête SQL avec des paramètres nommés (:email, :username) pour éviter les injections SQL
// Cette requête cherche dans la table users si l'email OU le nom d'utilisateur existe déjà
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email OR username = :username");

// Exécute la requête préparée en remplaçant les paramètres par les valeurs réelles
// Les valeurs sont passées dans un tableau associatif qui fait correspondre chaque paramètre à sa valeur
$stmt->execute(['email' => $email, 'username' => $username]);

// Tente de récupérer une ligne de résultat avec fetch()
// Si la requête trouve un utilisateur correspondant (l'email ou le username existe déjà):
if($stmt->fetch()){
    // Envoie une réponse d'erreur en format JSON
    echo json_encode(['error' => 'Email ou nom d\'utilisateur deja utilise.']);
    // Arrête l'exécution du script pour empêcher la création d'un compte avec un email ou username déjà existant
    exit;
}

//Hachage du mot de passe

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

//Insertion des donnees

$stmt = $pdo->prepare("
    INSERT INTO users (username, email, password, city, city_lat, city_lng, sport_preference)
    VALUES (:username, :email, :password, :city, :city_lat, :city_lng, :sport)
");

$success = $stmt->execute([
    'username' => $username,
    'email' => $email,
    'password' => $hashedPassword,
    'city' => $city,
    'city_lat' => $city_lat,
    'city_lng' => $city_lng,
    'sport' => $sport 
]);

if ($success){
    echo json_encode(['message' => 'Inscription reussite.']);
}else{
    echo json_encode(['error' => 'Erreur lors de l\'inscription. Inscription echouee.']);
}

?>