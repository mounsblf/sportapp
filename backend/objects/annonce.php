<?php
// Classe pour gérer les annonces sportives
class Annonce {
    // Connexion à la base de données et nom de la table
    private $conn;
    private $table_name = "annonces";
    
    // Propriétés de l'objet
    public $id;
    public $titre;
    public $sport;
    public $lieu;
    public $date_activite;
    public $description;
    public $places_max;
    public $user_id;
    public $latitude;
    public $longitude;
    public $adresse;
    public $ville;
    public $code_postal;
    public $address;
    
    // Constructeur
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Lire toutes les annonces
     * @return PDOStatement
     */
    public function read() {
        // Requête SELECT
        $query = "SELECT 
                    a.id, 
                    a.titre, 
                    a.sport, 
                    a.lieu, 
                    a.date_activite,
                    a.description, 
                    a.places_max, 
                    a.user_id, 
                    a.latitude, 
                    a.longitude,
                    a.adresse,
                    u.username as auteur
                FROM 
                    " . $this->table_name . " a
                LEFT JOIN
                    users u ON a.user_id = u.id
                ORDER BY
                    a.date_activite DESC";
        
        // Préparer la requête
        $stmt = $this->conn->prepare($query);
        
        // Exécuter la requête
        $stmt->execute();
        
        return $stmt;
    }
    
    /**
     * Récupérer une seule annonce par son ID
     * @param int $id ID de l'annonce à récupérer
     * @return array|boolean Données de l'annonce ou false si non trouvée
     */
    public function readOne($id) {
        // Requête pour récupérer une annonce avec des jointures pour obtenir le nom de l'utilisateur
        $query = "SELECT 
                    a.id, 
                    a.titre, 
                    a.sport, 
                    a.lieu, 
                    a.date_activite,
                    a.description, 
                    a.places_max, 
                    a.user_id, 
                    a.latitude, 
                    a.longitude,
                    a.adresse,
                    u.username as auteur
                FROM 
                    " . $this->table_name . " a
                LEFT JOIN
                    users u ON a.user_id = u.id
                WHERE 
                    a.id = ?
                LIMIT 0,1";
        
        // Préparer la requête
        $stmt = $this->conn->prepare($query);
        
        // Lier l'ID
        $stmt->bindParam(1, $id);
        
        // Exécuter la requête
        $stmt->execute();
        
        // Récupérer le résultat
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row) {
            return false;
        }
        
        return $row;
    }
    
    /**
     * Créer une nouvelle annonce
     * @return boolean
     */
    public function create() {
        // Requête d'insertion
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    titre = :titre,
                    sport = :sport,
                    lieu = :lieu,
                    date_activite = :date_activite,
                    description = :description,
                    places_max = :places_max,
                    user_id = :user_id,
                    latitude = :latitude,
                    longitude = :longitude,
                    adresse = :adresse";
        
        // Préparer la requête
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->titre = htmlspecialchars(strip_tags($this->titre));
        $this->sport = htmlspecialchars(strip_tags($this->sport));
        $this->lieu = htmlspecialchars(strip_tags($this->lieu));
        $this->date_activite = htmlspecialchars(strip_tags($this->date_activite));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->places_max = htmlspecialchars(strip_tags($this->places_max));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->latitude = htmlspecialchars(strip_tags($this->latitude));
        $this->longitude = htmlspecialchars(strip_tags($this->longitude));
        $this->adresse = htmlspecialchars(strip_tags($this->adresse));
        
        // Lier les valeurs
        $stmt->bindParam(":titre", $this->titre);
        $stmt->bindParam(":sport", $this->sport);
        $stmt->bindParam(":lieu", $this->lieu);
        $stmt->bindParam(":date_activite", $this->date_activite);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":places_max", $this->places_max);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":latitude", $this->latitude);
        $stmt->bindParam(":longitude", $this->longitude);
        $stmt->bindParam(":adresse", $this->adresse);
        
        // Exécuter la requête
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Supprimer une annonce
     * @return boolean
     */
    public function delete() {
        // Requête de suppression
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        // Préparer la requête
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer l'ID
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Lier l'ID
        $stmt->bindParam(1, $this->id);
        
        // Exécuter la requête
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?> 