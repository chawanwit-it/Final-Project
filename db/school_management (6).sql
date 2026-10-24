-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2026 at 08:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `house_no` varchar(50) NOT NULL,
  `village_no` varchar(50) NOT NULL,
  `road` varchar(100) NOT NULL,
  `sub_district` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `house_no`, `village_no`, `road`, `sub_district`, `district`, `province`, `postal_code`) VALUES
(1, '222', '22', '22', 'drr', 'rrrr', 'rrrr', 'rfrfrffrfr'),
(62, '123/45', '10', 'Sukhumvit', 'Khlong Toei', 'Bangkok', 'Bangkok', '10110'),
(144, '', '', '', '', '', '', ''),
(145, '12', '3', 'ประชาอุทิศ', 'ลาดกระบัง', 'ลาดกระบัง', 'กรุงเทพมหานคร', '10520'),
(149, '123', '2', 'พระราม 1', 'บางรัก', 'บางรัก', 'กรุงเทพมหานคร', '10500'),
(150, '11111', '1111111111111111111111', '1111111111111111111111', '1111111111', '11111111111111111', '1111111111111111111', '1111111111'),
(151, '11111', '1111111111111111111111', '1111111111111111111111', '1111111111', '11111111111111111', '1111111111111111111', '1111111111'),
(152, '', '', '', '', '', '', ''),
(153, '', '', '', '', '', '', ''),
(154, '122', '212', '121', '12', '121', '121', '21'),
(155, '122', '212', '121', '12', '121', '121', '21'),
(156, '1111111111111111111', '11111111111111', '11111111111111', '11111111', '11111111111111', '111111111', '111111111'),
(157, '1111111111111111111', '11111111111111', '11111111111111', '11111111', '11111111111111', '111111111', '111111111'),
(158, '11111111111', '11111111111111111111111111', '1111111111', '111111111111111', '111111111', '1111111111111111111111111', '1111111111'),
(159, '11111111111', '11111111111111111111111111', '1111111111', '111111111111111', '111111111', '1111111111111111111111111', '1111111111'),
(160, '11111111111111111111111111', '111111111111111111111', '1111111111111111111111111', '11111111111111111', '11111111111111111111', '1111111111', '1111111111'),
(161, '11111111111111111111111111', '111111111111111111111', '1111111111111111111111111', '11111111111111111', '11111111111111111111', '1111111111', '1111111111'),
(162, '1', '1', '1', '1', '1', '1', '1'),
(163, '1', '1', '1', '1', '1', '1', '1'),
(164, '115', '2', '-', 'บ้านเดื่อ', 'เกษตรสมบูรณ์', 'ชัยภูมิ', '36120'),
(165, '115', '2', '-', 'บ้านเดื่อ', 'เกษตรสมบูรณ์', 'ชัยภูมิ', '36120'),
(166, '', '', '', '', '', '', ''),
(167, '', '', '', '', '', '', ''),
(168, '115', '2', '-', 'บ้านเดื่อ', 'เกษตรสมบูรณ์', 'ชัยภูมิ', '36120'),
(169, '115', '2', '-', 'บ้านเดื่อ', 'เกษตรสมบูรณ์', 'ชัยภูมิ', '36120'),
(170, '166', '166', '-', 'ละหาน', 'จัตุรัส', 'ชัยภูมิ', '36130'),
(171, '166', '166', '-', 'ละหาน', 'จัตุรัส', 'ชัยภูมิ', '36130'),
(172, '152/1', '8', '-', 'นาหนองทุ่ม', 'แก้งคร้อ', 'ชัยภูมิ', '36150'),
(173, '152/1', '8', '-', 'นาหนองทุ่ม', 'แก้งคร้อ', 'ชัยภูมิ', '36150'),
(174, '185', '2', 'ชัยภูมิบ้านเขว้า', 'รอบเมือง', 'เมือง', 'ชัยภูมิ', '36000'),
(175, '185', '2', 'ชัยภูมิบ้านเขว้า', 'รอบเมือง', 'เมือง', 'ชัยภูมิ', '36000'),
(176, '57', '2', '', 'บ้านโคกมั้งงอย', 'คอนสวรรค์', 'ชัยภูมิ', '36140'),
(177, '57', '2', '', 'บ้านโคกมั้งงอย', 'คอนสวรรค์', 'ชัยภูมิ', '36140');

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `reg_number` varchar(20) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `color` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `families`
--

