<?php
// Endpoint pour récupérer les messages du chat pour une annonce spécifique
header('Content-Type: application/json');
require_once '../db/connect.php';

// Récupérer l'ID de l'annonce
$annonce_id = isset($_GET['annonce_id']) ? intval($_GET['annonce_id']) : 0;
$last_id = isset($_GET['last_id']) ? intval($_GET['last_id']) : 0;

// Vérifier les données
if ($annonce_id <= 0) {
    echo json_encode(['success' => false, 'error' => 'ID de l\'annonce invalide']);
    exit;
}

try {
    // Requête SQL de base
    $sql = "
        SELECT 
            cm.id, 
            cm.annonce_id, 
            cm.user_id, 
            u.username,
            cm.message, 
            cm.created_at
        FROM 
            chat_messages cm
        JOIN 
            users u ON cm.user_id = u.id
        WHERE 
            cm.annonce_id = ?
    ";
    
    $params = [$annonce_id];
    
    // Si un ID de dernier message est fourni, ne récupérer que les nouveaux messages
    if ($last_id > 0) {
        $sql .= " AND cm.id > ?";
        $params[] = $last_id;
    }
    
    // Ajouter l'ordre et la limite
    $sql .= " ORDER BY cm.created_at ASC LIMIT 100";
    
    // Exécuter la requête
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Récupérer les résultats
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formater la réponse
    echo json_encode([
        'success' => true,
        'messages' => $messages
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Erreur de base de données: ' . $e->getMessage()
    ]);
} 