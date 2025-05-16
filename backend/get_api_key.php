<?php
// Configurez CORS si nécessaire pour limiter l'accès à ce fichier
header('Content-Type: application/json');

// Il est FORTEMENT recommandé de stocker votre clé API dans une variable d'environnement
// ou un fichier de configuration sécurisé, pas directement dans le code.

// Méthode 1: Utiliser getenv() pour obtenir la clé depuis les variables d'environnement
// $api_key = getenv('GOOGLE_MAPS_API_KEY');

// Méthode 2: Charger depuis un fichier de configuration sécurisé non versionné
// qui n'est pas accessible au public (en dehors du dossier web)
// require_once($_SERVER['DOCUMENT_ROOT'] . '/../config/api_keys.php');
// $api_key = $config['google_maps_api_key'];

// TEMPORAIRE: Pour la démonstration, nous utilisons une clé codée en dur
// Mais cette approche n'est PAS recommandée pour la production!
$api_key = 'AIzaSyBSVn53hcpiHk4U6y1PX6G0kzw5HSIbA1c';

// Vérifier que la clé existe
if (!$api_key) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Configuration error: Google Maps API key not found'
    ]);
    exit;
}

// Renvoyer la clé API
echo json_encode(['apiKey' => $api_key]);
?> 