CREATE TABLE `families` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `families`
--

INSERT INTO `families` (`id`, `student_id`, `created_at`, `updated_at`) VALUES
(54, 440, '2025-02-15 06:30:36', '2025-02-15 06:30:36'),
(55, 440, '2025-02-15 06:30:36', '2025-02-15 06:30:36'),
(56, 426, '2025-02-17 17:44:27', '2025-02-17 17:44:27'),
(57, 426, '2025-02-17 17:44:27', '2025-02-17 17:44:27'),
(58, 429, '2025-02-18 04:30:44', '2025-02-18 04:30:44'),
(59, 429, '2025-02-18 04:30:44', '2025-02-18 04:30:44'),
(60, 422, '2025-02-18 04:43:15', '2025-02-18 04:43:15'),
(61, 422, '2025-02-18 04:43:15', '2025-02-18 04:43:15'),
(62, 427, '2025-02-18 05:10:20', '2025-02-18 05:10:20'),
(63, 427, '2025-02-18 05:10:21', '2025-02-18 05:10:21'),
(64, 432, '2025-02-18 06:43:01', '2025-02-18 06:43:01'),
(65, 432, '2025-02-18 06:43:01', '2025-02-18 06:43:01');

-- --------------------------------------------------------

--
-- Table structure for table `familymembers`
--

