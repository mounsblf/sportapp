# Sport Gathering App

# Demo disponible sur le lien suivant : https://unice-my.sharepoint.com/:v:/r/personal/mounir_boulifa_etu_unice_fr/Documents/DEMO_PROJET_WEB.mov?csf=1&web=1&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=1PLkE7
                      ou sur youtube : https://www.youtube.com/watch?v=3bYtd9KUku8

# Réqlisé par : 
      - Moussa CISSE 
      - Mounir BOULIFA

# ps: vous pouvez utiliser le code sql dans le fichier backend/db/sportapp_db-3.sql pour génerer le meme contenu de la DEMO.

Une application web moderne pour organiser et participer à des événements sportifs.

## Fonctionnalités

- Tableau de bord personnalisé
- Système de jeu en ligne
- Gestion de profil utilisateur
- Interface responsive

## Prérequis

- PHP 7.4 ou supérieur
- MySQL 5.7 ou supérieur
- XAMPP (ou équivalent)
- Navigateur web moderne

## Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
```

2. Configurez votre serveur web (XAMPP) :
   - Placez le projet dans le dossier `htdocs`
   - Assurez-vous que Apache et MySQL sont en cours d'exécution

3. Importez la base de données :
   - Utilisez phpMyAdmin pour importer le fichier SQL fourni

4. Configurez les variables d'environnement :
   - Copiez `.env.example` vers `.env`
   - Modifiez les paramètres selon votre configuration

## Utilisation

1. Accédez à l'application via votre navigateur :
   ```
   http://localhost/sportapp
   ```

2. Créez un compte ou connectez-vous

3. Explorez les différentes fonctionnalités de l'application

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Structure de l'application](#structure-de-lapplication)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Base de données](#base-de-données)
- [Installation et configuration](#installation-et-configuration)
- [Guide d'utilisation](#guide-dutilisation)
- [Mécanismes de fonctionnement](#mécanismes-de-fonctionnement)
- [Diagramme d'architecture](#diagramme-darchitecture)
- [Développement futur](#développement-futur)

## Technologies utilisées

- **Frontend**:
  - HTML5, CSS3, JavaScript (ES6+)
  - Tailwind CSS pour le design responsive
  - Aucun framework JavaScript (Vanilla JS)
  
- **Backend**:
  - PHP 7+ pour le traitement des données côté serveur
  - API REST pour la communication frontend/backend
  
- **Base de données**:
  - MySQL pour le stockage des données
  
- **APIs externes**:
  - Google Maps API pour la géolocalisation et l'affichage des cartes
  - Geocoding API pour la conversion d'adresses en coordonnées

## Structure de l'application

### Frontend

Le frontend est organisé en composants JavaScript modulaires qui gèrent l'interface utilisateur.

#### Dossier `frontend/js/`

- `main.js` - Point d'entrée de l'application, initialise l'interface et gère la session utilisateur
- `components/` - Dossier contenant tous les composants réutilisables de l'interface:
  - `authForm.js` - Gère le formulaire de connexion et d'inscription
  - `header.js` - Navigation principale et menu de l'application
  - `dashboard.js` - Page d'accueil après connexion avec animations et accès aux fonctionnalités
  - `createAnnonce.js` - Formulaire de création d'événements sportifs
  - `annonceDetails.js` - Affichage détaillé d'une annonce avec système de chat intégré
  - `listeAnnonces.js` - Liste des annonces disponibles avec filtres
  - `sportMap.js` - Carte interactive des événements sportifs
  - `profile.js` - Gestion du profil utilisateur
  - `jouerEnLigne.js` - Fonctionnalité pour les activités en ligne
  - `otherUserProfile.js` - Affichage du profil d'autres utilisateurs

- `utils/` - Utilitaires et services communs:
  - `userSession.js` - Gestion de la session utilisateur
  - `googleMapsLoader.js` - Chargement asynchrone de l'API Google Maps

### Backend

Le backend est structuré par domaine fonctionnel, chaque endpoint PHP correspondant à une fonctionnalité spécifique.

#### Dossier `backend/`

- `config/` - Configuration de l'application:
  - `database.php` - Configuration de la connexion à la base de données
  - `cors.php` - Gestion des Cross-Origin Resource Sharing

- `auth/` - Gestion de l'authentification:
  - `login.php` - Traitement des connexions
  - `register.php` - Enregistrement des nouveaux utilisateurs

- `annonces/` - Gestion des annonces sportives:
  - `create_annonce.php` - Création de nouvelles annonces
  - `get_annonces.php` - Récupération des annonces
  - `get_annonce.php` - Récupération d'une annonce spécifique
  - `join_annonce.php` - Participation à une annonce
  - `leave_annonce.php` - Désistement d'une annonce

- `maps/` - Fonctionnalités liées aux cartes:
  - `get_events_map.php` - Récupération des événements pour l'affichage sur la carte

- `chat/` - Système de messagerie:
  - `get_messages.php` - Récupération des messages d'un chat
  - `send_message.php` - Envoi d'un message dans le chat

- `users/` - Gestion des utilisateurs:
  - `get_current_user.php` - Information sur l'utilisateur courant
  - `get_user.php` - Récupération des détails d'un utilisateur
  - `get_user_annonces.php` - Récupération des annonces créées par un utilisateur

- `participations/` - Gestion des participations:
  - `get_participants.php` - Liste des participants à un événement

- `objects/` - Classes modèles:
  - `annonce.php` - Modèle de données pour les annonces
  - `user.php` - Modèle de données pour les utilisateurs

- `db/` - Scripts de base de données:
  - `setup.php` - Installation initiale de la base de données

### Base de données

La base de données MySQL est composée des tables suivantes:

- `users` - Stocke les informations des utilisateurs:
  - `id` - Identifiant unique
  - `username` - Nom d'utilisateur
  - `email` - Adresse email
  - `password` - Mot de passe hashé
  - `city` - Ville
  - `latitude`, `longitude` - Coordonnées géographiques
  - `sport` - Sport préféré
  - `created_at` - Date de création du compte

- `annonces` - Stocke les annonces d'événements sportifs:
  - `id` - Identifiant unique
  - `user_id` - Créateur de l'annonce
  - `title` - Titre de l'annonce
  - `description` - Description détaillée
  - `sport_type` - Type de sport
  - `location` - Lieu (texte)
  - `latitude`, `longitude` - Coordonnées géographiques
  - `event_date` - Date de l'événement
  - `places_max` - Nombre maximum de participants
  - `status` - État de l'annonce (active, terminée, etc.)
  - `created_at` - Date de création

- `participations` - Gère les inscriptions aux événements:
  - `id` - Identifiant unique
  - `annonce_id` - Référence à l'annonce
  - `user_id` - Utilisateur participant
  - `status` - Statut de la participation
  - `created_at` - Date de participation

- `messages` - Système de chat par annonce:
  - `id` - Identifiant unique
  - `annonce_id` - Annonce concernée
  - `user_id` - Auteur du message
  - `message` - Contenu du message
  - `created_at` - Date d'envoi

## Installation et configuration

### Prérequis

- XAMPP (ou équivalent avec PHP 7+ et MySQL)
- Navigateur web moderne
- Clé API Google Maps (pour les fonctionnalités de carte)

### Installation

1. Cloner ou télécharger ce dépôt dans votre dossier htdocs de XAMPP:
   ```
   /Applications/XAMPP/xamppfiles/htdocs/sportapp/
   ```

2. Démarrer les services Apache et MySQL de XAMPP.

3. Configurer la base de données en visitant:
   ```
   http://localhost/sportapp/backend/db/setup.php
   ```

4. Configurer votre clé API Google Maps dans:
   ```
   frontend/js/utils/googleMapsLoader.js
   ```

5. Accéder à l'application:
   ```
   http://localhost/sportapp/frontend/
   ```

## Guide d'utilisation

1. **Inscription/Connexion**: Créez un compte ou connectez-vous sur la page d'accueil
2. **Tableau de bord**: Accédez aux différentes fonctionnalités depuis le tableau de bord
3. **Création d'événement**: Utilisez le bouton "Créer une annonce" pour organiser un événement sportif
4. **Recherche d'événements**: Parcourez les annonces existantes via "Voir les annonces" ou "Carte des événements"
5. **Participation**: Rejoignez un événement en cliquant sur "Participer" dans les détails de l'annonce
6. **Communication**: Utilisez le chat intégré pour discuter avec les autres participants
7. **Profil**: Gérez votre profil et consultez vos participations

## Mécanismes de fonctionnement

L'application fonctionne comme une Single Page Application (SPA):

1. Le fichier `main.js` initialise l'application et gère la navigation entre les composants
2. Chaque composant (dashboard, annonce, etc.) est responsable de son propre rendu HTML et comportement
3. Les interactions utilisateur déclenchent des requêtes AJAX vers le backend
4. Les réponses du backend sont utilisées pour mettre à jour dynamiquement l'interface

La gestion des sessions utilisateur se fait via localStorage côté client et sessions PHP côté serveur.

## Diagramme d'architecture

Voici un aperçu des connexions entre le frontend, le backend et la base de données:

```
┌───────────────────────────────────────────────────────┐
│                      FRONTEND                          │
│                                                        │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐  │
│  │ Authentif.  │   │ Annonces &  │   │ Profil &    │  │
│  │ (authForm)  │   │   Carte     │   │ Session     │  │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘  │
└─────────┼───────────────┬─┼───────────────┬─┼─────────┘
          │               │ │               │ │
          │ AJAX/Fetch    │ │               │ │
          ▼               ▼ ▼               ▼ ▼
