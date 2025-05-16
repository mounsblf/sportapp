<?php
// Démarrer la session pour vérifier si l'utilisateur est connecté
session_start();
header('Content-Type: application/json');
// Inclure la connexion à la base de données
require_once '../db/connect.php';

// Récupérer les paramètres de la requête
$lat = isset($_GET['lat']) ? (float)$_GET['lat'] : null;
$lng = isset($_GET['lng']) ? (float)$_GET['lng'] : null;
$radius = isset($_GET['radius']) ? (int)$_GET['radius'] : 50; // Rayon en km
$sport = isset($_GET['sport']) ? $_GET['sport'] : null;

// Vérifier si les coordonnées sont fournies
if ($lat === null || $lng === null) {
    echo json_encode([
        'success' => false,
        'error' => 'Coordonnées non fournies'
    ]);
    exit;
}

// Calcul de la distance en SQL (formule Haversine)
$sql = "
    SELECT 
        a.*,
        a.places_max,
        u.username as creator_name,
        (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(a.latitude)) * cos(radians(a.longitude) - radians(:lng)) + 
                sin(radians(:lat)) * sin(radians(a.latitude))
            )
        ) AS distance,
        COALESCE((SELECT COUNT(*) FROM participations p WHERE p.annonce_id = a.id), 0) AS participants_count
    FROM 
        annonces a
    JOIN
        users u ON a.user_id = u.id
    WHERE 
        a.status = 'active'
";

// Ajouter la condition de distance
$sql .= " HAVING distance < :radius";

// Ajouter la condition de sport si spécifiée
if ($sport) {
    $sql .= " AND a.sport = :sport";
}

// Trier par proximité
$sql .= " ORDER BY distance ASC LIMIT 50";

try {
    $stmt = $pdo->prepare($sql);
    $params = [
        'lat' => $lat,
        'lng' => $lng,
        'radius' => $radius
    ];
    
    if ($sport) {
        $params['sport'] = $sport;
    }
    
    $stmt->execute($params);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Ajouter des informations supplémentaires pour chaque événement
    foreach ($events as &$event) {
        // Le compte des participants est maintenant directement inclus dans la requête SQL principale
        $event['participants_count'] = (int)$event['participants_count'];
        // Mappage entre places_max et max_participants pour la cohérence frontend
        $event['max_participants'] = isset($event['places_max']) ? (int)$event['places_max'] : 0;
        $event['is_full'] = $event['participants_count'] >= $event['max_participants'];
        $event['distance_formatted'] = formatDistance($event['distance']);
        
        // S'assurer que le titre est bien défini (peut-être un problème de nommage de colonne)
        if (!isset($event['title']) && isset($event['titre'])) {
            $event['title'] = $event['titre']; 
        }
        
        // S'assurer que l'adresse est bien définie
        if (isset($event['address'])) {
            // Utilisez la colonne adresse telle quelle
        } else if (isset($event['adresse'])) {
        $event['address'] = $event['adresse'];
        } else if (isset($event['location'])) {
            // Si aucune adresse n'est trouvée, utiliser l'emplacement comme solution de repli
            $event['address'] = $event['location'];
        }
        
        // Vérifier si l'utilisateur connecté participe déjà
        if (isset($_SESSION['user_id'])) {
            $stmtUserParticipation = $pdo->prepare("
                SELECT id 
                FROM participations 
                WHERE annonce_id = :annonce_id AND user_id = :user_id
            ");
            $stmtUserParticipation->execute([
                'annonce_id' => $event['id'],
                'user_id' => $_SESSION['user_id']
            ]);
            
            $event['user_participates'] = $stmtUserParticipation->rowCount() > 0;
        } else {
            $event['user_participates'] = false;
        }
    }
    
    echo json_encode([
        'success' => true,
        'events' => $events,
        'total' => count($events)
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de base de données: ' . $e->getMessage()
    ]);
}

/**
 * Formate la distance en km ou m
 * @param float $distance Distance en km
 * @return string Distance formatée
 */
function formatDistance($distance) {
    if ($distance < 1) {
        return round($distance * 1000) . ' m';
    } else {
        return round($distance, 1) . ' km';
    }
} 