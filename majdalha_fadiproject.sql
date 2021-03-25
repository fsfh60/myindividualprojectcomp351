-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 23, 2021 at 11:53 PM
-- Server version: 5.7.33-log
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `majdalha_fadiproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `_options`
--

CREATE TABLE `_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `title` varchar(500) NOT NULL,
  `is_correct` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `_options`
--

INSERT INTO `_options` (`id`, `question_id`, `title`, `is_correct`) VALUES
(1, 1, 'A!', b'1'),
(2, 1, 'B!', b'0'),
(3, 1, 'C !', b'0'),
(4, 1, 'D!', b'0'),
(5, 5, 'E!!', b'0'),
(6, 5, 'F!!', b'1'),
(7, 5, 'G!!', b'0'),
(8, 5, 'H!!', b'0'),
(9, 9, 'I:::', b'0'),
(10, 9, 'J:::', b'0'),
(11, 9, 'K:::', b'1'),
(12, 9, 'L:::', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `_questions`
--

CREATE TABLE `_questions` (
  `id` int(11) NOT NULL,
  `title` varchar(500) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `_questions`
--

INSERT INTO `_questions` (`id`, `title`) VALUES
(1, 'Question One???'),
(6, 'Question Three'),
(5, 'Question Two???'),
(9, 'Question Three??');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `_options`
--
ALTER TABLE `_options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `_questions`
--
ALTER TABLE `_questions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `_options`
--
ALTER TABLE `_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `_questions`
--
ALTER TABLE `_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
