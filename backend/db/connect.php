<?php
// Définition du nom d'hôte de la base de données (généralement localhost pour les environnements de développement)
$host = 'localhost';
// Définition du nom de la base de données à laquelle se connecter
$dbname = 'sportapp_db';
// Définition du nom d'utilisateur pour la connexion à la base de données
$user = 'root';
// Définition du mot de passe pour la connexion à la base de données (vide dans ce cas)
$pass = '';

try {
    // Création d'une nouvelle instance PDO pour établir la connexion à la base de données MySQL
    // avec les paramètres définis ci-dessus et encodage UTF-8
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4",$user,$pass);
    // Configuration de PDO pour qu'il lance des exceptions en cas d'erreur SQL
    $pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
}catch (PDOException $e){
    // En cas d'échec de connexion, capture l'exception PDO
    // Renvoie un message d'erreur formaté en JSON avec le détail de l'erreur
    echo json_encode(['error' => 'Connexion echouee: '. $e->getMessage()]);
    // Arrête l'exécution du script en cas d'échec de connexion
    exit;
}
?>