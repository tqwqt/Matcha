-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 24, 2018 at 09:27 AM
-- Server version: 5.7.22
-- PHP Version: 7.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matchaprod`
--
DROP DATABASE IF EXISTS `matchaprod`;
CREATE DATABASE IF NOT EXISTS `matchaprod` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `matchaprod`;

-- --------------------------------------------------------

--
-- Table structure for table `black_list`
--

CREATE TABLE `black_list` (
  `who_id` int(11) NOT NULL,
  `whom_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `black_list`
--

INSERT INTO `black_list` (`who_id`, `whom_id`) VALUES
(0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `text` char(255) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_seen` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `who_id` int(11) NOT NULL,
  `whom_id` int(11) NOT NULL,
  `type` char(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_seen` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`who_id`, `whom_id`, `type`, `time`, `is_seen`) VALUES
(38, 40, 'visited', '2018-11-24 17:26:01', 0);

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE `photo` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `url` char(255) DEFAULT NULL,
  `is_avatar` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`id`, `user_id`, `url`, `is_avatar`) VALUES
(19, 38, '../../userInfo/photos/avatar-1542731642677.png', 0),
(20, 39, '../../userInfo/photos/avatar-1542731869548.png', 1),
(21, 38, '../../userInfo/photos/photo-1542798235589.png', 1),
(22, 38, '../../userInfo/photos/photo-1542798241777.png', 0),
(23, 38, '../../userInfo/photos/photo-1542798266209.png', 0),
(24, 40, '../../userInfo/photos/avatar-1542798499637.png', 1),
(25, 41, '../../userInfo/photos/avatar-1542799499232.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `who_id` int(11) NOT NULL,
  `whom_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tag` char(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `user_id`, `tag`) VALUES
(890, 39, 'Programming'),
(893, 40, 'Programming'),
(894, 41, 'Programming'),
(895, 38, 'Programming');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `login` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` char(18) NOT NULL DEFAULT 'unverified',
  `email` char(100) NOT NULL,
  `sex` set('male','female') DEFAULT NULL,
  `orientation` set('gay','straight','bisexual') DEFAULT NULL,
  `rate` int(3) NOT NULL DEFAULT '0',
  `location` point DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `bday` date DEFAULT NULL,
  `last_seen` timestamp NULL DEFAULT NULL,
  `restore_token` char(25) DEFAULT NULL,
  `is_online` tinyint(1) NOT NULL DEFAULT '0',
  `has_access` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `lastName`, `login`, `password`, `token`, `email`, `sex`, `orientation`, `rate`, `location`, `bio`, `bday`, `last_seen`, `restore_token`, `is_online`, `has_access`) VALUES
(38, 'Yevgeniy', 'Marchyshyn', 'ymarchys', '$2b$10$P2mLhrxupZOvxMOWTUaqde0JarqE79Nmq6EjQOnwOm9VdQzDkPUxS', 'verified', 'y.marchyshyn@gmail.com', 'male', 'straight', 0, '\0\0\0\0\0\0\0M»ûõ;I@IqD­s>@', 'Hello World', '1997-01-04', '2018-11-24 17:26:01', NULL, 1, 1),
(39, 'Vlad', 'Havrylenko', 'vhavryle', '$2b$10$GPkw6QrXY5WIS0qFC74fWulhmC29wTmOeqHNz1R76e7K5p1oRhnN.', 'verified', 'y.m.archyshyn@gmail.com', 'male', 'straight', 0, '\0\0\0\0\0\0\0M»ûõ;I@IqD­s>@', 'Hello World', '1995-07-08', '2018-11-24 17:20:38', NULL, 0, 1),
(40, 'Donna', 'Reed', 'donna_reed', '$2b$10$eF4CyLk6UQCZ1180nADSZu1FfE2o0kasq6jrcJCWwnuj6G07QuVRy', 'verified', 'y.m.a.r.chyshyn@gmail.com', 'female', 'straight', 1, '\0\0\0\0\0\0\0M»ûõ;I@IqD­s>@', NULL, '1990-01-27', '2018-11-24 17:21:41', NULL, 0, 1),
(41, 'Katharine', 'Hepburn', 'katharine_hepburn', '$2b$10$NvrOHWGL.axFag9DZjYa0uSubY81Ch5cPdx9XP43XSny6GR2YgVE.', 'verified', 'ymarc.hyshyn@gmail.com', 'female', 'straight', 0, '\0\0\0\0\0\0\0M»ûõ;I@IqD­s>@', NULL, '1990-05-12', '2018-11-24 17:22:13', NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_visits`
--

CREATE TABLE `user_visits` (
  `who_id` int(11) NOT NULL,
  `whom_id` int(11) NOT NULL,
  `is_like` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_visits`
--

INSERT INTO `user_visits` (`who_id`, `whom_id`, `is_like`) VALUES
(38, 40, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`,`user1_id`,`user2_id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id` (`chat_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`who_id`,`whom_id`,`type`);

--
-- Indexes for table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`who_id`,`whom_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- Indexes for table `user_visits`
--
ALTER TABLE `user_visits`
  ADD PRIMARY KEY (`who_id`,`whom_id`),
  ADD KEY `who_id` (`who_id`),
  ADD KEY `whom_id` (`whom_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=896;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`),
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `photo`
--
ALTER TABLE `photo`
  ADD CONSTRAINT `photo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_visits`
--
ALTER TABLE `user_visits`
  ADD CONSTRAINT `user_visits_ibfk_1` FOREIGN KEY (`who_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_visits_ibfk_2` FOREIGN KEY (`whom_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
