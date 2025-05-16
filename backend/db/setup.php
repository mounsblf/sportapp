<?php
// Database configuration
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'sportapp_db';

// Create database if it doesn't exist
try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
    echo "Database created or already exists.\n";
    
    // Select database
    $pdo->exec("USE `$dbname`");
    
    // Create users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Users table created or already exists.\n";
    
    // Create annonces table
    $pdo->exec("CREATE TABLE IF NOT EXISTS annonces (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(100) NOT NULL,
        sport_type VARCHAR(50) NOT NULL,
        date_time DATETIME NOT NULL,
        max_participants INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "Annonces table created or already exists.\n";
    
    // Create participations table
    $pdo->exec("CREATE TABLE IF NOT EXISTS participations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        annonce_id INT NOT NULL,
        user_id INT NOT NULL,
        status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_participation (annonce_id, user_id)
    )");
    echo "Participations table created or already exists.\n";
    
    echo "Database setup completed successfully!";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?> 