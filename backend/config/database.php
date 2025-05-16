<?php
/**
 * Classe pour la connexion à la base de données
 */
class Database {
    // Paramètres de connexion à la base de données
    private $host = "localhost";
    private $db_name = "sportapp_db";
    private $username = "root";
    private $password = "";
    public $conn;

    /**
     * Obtenir la connexion à la base de données
     *
     * @return PDO|null Connexion PDO ou null en cas d'erreur
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $exception) {
            error_log("Erreur de connexion: " . $exception->getMessage());
            // Retourner null en cas d'erreur pour permettre une gestion d'erreur plus propre
            return null;
        }

        return $this->conn;
    }
}
?> 