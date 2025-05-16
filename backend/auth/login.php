<?php
// Démarre une session PHP pour stocker les informations de l'utilisateur connecté
session_start();
// Définit l'en-tête HTTP pour spécifier que la réponse sera au format JSON
header('Content-Type: application/json');
// Inclut le fichier de connexion à la base de données pour avoir accès à l'objet PDO ($pdo)
require_once '../db/connect.php' ;

// Récupère l'email envoyé par le formulaire ou définit sa valeur à null s'il n'existe pas
$email = $_POST['email'] ?? null;
// Récupère le mot de passe envoyé par le formulaire ou définit sa valeur à null s'il n'existe pas
$password = $_POST['password'] ?? null;

// Vérifie si l'email ou le mot de passe est manquant
if(!$email || !$password){
    // Envoie un message d'erreur au format JSON si un des champs est manquant
    echo json_encode(['error' => 'Email et mot de passe requis.']);
    // Arrête l'exécution du script
    exit;
}

//verifier si l'utilisateur exist

// Prépare une requête SQL sécurisée pour chercher l'utilisateur par son email
$stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE email = :email");
// Exécute la requête en remplaçant le paramètre nommé par la valeur réelle
$stmt->execute(['email' => $email]);
// Récupère les données de l'utilisateur sous forme de tableau associatif
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Vérifie si l'utilisateur existe et si le mot de passe correspond au hash stocké
if(!$user || !password_verify($password, $user['password'])){
    // Envoie un message d'erreur si les identifiants sont incorrects
    echo json_encode(['error' => 'Identifiants invalides']);
    // Arrête l'exécution du script
    exit;
}

//Connexion reussie

// Stocke l'ID de l'utilisateur dans la variable de session pour le maintenir connecté
$_SESSION['user_id'] = $user['id'];
// Stocke le nom d'utilisateur dans la session pour l'utiliser dans l'interface
$_SESSION['username'] = $user['username'];

// Envoie un message de succès au format JSON
echo json_encode([
    'message' => 'Connexion reussite.',
    'username' => $user['username']
]);

?>