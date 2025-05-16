-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mer. 14 mai 2025 à 19:34
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sportapp_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `annonces`
--

CREATE TABLE `annonces` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titre` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `lieu` varchar(100) DEFAULT NULL,
  `adresse` varchar(255) NOT NULL DEFAULT '',
  `latitude` decimal(10,8) NOT NULL DEFAULT 0.00000000,
  `longitude` decimal(11,8) NOT NULL DEFAULT 0.00000000,
  `date_activite` date DEFAULT NULL,
  `sport` varchar(50) DEFAULT NULL,
  `places_max` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','cancelled','completed') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `annonces`
--

INSERT INTO `annonces` (`id`, `user_id`, `titre`, `description`, `lieu`, `adresse`, `latitude`, `longitude`, `date_activite`, `sport`, `places_max`, `created_at`, `status`) VALUES
(3, 4, 'cisse', 'fkljsk', 'nice', '', 0.00000000, 0.00000000, '2025-04-24', 'Basketball', 2, '2025-04-24 12:11:12', 'active'),
(4, 3, 'boating', '', 'nice', '', 0.00000000, 0.00000000, '2025-04-27', 'Surf', 9, '2025-04-24 18:40:42', 'active'),
(5, 3, 'footing sur la promenade', 'zz', 'nice', '', 0.00000000, 0.00000000, '2025-04-30', 'Course à pied', 5, '2025-04-25 08:32:46', 'active'),
(7, 3, 'footing sur la promenade', 'vgf', 'bhz', '', 0.00000000, 0.00000000, '2025-04-27', 'Basketball', 89, '2025-04-25 10:34:11', 'active'),
(8, 8, 'plage st jean', 'grosse soiree', 'st jean', '', 0.00000000, 0.00000000, '2025-05-31', 'Natation', 100, '2025-04-25 15:47:56', 'active'),
(9, 9, 'footing dimanche', 'footing', 'nice', '', 0.00000000, 0.00000000, '2025-04-30', 'Basketball', 9, '2025-04-26 15:30:00', 'active'),
(13, 17, 'Foot', 'Foot 11 contre 11 stade charles hermann', 'charles hermann', '2 Allée Philippe Seguin, Nice, France', 43.70867880, 7.26009390, '2025-05-18', 'Football', 22, '2025-05-14 13:18:05', 'active'),
(14, 3, 'plage', 'plage', 'villefranche', 'Avenue du Cap-d\'Ail, La Turbie, France', 43.73673720, 7.39673550, '2025-05-24', 'Natation', 10, '2025-05-14 16:08:24', 'active');

-- --------------------------------------------------------

--
-- Structure de la table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `annonce_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `annonce_id`, `user_id`, `message`, `created_at`) VALUES
(1, 13, 13, 'bonjour', '2025-05-14 15:36:05'),
(4, 13, 3, 'hello', '2025-05-14 16:12:11'),
(5, 13, 13, 'gello', '2025-05-14 16:30:36'),
(6, 13, 13, 'hello', '2025-05-14 17:04:01'),
(7, 13, 3, 'kefa mon pote', '2025-05-14 17:04:51'),
(8, 13, 13, 'ca dit quoi le sang', '2025-05-14 17:05:12'),
(9, 13, 3, 'trankil', '2025-05-14 17:05:20');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `annonce_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `participations`
--

CREATE TABLE `participations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `annonce_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `participations`
--

INSERT INTO `participations` (`id`, `user_id`, `annonce_id`, `created_at`) VALUES
(8, 4, 3, '2025-04-24 12:11:28'),
(9, 5, 3, '2025-04-24 12:17:47'),
(11, 3, 5, '2025-04-25 08:55:40'),
(13, 8, 5, '2025-04-25 15:46:55'),
(30, 3, 8, '2025-05-14 12:09:21'),
(32, 17, 13, '2025-05-14 13:18:12'),
(36, 13, 13, '2025-05-14 16:01:48'),
(38, 3, 13, '2025-05-14 16:11:59'),
(39, 13, 14, '2025-05-14 16:58:50');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `city` varchar(50) DEFAULT NULL,
  `city_lat` decimal(10,8) DEFAULT NULL,
  `city_lng` decimal(11,8) DEFAULT NULL,
  `sport_preference` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `city`, `city_lat`, `city_lng`, `sport_preference`, `created_at`) VALUES
(1, 'mouns66', 'moun@mouns.com', '$2y$10$BbkV0RV8cn9sYOSdSdeu0.OsJHb53YXVqqYopVau5hFV6RR9oc5h.', 'Paris', NULL, NULL, 'Foot', '2025-04-23 16:39:28'),
(2, 'mouns123', 'mouns123@mouns.com', '$2y$10$i/dqfscdWSVSGjrhIDW7nOhFg4dv3uiQGPcP.FMX9Tpp0RTB4gEbu', 'Nice', NULL, NULL, 'Footing', '2025-04-23 19:39:25'),
(3, 'hugel', 'hugel@hugel.com', '$2y$10$sIQbya5tUeXUBCFGBqGFGeuvefPi.nQLbyB17h.JktqR1F0.zKeBu', 'nice', NULL, NULL, 'Autre', '2025-04-24 05:50:11'),
(4, 'moussa', 'moussa412@gmail.com', '$2y$10$gH0gr/epEDf6OpCni68/o.l37I82IYv75A7oF/gg2ljvFHz76orsa', 'nice', NULL, NULL, 'basket', '2025-04-24 12:09:40'),
(5, 'momo', 'momo@momo.com', '$2y$10$EizLFxl5qMGAtbsLEHhhMeInLX2TM2gHJuX/uo2I7J3zQCEi0P4QS', 'nice', NULL, NULL, 'foot', '2025-04-24 12:17:32'),
(6, 'hugel@huge.com', 'hugel@huge.com', '$2y$10$9Y..AKdKMRvrPtUhHZKOUuZWBGcslZicmuYitQCiTdWLzgw26uY32', 'nice', NULL, NULL, 'Football', '2025-04-25 06:50:38'),
(7, 'ali@ali.cc', 'ali@ali.cc', '$2y$10$SHmjVXuyAnp2GMnY2jlpf.ip49yh2Wm/uAY59SZoSJ47r/OTLAdle', 'nice', NULL, NULL, 'Basketball', '2025-04-25 07:08:16'),
(8, 'hhh', 'hhh@hhh.com', '$2y$10$XFSGMkZZ/9QN65vGXSo70ujCvsXvnc.gcWIGOfOrY3rfYETBUyPT6', 'nice', NULL, NULL, 'Football', '2025-04-25 15:46:02'),
(9, 'cisse', 'cisse@cisse.com', '$2y$10$5nLVU9il96NOLDSz.j1eqexdCJAEQ3SF218Woyx0FuVR4M0f444sK', 'Nice', NULL, NULL, 'Basketball', '2025-04-26 15:28:38'),
(10, 'kkkk', 'kkk@kkk.com', '$2y$10$vfzoTfGYbmVM9fwzAmxwu.GqAuqQfAw7rz/6LFlFPr5rO/FPlm/kO', 'Nice', NULL, NULL, 'Basketball', '2025-05-06 19:47:27'),
(11, 'kkkkk', 'kkkk@kkk.com', '$2y$10$WqdIwePc567m/fcvJAaq7eVwR5nlge3cmU8B/l0C2xUDbmio4V4Se', 'Nice', NULL, NULL, 'Football', '2025-05-06 19:50:54'),
(12, 'kkkkkk', 'kkkk@kkkk.com', '$2y$10$RBjIhxQnNFYphjQKEkhh7.Q9rNxRNA4yLkHGqtFMWu5/GCyJjqJmS', 'Nice', NULL, NULL, 'Volleyball', '2025-05-06 19:53:13'),
(13, 'chico06', 'lll@lll.com', '$2y$10$aw2iYThv3MjIhErzafJZWOk63Ili3o3hwTHoecZ/GUNxNu.ObunmG', 'Nice', NULL, NULL, 'Natation', '2025-05-06 19:54:14'),
(14, 'ggg', 'ggg@ggg.com', '$2y$10$xsOblbikxYmWVuiGFH8v4ObMXxTqHCpSIloSBlfLUz/.gpCSQanKy', 'nice', NULL, NULL, 'Football', '2025-05-06 19:59:46'),
(15, 'simo', 'simo@simo.com', '$2y$10$Z5L0gWDnLkTyO6zEKugCOeenNeBrawPq0Vqo3Mpc6Vlb2Y9Ysma2O', 'nice', NULL, NULL, 'Football', '2025-05-13 20:47:46'),
(16, 'lari', 'lari@lari.com', '$2y$10$Hz04MGhoojp5UeNyci3h2e.qBQ3FUHdwO.6uTgxbj0hBYFU0OAahq', 'Nice', NULL, NULL, 'Volleyball', '2025-05-14 11:17:13'),
(17, 'gg', 'gg@gg.com', '$2y$10$ypAdJoHz81yn0Comy7zCtuSpp7Zmo36ppt7xNqOftr.v/f4DqUUzu', 'Marseille', 43.30257420, 5.36907430, 'Football', '2025-05-14 13:15:51'),
(18, 'gege', 'gege@gege.com', '$2y$10$fuhFmzGM8ZVhJTjnzofQmOB4zX2juzrqipG2hK2pPTwg0Y/FJzeHm', 'Nice', 43.71017280, 7.26195320, 'Football', '2025-05-14 13:27:33');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annonces`
--
ALTER TABLE `annonces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_coordinates` (`latitude`,`longitude`);

--
-- Index pour la table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `annonce_id` (`annonce_id`,`created_at`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `annonce_id` (`annonce_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `participations`
--
ALTER TABLE `participations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_participation` (`user_id`,`annonce_id`),
  ADD KEY `annonce_id` (`annonce_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annonces`
--
ALTER TABLE `annonces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `participations`
--
ALTER TABLE `participations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `annonces`
--
ALTER TABLE `annonces`
  ADD CONSTRAINT `annonces_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`annonce_id`) REFERENCES `annonces` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`annonce_id`) REFERENCES `annonces` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `participations`
--
ALTER TABLE `participations`
  ADD CONSTRAINT `participations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participations_ibfk_2` FOREIGN KEY (`annonce_id`) REFERENCES `annonces` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