┌─────────┼───────────────┼─┼───────────────┼─┼─────────┐
│         │               │ │   BACKEND     │ │         │
│  ┌──────┴──────┐  ┌─────┴─┴─────┐  ┌──────┴──────┐    │
│  │ auth/       │  │ annonces/   │  │ users/      │    │
│  │ login.php   │  │ get_*.php   │  │ get_*.php   │    │
│  │ register.php│  │ join_*.php  │  │             │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                 │           │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐    │
│  │ chat/       │  │ maps/       │  │ participat- │    │
│  │ get_*.php   │  │ get_events_ │  │ ions/       │    │
│  │ send_*.php  │  │ map.php     │  │ get_*.php   │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
└─────────┼───────────────┬┼─────────────┬──┼───────────┘
          │               ││             │  │
          │  Requêtes SQL ││             │  │
          ▼               ▼▼             ▼  ▼
┌─────────┼───────────────┼┼─────────────┼──┼───────────┐
│         │               ││  DATABASE   │  │           │
│  ┌──────┴──────┐  ┌─────┴┴─────┐  ┌────┴──┴─────┐     │
│  │   users     │◄─┼─────┐      │◄─┼──────┐      │     │
│  └─────────────┘  │     │      │  │      │      │     │
│                   │     ▼      │  │      ▼      │     │
│                   │ ┌──────────┴──┴┐ ┌───────────┐    │
│                   └─┤  annonces    ├─┤ messages  │    │
│                     └──────────┬───┘ └───────────┘    │
│                                │                       │
│                                ▼                       │
│                         ┌─────────────┐               │
│                         │participations│               │
│                         └─────────────┘               │
└────────────────────────────────────────────────────────┘
```

### Flux de données principaux

1. **Authentification**:
   - Frontend: `authForm.js` → Backend: `auth/login.php`, `auth/register.php` → Database: `users`

2. **Gestion des annonces**:
   - Création: Frontend: `createAnnonce.js` → Backend: `annonces/create_annonce.php` → Database: `annonces`
   - Affichage: Frontend: `listeAnnonces.js` → Backend: `annonces/get_annonces.php` → Database: `annonces`
   - Détails: Frontend: `annonceDetails.js` → Backend: `annonces/get_annonce.php` → Database: `annonces`, `participations`

3. **Carte des événements**:
   - Frontend: `sportMap.js` → Backend: `maps/get_events_map.php` → Database: `annonces`, `participations`

4. **Système de chat**:
   - Frontend: `annonceDetails.js` → Backend: `chat/get_messages.php`, `chat/send_message.php` → Database: `messages`

5. **Participations**:
   - Frontend: `annonceDetails.js` → Backend: `annonces/join_annonce.php`, `annonces/leave_annonce.php` → Database: `participations`

6. **Profils utilisateurs**:
   - Frontend: `profile.js`, `otherUserProfile.js` → Backend: `users/get_user.php`, `users/get_user_annonces.php` → Database: `users`, `annonces`

## Développement futur

- Implémentation de notifications en temps réel
- Système d'évaluation des utilisateurs
- Galerie d'images pour les événements
- Intégration de paiements pour les événements premium
- Application mobile hybride 