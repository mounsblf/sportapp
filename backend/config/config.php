<?php
/**
 * Configuration globale de l'application
 */

// Configuration de la base de données
define("DB_SERVER", "localhost");
define("DB_USERNAME", "root");
define("DB_PASSWORD", "");
define("DB_NAME", "sportapp_db");

// Configuration des messages d'erreur
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Fuseau horaire
date_default_timezone_set('Europe/Paris');

// Session
session_start();
?> 