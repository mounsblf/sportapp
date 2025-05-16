<?php
// Script pour ajouter les colonnes de coordonnées géographiques à la table des annonces
// À exécuter une seule fois pour mettre à jour la structure de la base de données

// Inclure le fichier de connexion
require_once 'connect.php';

try {
    // Vérifier si les colonnes existent déjà
    $checkColumns = $pdo->query("SHOW COLUMNS FROM annonces LIKE 'latitude'");
    $columnExists = $checkColumns->fetchColumn();
    
    if (!$columnExists) {
        // Ajouter les colonnes de latitude et longitude
        $pdo->exec("ALTER TABLE annonces ADD COLUMN latitude DECIMAL(10, 8) DEFAULT NULL");
        $pdo->exec("ALTER TABLE annonces ADD COLUMN longitude DECIMAL(11, 8) DEFAULT NULL");
        
        echo "Colonnes de coordonnées ajoutées avec succès.\n";
        
        // Ajouter un index spatial si votre version de MySQL le supporte
        try {
            $pdo->exec("CREATE INDEX idx_coordinates ON annonces (latitude, longitude)");
            echo "Index spatial créé avec succès.\n";
        } catch (PDOException $e) {
            echo "Impossible de créer l'index spatial: " . $e->getMessage() . "\n";
        }
        
        // Mettre à jour les coordonnées pour les annonces existantes
        // Nous allons utiliser un service de géocodage pour cela
        // Pour l'instant, nous allons uniquement mettre à jour les entrées avec des valeurs aléatoires à titre d'exemple
        
        $annonces = $pdo->query("SELECT id, address FROM annonces WHERE latitude IS NULL OR longitude IS NULL");
        
        while ($annonce = $annonces->fetch(PDO::FETCH_ASSOC)) {
            // Dans un vrai scénario, vous utiliseriez un service comme l'API Google Maps Geocoding ici
            // Pour l'exemple, nous utilisons des coordonnées aléatoires dans Paris
            $lat = 48.8566 + (mt_rand(-1000, 1000) / 10000); // Environ dans la région parisienne
            $lng = 2.3522 + (mt_rand(-1000, 1000) / 10000);
            
            $stmt = $pdo->prepare("UPDATE annonces SET latitude = :lat, longitude = :lng WHERE id = :id");
            $stmt->execute([
                'lat' => $lat,
                'lng' => $lng,
                'id' => $annonce['id']
            ]);
        }
        
        echo "Coordonnées mises à jour pour les annonces existantes.\n";
    } else {
        echo "Les colonnes de coordonnées existent déjà.\n";
    }
    
    // Vérifier si la colonne status existe
    $checkStatus = $pdo->query("SHOW COLUMNS FROM annonces LIKE 'status'");
    $statusExists = $checkStatus->fetchColumn();
    
    if (!$statusExists) {
        // Ajouter une colonne status pour les annonces (active, cancelled, completed)
        $pdo->exec("ALTER TABLE annonces ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active'");
        echo "Colonne de statut ajoutée avec succès.\n";
    } else {
        echo "La colonne de statut existe déjà.\n";
    }
    
    echo "Mise à jour de la base de données terminée avec succès.";
    
} catch (PDOException $e) {
    echo "Erreur lors de la mise à jour de la base de données: " . $e->getMessage();
}
?> 