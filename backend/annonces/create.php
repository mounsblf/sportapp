<?php
session_start();
header('Content-Type: application/json');
require_once '../db/connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Vous devez être connecté pour publier une annonce.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$titre = $_POST['titre'] ?? null;
$description = $_POST['description'] ?? '';
$lieu = $_POST['lieu'] ?? null;
$adresse = $_POST['adresse'] ?? null;
$latitude = $_POST['latitude'] ?? null;
$longitude = $_POST['longitude'] ?? null;
$date_activite = $_POST['date_activite'] ?? null;
$sport = $_POST['sport'] ?? null;
$places_max = $_POST['places_max'] ?? null;

if (!$titre || !$lieu || !$date_activite || !$sport || !$places_max) {
    echo json_encode(['error' => 'Tous les champs obligatoires doivent être remplis.']);
    exit;
}

// Vérifier que les coordonnées sont présentes
if (!$latitude || !$longitude || !$adresse) {
    echo json_encode(['error' => 'Les coordonnées géographiques et l\'adresse précise sont requises.']);
    exit;
}

// 🔐 Vérifie que la date est aujourd'hui ou future
$today = date('Y-m-d');
if ($date_activite < $today) {
    echo json_encode(['error' => "La date de l'activité ne peut pas être dans le passé."]);
    exit;
}

// 🏅 Vérifie que le sport est autorisé
$sportsAutorises = [
    "Football", "Basketball", "Tennis", "Paddle", "Volleyball",
    "Rugby", "Natation", "Course à pied", "Cyclisme", "Randonnée",
    "Escalade", "Boxe", "Badminton", "Danse", "Yoga",
    "Fitness", "Musculation", "Ski", "Snowboard", "Surf"
];

if (!in_array($sport, $sportsAutorises)) {
    echo json_encode(['error' => 'Sport invalide.']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO annonces (user_id, titre, description, lieu, adresse, latitude, longitude, date_activite, sport, places_max)
    VALUES (:user_id, :titre, :description, :lieu, :adresse, :latitude, :longitude, :date_activite, :sport, :places_max)
");

$success = $stmt->execute([
    'user_id' => $user_id,
    'titre' => $titre,
    'description' => $description,
    'lieu' => $lieu,
    'adresse' => $adresse,
    'latitude' => $latitude,
    'longitude' => $longitude,
    'date_activite' => $date_activite,
    'sport' => $sport,
    'places_max' => $places_max
]);

if ($success) {
    echo json_encode(['message' => 'Annonce publiée avec succès.']);
} else {
    echo json_encode(['error' => "Erreur lors de l'enregistrement de l'annonce."]);
}

?>