CREATE TABLE `familymembers` (
  `id` int(11) NOT NULL,
  `family_id` int(11) NOT NULL,
  `relationship` enum('Father','Mother','Other') NOT NULL,
  `name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `job` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `address_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `familymembers`
--

INSERT INTO `familymembers` (`id`, `family_id`, `relationship`, `name`, `age`, `job`, `phone`, `salary`, `address_id`) VALUES
(269, 54, 'Father', 'สมมา', 45, 'นา', '0650934609', 450000.00, 165),
(270, 54, 'Mother', 'สมมี', 45, 'นา', '0650934609', 25000.00, 165),
(271, 54, 'Other', 'สมจิต', 58, 'ว่างงาน', '0650934609', 12000.00, 165),
(272, 56, 'Father', 'ชุมพล คงสัมพันธ์', 45, 'ชาวไร่', '0984715894', 15000.00, 168),
(273, 56, 'Mother', 'บังอร คณารัตน์', 45, 'แม่บ้าน', '0651002000', 18000.00, 168),
(274, 56, 'Other', 'ศิวพร คณารัตน์', 39, 'ค้าขาย', '0847013200', 20000.00, 168),
(275, 57, 'Father', 'ชุมพล คงสัมพันธ์', 45, 'ชาวไร่', '0984715894', 15000.00, 169),
(276, 57, 'Mother', 'บังอร คณารัตน์', 45, 'แม่บ้าน', '0651002000', 18000.00, 169),
(277, 57, 'Other', 'ศิวพร คณารัตน์', 39, 'ค้าขาย', '0847013200', 20000.00, 169),
(278, 58, 'Father', 'ดนัย', 57, 'รับจ้างทั่วไป', '0856894475', 15000.00, 171),
(279, 58, 'Mother', 'มารดา', 47, 'รับจ้างทั่วไป', '0806492579', 20000.00, 171),
(280, 59, 'Father', 'ดนัย', 57, 'รับจ้างทั่วไป', '0856894475', 15000.00, 170),
(281, 59, 'Mother', 'มารดา', 47, 'รับจ้างทั่วไป', '0806492579', 20000.00, 170),
(282, 60, 'Father', 'นายนารา', 55, 'รับจ้าง', '08645213547', 50000.00, 172),
(283, 60, 'Mother', 'นางจารี', 54, 'รับจ้าง', '-', 0.00, 172),
(284, 61, 'Father', 'นายนารา', 55, 'รับจ้าง', '08645213547', 50000.00, 173),
(285, 61, 'Mother', 'นางจารี', 54, 'รับจ้าง', '-', 0.00, 173),
(286, 62, 'Father', 'สมชาย', 44, 'ครู', '0123456789', 18000.00, 174),
(287, 62, 'Mother', 'สมหญิง', 44, 'ครู', '0123456789', 170000.00, 174),
(288, 62, 'Other', 'สมศรี', 23, 'นอนเล่น', '', 0.00, 174),
(289, 63, 'Father', 'สมชาย', 44, 'ครู', '0123456789', 18000.00, 175),
(290, 63, 'Mother', 'สมหญิง', 44, 'ครู', '0123456789', 170000.00, 175),
(291, 63, 'Other', 'สมศรี', 23, 'นอนเล่น', '', 0.00, 175);

-- --------------------------------------------------------

--
-- Table structure for table `home_visits`
--

CREATE TABLE `home_visits` (
  `id` int(11) NOT NULL,
  `visit_id` varchar(255) NOT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `student_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `visit_date` date NOT NULL,
  `environment_condition` text DEFAULT NULL,
  `student_behavior` text DEFAULT NULL,
  `family_finance` text DEFAULT NULL,
  `scholarship_need` text DEFAULT NULL,
  `positive_behavior` text DEFAULT NULL,
  `problem_solving` text DEFAULT NULL,
  `parent_feedback` text DEFAULT NULL,
  `suggestion` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `visit_status` varchar(20) DEFAULT 'ยังไม่เยี่ยม',
  `improvement_behavior` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `home_visits`
--

INSERT INTO `home_visits` (`id`, `visit_id`, `semester_id`, `student_id`, `teacher_id`, `visit_date`, `environment_condition`, `student_behavior`, `family_finance`, `scholarship_need`, `positive_behavior`, `problem_solving`, `parent_feedback`, `suggestion`, `image`, `created_at`, `updated_at`, `visit_status`, `improvement_behavior`) VALUES
(205, 'visit_1739863417920_650', 9, 432, 18, '2025-02-18', 'พอใช้', 'ช่วยงานผู้ปกครอง,อ่านหนังสือทำการบ้าน', 'เพียงพอ', 'ไม่ต้องการ', 'ดี', 'งดเหล้าเข้าพรรษา', 'ลูกชั้นเป็นคนดีย์', 'นักเรียนคนนี้เรียนดีมาตรงเวลาทุกวันเสาร์', 'myFiles-1739864658258-424322974.jpg, myFiles-1739864658260-748749579.jpg, myFiles-1739864658264-91785642.jpg', '2025-02-18 07:23:37', '2025-02-18 07:45:17', 'เยี่ยมบ้านแล้ว', 'งดเหล้า'),
(206, 'visit_1739866621453_295', 9, 429, 18, '2025-02-18', 'ดี', 'อ่านหนังสือทำการบ้าน,ช่วยงานผู้ปกครอง,ทำงานบ้าน', 'เพียงพอ', 'ไม่ต้องการ', 'ดีดี', 'ไม่มีปัษหา', 'ไม่มี', 'ไม่มี', 'myFiles-1739866724850-453387440.jpg, myFiles-1739866724857-901381139.webp, myFiles-1739866724861-914151129.jpg', '2025-02-18 08:17:01', '2025-02-18 08:19:25', 'เยี่ยมบ้านแล้ว', 'ไม่มี'),
(207, 'visit_1739939855066_981', 9, 415, 18, '2025-02-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-19 04:37:35', '2025-02-19 04:37:35', 'ยังไม่เยี่ยม', NULL),
(208, 'visit_1739939916455_768', 9, 422, 18, '2025-02-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-19 04:38:36', '2025-02-19 04:38:39', 'เยี่ยมบ้านแล้ว', NULL),
(209, 'visit_1739940936916_442', 9, 437, 18, '2025-02-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-19 04:55:36', '2025-02-19 04:55:36', 'ยังไม่เยี่ยม', NULL),
(210, 'visit_1739940968501_461', 9, 429, 18, '2025-02-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-19 04:56:08', '2025-02-19 04:56:38', 'เยี่ยมบ้านแล้ว', NULL),
(212, 'visit_1792144997517_175', 9, 426, 18, '2026-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-10-16 10:03:17', '2026-10-16 10:06:08', 'เยี่ยมบ้านแล้ว', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `motorcycles`
--

CREATE TABLE `motorcycles` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `reg_number` varchar(20) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `color` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `motorcycles`
--

INSERT INTO `motorcycles` (`id`, `student_id`, `reg_number`, `brand`, `model`, `color`) VALUES
(58, 426, '123 กพ กรุงเทพมหานคร', 'ฮอนด้า', 'wawe', 'red'),
(60, 429, '1130', '-', '-', '-'),
(62, 422, '-', '-', '-', '-');

-- --------------------------------------------------------

--
-- Table structure for table `offices`
--

CREATE TABLE `offices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `office_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offices`
--

INSERT INTO `offices` (`id`, `user_id`, `office_name`, `phone`, `email`, `address_id`, `created_at`, `updated_at`) VALUES
(15, 150, 'นาย วิทยา เล็กน้อย', '0650934609', 'office@gmail.com', 1, '2025-02-10 10:41:12', '2025-02-11 01:57:28');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `report_title` varchar(100) NOT NULL,
  `report_content` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Office'),
(4, 'Student'),
(3, 'Teacher');

-- --------------------------------------------------------

--
-- Table structure for table `semesters`
--

CREATE TABLE `semesters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `semesters`
--

INSERT INTO `semesters` (`id`, `name`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(9, 'ภาคเรียนที่ 1 ปีการศึกษา 2567', '2024-02-10', '2025-02-15', '2025-02-09 18:07:55', '2025-02-09 18:07:55');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `nick_name` varchar(50) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `citizen_id` varchar(13) NOT NULL,
  `birth_date` date NOT NULL,
  `age` int(11) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address_id` int(11) NOT NULL DEFAULT 1,
  `advisor_id` int(11) DEFAULT NULL,
  `education_level` varchar(50) NOT NULL,
  `plan` varchar(50) NOT NULL,
  `major` varchar(50) NOT NULL,
  `department` varchar(100) NOT NULL,
  `room` varchar(10) NOT NULL,
  `img` varchar(255) NOT NULL,
  `previous_school` varchar(100) NOT NULL,
  `previous_school_district` varchar(50) NOT NULL,
  `previous_school_province` varchar(50) NOT NULL,
  `family_status` varchar(50) NOT NULL,
  `other_family_status` varchar(100) DEFAULT NULL,
  `total_siblings` int(11) NOT NULL,
  `child_order` varchar(20) NOT NULL,
  `current_living_with` varchar(50) NOT NULL,
  `other_living_with` varchar(100) DEFAULT NULL,
  `current_residence` varchar(50) NOT NULL,
  `dorm_name` varchar(100) DEFAULT NULL,
  `dorm_address` varchar(255) DEFAULT NULL,
  `other_residence` varchar(100) DEFAULT NULL,
  `blood_type` varchar(3) DEFAULT NULL,
  `has_chronic_disease` tinyint(1) NOT NULL,
  `chronic_disease` varchar(255) DEFAULT NULL,
  `treatment_hospital` varchar(100) DEFAULT NULL,
  `treatment_district` varchar(50) DEFAULT NULL,
  `treatment_province` varchar(50) DEFAULT NULL,
  `travel_distance` int(11) NOT NULL,
  `travel_time` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_completed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `full_name`, `nick_name`, `student_id`, `citizen_id`, `birth_date`, `age`, `phone`, `address_id`, `advisor_id`, `education_level`, `plan`, `major`, `department`, `room`, `img`, `previous_school`, `previous_school_district`, `previous_school_province`, `family_status`, `other_family_status`, `total_siblings`, `child_order`, `current_living_with`, `other_living_with`, `current_residence`, `dorm_name`, `dorm_address`, `other_residence`, `blood_type`, `has_chronic_disease`, `chronic_disease`, `treatment_hospital`, `treatment_district`, `treatment_province`, `travel_distance`, `travel_time`, `created_at`, `updated_at`, `is_completed`) VALUES
(414, 759, 'นายนพรัตน์ อินมีมี', '', '66309010001', '1730601273356', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', 'uploads\\avatar-1792144366104-608809038.png', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2026-10-16 09:52:46', 0),
(415, 760, 'นางสาวสิริวิมลน์ สุทธิสาย', '', '66309010002', '1369900712396', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E1', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(416, 761, 'นายชูศักดิ์ ขาวผิว', '', '66309010006', '1103703798502', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E1', 'uploads\\avatar-1792145514942-179926679.png', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2026-10-16 10:11:54', 0),
(417, 762, 'นายวริศ ภิญโยดม', '', '66309010007', '1369900706167', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E1', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(418, 763, 'นายจักรกฤษณ์ แก้วบ้านดู่', '', '66309010008', '1369900699837', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E1', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(419, 764, 'นายรัฐภูมิ ชูทิพย์', '', '66309010011', '1118700070014', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E1', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(420, 765, 'นายกฤษฎา อุดมพร', '', '66309010012', '1369900672599', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E1', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(421, 766, 'นายพิเชษฐ์ชัย บุญทอง', '', '66309010034', '1369900595292', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E1', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(422, 767, 'นางสาวฟ้าใส ทรงพระ', '', '66309010015', '1368100031652', '2005-03-04', 13, '068515423', 173, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', 'โรงเรียนแก้งคร้อวิทยา', 'แก้งคร้อ', 'ชัยภูมิ', '', NULL, 0, '', 'บิดา/มารดา', '', 'เช่าหอพัก', 'นานา', '-', '', 'B', 0, '', '-', '-', '-', 0, '5', '2025-02-15 06:25:24', '2025-02-18 04:43:15', 0),
(423, 768, 'นางสาวณฤดี เกื้อกุลวงษ์', '', '66309010016', '1368400041220', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(425, 770, 'นายธนัท มิตรสันเทียะ', '', '66309010019', '1369900683078', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(426, 771, 'นายชวัลวิชญ์ คงสัมพันธ์', 'มาร์ค', '66309010020', '1369200034620', '2004-11-25', 21, '0650934609', 169, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', 'uploads\\avatar-1739819758915-367773129.jpg', 'น.ว', 'หนองบัวแดง', 'ชัยภูมิ', '', NULL, 0, '', 'อื่นๆ', 'น้า ', 'เช่าหอพัก', 'หอ เทคนิคค', '120/2', '', 'A', 0, '', 'รพ.หนองบัวแดง', 'หนองบัวแดง', 'ชัยภูมิ', 5, '10 นาที', '2025-02-15 06:25:24', '2025-02-17 19:15:58', 0),
(427, 772, 'นายธนาธิป เศรษฐฉัตรกุล', 'เจมส์', '66309010021', '1409903393169', '2005-04-26', 19, '0903327470', 175, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', 'สตรีชัยภูมิ', 'เมือง', 'ชัยภูมิ', '', NULL, 0, '', 'อื่นๆ', 'ป้า ', '', '', '', '', '', 0, '', '', '', '', 0, '', '2025-02-15 06:25:24', '2025-02-18 05:10:20', 0),
(428, 773, 'นางสาวปัทมาภรณ์ งามเนตร', '', '66309010022', '1329901291882', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(429, 774, 'นางสาวภัสรี เรืองรุ่งโรจน์', 'คิม', '66309010023', '1102003632813', '2004-10-30', 20, '0804854781', 170, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', 'โรงเรียนสตรีชัยภูมิ', 'เมือง', 'ชัยภูมิ', '', NULL, 0, '', 'บิดา/มารดา', '', 'อยู่กับผู้ปกครอง (ข้อ 2)', '', '', '', 'O', 0, '', '', '', '', 20, '20', '2025-02-15 06:25:24', '2025-02-18 04:30:44', 0),
(430, 775, 'นางสาววิภาวานี ยอดแสง', '', '66309010024', '1369900675288', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(431, 776, 'นายภานุเดช เคนชมภู', '', '66309010025', '1369900471984', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(432, 777, 'นายณัฐพล ทรัพย์พงษ์', 'เอิร์ธ', '66309010026', '1369900685453', '2547-09-13', 20, '0980192760', 177, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', '', '', '', '', '', '', 0, '', '', '', '', 0, '', '2025-02-15 06:25:24', '2025-02-18 06:43:01', 0),
(433, 778, 'นายเมธี โยธะศรี', '', '66309010028', '1369900649031', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(434, 779, 'นายนิธิกุล คิดสุขุม', '', '66309010029', '1369900702731', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(435, 780, 'นายณัฐวุฒิ เมืองโคตร', '', '66309010030', '1279900244610', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(436, 781, 'นายวิทยา เพ็งแจ่ม', '', '66309010031', '1368100028431', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(437, 782, 'นายตะวัน บุญหว่าน', '', '66309010032', '1104300788526', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(438, 783, 'นายฉัตรพล แทนรินทร์', '', '66309010036', '1679900616122', '0000-00-00', 0, '', 1, NULL, 'ปวส.2', 'ปกติ', 'นักพัฒนาซอฟต์แวร์คอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ ', 'E5', '', '', '', '', '', NULL, 0, '', '', NULL, '', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, '', '2025-02-15 06:25:24', '2025-02-15 06:25:24', 0),
(440, 785, 'สมดี', '', '6630901000', '1369200003462', '0000-00-00', 0, '', 167, NULL, 'ปวส2', 'ปกติ', 'อุตสาหกรรม', 'it', 'E1', 'uploads\\avatar-1739819055325-414653446.jpg', '', '', '', '', NULL, 0, '', '', '', '', '', '', '', '', 0, '', '', '', '', 0, '', '2025-02-15 06:25:52', '2025-02-17 19:04:15', 0);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `advisor` varchar(20) DEFAULT NULL,
  `department` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `user_id`, `full_name`, `advisor`, `department`, `phone`, `email`, `address_id`, `created_at`, `updated_at`) VALUES
(18, 104, 'ครู อลงกรณ์ ภูคงคา', 'E5,E1', '', '', '', 1, '2025-02-04 11:32:29', '2025-02-09 17:39:06');

-- --------------------------------------------------------

--
-- Table structure for table `transportations`
--

CREATE TABLE `transportations` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `mode` enum('Bus','Shuttle','Bicycle','Walking','Other') NOT NULL,
  `description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transportations`
--

INSERT INTO `transportations` (`id`, `student_id`, `mode`, `description`) VALUES
(196, 426, '', ''),
(198, 429, '', ''),
(201, 422, 'Bus', ''),
(202, 422, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role_id`, `created_at`, `updated_at`) VALUES
(103, 'admin', '1234', 'admin@gmail.com', 1, '2025-02-04 11:30:44', '2025-02-10 10:20:29'),
(104, 'teacher', '$2b$10$w1ZmFktRR9Kf5pOvqzdL8OaTmQyjPXVcuQC64OpQjeIMyk8rHM45S', 'student@gmail.com', 3, '2025-02-04 11:32:29', '2025-02-04 11:33:25'),
(150, 'office', '$2b$10$EHyPrBwjRIkQdhio/exRMOhrQuuMEMKIVtlCypqQZIaEv48.vpaBa', 'office@gmail.com', 2, '2025-02-10 10:41:12', '2025-02-10 10:41:12'),
(759, '66309010001', '1730601273356', '66309010001', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(760, '66309010002', '1369900712396', '66309010002', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(761, '66309010006', '1103703798502', '66309010006', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(762, '66309010007', '1369900706167', '66309010007', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(763, '66309010008', '1369900699837', '66309010008', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(764, '66309010011', '1118700070014', '66309010011', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(765, '66309010012', '1369900672599', '66309010012', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(766, '66309010034', '1369900595292', '66309010034', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(767, '66309010015', '1368100031652', '66309010015', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(768, '66309010016', '1368400041220', '66309010016', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(770, '66309010019', '1369900683078', '66309010019', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(771, '66309010020', '1369200034620', '66309010020', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(772, '66309010021', '1409903393169', '66309010021', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(773, '66309010022', '1329901291882', '66309010022', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(774, '66309010023', '1102003632813', '66309010023', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(775, '66309010024', '1369900675288', '66309010024', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(776, '66309010025', '1369900471984', '66309010025', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(777, '66309010026', '1369900685453', '66309010026', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(778, '66309010028', '1369900649031', '66309010028', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(779, '66309010029', '1369900702731', '66309010029', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(780, '66309010030', '1279900244610', '66309010030', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(781, '66309010031', '1368100028431', '66309010031', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(782, '66309010032', '1104300788526', '66309010032', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(783, '66309010036', '1679900616122', '66309010036', 4, '2025-02-15 06:25:24', '2025-02-15 06:25:24'),
(785, 'student', '$2b$10$sESxX3wPTaG40iiBIilCA.ZNBEQT3K3Y3wC/o8zkBN9P84LBiAxYi', 'student', 4, '2025-02-15 06:25:52', '2025-02-15 06:25:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reg_number` (`reg_number`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `families`
--
ALTER TABLE `families`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `familymembers`
--
ALTER TABLE `familymembers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `family_id` (`family_id`),
  ADD KEY `address_id` (`address_id`);

--
-- Indexes for table `home_visits`
--
ALTER TABLE `home_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `fk_home_visits_semester` (`semester_id`);

--
-- Indexes for table `motorcycles`
--
ALTER TABLE `motorcycles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reg_number` (`reg_number`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `offices`
--
ALTER TABLE `offices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `semesters`
--
ALTER TABLE `semesters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_students_advisor` (`advisor_id`),
  ADD KEY `fk_students_address` (`address_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`);

--
-- Indexes for table `transportations`
--
ALTER TABLE `transportations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=178;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `families`
--
ALTER TABLE `families`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `familymembers`
--
ALTER TABLE `familymembers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=292;

--
-- AUTO_INCREMENT for table `home_visits`
--
ALTER TABLE `home_visits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

--
-- AUTO_INCREMENT for table `motorcycles`
--
ALTER TABLE `motorcycles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `offices`
--
ALTER TABLE `offices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `semesters`
--
ALTER TABLE `semesters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=441;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `transportations`
--
ALTER TABLE `transportations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=789;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `families`
--
ALTER TABLE `families`
  ADD CONSTRAINT `families_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `familymembers`
--
ALTER TABLE `familymembers`
  ADD CONSTRAINT `familymembers_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `familymembers_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `home_visits`
--
ALTER TABLE `home_visits`
  ADD CONSTRAINT `fk_home_visits_semester` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `home_visits_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `home_visits_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`);

--
-- Constraints for table `motorcycles`
--
ALTER TABLE `motorcycles`
  ADD CONSTRAINT `motorcycles_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `offices`
--
ALTER TABLE `offices`
  ADD CONSTRAINT `offices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `offices_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_students_advisor` FOREIGN KEY (`advisor_id`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teachers_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `transportations`
--
ALTER TABLE `transportations`
  ADD CONSTRAINT `transportations_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
