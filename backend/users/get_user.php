<?php
// Configuration pour renvoyer du JSON
header('Content-Type: application/json');

// Importer les configurations nécessaires
require_once '../config/config.php';
require_once '../config/database.php';

// Vérifier que nous avons un ID ou un nom d'utilisateur
if ((!isset($_GET['id']) || empty($_GET['id'])) && (!isset($_GET['username']) || empty($_GET['username']))) {
    echo json_encode(['error' => 'Identifiant ou nom d\'utilisateur requis']);
    exit;
}

// Créer une connexion à la base de données
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Vérifier la connexion
if ($conn->connect_error) {
    echo json_encode(['error' => 'Erreur de connexion à la base de données: ' . $conn->connect_error]);
    exit;
}

try {
    // Préparer la requête en fonction du paramètre fourni
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        // Recherche par ID
        $id = $_GET['id'];
        $sql = "SELECT id, username, email, created_at FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
    } else {
        // Recherche par nom d'utilisateur
        $username = $_GET['username'];
        $sql = "SELECT id, username, email, created_at FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
    }

    // Exécuter la requête
    $stmt->execute();
    $result = $stmt->get_result();

    // Vérifier si l'utilisateur existe
    if ($result->num_rows === 0) {
        echo json_encode(['error' => 'Utilisateur introuvable']);
        exit;
    }

    // Récupérer les données de l'utilisateur
    $user = $result->fetch_assoc();

    // Ajouter les champs manquants avec des valeurs par défaut
    $user['bio'] = null;
    $user['favorite_sports'] = null;

    // Protéger les informations sensibles
    unset($user['password']);
    if (isset($user['email'])) {
        // Masquer l'email pour la confidentialité
        $email_parts = explode('@', $user['email']);
        if (count($email_parts) > 1) {
            $user['email'] = substr($email_parts[0], 0, 2) . '****@' . $email_parts[1];
        }
    }

    // Renvoyer les données au format JSON
    echo json_encode($user);

    // Fermer la connexion
    $stmt->close();
} catch (Exception $e) {
    // Capturer et afficher toute erreur pendant l'exécution
    echo json_encode(['error' => 'Erreur lors de la récupération de l\'utilisateur: ' . $e->getMessage()]);
} finally {
    // Toujours fermer la connexion
    $conn->close();
}
?> 