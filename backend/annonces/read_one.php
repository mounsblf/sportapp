<?php
// Endpoint pour récupérer les détails complets d'une annonce spécifique par son ID
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// Activer l'affichage des erreurs pendant le développement
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Inclure les fichiers de configuration et de connexion
    require_once '../config/database.php';
    require_once '../objects/annonce.php';

    // Vérifier que l'ID est fourni
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode(["error" => "ID de l'annonce manquant"]);
        exit();
    }

    $annonceId = intval($_GET['id']);

    // Instancier la base de données
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier la connexion à la base de données
    if (!$db) {
        throw new Exception("La connexion à la base de données a échoué");
    }

    // Instancier l'objet Annonce
    $annonce = new Annonce($db);

    // Obtenir les détails de l'annonce
    $result = $annonce->readOne($annonceId);

    if ($result) {
        // Retourner les données en JSON
        echo json_encode($result);
    } else {
        // Aucune annonce trouvée
        echo json_encode(["error" => "Annonce non trouvée"]);
    }
} catch (Exception $e) {
    // En cas d'erreur, retourner un message détaillé (pour le développement)
    http_response_code(500);
    echo json_encode([
        "error" => "Une erreur est survenue",
        "message" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
} 