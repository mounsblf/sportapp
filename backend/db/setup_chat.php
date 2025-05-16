<?php
// Script pour créer la table de chat dans la base de données
header('Content-Type: text/html; charset=utf-8');
require_once 'connect.php';

echo "<h1>Configuration de la table de chat</h1>";

try {
    // Lire le contenu du fichier SQL
    $sql = file_get_contents(__DIR__ . '/chat_table.sql');
    
    // Exécuter le script SQL
    $pdo->exec($sql);
    
    echo "<p style='color: green;'>✅ Table de chat créée avec succès!</p>";
    echo "<p>Vous pouvez maintenant utiliser la fonctionnalité de chat dans les détails des événements.</p>";
    
    // Vérifier si la table a été créée
    $tables = $pdo->query("SHOW TABLES LIKE 'chat_messages'")->fetchAll();
    if (count($tables) > 0) {
        echo "<p style='color: green;'>✅ Vérification: La table 'chat_messages' existe bien dans la base de données.</p>";
    } else {
        echo "<p style='color: red;'>❌ Erreur: La table 'chat_messages' n'a pas été créée correctement.</p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Erreur lors de la création de la table: " . $e->getMessage() . "</p>";
    
    if (strpos($e->getMessage(), "Table 'chat_messages' already exists") !== false) {
        echo "<p style='color: orange;'>⚠️ La table existe déjà, ce n'est pas un problème.</p>";
    }
}

echo "<p><a href='../../frontend/index.html' style='display: inline-block; padding: 10px 15px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;'>Retour à l'application</a></p>";
?> 