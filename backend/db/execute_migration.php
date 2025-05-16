<?php
/**
 * Script pour exécuter la migration SQL pour mettre à jour la table users
 * avec les coordonnées géographiques des villes
 */

// Connexion à la base de données
require_once 'connect.php';

echo "Début de la migration de la table users...\n";

try {
    // Lecture du fichier SQL
    $sql = file_get_contents(__DIR__ . '/update_users_table.sql');
    
    // Exécution des requêtes SQL
    $result = $pdo->exec($sql);
    
    echo "Migration terminée avec succès!\n";
    echo "La table 'users' a été mise à jour pour inclure les coordonnées géographiques des villes.\n";
    
} catch (PDOException $e) {
    echo "Erreur lors de la migration: " . $e->getMessage() . "\n";
    exit(1);
}
?> 