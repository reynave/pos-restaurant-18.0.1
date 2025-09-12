-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.28-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table pos_resto.adjust_items
CREATE TABLE IF NOT EXISTS `adjust_items` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `createDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.adjust_items: ~89 rows (approximately)
INSERT INTO `adjust_items` (`id`, `createDate`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	('A0030', '2025-01-01 00:00:00', 1, '2025-06-04 12:47:59', 1, '2025-06-25 16:37:29', 1),
	('A0031', '2025-01-01 00:00:00', 1, '2025-06-13 18:13:29', 1, '2025-06-13 18:18:13', 1),
	('A0032', '2025-01-01 00:00:00', 1, '2025-06-13 18:13:29', 1, '2025-06-13 18:18:13', 1),
	('A0033', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0034', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-25 16:36:53', 1),
	('A0035', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-25 16:36:53', 1),
	('A0036', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-25 16:36:53', 1),
	('A0037', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0038', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0039', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0040', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0041', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0042', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0043', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0044', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0045', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0046', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-13 18:18:13', 1),
	('A0047', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:13', 1, '2025-06-18 16:08:47', 1),
	('A0048', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-07-02 11:16:34', 1),
	('A0049', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0050', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0051', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0052', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0053', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0054', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0055', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0056', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0057', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0058', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0059', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0060', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0061', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0062', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0063', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0064', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0065', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-25 16:37:29', 1),
	('A0066', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0067', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0068', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0069', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0070', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0071', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0072', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0073', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0074', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0075', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0076', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0077', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0078', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0079', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0080', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0081', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0082', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0083', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0084', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0085', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0086', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0087', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0088', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0089', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0090', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0091', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0092', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0093', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0094', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0095', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0096', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0097', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0098', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0099', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0100', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0101', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0102', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-24 15:55:19', 1),
	('A0103', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0104', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0105', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0106', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0107', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0108', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0109', '2025-01-01 00:00:00', 1, '2025-06-13 18:18:14', 1, '2025-06-13 18:18:14', 1),
	('A0110', '2025-01-01 00:00:00', 1, '2025-07-02 11:21:06', 1, '2025-07-02 11:21:06', 1),
	('A0111', '2025-01-01 00:00:00', 1, '2025-07-02 11:21:14', 1, '2025-07-02 11:21:14', 1),
	('A0112', '2025-01-01 00:00:00', 1, '2025-07-02 12:02:52', 1, '2025-07-02 12:02:52', 1),
	('A0113', '2025-01-01 00:00:00', 1, '2025-07-02 12:30:31', 1, '2025-07-02 12:30:31', 1),
	('A0114', '2025-01-01 00:00:00', 1, '2025-07-02 12:30:31', 1, '2025-07-02 12:30:31', 1),
	('A0115', '2025-01-01 00:00:00', 1, '2025-07-02 16:10:32', 1, '2025-07-02 16:10:32', 1),
	('A0116', '2025-01-01 00:00:00', 1, '2025-07-02 16:10:32', 1, '2025-07-02 16:10:32', 1),
	('A0117', '2025-01-01 00:00:00', 1, '2025-07-02 16:10:50', 1, '2025-07-02 16:10:50', 1),
	('A0118', '2025-01-01 00:00:00', 1, '2025-07-02 16:10:51', 1, '2025-07-02 16:10:51', 1),
	('A0119', '2025-01-01 00:00:00', 1, '2025-07-04 11:54:15', 1, '2025-07-04 11:54:15', 1),
	('A0120', '2025-01-01 00:00:00', 1, '2025-07-04 12:20:22', 1, '2025-07-04 12:20:22', 1),
	('A0121', '2025-01-01 00:00:00', 1, '2025-07-09 13:59:58', 1, '2025-07-09 13:59:58', 1),
	('A0122', '2025-01-01 00:00:00', 1, '2025-07-09 13:59:58', 1, '2025-07-09 13:59:58', 1),
	('A0123', '2025-01-01 00:00:00', 1, '2025-07-09 13:59:58', 1, '2025-07-09 13:59:58', 1),
	('A0124', '2025-01-01 00:00:00', 1, '2025-07-09 14:01:36', 1, '2025-07-09 14:01:36', 1),
	('A0125', '2025-01-01 00:00:00', 1, '2025-07-09 14:01:36', 1, '2025-07-09 14:01:36', 1),
	('A0126', '2025-01-01 00:00:00', 1, '2025-07-18 16:08:13', 1, '2025-07-18 16:08:13', 1),
	('A0127', '2025-01-01 00:00:00', 1, '2025-07-18 16:08:13', 1, '2025-07-18 16:08:13', 1),
	('A0128', '2025-01-01 00:00:00', 1, '2025-07-18 16:08:13', 1, '2025-07-18 16:08:13', 1),
	('A0129', '2025-01-01 00:00:00', 1, '2025-07-18 16:08:46', 1, '2025-07-18 16:08:46', 1),
	('A0130', '2025-01-01 00:00:00', 1, '2025-07-28 16:21:11', 1, '2025-07-28 16:21:11', 1),
	('A0131', '2025-01-01 00:00:00', 1, '2025-07-28 17:28:42', 1, '2025-07-28 17:28:42', 1);

-- Dumping structure for table pos_resto.auto_number
CREATE TABLE IF NOT EXISTS `auto_number` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `prefix` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `digit` int(11) NOT NULL DEFAULT 6,
  `runningNumber` int(11) NOT NULL DEFAULT 0,
  `lastRecord` varchar(50) DEFAULT NULL,
  `updateDate` datetime DEFAULT '2024-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=323 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pos_resto.auto_number: ~5 rows (approximately)
INSERT INTO `auto_number` (`id`, `name`, `prefix`, `digit`, `runningNumber`, `lastRecord`, `updateDate`) VALUES
	(1, 'cart', 'yymmdd', 6, 427, '250912000427', '2025-09-12 17:23:40'),
	(2, 'order', NULL, 6, 92, '000092', '2025-09-12 17:38:43'),
	(320, 'sendOrder', 'SO', 6, 588, 'SO000588', '2025-09-12 17:38:20'),
	(321, 'dailyCheck', NULL, 6, 52, '000052', '2025-09-12 12:25:01'),
	(322, 'adjustItems', 'A', 4, 131, 'A0131', '2025-07-28 17:28:42');

-- Dumping structure for table pos_resto.bill
CREATE TABLE IF NOT EXISTS `bill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) NOT NULL DEFAULT '0',
  `no` tinyint(4) NOT NULL DEFAULT 1,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pos_resto.bill: ~0 rows (approximately)

-- Dumping structure for table pos_resto.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `billNo` tinyint(4) NOT NULL DEFAULT 0,
  `dailyCheckId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `sendOrder` tinyint(4) NOT NULL DEFAULT 0,
  `outletId` int(11) NOT NULL DEFAULT 0,
  `outletTableMapId` int(11) NOT NULL DEFAULT 0,
  `lockBy` varchar(10) NOT NULL DEFAULT '',
  `cover` int(11) NOT NULL DEFAULT 0,
  `tableMapStatusId` int(11) NOT NULL DEFAULT 0,
  `close` tinyint(4) NOT NULL DEFAULT 0,
  `totalItem` tinyint(4) NOT NULL DEFAULT 0,
  `totalAmount` int(11) NOT NULL DEFAULT 0,
  `totalTips` int(11) NOT NULL DEFAULT 0,
  `changePayment` int(11) NOT NULL DEFAULT 0,
  `tips` int(11) NOT NULL DEFAULT 0,
  `grandTotal` int(11) NOT NULL DEFAULT 0,
  `startDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `endDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `overDue` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `void` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.cart: ~3 rows (approximately)
INSERT INTO `cart` (`id`, `billNo`, `dailyCheckId`, `sendOrder`, `outletId`, `outletTableMapId`, `lockBy`, `cover`, `tableMapStatusId`, `close`, `totalItem`, `totalAmount`, `totalTips`, `changePayment`, `tips`, `grandTotal`, `startDate`, `endDate`, `overDue`, `void`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	('000091', 0, '000052', 0, 15, 4, '', 4, 42, 1, 0, 0, 0, 0, 0, 0, '2025-09-12 17:38:31', '2025-09-12 17:38:40', '2025-09-12 19:38:31', 1, 1, '2025-09-12 17:38:31', 76, '2025-09-12 17:38:40', 76),
	('000092', 0, '000052', 0, 15, 4, '', 4, 42, 1, 0, 0, 0, 0, 0, 0, '2025-09-12 17:38:43', '2025-09-12 17:42:57', '2025-09-12 19:38:43', 1, 1, '2025-09-12 17:38:43', 76, '2025-09-12 17:42:57', 76),
	('250912000427', 0, '000052', 1, 15, 15, '0005', 4, 12, 0, 0, 0, 0, 0, 0, 0, '2025-09-12 17:22:46', '2025-09-12 17:22:46', '2025-09-12 19:22:46', 0, 1, '2025-09-12 17:22:46', 76, '2025-09-12 17:43:06', 76);

-- Dumping structure for table pos_resto.cart_copy_bill
CREATE TABLE IF NOT EXISTS `cart_copy_bill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) NOT NULL DEFAULT '0',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.cart_copy_bill: ~4 rows (approximately)
INSERT INTO `cart_copy_bill` (`id`, `cartId`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(23, '250715000207', 1, '2025-07-18 14:47:10', 0, '2025-01-01 00:00:00', 1),
	(24, '250820000318', 1, '2025-08-21 13:52:29', 0, '2025-01-01 00:00:00', 1),
	(25, '250826000337', 1, '2025-08-26 17:33:41', 0, '2025-01-01 00:00:00', 1),
	(26, '250826000337', 1, '2025-08-26 17:38:38', 0, '2025-01-01 00:00:00', 1);

-- Dumping structure for table pos_resto.cart_item
CREATE TABLE IF NOT EXISTS `cart_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `subgroup` smallint(6) NOT NULL DEFAULT 1,
  `qty` smallint(6) NOT NULL DEFAULT 1,
  `menuId` int(11) NOT NULL DEFAULT 0,
  `adjustItemsId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `ta` tinyint(4) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  `closedPrice` int(11) NOT NULL DEFAULT 0,
  `sendOrder` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `void` tinyint(4) NOT NULL DEFAULT 0,
  `menuCategoryId` int(11) NOT NULL DEFAULT 0,
  `menuDepartmentId` int(11) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.cart_item: ~2 rows (approximately)
INSERT INTO `cart_item` (`id`, `cartId`, `subgroup`, `qty`, `menuId`, `adjustItemsId`, `ta`, `price`, `closedPrice`, `sendOrder`, `void`, `menuCategoryId`, `menuDepartmentId`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, '250912000427', 1, 3, 25, '3', 0, 20000, 0, 'SO000587', 0, 5, 1, 1, '2025-09-12 17:22:48', 76, '2025-09-12 17:23:40', 76),
	(2, '250912000427', 1, 1, 24, 'A0120', 0, 30000, 0, 'SO000587', 0, 5, 1, 1, '2025-09-12 17:22:49', 76, '2025-09-12 17:23:40', 76);

-- Dumping structure for table pos_resto.cart_item_modifier
CREATE TABLE IF NOT EXISTS `cart_item_modifier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menuSetMenuId` int(11) NOT NULL DEFAULT 0,
  `menuSetQty` tinyint(4) NOT NULL DEFAULT 0,
  `menuSetAdjustItemsId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cartItemId` int(11) NOT NULL DEFAULT 0,
  `modifierId` tinyint(4) NOT NULL DEFAULT 0,
  `applyDiscount` tinyint(4) NOT NULL DEFAULT 0,
  `menuTaxScId` tinyint(4) NOT NULL DEFAULT 0,
  `scRate` tinyint(4) NOT NULL DEFAULT 0,
  `scTaxInclude` tinyint(4) NOT NULL DEFAULT 0,
  `scStatus` tinyint(4) NOT NULL DEFAULT 0,
  `taxRate` tinyint(4) NOT NULL DEFAULT 0,
  `taxStatus` tinyint(4) NOT NULL DEFAULT 0,
  `note` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `remark` varchar(250) NOT NULL DEFAULT '',
  `price` int(11) NOT NULL DEFAULT 0,
  `priceIncluded` int(11) NOT NULL DEFAULT 0,
  `sendOrder` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `void` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.cart_item_modifier: ~9 rows (approximately)
INSERT INTO `cart_item_modifier` (`id`, `menuSetMenuId`, `menuSetQty`, `menuSetAdjustItemsId`, `cartId`, `cartItemId`, `modifierId`, `applyDiscount`, `menuTaxScId`, `scRate`, `scTaxInclude`, `scStatus`, `taxRate`, `taxStatus`, `note`, `remark`, `price`, `priceIncluded`, `sendOrder`, `void`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 0, 0, '', '250912000427', 1, 0, 0, 1, 5, 0, 1, 0, 0, '', '', 1000, 0, 'SO000587', 0, 1, '2025-09-12 17:22:48', 76, '2025-09-12 17:23:40', 76),
	(2, 0, 0, '', '250912000427', 1, 0, 0, 1, 0, 0, 0, 10, 1, '', '', 2100, 0, 'SO000587', 0, 1, '2025-09-12 17:22:48', 76, '2025-09-12 17:23:40', 76),
	(3, 0, 0, '', '250912000427', 2, 0, 0, 1, 5, 0, 1, 0, 0, '', '', 1500, 0, 'SO000587', 0, 1, '2025-09-12 17:22:49', 76, '2025-09-12 17:23:40', 76),
	(4, 0, 0, '', '250912000427', 2, 0, 0, 1, 0, 0, 0, 10, 1, '', '', 3150, 0, 'SO000587', 0, 1, '2025-09-12 17:22:49', 76, '2025-09-12 17:23:40', 76),
	(5, 0, 0, '', '250912000427', 1, 48, 0, 0, 0, 0, 0, 0, 0, '', '', 0, 0, 'SO000587', 0, 1, '2025-09-12 17:23:01', 76, '2025-09-12 17:23:40', 76),
	(6, 0, 0, '', '250912000427', 1, 52, 0, 0, 0, 0, 0, 0, 0, '', '', 0, 0, 'SO000587', 0, 1, '2025-09-12 17:23:01', 76, '2025-09-12 17:23:40', 76),
	(7, 0, 0, '', '250912000427', 2, 48, 0, 0, 0, 0, 0, 0, 0, '', '', 0, 0, 'SO000587', 0, 1, '2025-09-12 17:23:01', 76, '2025-09-12 17:23:40', 76),
	(8, 0, 0, '', '250912000427', 2, 52, 0, 0, 0, 0, 0, 0, 0, '', '', 0, 0, 'SO000587', 0, 1, '2025-09-12 17:23:01', 76, '2025-09-12 17:23:40', 76),
	(9, 0, 0, '', '250912000427', 1, 0, 0, 0, 0, 0, 0, 0, 0, 'I tried sending a clear screen command to a customer pole display its model LCD210 its baud rate 9600 8 n 1V1 and 20 characters 2 lines display with a command type CD5220 Font USA PC437 I had manual but while I am trying to send commands Its not pick', '', 0, 0, 'SO000587', 0, 1, '2025-09-12 17:23:07', 76, '2025-09-12 17:23:40', 76);

-- Dumping structure for table pos_resto.cart_merge_log
CREATE TABLE IF NOT EXISTS `cart_merge_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) NOT NULL DEFAULT '',
  `cartIdNew` varchar(50) NOT NULL DEFAULT '',
  `outletTableMapId` int(11) NOT NULL DEFAULT 0,
  `outletTableMapIdNew` int(11) NOT NULL DEFAULT 0,
  `dailyCheckId` varchar(50) NOT NULL DEFAULT '',
  `cover1` tinyint(4) NOT NULL DEFAULT 0,
  `cover2` tinyint(4) NOT NULL DEFAULT 0,
  `coverNew` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.cart_merge_log: ~6 rows (approximately)
INSERT INTO `cart_merge_log` (`id`, `cartId`, `cartIdNew`, `outletTableMapId`, `outletTableMapIdNew`, `dailyCheckId`, `cover1`, `cover2`, `coverNew`, `presence`, `inputDate`, `inputBy`) VALUES
	(6, '250718000222', '250721000224', 3, 4, 'undefined', 8, 1, 9, 1, '2025-07-21 15:29:45', 1),
	(7, '250721000224', '250721000225', 4, 1, '000021', 9, 1, 10, 1, '2025-07-21 15:34:19', 1),
	(8, '250723000248', '250723000243', 2, 3, '000029', 4, 4, 8, 1, '2025-07-23 16:01:33', 1),
	(9, '250822000323', '250822000322', 2, 4, '000041', 4, 4, 8, 1, '2025-08-22 15:33:01', 1),
	(10, '250825000331', '250825000330', 4, 3, '000042', 4, 4, 8, 1, '2025-08-25 13:33:31', 1),
	(11, '250825000330', '250825000328', 3, 2, '000042', 8, 4, 12, 1, '2025-08-25 14:47:50', 1),
	(12, '250825000328', '250825000329', 2, 1, '000042', 12, 4, 16, 1, '2025-08-25 14:48:26', 1);

-- Dumping structure for table pos_resto.cart_payment
CREATE TABLE IF NOT EXISTS `cart_payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) NOT NULL DEFAULT '',
  `checkPaymentTypeId` int(11) NOT NULL DEFAULT 0,
  `paid` int(11) NOT NULL DEFAULT 0,
  `tips` int(11) NOT NULL DEFAULT 0,
  `submit` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=200 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.cart_payment: ~57 rows (approximately)
INSERT INTO `cart_payment` (`id`, `cartId`, `checkPaymentTypeId`, `paid`, `tips`, `submit`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(138, '250630000160', 3, 148780, 0, 1, 1, '2025-06-30 16:50:15', 1, '2025-06-30 16:50:16', 1),
	(139, '250630000161', 12, 185975, 0, 1, 1, '2025-06-30 16:51:02', 1, '2025-06-30 16:51:03', 1),
	(140, '250630000162', 3, 960116, 0, 1, 1, '2025-07-01 16:58:40', 1, '2025-07-01 16:58:41', 1),
	(141, '250704000190', 2, 109253, 0, 1, 1, '2025-07-07 16:02:59', 1, '2025-07-07 16:03:00', 1),
	(142, '250707000192', 3, 30000, 0, 1, 1, '2025-07-07 17:31:08', 1, '2025-07-07 17:31:24', 1),
	(143, '250707000192', 1, 0, 0, 1, 0, '2025-07-07 17:31:17', 1, '2025-07-07 17:31:22', 1),
	(144, '250707000192', 12, 12, 0, 1, 1, '2025-07-07 17:31:23', 1, '2025-07-07 17:31:24', 1),
	(145, '250707000193', 12, 33485, 0, 1, 1, '2025-07-07 17:53:55', 1, '2025-07-07 17:53:56', 1),
	(146, '250707000194', 2, 34782, 0, 0, 0, '2025-07-08 12:53:50', 1, '2025-07-08 14:12:04', 1),
	(147, '250707000194', 2, 34782, 0, 0, 0, '2025-07-08 14:11:59', 1, '2025-07-08 14:12:04', 1),
	(148, '250707000194', 1, 0, 0, 0, 0, '2025-07-08 14:12:29', 1, '2025-07-08 14:13:52', 1),
	(149, '250707000194', 3, 34782, 0, 1, 1, '2025-07-08 14:13:56', 1, '2025-07-08 14:13:57', 1),
	(150, '250708000196', 1, 100000, 955, 1, 1, '2025-07-08 16:03:49', 1, '2025-07-08 16:04:06', 1),
	(151, '250708000195', 24, 69960, 0, 1, 1, '2025-07-08 16:05:10', 1, '2025-07-08 16:05:11', 1),
	(152, '250708000198', 12, 23278, 0, 1, 1, '2025-07-10 11:13:53', 1, '2025-07-10 11:18:48', 1),
	(153, '250708000198', 16, 93278, 0, 1, 1, '2025-07-10 11:18:28', 1, '2025-07-10 11:18:48', 1),
	(154, '250708000197', 1, 0, 0, 0, 0, '2025-07-10 11:26:19', 1, '2025-07-10 11:26:21', 1),
	(155, '250708000197', 2, 485305, 0, 0, 0, '2025-07-10 11:26:25', 1, '2025-07-10 11:27:26', 1),
	(156, '250708000197', 2, 485305, 0, 0, 0, '2025-07-10 11:28:41', 1, '2025-07-10 11:28:43', 1),
	(157, '250708000197', 16, 485305, 0, 1, 1, '2025-07-10 11:28:50', 1, '2025-07-10 11:28:56', 1),
	(158, '250709000202', 16, 69960, 0, 1, 1, '2025-07-10 11:32:14', 1, '2025-07-10 11:32:16', 1),
	(159, '250709000200', 16, 270300, 0, 1, 1, '2025-07-10 11:34:05', 1, '2025-07-10 11:34:06', 1),
	(160, '250715000207', 14, 265677, 0, 1, 1, '2025-07-17 19:04:18', 1, '2025-07-17 19:04:20', 1),
	(161, '250718000216', 3, 93280, 0, 1, 1, '2025-07-18 15:48:41', 1, '2025-07-18 15:48:42', 1),
	(162, '250718000221', 12, 69960, 0, 1, 1, '2025-07-18 18:07:52', 1, '2025-07-18 18:07:53', 1),
	(163, '250721000225', 46, 431420, 0, 1, 1, '2025-07-22 13:00:34', 1, '2025-07-22 13:00:35', 1),
	(164, '250722000227', 3, 187375, 0, 1, 1, '2025-07-22 13:09:22', 1, '2025-07-22 13:09:23', 1),
	(165, '250722000237', 16, 69960, 0, 1, 1, '2025-07-22 15:59:22', 1, '2025-07-22 15:59:23', 1),
	(166, '250722000236', 16, 69960, 0, 1, 1, '2025-07-22 15:59:36', 1, '2025-07-22 15:59:37', 1),
	(167, '250722000238', 16, 1317580, 0, 1, 1, '2025-07-23 11:28:41', 1, '2025-07-23 11:28:42', 1),
	(168, '250723000250', 16, 139920, 0, 1, 1, '2025-07-23 12:00:20', 1, '2025-07-23 12:00:21', 1),
	(169, '250723000243', 16, 166500, 0, 1, 1, '2025-07-24 11:01:19', 1, '2025-07-24 11:01:20', 1),
	(170, '250724000266', 18, 209882, 0, 1, 1, '2025-07-24 13:53:33', 1, '2025-07-24 13:53:33', 1),
	(171, '250724000267', 46, 247084, 0, 1, 1, '2025-07-24 15:09:58', 1, '2025-07-24 15:09:59', 1),
	(172, '250730000297', 1, 0, 0, 0, 0, '2025-08-07 16:41:55', 1, '2025-08-07 16:41:58', 1),
	(173, '250730000297', 3, 326480, 0, 1, 1, '2025-08-07 16:41:57', 1, '2025-08-07 16:42:00', 1),
	(174, '250807000299', 12, 711950, 0, 0, 0, '2025-08-07 16:48:35', 1, '2025-08-07 16:48:37', 1),
	(175, '250807000299', 2, 711950, 0, 1, 1, '2025-08-07 16:48:36', 1, '2025-08-07 16:48:38', 1),
	(176, '250807000300', 16, 139920, 0, 1, 1, '2025-08-13 18:01:20', 1, '2025-08-13 18:01:21', 1),
	(177, '250813000301', 2, 250688, 0, 1, 1, '2025-08-15 14:29:19', 1, '2025-08-15 14:29:20', 1),
	(178, '250815000302', 12, 24426, 0, 1, 1, '2025-08-15 17:02:22', 1, '2025-08-15 17:02:23', 1),
	(179, '250815000304', 2, 134860, 0, 1, 1, '2025-08-19 12:15:45', 1, '2025-08-19 12:15:45', 1),
	(180, '250819000310', 12, 59960, 0, 1, 1, '2025-08-20 11:35:46', 1, '2025-08-20 11:35:47', 1),
	(181, '250820000316', 1, 0, 0, 0, 0, '2025-08-20 19:28:30', 1, '2025-08-20 19:28:35', 1),
	(182, '250820000318', 2, 17650, 0, 1, 1, '2025-08-21 12:55:00', 1, '2025-08-21 13:48:05', 1),
	(183, '250820000318', 2, 10000, 0, 1, 1, '2025-08-21 13:48:05', 1, '2025-08-21 13:48:06', 1),
	(184, '250820000317', 2, 29650, 0, 1, 1, '2025-08-21 15:43:27', 1, '2025-08-21 15:43:28', 1),
	(185, '250820000315', 47, 31185, 0, 1, 1, '2025-08-21 15:43:34', 1, '2025-08-21 15:43:34', 1),
	(186, '250820000314', 46, 69450, 0, 1, 1, '2025-08-21 15:43:43', 1, '2025-08-21 15:43:43', 1),
	(187, '250822000322', 16, 302225, 0, 1, 1, '2025-08-25 11:10:11', 1, '2025-08-25 11:10:12', 1),
	(188, '250826000337', 13, 87575, 0, 1, 1, '2025-08-26 17:04:46', 1, '2025-08-26 17:24:03', 1),
	(189, '250826000337', 15, 1000, 0, 1, 1, '2025-08-26 17:17:21', 1, '2025-08-26 17:24:03', 1),
	(190, '250826000337', 1, 340, 0, 1, 1, '2025-08-26 17:17:27', 1, '2025-08-26 17:24:03', 1),
	(191, '250826000337', 1, 230, 0, 1, 1, '2025-08-26 17:17:31', 1, '2025-08-26 17:24:03', 1),
	(192, '250826000337', 1, 210, 0, 1, 1, '2025-08-26 17:17:34', 1, '2025-08-26 17:24:03', 1),
	(193, '250826000337', 1, 230, 0, 1, 1, '2025-08-26 17:17:38', 1, '2025-08-26 17:24:03', 1),
	(194, '250826000337', 1, 320, 0, 1, 1, '2025-08-26 17:17:42', 1, '2025-08-26 17:24:03', 1),
	(195, '250826000337', 3, 97670, 0, 1, 1, '2025-08-26 17:24:01', 1, '2025-08-26 17:24:03', 1),
	(196, '250828000341', 16, 92400, 0, 0, 0, '2025-08-29 16:29:34', 1, '2025-08-29 16:29:44', 1),
	(197, '250828000341', 1, 100000, 0, 1, 1, '2025-08-29 16:29:46', 1, '2025-08-29 16:30:38', 1),
	(198, '250828000340', 12, 129300, 0, 1, 1, '2025-08-29 16:41:46', 1, '2025-08-29 16:42:02', 1),
	(199, '250828000338', 3, 51350, 0, 1, 1, '2025-09-02 12:26:04', 1, '2025-09-02 12:26:09', 1);

-- Dumping structure for table pos_resto.cart_transfer_items
CREATE TABLE IF NOT EXISTS `cart_transfer_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartItemId` int(11) NOT NULL DEFAULT 0,
  `cartId` varchar(50) NOT NULL DEFAULT '',
  `cartIdNew` varchar(50) NOT NULL DEFAULT '',
  `outletTableMapId` int(11) NOT NULL DEFAULT 0,
  `outletTableMapIdNew` int(11) NOT NULL DEFAULT 0,
  `dailyCheckId` varchar(50) NOT NULL DEFAULT '',
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.cart_transfer_items: ~0 rows (approximately)

-- Dumping structure for table pos_resto.check_cash_type
CREATE TABLE IF NOT EXISTS `check_cash_type` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `value` decimal(8,2) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.check_cash_type: ~10 rows (approximately)
INSERT INTO `check_cash_type` (`id`, `name`, `value`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, '100k', 100000.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(2, '50k', 50000.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(3, '20k', 20000.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(4, '10k', 10000.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(5, '5k', 5000.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(6, '1k', 1000.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(7, '500', 500.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(8, '200', 200.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(9, '100', 100.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(10, '50', 50.00, 1, '2025-01-01 00:00:00', 1, '2025-08-06 17:30:17', 1),
	(12, 'undefined', 123330.00, 0, '2025-08-06 17:29:10', 1, '2025-08-06 17:29:47', 1);

-- Dumping structure for table pos_resto.check_payment_group
CREATE TABLE IF NOT EXISTS `check_payment_group` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.check_payment_group: ~4 rows (approximately)
INSERT INTO `check_payment_group` (`id`, `name`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Cash', 1, '2025-04-29 12:05:06', 1, '2025-04-29 12:05:44', 1),
	(2, 'Card', 1, '2025-04-29 12:06:45', 1, '2025-04-29 12:07:26', 1),
	(3, 'Voucher', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(4, 'Qris', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(5, 'Other', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1);

-- Dumping structure for table pos_resto.check_payment_type
CREATE TABLE IF NOT EXISTS `check_payment_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paymentGroupId` smallint(6) NOT NULL DEFAULT 0,
  `name` varchar(200) DEFAULT NULL,
  `autoMatchAmount` tinyint(4) DEFAULT 1,
  `maxlimit` decimal(3,2) DEFAULT NULL,
  `openDrawer` tinyint(4) DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.check_payment_type: ~100 rows (approximately)
INSERT INTO `check_payment_type` (`id`, `paymentGroupId`, `name`, `autoMatchAmount`, `maxlimit`, `openDrawer`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 1, 'CASH', 0, 0.00, 1, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(2, 2, 'BCA CREDIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(3, 2, 'BCA DEBIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(4, 3, 'ENTERTAIN ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(5, 5, 'CITILEDGER ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(6, 5, 'OFFICER CHECK ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(7, 5, 'COMPLIMENT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(8, 4, 'OVO ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(9, 3, 'VOUCHER EZ MGM ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(10, 3, 'VOUCHER FAVE ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(11, 3, 'VOUCHER EZ BIRTHDAY ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(12, 2, 'BCA FLAZZ ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(13, 2, 'BNI DEBIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(14, 2, 'BNI CREDIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(15, 2, 'CIMB CREDIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(16, 2, 'CIMB DEBIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(17, 2, 'MANDIRI DEBIT ON US ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(18, 2, 'MANDIRI CREDIT ON/OF', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(19, 2, 'PERMATA CREDIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(20, 2, 'PERMATA DEBIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(21, 2, 'OTHERS DEBIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(22, 2, 'OTHERS CREDIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(23, 4, 'GOJEK CASH ', 1, 0.00, 1, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(24, 4, 'GOJEK DEBIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(25, 4, 'GOJEK CREDIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(26, 4, 'GOJEK PAY ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(27, 4, 'GO BIZ ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(28, 3, 'VOUCHER GROUP ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(29, 3, 'VOUCHER MAL ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:10', 1),
	(30, 3, 'VOUCHER BNI ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(31, 3, 'VOUCHER HSBC ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(32, 3, 'VOUCHER EZ STARTERPA', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(33, 3, 'VOUCHER EZ TOP UP ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(34, 3, 'VOUCHER EZ CASH BACK', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(35, 3, 'VOUCHER GRAB ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(36, 3, 'VOUCHER MFG ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(37, 3, 'VOUCHER TADA STARTER', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(38, 3, 'VOUCHER TADA TOP UP ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(39, 3, 'VOUCHER TADACASHBACK', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(40, 3, 'VOUCHER TADA MGM ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(41, 3, 'VOUCHER TADABIRTHDA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(42, 3, 'COMPLIMENT EZ ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(43, 3, 'COMPLIMENT TADA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(44, 3, 'COMPLIMENT MAL ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(45, 3, 'COMPLIMENT PROMO ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(46, 2, 'MEGA DEBIT ON US ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(47, 2, 'MEGA CREDIT ON US ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(48, 3, 'VOUCHER GOJEK ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(49, 3, 'VOUCHER EZ EXTRA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(50, 3, 'VOUCHER EATIGO ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(51, 3, 'VOUCHER GIFTN ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(52, 3, 'VOUCHER JD.ID ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(53, 3, 'VOUCHER TRAVELOKA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(54, 4, 'GRAB CASH ', 1, 0.00, 1, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(55, 4, 'GRAB DEBIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(56, 4, 'GRAB CREDIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(57, 4, 'GRAB PAY ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(58, 4, 'GRAB RESTO ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(59, 3, 'KVOUCHER ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(60, 3, 'COUPON FAVE ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(61, 3, 'COUPON GRAB ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(62, 3, 'COUPON GOJEK ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(63, 3, 'COUPON GIFTN ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(64, 3, 'COUPON JD ID ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(65, 3, 'COUPON TRAVELOKA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(66, 3, 'COUPON BLIBLI ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(67, 3, 'COUPON LOCARD ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(68, 3, 'COUPON DANA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(69, 3, 'VOUCHER BLIBLI ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(70, 3, 'VOUCHER LOCARD ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(71, 3, 'VOUCHER DANA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(72, 4, 'DANA DEBIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(73, 4, 'DANA CREDIT ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(74, 3, 'COUPON EZEELINK ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(75, 4, 'DANA BALANCE ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(76, 3, 'VOUCHER SODEXO ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(77, 3, 'COUPON SHOPEE ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(78, 3, 'COUPON LINK AJA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(79, 3, 'VOUCHER SHOPEE ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(80, 3, 'VOUCHER LINK AJA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(81, 4, 'LINK AJA PAY ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(82, 4, 'SHOPEE PAY ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(83, 3, 'E-VOUCHER SODEXO ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(84, 3, 'VOUCHER MAGIC PIN ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(85, 3, 'COUPON MAGIC PIN ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(86, 3, 'BALANCE I.CLUB ', 1, 0.00, 1, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(87, 3, 'VOUCHER I.CLUB ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(88, 3, 'VOUCHER I.CLUB START', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(89, 3, 'VOUCHER I.CLUB B.DAY', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(90, 3, 'COUPON I.CLUB ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(91, 3, 'COUPON I.CLUB WELPAC', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(92, 5, 'FAVE PAY ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(93, 3, 'FAVE E-CARD ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(94, 3, 'VOUCHER TADA ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(95, 3, 'DELIVERY I.CLUB ', 1, 0.00, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:11', 1),
	(96, 3, 'MP TOKPED ', 1, 0.00, 0, 0, '2025-01-01 00:00:00', 1, '2025-04-28 18:46:10', 1),
	(97, 3, 'MP SHOPEE ', 1, 0.00, 0, 0, '2025-01-01 00:00:00', 1, '2025-04-28 18:46:10', 1),
	(98, 3, 'MP BLI BLI ', 1, 0.00, 0, 0, '2025-01-01 00:00:00', 1, '2025-04-28 18:46:10', 1),
	(99, 3, 'MP JD.ID ', 1, 0.00, 0, 0, '2025-01-01 00:00:00', 1, '2025-04-28 18:46:10', 1),
	(100, 5, 'COUPON TIKET.COM ', 1, 0.00, 0, 0, '2025-01-01 00:00:00', 1, '2025-04-28 18:46:10', 1);

-- Dumping structure for table pos_resto.daily_cash_balance
CREATE TABLE IF NOT EXISTS `daily_cash_balance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `dailyCheckId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `openingBalance` tinyint(4) NOT NULL DEFAULT 0,
  `cashIn` int(11) NOT NULL DEFAULT 0,
  `cashOut` int(11) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=170 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.daily_cash_balance: ~158 rows (approximately)
INSERT INTO `daily_cash_balance` (`id`, `cartId`, `dailyCheckId`, `openingBalance`, `cashIn`, `cashOut`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, '', '000010', 1, 1000000, 0, 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(2, '', '000010', 0, 10000, 0, 1, '2025-06-04 14:20:27', 1, '2025-06-04 14:20:27', 1),
	(3, '', '000010', 0, 0, 0, 1, '2025-06-04 14:23:07', 1, '2025-06-04 14:23:07', 1),
	(4, '', '000010', 0, 160000, 0, 1, '2025-06-04 14:38:19', 1, '2025-06-04 14:38:19', 1),
	(5, '', '000010', 0, 345000, 0, 1, '2025-06-04 14:44:29', 1, '2025-06-04 14:44:29', 1),
	(6, '', '000010', 0, 345000, 0, 1, '2025-06-04 14:44:35', 1, '2025-06-04 14:44:35', 1),
	(7, '', '000010', 0, 270000, 0, 1, '2025-06-04 14:45:03', 1, '2025-06-04 14:45:03', 1),
	(8, '', '000010', 0, 50000, 0, 1, '2025-06-04 14:54:04', 1, '2025-06-04 14:54:04', 1),
	(9, '', '000010', 0, 50, 0, 1, '2025-06-04 14:54:11', 1, '2025-06-04 14:54:11', 1),
	(10, '', '000011', 1, 150000, 0, 1, '2025-06-04 15:08:07', 1, '2025-06-04 15:08:07', 1),
	(11, '250604000058', '000011', 0, 0, 13588, 1, '2025-06-04 18:23:55', 1, '2025-06-04 18:23:55', 1),
	(12, '250604000059', '000011', 0, 0, 0, 1, '2025-06-04 18:26:41', 1, '2025-06-04 18:26:41', 1),
	(13, '250604000063', '000011', 0, 0, 36412, 1, '2025-06-04 18:27:58', 1, '2025-06-04 18:27:58', 1),
	(14, '250604000067', '000011', 0, 200000, 0, 1, '2025-06-04 18:47:04', 1, '2025-06-04 18:47:04', 1),
	(15, '250604000067', '000011', 0, 0, 146412, 1, '2025-06-04 18:47:04', 1, '2025-06-04 18:47:04', 1),
	(16, '', '000011', 0, 50000, 0, 1, '2025-06-04 18:48:30', 1, '2025-06-04 18:48:30', 1),
	(17, '', '000013', 1, 100000, 0, 1, '2025-06-09 18:40:53', 1, '2025-06-09 18:40:53', 1),
	(18, '250611000074', '000015', 0, 100000, 0, 1, '2025-06-12 13:06:01', 1, '2025-06-12 13:06:01', 1),
	(19, '250611000074', '000015', 0, 0, 91368, 1, '2025-06-12 13:06:01', 1, '2025-06-12 13:06:01', 1),
	(20, '250611000074', 'undefined', 0, 100000, 0, 1, '2025-06-12 13:06:06', 1, '2025-06-12 13:06:06', 1),
	(21, '250611000074', 'undefined', 0, 0, 91368, 1, '2025-06-12 13:06:06', 1, '2025-06-12 13:06:06', 1),
	(22, '250611000074', 'undefined', 0, 100000, 0, 1, '2025-06-12 13:06:16', 1, '2025-06-12 13:06:16', 1),
	(23, '250611000074', 'undefined', 0, 0, 91368, 1, '2025-06-12 13:06:16', 1, '2025-06-12 13:06:16', 1),
	(24, '250613000085', '000015', 0, 113588, 0, 1, '2025-06-13 13:27:54', 1, '2025-06-13 13:27:54', 1),
	(25, '250613000085', '000015', 0, 0, 0, 1, '2025-06-13 13:27:54', 1, '2025-06-13 13:27:54', 1),
	(26, '250613000085', 'undefined', 0, 113588, 0, 1, '2025-06-13 14:40:38', 1, '2025-06-13 14:40:38', 1),
	(27, '250613000085', 'undefined', 0, 0, 0, 1, '2025-06-13 14:40:38', 1, '2025-06-13 14:40:38', 1),
	(28, '250613000085', 'undefined', 0, 113588, 0, 1, '2025-06-13 14:40:48', 1, '2025-06-13 14:40:48', 1),
	(29, '250613000085', 'undefined', 0, 0, 0, 1, '2025-06-13 14:40:48', 1, '2025-06-13 14:40:48', 1),
	(30, '250613000085', 'undefined', 0, 113588, 0, 1, '2025-06-13 14:45:08', 1, '2025-06-13 14:45:08', 1),
	(31, '250613000085', 'undefined', 0, 0, 0, 1, '2025-06-13 14:45:08', 1, '2025-06-13 14:45:08', 1),
	(32, '250613000085', 'undefined', 0, 113588, 0, 1, '2025-06-13 14:45:14', 1, '2025-06-13 14:45:14', 1),
	(33, '250613000085', 'undefined', 0, 0, 0, 1, '2025-06-13 14:45:14', 1, '2025-06-13 14:45:14', 1),
	(34, '250613000090', '000015', 0, 120000, 0, 1, '2025-06-13 15:05:38', 1, '2025-06-13 15:05:38', 1),
	(35, '250613000090', '000015', 0, 0, 110000, 1, '2025-06-13 15:05:38', 1, '2025-06-13 15:05:38', 1),
	(36, '250613000093', '000015', 0, 136532, 0, 1, '2025-06-13 15:15:14', 1, '2025-06-13 15:15:14', 1),
	(37, '250613000093', '000015', 0, 0, 0, 1, '2025-06-13 15:15:14', 1, '2025-06-13 15:15:14', 1),
	(38, '250613000093', 'undefined', 0, 136532, 0, 1, '2025-06-13 16:09:17', 1, '2025-06-13 16:09:17', 1),
	(39, '250613000093', 'undefined', 0, 0, 0, 1, '2025-06-13 16:09:17', 1, '2025-06-13 16:09:17', 1),
	(40, '250613000093', 'undefined', 0, 136532, 0, 1, '2025-06-13 16:37:13', 1, '2025-06-13 16:37:13', 1),
	(41, '250613000093', 'undefined', 0, 0, 0, 1, '2025-06-13 16:37:13', 1, '2025-06-13 16:37:13', 1),
	(42, '250613000093', 'undefined', 0, 136532, 0, 1, '2025-06-13 16:39:12', 1, '2025-06-13 16:39:12', 1),
	(43, '250613000093', 'undefined', 0, 0, 0, 1, '2025-06-13 16:39:12', 1, '2025-06-13 16:39:12', 1),
	(44, '250616000098', '000015', 0, 255810, 0, 1, '2025-06-16 15:49:01', 1, '2025-06-16 15:49:01', 1),
	(45, '250616000098', '000015', 0, 0, 117858, 1, '2025-06-16 15:49:01', 1, '2025-06-16 15:49:01', 1),
	(46, '250616000098', 'undefined', 0, 255810, 0, 1, '2025-06-16 15:49:52', 1, '2025-06-16 15:49:52', 1),
	(47, '250616000098', 'undefined', 0, 0, 117858, 1, '2025-06-16 15:49:52', 1, '2025-06-16 15:49:52', 1),
	(48, '', '000015', 0, 50000, 0, 1, '2025-06-18 15:49:25', 1, '2025-06-18 15:49:25', 1),
	(49, '', '000015', 0, 50000, 0, 1, '2025-06-18 15:49:31', 1, '2025-06-18 15:49:31', 1),
	(50, '', '000015', 0, 255000, 0, 1, '2025-06-18 15:56:07', 1, '2025-06-18 15:56:07', 1),
	(51, '', '000017', 1, 300000, 0, 1, '2025-06-24 15:35:38', 1, '2025-06-24 15:35:38', 1),
	(52, '250625000116', '000017', 0, 50000, 0, 1, '2025-06-25 11:11:39', 1, '2025-06-25 11:11:39', 1),
	(53, '250625000116', '000017', 0, 0, 40446, 1, '2025-06-25 11:11:39', 1, '2025-06-25 11:11:39', 1),
	(54, '250708000196', '000017', 0, 100000, 0, 1, '2025-07-08 16:04:07', 1, '2025-07-08 16:04:07', 1),
	(55, '250708000196', '000017', 0, 0, 30040, 1, '2025-07-08 16:04:07', 1, '2025-07-08 16:04:07', 1),
	(56, '', '000020', 1, 150000, 0, 1, '2025-07-09 14:24:55', 1, '2025-07-09 14:24:55', 1),
	(57, '', '000020', 0, 260400, 0, 1, '2025-07-09 14:25:47', 1, '2025-07-09 14:25:47', 1),
	(58, '', '000042', 1, 500000, 0, 1, '2025-08-25 17:34:13', 1, '2025-08-25 17:34:13', 1),
	(59, '', '000042', 0, 55200, 0, 1, '2025-08-25 17:50:20', 1, '2025-08-25 17:50:20', 1),
	(60, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:24:03', 1, '2025-08-26 17:24:03', 1),
	(61, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:24:03', 1, '2025-08-26 17:24:03', 1),
	(62, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:24:03', 1, '2025-08-26 17:24:03', 1),
	(63, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:24:03', 1, '2025-08-26 17:24:03', 1),
	(64, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:24:03', 1, '2025-08-26 17:24:03', 1),
	(65, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:24:03', 1, '2025-08-26 17:24:03', 1),
	(66, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:24:19', 1, '2025-08-26 17:24:19', 1),
	(67, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:24:19', 1, '2025-08-26 17:24:19', 1),
	(68, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:24:19', 1, '2025-08-26 17:24:19', 1),
	(69, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:24:19', 1, '2025-08-26 17:24:19', 1),
	(70, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:24:19', 1, '2025-08-26 17:24:19', 1),
	(71, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:24:19', 1, '2025-08-26 17:24:19', 1),
	(72, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:24:26', 1, '2025-08-26 17:24:26', 1),
	(73, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:24:26', 1, '2025-08-26 17:24:26', 1),
	(74, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:24:26', 1, '2025-08-26 17:24:26', 1),
	(75, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:24:26', 1, '2025-08-26 17:24:26', 1),
	(76, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:24:26', 1, '2025-08-26 17:24:26', 1),
	(77, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:24:26', 1, '2025-08-26 17:24:26', 1),
	(78, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:25:07', 1, '2025-08-26 17:25:07', 1),
	(79, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:25:07', 1, '2025-08-26 17:25:07', 1),
	(80, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:25:07', 1, '2025-08-26 17:25:07', 1),
	(81, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:25:07', 1, '2025-08-26 17:25:07', 1),
	(82, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:25:07', 1, '2025-08-26 17:25:07', 1),
	(83, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:25:07', 1, '2025-08-26 17:25:07', 1),
	(84, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:25:20', 1, '2025-08-26 17:25:20', 1),
	(85, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:25:20', 1, '2025-08-26 17:25:20', 1),
	(86, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:25:20', 1, '2025-08-26 17:25:20', 1),
	(87, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:25:20', 1, '2025-08-26 17:25:20', 1),
	(88, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:25:20', 1, '2025-08-26 17:25:20', 1),
	(89, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:25:20', 1, '2025-08-26 17:25:20', 1),
	(90, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:25:42', 1, '2025-08-26 17:25:42', 1),
	(91, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:25:42', 1, '2025-08-26 17:25:42', 1),
	(92, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:25:42', 1, '2025-08-26 17:25:42', 1),
	(93, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:25:42', 1, '2025-08-26 17:25:42', 1),
	(94, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:25:42', 1, '2025-08-26 17:25:42', 1),
	(95, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:25:42', 1, '2025-08-26 17:25:42', 1),
	(96, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:25:54', 1, '2025-08-26 17:25:54', 1),
	(97, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:25:54', 1, '2025-08-26 17:25:54', 1),
	(98, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:25:54', 1, '2025-08-26 17:25:54', 1),
	(99, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:25:54', 1, '2025-08-26 17:25:54', 1),
	(100, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:25:54', 1, '2025-08-26 17:25:54', 1),
	(101, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:25:54', 1, '2025-08-26 17:25:54', 1),
	(102, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:26:29', 1, '2025-08-26 17:26:29', 1),
	(103, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:26:29', 1, '2025-08-26 17:26:29', 1),
	(104, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:26:29', 1, '2025-08-26 17:26:29', 1),
	(105, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:26:29', 1, '2025-08-26 17:26:29', 1),
	(106, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:26:29', 1, '2025-08-26 17:26:29', 1),
	(107, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:26:29', 1, '2025-08-26 17:26:29', 1),
	(108, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:26:51', 1, '2025-08-26 17:26:51', 1),
	(109, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:26:51', 1, '2025-08-26 17:26:51', 1),
	(110, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:26:51', 1, '2025-08-26 17:26:51', 1),
	(111, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:26:51', 1, '2025-08-26 17:26:51', 1),
	(112, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:26:51', 1, '2025-08-26 17:26:51', 1),
	(113, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:26:51', 1, '2025-08-26 17:26:51', 1),
	(114, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:26:58', 1, '2025-08-26 17:26:58', 1),
	(115, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:26:58', 1, '2025-08-26 17:26:58', 1),
	(116, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:26:58', 1, '2025-08-26 17:26:58', 1),
	(117, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:26:58', 1, '2025-08-26 17:26:58', 1),
	(118, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:26:58', 1, '2025-08-26 17:26:58', 1),
	(119, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:26:58', 1, '2025-08-26 17:26:58', 1),
	(120, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:27:41', 1, '2025-08-26 17:27:41', 1),
	(121, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:27:41', 1, '2025-08-26 17:27:41', 1),
	(122, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:27:41', 1, '2025-08-26 17:27:41', 1),
	(123, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:27:41', 1, '2025-08-26 17:27:41', 1),
	(124, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:27:41', 1, '2025-08-26 17:27:41', 1),
	(125, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:27:41', 1, '2025-08-26 17:27:41', 1),
	(126, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:28:08', 1, '2025-08-26 17:28:08', 1),
	(127, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:28:08', 1, '2025-08-26 17:28:08', 1),
	(128, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:28:08', 1, '2025-08-26 17:28:08', 1),
	(129, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:28:08', 1, '2025-08-26 17:28:08', 1),
	(130, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:28:08', 1, '2025-08-26 17:28:08', 1),
	(131, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:28:08', 1, '2025-08-26 17:28:08', 1),
	(132, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:28:26', 1, '2025-08-26 17:28:26', 1),
	(133, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:28:26', 1, '2025-08-26 17:28:26', 1),
	(134, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:28:26', 1, '2025-08-26 17:28:26', 1),
	(135, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:28:26', 1, '2025-08-26 17:28:26', 1),
	(136, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:28:26', 1, '2025-08-26 17:28:26', 1),
	(137, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:28:26', 1, '2025-08-26 17:28:26', 1),
	(138, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:28:37', 1, '2025-08-26 17:28:37', 1),
	(139, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:28:37', 1, '2025-08-26 17:28:37', 1),
	(140, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:28:37', 1, '2025-08-26 17:28:37', 1),
	(141, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:28:37', 1, '2025-08-26 17:28:37', 1),
	(142, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:28:37', 1, '2025-08-26 17:28:37', 1),
	(143, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:28:37', 1, '2025-08-26 17:28:37', 1),
	(144, '250826000337', '000043', 0, 340, 0, 1, '2025-08-26 17:29:41', 1, '2025-08-26 17:29:41', 1),
	(145, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:29:41', 1, '2025-08-26 17:29:41', 1),
	(146, '250826000337', '000043', 0, 210, 0, 1, '2025-08-26 17:29:41', 1, '2025-08-26 17:29:41', 1),
	(147, '250826000337', '000043', 0, 230, 0, 1, '2025-08-26 17:29:41', 1, '2025-08-26 17:29:41', 1),
	(148, '250826000337', '000043', 0, 320, 0, 1, '2025-08-26 17:29:41', 1, '2025-08-26 17:29:41', 1),
	(149, '250826000337', '000043', 0, 0, 0, 1, '2025-08-26 17:29:41', 1, '2025-08-26 17:29:41', 1),
	(150, '250826000337', 'undefined', 0, 340, 0, 1, '2025-08-26 17:30:00', 1, '2025-08-26 17:30:00', 1),
	(151, '250826000337', 'undefined', 0, 230, 0, 1, '2025-08-26 17:30:00', 1, '2025-08-26 17:30:00', 1),
	(152, '250826000337', 'undefined', 0, 210, 0, 1, '2025-08-26 17:30:00', 1, '2025-08-26 17:30:00', 1),
	(153, '250826000337', 'undefined', 0, 230, 0, 1, '2025-08-26 17:30:00', 1, '2025-08-26 17:30:00', 1),
	(154, '250826000337', 'undefined', 0, 320, 0, 1, '2025-08-26 17:30:00', 1, '2025-08-26 17:30:00', 1),
	(155, '250826000337', 'undefined', 0, 0, 0, 1, '2025-08-26 17:30:00', 1, '2025-08-26 17:30:00', 1),
	(156, '250826000337', 'undefined', 0, 340, 0, 1, '2025-08-26 17:38:30', 1, '2025-08-26 17:38:30', 1),
	(157, '250826000337', 'undefined', 0, 230, 0, 1, '2025-08-26 17:38:30', 1, '2025-08-26 17:38:30', 1),
	(158, '250826000337', 'undefined', 0, 210, 0, 1, '2025-08-26 17:38:30', 1, '2025-08-26 17:38:30', 1),
	(159, '250826000337', 'undefined', 0, 230, 0, 1, '2025-08-26 17:38:30', 1, '2025-08-26 17:38:30', 1),
	(160, '250826000337', 'undefined', 0, 320, 0, 1, '2025-08-26 17:38:30', 1, '2025-08-26 17:38:30', 1),
	(161, '250826000337', 'undefined', 0, 0, 0, 1, '2025-08-26 17:38:30', 1, '2025-08-26 17:38:30', 1),
	(162, '250826000337', 'undefined', 0, 340, 0, 1, '2025-08-26 17:43:37', 1, '2025-08-26 17:43:37', 1),
	(163, '250826000337', 'undefined', 0, 230, 0, 1, '2025-08-26 17:43:37', 1, '2025-08-26 17:43:37', 1),
	(164, '250826000337', 'undefined', 0, 210, 0, 1, '2025-08-26 17:43:37', 1, '2025-08-26 17:43:37', 1),
	(165, '250826000337', 'undefined', 0, 230, 0, 1, '2025-08-26 17:43:37', 1, '2025-08-26 17:43:37', 1),
	(166, '250826000337', 'undefined', 0, 320, 0, 1, '2025-08-26 17:43:37', 1, '2025-08-26 17:43:37', 1),
	(167, '250826000337', 'undefined', 0, 0, 0, 1, '2025-08-26 17:43:37', 1, '2025-08-26 17:43:37', 1),
	(168, '250828000341', '000044', 0, 100000, 0, 1, '2025-08-29 16:30:38', 1, '2025-08-29 16:30:38', 1),
	(169, '250828000341', '000044', 0, 0, 7600, 1, '2025-08-29 16:30:38', 1, '2025-08-29 16:30:38', 1);

-- Dumping structure for table pos_resto.daily_check
CREATE TABLE IF NOT EXISTS `daily_check` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `dailyScheduleId` smallint(6) NOT NULL DEFAULT 0,
  `outletId` tinyint(4) DEFAULT NULL,
  `closed` tinyint(4) NOT NULL DEFAULT 0,
  `startDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `closeDate` datetime DEFAULT NULL,
  `closeDateLimit` datetime DEFAULT NULL,
  `startBalance` int(11) NOT NULL DEFAULT 0,
  `closeBalance` int(11) NOT NULL DEFAULT 0,
  `totalTables` smallint(6) NOT NULL DEFAULT 0,
  `totalCover` smallint(6) NOT NULL DEFAULT 0,
  `totalBill` smallint(6) NOT NULL DEFAULT 0,
  `totalItem` smallint(6) NOT NULL DEFAULT 0,
  `totalVoid` smallint(6) NOT NULL DEFAULT 0,
  `totalTA` smallint(6) NOT NULL DEFAULT 0,
  `discount` int(11) NOT NULL DEFAULT 0,
  `sc` int(11) NOT NULL DEFAULT 0,
  `scIncluded` int(11) NOT NULL DEFAULT 0,
  `tax` int(11) NOT NULL DEFAULT 0,
  `taxIncluded` int(11) NOT NULL DEFAULT 0,
  `subTotal` int(11) NOT NULL DEFAULT 0,
  `grandTotal` int(11) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.daily_check: ~25 rows (approximately)
INSERT INTO `daily_check` (`id`, `dailyScheduleId`, `outletId`, `closed`, `startDate`, `closeDate`, `closeDateLimit`, `startBalance`, `closeBalance`, `totalTables`, `totalCover`, `totalBill`, `totalItem`, `totalVoid`, `totalTA`, `discount`, `sc`, `scIncluded`, `tax`, `taxIncluded`, `subTotal`, `grandTotal`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	('000021', 0, NULL, 1, '2025-07-15 16:12:38', '2025-07-22 13:00:59', '2025-07-22 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-15 16:12:38', 1, '2025-07-22 13:00:59', 1),
	('000022', 0, NULL, 1, '2025-07-22 13:01:05', '2025-07-22 13:09:27', '2025-07-23 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-22 13:01:05', 1, '2025-07-22 13:09:27', 1),
	('000024', 1, NULL, 1, '2025-07-22 13:13:17', '2025-07-22 15:59:47', '2025-07-23 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-22 13:13:17', 1, '2025-07-22 15:59:47', 1),
	('000025', 0, NULL, 1, '2025-07-22 16:04:37', '2025-07-22 16:22:03', '2025-07-23 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-22 16:04:37', 1, '2025-07-22 16:22:03', 1),
	('000026', 0, NULL, 1, '2025-07-22 16:22:57', '2025-07-22 16:27:54', '2025-07-23 03:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-22 16:22:57', 1, '2025-07-22 16:27:54', 1),
	('000028', 2, NULL, 1, '2025-07-22 16:28:18', '2025-07-23 11:30:32', '2025-07-23 03:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-22 16:28:18', 1, '2025-07-23 11:30:32', 1),
	('000029', 1, NULL, 1, '2025-07-23 11:30:39', '2025-07-24 11:05:01', '2025-07-24 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-23 11:30:39', 1, '2025-07-24 11:05:01', 1),
	('000030', 2, NULL, 1, '2025-07-24 11:05:04', '2025-07-25 13:24:21', '2025-07-25 03:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-24 11:05:04', 1, '2025-07-25 13:24:21', 1),
	('000031', 1, NULL, 1, '2025-07-25 13:24:23', '2025-07-28 12:41:34', '2025-07-26 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-25 13:24:23', 1, '2025-07-28 12:41:34', 1),
	('000032', 1, NULL, 1, '2025-07-28 12:41:51', '2025-07-29 13:14:50', '2025-07-29 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-28 12:41:51', 1, '2025-07-29 13:14:50', 1),
	('000033', 2, NULL, 1, '2025-07-29 13:14:57', '2025-07-30 12:21:22', '2025-07-30 03:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-29 13:14:57', 1, '2025-07-30 12:21:22', 1),
	('000034', 1, NULL, 1, '2025-07-30 12:21:26', '2025-08-07 16:42:06', '2025-07-31 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-07-30 12:21:26', 1, '2025-08-07 16:42:06', 1),
	('000035', 2, NULL, 1, '2025-08-07 16:42:28', '2025-08-13 18:01:36', '2025-08-08 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-07 16:42:28', 1, '2025-08-13 18:01:36', 1),
	('000036', 1, NULL, 1, '2025-08-13 18:01:40', '2025-08-15 14:29:40', '2025-08-14 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-13 18:01:40', 1, '2025-08-15 14:29:40', 1),
	('000037', 1, NULL, 1, '2025-08-15 14:29:49', '2025-08-19 12:15:58', '2025-08-16 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-15 14:29:49', 1, '2025-08-19 12:15:58', 1),
	('000038', 2, NULL, 1, '2025-08-19 12:16:03', '2025-08-20 11:35:52', '2025-08-20 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-19 12:16:03', 1, '2025-08-20 11:35:52', 1),
	('000039', 2, NULL, 1, '2025-08-20 11:35:56', '2025-08-21 15:43:49', '2025-08-21 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-20 11:35:56', 1, '2025-08-21 15:43:49', 1),
	('000040', 2, NULL, 1, '2025-08-21 15:43:53', '2025-08-22 13:18:22', '2025-08-22 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-21 15:43:53', 1, '2025-08-22 13:18:22', 1),
	('000041', 1, NULL, 1, '2025-08-22 13:18:26', '2025-08-25 11:12:28', '2025-08-23 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-22 13:18:26', 1, '2025-08-25 11:12:28', 1),
	('000042', 1, NULL, 1, '2025-08-25 11:12:32', '2025-08-26 11:38:19', '2025-08-26 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-25 11:12:32', 1, '2025-08-26 11:38:19', 1),
	('000043', 2, NULL, 1, '2025-08-26 11:39:49', '2025-08-28 13:21:40', '2025-08-27 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-26 11:39:49', 1, '2025-08-28 13:21:40', 1),
	('000044', 2, NULL, 1, '2025-08-28 13:21:43', '2025-09-02 13:26:52', '2025-08-29 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-08-28 13:21:43', 1, '2025-09-02 13:26:52', 1),
	('000045', 2, NULL, 1, '2025-09-02 13:29:29', '2025-09-02 13:30:09', '2025-09-03 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-09-02 13:29:29', 1, '2025-09-02 13:30:09', 1),
	('000046', 2, NULL, 1, '2025-09-02 13:31:56', '2025-09-03 13:56:15', '2025-09-03 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-09-02 13:31:56', 1, '2025-09-03 13:56:15', 1),
	('000047', 2, NULL, 1, '2025-09-03 13:56:20', '2025-09-08 13:12:53', '2025-09-04 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-09-03 13:56:20', 1, '2025-09-08 13:12:53', 1),
	('000048', 1, NULL, 1, '2025-09-08 13:12:59', '2025-09-09 11:51:25', '2025-09-09 00:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-09-08 13:12:59', 1, '2025-09-09 11:51:25', 1),
	('000049', 2, NULL, 1, '2025-09-09 11:51:29', '2025-09-10 12:01:48', '2025-09-10 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-09-09 11:51:29', 1, '2025-09-10 12:01:48', 1),
	('000050', 2, NULL, 1, '2025-09-10 12:01:53', '2025-09-11 11:38:28', '2025-09-11 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-09-10 12:01:53', 1, '2025-09-11 11:38:28', 1),
	('000051', 2, NULL, 1, '2025-09-11 11:38:31', '2025-09-12 12:24:58', '2025-09-12 04:00:00', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-09-11 11:38:31', 1, '2025-09-12 12:24:58', 1),
	('000052', 1, NULL, 0, '2025-09-12 12:25:01', NULL, '2025-09-13 00:00:00', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-09-12 12:25:01', 1, '2025-09-12 12:25:01', 1);

-- Dumping structure for table pos_resto.daily_schedule
CREATE TABLE IF NOT EXISTS `daily_schedule` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `days` tinyint(4) NOT NULL DEFAULT 0,
  `closeHour` time NOT NULL DEFAULT '00:00:00',
  `mon` smallint(6) NOT NULL DEFAULT 0,
  `tue` smallint(6) NOT NULL DEFAULT 0,
  `wed` smallint(6) NOT NULL DEFAULT 0,
  `thu` smallint(6) NOT NULL DEFAULT 0,
  `fri` smallint(6) NOT NULL DEFAULT 0,
  `sat` smallint(6) NOT NULL DEFAULT 0,
  `sun` smallint(6) NOT NULL DEFAULT 0,
  `status` smallint(6) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.daily_schedule: ~3 rows (approximately)
INSERT INTO `daily_schedule` (`id`, `name`, `days`, `closeHour`, `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`, `status`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Normal Day', 1, '00:00:00', 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-19 12:21:46', 1),
	(2, 'Late Night Show', 1, '04:00:00', 0, 1, 1, 1, 0, 1, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-19 12:21:46', 1);

-- Dumping structure for table pos_resto.discount
CREATE TABLE IF NOT EXISTS `discount` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `discountGroupId` smallint(6) NOT NULL DEFAULT 0,
  `allDiscountGroup` tinyint(4) NOT NULL DEFAULT 0,
  `allLevel` tinyint(4) NOT NULL DEFAULT 1,
  `allOutlet` tinyint(4) NOT NULL DEFAULT 1,
  `name` varchar(200) DEFAULT NULL,
  `discRate` decimal(5,2) DEFAULT NULL,
  `discAmount` int(11) NOT NULL DEFAULT 0,
  `maxDiscount` int(11) NOT NULL DEFAULT 0,
  `postDiscountSC` tinyint(4) NOT NULL DEFAULT 0,
  `postDiscountTax` tinyint(4) NOT NULL DEFAULT 0,
  `remark` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.discount: ~36 rows (approximately)
INSERT INTO `discount` (`id`, `discountGroupId`, `allDiscountGroup`, `allLevel`, `allOutlet`, `name`, `discRate`, `discAmount`, `maxDiscount`, `postDiscountSC`, `postDiscountTax`, `remark`, `presence`, `status`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 1, 1, 1, 0, '10% POST ALL', 10.00, 0, 10000, 1, 1, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(2, 1, 1, 1, 0, '10% PRE ALL', 10.00, 0, 10000, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(3, 1, 1, 1, 1, '10% post SC', 10.00, 0, 10000, 1, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(4, 1, 1, 1, 1, '10% post TAX', 10.00, 0, 10000, 0, 1, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(5, 1, 1, 1, 1, '30% Remark', 30.00, 0, 2000, 0, 0, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(6, 2, 0, 1, 1, '35% Disc All ', 35.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(7, 2, 0, 0, 1, '50% Disc All  BOSS', 50.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(8, 2, 0, 0, 1, '100% Disc All BOSS', 100.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(9, 2, 0, 1, 1, '50% + 10 % Disc ', 100.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(10, 2, 0, 0, 1, 'O C ', 100.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(11, 2, 0, 0, 1, 'ENT ', 100.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(12, 2, 0, 1, 1, 'COMPLIMENT ', 100.00, 0, 0, 0, 0, 0, 1, 0, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(13, 2, 0, 1, 1, '25% + 25% Disc ', 43.75, 0, 0, 0, 0, 0, 1, 0, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(14, 3, 0, 1, 1, '17% Disc all ++', 17.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(15, 3, 0, 1, 1, '40% Disc All X2', 40.00, 0, 12345, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(16, 3, 0, 1, 1, '50% Disc Member ', 50.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(17, 3, 0, 1, 1, '100% Disc Member ', 100.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(18, 7, 1, 0, 1, 'DISC MAX 100 ', 0.00, 100000, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(19, 0, 1, 0, 1, 'DISC MAX 200 ', 0.00, 200000, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(20, 0, 0, 1, 1, 'DISC MAX 300 ', 0.00, 300000, 0, 0, 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:03:49', 1),
	(21, 0, 1, 1, 1, '27% Disc all ', 27.00, 0, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(22, 0, 1, 1, 1, '45% Disc all x2', 45.00, 0, 5000, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(25, 0, 1, 1, 1, 'DISC MAX 75 34', 0.00, 75000, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(26, 0, 1, 1, 1, 'DISC MAX 50 ', 0.00, 50000, 0, 0, 0, 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-20 15:28:27', 1),
	(27, 0, 0, 1, 1, 'DISC MAX 1000 ', 0.00, 1000000, 0, 0, 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:03:39', 1),
	(28, 0, 0, 1, 1, 'DISC MAX BCA 105 ', 0.00, 105000, 0, 0, 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:03:39', 1),
	(29, 0, 0, 1, 1, 'DISC MAX BRI 150 ', 0.00, 150000, 0, 0, 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-04-29 15:31:13', 1),
	(30, 0, 0, 1, 1, 'DISC MAX 150 ', 0.00, 150000, 0, 0, 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-04-29 15:31:13', 1),
	(31, 0, 0, 1, 1, 'DISC MAX OCBC 150 ', 0.00, 150000, 0, 0, 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-04-29 15:31:05', 1),
	(32, 0, 0, 1, 1, 'DISC 50% OCBC ', 50.00, 0, 0, 0, 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-04-29 15:31:05', 1),
	(34, 0, 0, 1, 1, 'test1', NULL, 0, 0, 0, 0, 0, 0, 1, '2025-08-05 14:03:54', 1, '2025-08-05 14:08:39', 1),
	(35, 0, 0, 1, 1, 'AkanShari', NULL, 0, 0, 0, 0, 0, 0, 1, '2025-08-05 14:07:32', 1, '2025-08-05 14:08:39', 1),
	(36, 1, 0, 1, 1, 'test 44', 23.00, 0, 0, 0, 0, 0, 0, 1, '2025-08-05 14:08:45', 1, '2025-08-15 16:58:07', 1),
	(37, 6, 0, 1, 1, 'test 333', 12.00, 0, 0, 0, 0, 0, 0, 1, '2025-08-05 14:09:18', 1, '2025-08-05 14:09:22', 1),
	(38, 1, 0, 1, 1, 'test 4', 0.00, 0, 0, 0, 0, 0, 0, 1, '2025-08-05 15:02:10', 1, '2025-08-15 16:58:07', 1),
	(39, 1, 0, 1, 1, 'test', 20.00, 0, 30, 0, 0, 0, 0, 1, '2025-08-12 16:07:57', 1, '2025-08-15 16:58:07', 1);

-- Dumping structure for table pos_resto.discount_group
CREATE TABLE IF NOT EXISTS `discount_group` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.discount_group: ~8 rows (approximately)
INSERT INTO `discount_group` (`id`, `name`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Drink Discount', 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:17:41', 1),
	(2, 'Food Discount', 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:17:41', 1),
	(3, 'DimSum Discount', 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:17:41', 1),
	(4, 'Cake Discount ', 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:17:41', 1),
	(5, 'Dessert Discount ', 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:17:41', 1),
	(6, 'Pastry Discount ', 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:17:41', 1),
	(7, 'No Discount ', 1, '2025-01-01 00:00:00', 1, '2025-08-05 14:17:41', 1),
	(9, 'test 2', 0, '2025-08-05 14:18:13', 1, '2025-08-05 14:18:21', 1);

-- Dumping structure for table pos_resto.discount_level
CREATE TABLE IF NOT EXISTS `discount_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discountId` smallint(6) NOT NULL DEFAULT 0,
  `employeeAuthLevelId` smallint(6) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.discount_level: ~19 rows (approximately)
INSERT INTO `discount_level` (`id`, `discountId`, `employeeAuthLevelId`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(12, 11, 4, 1, '2025-08-05 16:53:07', 1, '2025-01-01 00:00:00', 1),
	(13, 11, 5, 1, '2025-08-05 16:53:07', 1, '2025-01-01 00:00:00', 1),
	(14, 11, 6, 1, '2025-08-05 16:53:07', 1, '2025-01-01 00:00:00', 1),
	(26, 1, 2, 1, '2025-08-05 17:43:20', 1, '2025-01-01 00:00:00', 1),
	(27, 1, 3, 1, '2025-08-05 17:43:20', 1, '2025-01-01 00:00:00', 1),
	(28, 1, 5, 1, '2025-08-05 17:43:20', 1, '2025-01-01 00:00:00', 1),
	(71, 10, 5, 1, '2025-08-05 18:32:04', 1, '2025-01-01 00:00:00', 1),
	(72, 10, 6, 1, '2025-08-05 18:32:04', 1, '2025-01-01 00:00:00', 1),
	(73, 2, 1, 1, '2025-08-05 18:32:45', 1, '2025-01-01 00:00:00', 1),
	(74, 2, 2, 1, '2025-08-05 18:32:45', 1, '2025-01-01 00:00:00', 1),
	(75, 2, 3, 1, '2025-08-05 18:32:45', 1, '2025-01-01 00:00:00', 1),
	(76, 2, 4, 1, '2025-08-05 18:32:45', 1, '2025-01-01 00:00:00', 1),
	(77, 2, 5, 1, '2025-08-05 18:32:45', 1, '2025-01-01 00:00:00', 1),
	(78, 8, 1, 1, '2025-08-19 13:50:26', 1, '2025-01-01 00:00:00', 1),
	(79, 8, 2, 1, '2025-08-19 13:50:26', 1, '2025-01-01 00:00:00', 1),
	(80, 7, 1, 1, '2025-08-19 13:50:31', 1, '2025-01-01 00:00:00', 1),
	(81, 7, 2, 1, '2025-08-19 13:50:31', 1, '2025-01-01 00:00:00', 1),
	(82, 18, 1, 1, '2025-08-19 14:34:46', 1, '2025-01-01 00:00:00', 1),
	(83, 18, 2, 1, '2025-08-19 14:34:46', 1, '2025-01-01 00:00:00', 1),
	(84, 18, 3, 1, '2025-08-19 14:34:46', 1, '2025-01-01 00:00:00', 1),
	(85, 19, 1, 1, '2025-08-19 14:34:49', 1, '2025-01-01 00:00:00', 1);

-- Dumping structure for table pos_resto.employee
CREATE TABLE IF NOT EXISTS `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `authlevelId` smallint(6) DEFAULT NULL,
  `username` varchar(20) NOT NULL DEFAULT 'R',
  `hash` varchar(200) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `contact` varchar(200) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `birthday` date NOT NULL DEFAULT '2000-01-01',
  `dob` varchar(20) DEFAULT NULL,
  `sex` varchar(1) DEFAULT NULL,
  `socialid` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `empdept` smallint(6) DEFAULT NULL,
  `ordlevel` smallint(6) DEFAULT NULL,
  `disclevel` tinyint(4) DEFAULT NULL,
  `actdate` varchar(8) DEFAULT NULL,
  `card` varchar(40) DEFAULT NULL,
  `emptype` tinyint(4) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` int(11) NOT NULL DEFAULT 0,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `flogin` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.employee: ~3 rows (approximately)
INSERT INTO `employee` (`id`, `authlevelId`, `username`, `hash`, `name`, `tel`, `contact`, `address`, `birthday`, `dob`, `sex`, `socialid`, `email`, `empdept`, `ordlevel`, `disclevel`, `actdate`, `card`, `emptype`, `status`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, NULL, 'R', NULL, 'R', NULL, NULL, NULL, '2000-01-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2025-01-01 00:00:00', 0, '2025-01-01 00:00:00', 0),
	(2, 4, '00', '$2b$04$qiBKEOtdwoFe7pD4ijLjA.HbXnmKhUSIikw6g7.sA7Upup98WT5Ci', 'UAT Molly ', '8988989    ', '   ', ' 43         ', '2025-08-05', '               234  ', 'F', '                42              ', '23   ', 2, 1, 3, '4   ', '        34                              ', 34, 1, 1, '2025-01-01 00:00:00', 0, '2025-08-06 15:39:42', 0),
	(76, 1, '123123', '$2b$04$OFe9/k0m.QAB57c4.5AsJ.sxNGeCj9OUENacoQtQqZe4R.6CDkM22', 'sa ', 'null  ', NULL, 'null  ', '2000-01-01', NULL, 'n', NULL, 'null  ', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2025-08-06 14:47:35', 0, '2025-08-06 15:39:42', 0),
	(77, 1, 'sa', '$2b$04$MMm4RxFLDU0XaGHuN3UoneannV.y7No/r/1jTxHQLpu8VNUYgPdWK', 'sa ', 'null ', NULL, 'null ', '2000-01-01', NULL, 'n', NULL, 'null ', NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2025-08-06 14:48:05', 0, '2025-08-06 15:39:20', 0);

-- Dumping structure for table pos_resto.employee_auth_level
CREATE TABLE IF NOT EXISTS `employee_auth_level` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `void` tinyint(4) NOT NULL DEFAULT 0,
  `dailyAccess` tinyint(4) NOT NULL DEFAULT 0,
  `discountLevelId` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.employee_auth_level: ~7 rows (approximately)
INSERT INTO `employee_auth_level` (`id`, `name`, `void`, `dailyAccess`, `discountLevelId`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Administrator', 1, 1, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:45', 1),
	(2, 'General Manager ', 1, 1, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:45', 1),
	(3, 'Manager sert', 0, 1, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:45', 1),
	(4, 'Cashier ', 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:45', 1),
	(5, 'Senior Waiter ', 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:45', 1),
	(6, 'Waiter ', 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:45', 1),
	(7, 'Junior Waiter ', 0, 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-05-02 13:36:45', 1);

-- Dumping structure for table pos_resto.employee_dept
CREATE TABLE IF NOT EXISTS `employee_dept` (
  `empdept` smallint(6) NOT NULL AUTO_INCREMENT,
  `desc1` varchar(200) DEFAULT '',
  `desc2` varchar(200) DEFAULT '',
  `desc3` varchar(200) DEFAULT '',
  `drawer` varchar(20) DEFAULT '',
  `autopend` varchar(20) DEFAULT '',
  `voidown` varchar(20) DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`empdept`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.employee_dept: ~6 rows (approximately)
INSERT INTO `employee_dept` (`empdept`, `desc1`, `desc2`, `desc3`, `drawer`, `autopend`, `voidown`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Administrator ', 'Administrator       ', 'Administrator       ', 'checkbox', 'checkbox', 'dropdown [order leve', 1, '2025-01-01 00:00:00', 1, '2025-05-02 14:26:51', 1),
	(2, 'General Manager ', 'General Manager     ', 'General Manager     ', '1', ' c', 'zcv ', 1, '2025-01-01 00:00:00', 1, '2025-05-02 14:26:51', 1),
	(3, 'Manager ', 'Manager             ', 'Manager             ', ' 3', ' b', ' ', 1, '2025-01-01 00:00:00', 1, '2025-05-02 14:26:51', 1),
	(4, 'Cashier2534', 'Cashier             ', 'Cashier             ', ' 4', ' s', ' g', 1, '2025-01-01 00:00:00', 1, '2025-05-02 14:26:51', 1),
	(5, 'Senior Waiter ', 'Senior Waiter       ', 'Senior Waiter       ', ' 5', ' e', ' ', 1, '2025-01-01 00:00:00', 1, '2025-05-02 14:26:51', 1),
	(6, 'Waiter ', 'Waiter              ', 'Waiter              ', ' 6', ' e', ' ', 1, '2025-01-01 00:00:00', 1, '2025-05-02 14:26:51', 1),
	(9, 'SPG woman', '', '', '2', '4', '56', 1, '2025-04-28 14:53:59', 1, '2025-05-02 14:26:51', 1);

-- Dumping structure for table pos_resto.employee_order_level
CREATE TABLE IF NOT EXISTS `employee_order_level` (
  `ordlevel` smallint(6) NOT NULL AUTO_INCREMENT,
  `desc1` varchar(20) DEFAULT NULL,
  `desc2` varchar(20) DEFAULT NULL,
  `desc3` varchar(20) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ordlevel`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.employee_order_level: ~4 rows (approximately)
INSERT INTO `employee_order_level` (`ordlevel`, `desc1`, `desc2`, `desc3`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Department Head ', 'Department Head     ', 'Department Head     ', 1, '2025-01-01 00:00:00', 1, '2025-04-28 15:22:28', 1),
	(2, 'Senior Waiter ', 'Senior Waiter       ', 'Senior Waiter       ', 1, '2025-01-01 00:00:00', 1, '2025-04-28 15:22:28', 1),
	(3, 'Junior Waiter', 'Junior Waiter       ', 'Junior Waiter       ', 1, '2025-01-01 00:00:00', 1, '2025-04-28 15:22:28', 1),
	(4, 'SPG 2', NULL, NULL, 0, '2025-04-28 15:22:34', 1, '2025-04-28 15:22:38', 1);

-- Dumping structure for table pos_resto.employee_token
CREATE TABLE IF NOT EXISTS `employee_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` int(11) NOT NULL DEFAULT 0,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` int(11) NOT NULL DEFAULT 0,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.employee_token: ~138 rows (approximately)
INSERT INTO `employee_token` (`id`, `employeeId`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(61, 1, 1, '2025-07-02 15:04:13', 0, '2025-07-02 15:04:13', 0),
	(62, 1, 1, '2025-07-02 15:10:44', 0, '2025-07-02 15:10:44', 0),
	(63, 1, 1, '2025-07-02 15:12:42', 0, '2025-07-02 15:12:42', 0),
	(64, 1, 1, '2025-07-02 15:23:40', 0, '2025-07-02 15:23:40', 0),
	(65, 1, 1, '2025-07-02 15:26:09', 0, '2025-07-02 15:26:09', 0),
	(66, 1, 1, '2025-07-02 15:26:34', 0, '2025-07-02 15:26:34', 0),
	(67, 1, 1, '2025-07-02 15:29:46', 0, '2025-07-02 15:29:46', 0),
	(68, 1, 1, '2025-07-02 15:29:58', 0, '2025-07-02 15:29:58', 0),
	(69, 1, 1, '2025-07-02 15:33:34', 0, '2025-07-02 15:33:34', 0),
	(70, 1, 1, '2025-07-02 15:42:14', 0, '2025-07-02 15:42:14', 0),
	(71, 1, 1, '2025-07-02 16:18:26', 0, '2025-07-02 16:18:26', 0),
	(72, 1, 1, '2025-07-03 13:13:41', 0, '2025-07-03 13:13:41', 0),
	(73, 1, 1, '2025-07-03 14:33:13', 0, '2025-07-03 14:33:13', 0),
	(74, 1, 1, '2025-07-03 18:27:11', 0, '2025-07-03 18:27:11', 0),
	(75, 1, 1, '2025-07-04 12:59:29', 0, '2025-07-04 12:59:29', 0),
	(76, 1, 1, '2025-07-04 13:28:38', 0, '2025-07-04 13:28:38', 0),
	(77, 1, 1, '2025-07-04 14:06:02', 0, '2025-07-04 14:06:02', 0),
	(78, 1, 1, '2025-07-04 14:06:11', 0, '2025-07-04 14:06:11', 0),
	(79, 1, 1, '2025-07-04 14:06:48', 0, '2025-07-04 14:06:48', 0),
	(80, 1, 1, '2025-07-04 14:09:41', 0, '2025-07-04 14:09:41', 0),
	(81, 1, 1, '2025-07-04 15:14:28', 0, '2025-07-04 15:14:28', 0),
	(82, 1, 1, '2025-07-04 15:31:06', 0, '2025-07-04 15:31:06', 0),
	(83, 1, 1, '2025-07-04 15:45:59', 0, '2025-07-04 15:45:59', 0),
	(84, 1, 1, '2025-07-04 15:46:13', 0, '2025-07-04 15:46:13', 0),
	(85, 1, 1, '2025-07-04 15:59:01', 0, '2025-07-04 15:59:01', 0),
	(86, 1, 1, '2025-07-04 16:45:31', 0, '2025-07-04 16:45:31', 0),
	(87, 1, 1, '2025-07-08 14:33:43', 0, '2025-07-08 14:33:43', 0),
	(88, 1, 1, '2025-07-08 14:33:54', 0, '2025-07-08 14:33:54', 0),
	(89, 1, 1, '2025-07-08 14:36:11', 0, '2025-07-08 14:36:11', 0),
	(90, 1, 1, '2025-07-08 14:40:40', 0, '2025-07-08 14:40:40', 0),
	(91, 1, 1, '2025-07-08 15:34:11', 0, '2025-07-08 15:34:11', 0),
	(92, 1, 1, '2025-07-08 15:36:43', 0, '2025-07-08 15:36:43', 0),
	(93, 1, 1, '2025-07-08 15:37:30', 0, '2025-07-08 15:37:30', 0),
	(94, 1, 1, '2025-07-08 15:40:45', 0, '2025-07-08 15:40:45', 0),
	(95, 1, 1, '2025-07-08 15:47:50', 0, '2025-07-08 15:47:50', 0),
	(96, 1, 1, '2025-07-08 15:49:14', 0, '2025-07-08 15:49:14', 0),
	(97, 1, 1, '2025-07-08 16:05:19', 0, '2025-07-08 16:05:19', 0),
	(98, 1, 1, '2025-07-08 16:06:21', 0, '2025-07-08 16:06:21', 0),
	(99, 2, 1, '2025-07-08 16:24:41', 0, '2025-07-08 16:24:41', 0),
	(100, 2, 1, '2025-07-08 16:45:09', 0, '2025-07-08 16:45:09', 0),
	(101, 1, 1, '2025-07-08 17:12:15', 0, '2025-07-08 17:12:15', 0),
	(102, 1, 1, '2025-07-08 17:40:56', 0, '2025-07-08 17:40:56', 0),
	(103, 1, 1, '2025-07-08 17:59:10', 0, '2025-07-08 17:59:10', 0),
	(104, 1, 1, '2025-07-08 18:21:37', 0, '2025-07-08 18:21:37', 0),
	(105, 1, 1, '2025-07-09 13:11:49', 0, '2025-07-09 13:11:49', 0),
	(106, 1, 1, '2025-07-09 14:27:42', 0, '2025-07-09 14:27:42', 0),
	(107, 1, 1, '2025-07-09 14:29:41', 0, '2025-07-09 14:29:41', 0),
	(108, 1, 1, '2025-07-09 14:35:57', 0, '2025-07-09 14:35:57', 0),
	(109, 1, 1, '2025-07-10 18:14:40', 0, '2025-07-10 18:14:40', 0),
	(110, 1, 1, '2025-07-10 18:15:08', 0, '2025-07-10 18:15:08', 0),
	(111, 1, 1, '2025-07-15 14:27:52', 0, '2025-07-15 14:27:52', 0),
	(112, 1, 1, '2025-07-15 15:13:24', 0, '2025-07-15 15:13:24', 0),
	(113, 1, 1, '2025-07-15 15:14:15', 0, '2025-07-15 15:14:15', 0),
	(114, 1, 1, '2025-07-15 15:55:21', 0, '2025-07-15 15:55:21', 0),
	(115, 1, 1, '2025-07-15 16:01:55', 0, '2025-07-15 16:01:55', 0),
	(116, 1, 1, '2025-07-15 16:04:46', 0, '2025-07-15 16:04:46', 0),
	(117, 1, 1, '2025-07-15 16:05:52', 0, '2025-07-15 16:05:52', 0),
	(118, 2, 1, '2025-07-15 16:06:16', 0, '2025-07-15 16:06:16', 0),
	(119, 1, 1, '2025-07-15 16:08:52', 0, '2025-07-15 16:08:52', 0),
	(120, 1, 1, '2025-07-15 16:11:43', 0, '2025-07-15 16:11:43', 0),
	(121, 1, 1, '2025-07-15 16:11:48', 0, '2025-07-15 16:11:48', 0),
	(122, 1, 1, '2025-07-15 16:12:27', 0, '2025-07-15 16:12:27', 0),
	(123, 1, 1, '2025-07-15 16:12:30', 0, '2025-07-15 16:12:30', 0),
	(124, 1, 1, '2025-07-15 16:12:55', 0, '2025-07-15 16:12:55', 0),
	(125, 1, 1, '2025-07-15 16:14:38', 0, '2025-07-15 16:14:38', 0),
	(126, 1, 1, '2025-07-15 17:36:08', 0, '2025-07-15 17:36:08', 0),
	(127, 1, 1, '2025-07-17 19:05:44', 0, '2025-07-17 19:05:44', 0),
	(128, 1, 1, '2025-07-18 10:58:14', 0, '2025-07-18 10:58:14', 0),
	(129, 1, 1, '2025-07-18 14:03:14', 0, '2025-07-18 14:03:14', 0),
	(130, 1, 1, '2025-07-18 14:03:37', 0, '2025-07-18 14:03:37', 0),
	(131, 1, 1, '2025-07-18 14:21:05', 0, '2025-07-18 14:21:05', 0),
	(132, 1, 1, '2025-07-22 13:01:03', 0, '2025-07-22 13:01:03', 0),
	(133, 1, 1, '2025-07-22 13:09:03', 0, '2025-07-22 13:09:03', 0),
	(134, 1, 1, '2025-07-22 13:09:29', 0, '2025-07-22 13:09:29', 0),
	(135, 1, 1, '2025-07-22 15:58:41', 0, '2025-07-22 15:58:41', 0),
	(136, 1, 1, '2025-07-22 15:59:42', 0, '2025-07-22 15:59:42', 0),
	(137, 1, 1, '2025-07-22 16:04:28', 0, '2025-07-22 16:04:28', 0),
	(138, 1, 1, '2025-07-22 16:21:59', 0, '2025-07-22 16:21:59', 0),
	(139, 1, 1, '2025-07-22 16:22:05', 0, '2025-07-22 16:22:05', 0),
	(140, 1, 1, '2025-07-22 16:27:50', 0, '2025-07-22 16:27:50', 0),
	(141, 1, 1, '2025-07-22 16:27:56', 0, '2025-07-22 16:27:56', 0),
	(142, 1, 1, '2025-07-23 11:30:34', 0, '2025-07-23 11:30:34', 0),
	(143, 1, 1, '2025-07-23 11:30:38', 0, '2025-07-23 11:30:38', 0),
	(144, 1, 1, '2025-07-23 15:52:00', 0, '2025-07-23 15:52:00', 0),
	(145, 1, 1, '2025-07-23 15:54:42', 0, '2025-07-23 15:54:42', 0),
	(146, 1, 1, '2025-07-23 15:57:17', 0, '2025-07-23 15:57:17', 0),
	(147, 1, 1, '2025-07-24 11:05:03', 0, '2025-07-24 11:05:03', 0),
	(148, 1, 1, '2025-07-25 13:24:22', 0, '2025-07-25 13:24:22', 0),
	(149, 1, 1, '2025-07-28 12:41:07', 0, '2025-07-28 12:41:07', 0),
	(150, 1, 1, '2025-07-28 12:41:47', 0, '2025-07-28 12:41:47', 0),
	(151, 1, 1, '2025-07-28 12:43:14', 0, '2025-07-28 12:43:14', 0),
	(152, 1, 1, '2025-07-28 12:48:46', 0, '2025-07-28 12:48:46', 0),
	(153, 1, 1, '2025-07-28 12:52:35', 0, '2025-07-28 12:52:35', 0),
	(154, 1, 1, '2025-07-28 12:53:41', 0, '2025-07-28 12:53:41', 0),
	(155, 1, 1, '2025-07-28 12:53:46', 0, '2025-07-28 12:53:46', 0),
	(156, 1, 1, '2025-07-28 12:58:11', 0, '2025-07-28 12:58:11', 0),
	(157, 1, 1, '2025-07-28 13:37:46', 0, '2025-07-28 13:37:46', 0),
	(158, 1, 1, '2025-07-28 15:59:50', 0, '2025-07-28 15:59:50', 0),
	(159, 1, 1, '2025-07-28 16:00:47', 0, '2025-07-28 16:00:47', 0),
	(160, 1, 1, '2025-07-29 13:14:55', 0, '2025-07-29 13:14:55', 0),
	(161, 1, 1, '2025-07-30 12:21:25', 0, '2025-07-30 12:21:25', 0),
	(162, 1, 1, '2025-07-30 12:51:49', 0, '2025-07-30 12:51:49', 0),
	(163, 76, 1, '2025-08-07 16:42:27', 0, '2025-08-07 16:42:27', 0),
	(164, 76, 1, '2025-08-11 15:35:19', 0, '2025-08-11 15:35:19', 0),
	(165, 76, 1, '2025-08-11 15:45:42', 0, '2025-08-11 15:45:42', 0),
	(166, 76, 1, '2025-08-11 15:46:23', 0, '2025-08-11 15:46:23', 0),
	(167, 76, 1, '2025-08-11 15:46:48', 0, '2025-08-11 15:46:48', 0),
	(168, 76, 1, '2025-08-12 16:39:29', 0, '2025-08-12 16:39:29', 0),
	(169, 76, 1, '2025-08-13 18:01:28', 0, '2025-08-13 18:01:28', 0),
	(170, 76, 1, '2025-08-13 18:01:38', 0, '2025-08-13 18:01:38', 0),
	(171, 76, 1, '2025-08-15 14:29:30', 0, '2025-08-15 14:29:30', 0),
	(172, 76, 1, '2025-08-15 14:29:42', 0, '2025-08-15 14:29:42', 0),
	(173, 76, 1, '2025-08-15 14:29:47', 0, '2025-08-15 14:29:47', 0),
	(174, 76, 1, '2025-08-19 12:15:52', 0, '2025-08-19 12:15:52', 0),
	(175, 76, 1, '2025-08-19 12:16:00', 0, '2025-08-19 12:16:00', 0),
	(176, 76, 1, '2025-08-19 15:17:33', 0, '2025-08-19 15:17:33', 0),
	(177, 76, 1, '2025-08-20 11:35:54', 0, '2025-08-20 11:35:54', 0),
	(178, 76, 1, '2025-08-21 14:23:27', 0, '2025-08-21 14:23:27', 0),
	(179, 76, 1, '2025-08-21 15:43:51', 0, '2025-08-21 15:43:51', 0),
	(180, 76, 1, '2025-08-22 13:18:24', 0, '2025-08-22 13:18:24', 0),
	(181, 76, 1, '2025-08-22 18:15:42', 0, '2025-08-22 18:15:42', 0),
	(182, 76, 1, '2025-08-22 18:37:35', 0, '2025-08-22 18:37:35', 0),
	(183, 76, 1, '2025-08-22 18:38:32', 0, '2025-08-22 18:38:32', 0),
	(184, 76, 1, '2025-08-22 18:38:45', 0, '2025-08-22 18:38:45', 0),
	(185, 76, 1, '2025-08-25 11:09:46', 0, '2025-08-25 11:09:46', 0),
	(186, 76, 1, '2025-08-25 11:12:30', 0, '2025-08-25 11:12:30', 0),
	(187, 76, 1, '2025-08-25 15:37:58', 0, '2025-08-25 15:37:58', 0),
	(188, 76, 1, '2025-08-25 15:51:21', 0, '2025-08-25 15:51:21', 0),
	(189, 76, 1, '2025-08-25 15:52:42', 0, '2025-08-25 15:52:42', 0),
	(190, 76, 1, '2025-08-25 15:53:27', 0, '2025-08-25 15:53:27', 0),
	(191, 76, 1, '2025-08-25 15:59:59', 0, '2025-08-25 15:59:59', 0),
	(192, 76, 1, '2025-08-25 16:00:34', 0, '2025-08-25 16:00:34', 0),
	(193, 76, 1, '2025-08-25 16:02:21', 0, '2025-08-25 16:02:21', 0),
	(194, 76, 1, '2025-08-25 16:04:06', 0, '2025-08-25 16:04:06', 0),
	(195, 76, 1, '2025-08-25 16:48:10', 0, '2025-08-25 16:48:10', 0),
	(196, 76, 1, '2025-08-25 16:48:55', 0, '2025-08-25 16:48:55', 0),
	(197, 76, 1, '2025-08-25 16:50:29', 0, '2025-08-25 16:50:29', 0),
	(198, 76, 1, '2025-08-25 16:53:55', 0, '2025-08-25 16:53:55', 0),
	(199, 76, 1, '2025-08-25 17:28:13', 0, '2025-08-25 17:28:13', 0),
	(200, 76, 1, '2025-08-25 17:33:43', 0, '2025-08-25 17:33:43', 0),
	(201, 76, 1, '2025-08-25 18:11:23', 0, '2025-08-25 18:11:23', 0),
	(202, 76, 1, '2025-08-25 18:11:33', 0, '2025-08-25 18:11:33', 0),
	(203, 76, 1, '2025-08-25 18:17:39', 0, '2025-08-25 18:17:39', 0),
	(204, 76, 1, '2025-08-26 10:59:20', 0, '2025-08-26 10:59:20', 0),
	(205, 76, 1, '2025-08-26 11:33:42', 0, '2025-08-26 11:33:42', 0),
	(206, 76, 1, '2025-08-26 11:38:22', 0, '2025-08-26 11:38:22', 0),
	(207, 76, 1, '2025-08-26 11:57:30', 0, '2025-08-26 11:57:30', 0),
	(208, 76, 1, '2025-08-26 12:04:00', 0, '2025-08-26 12:04:00', 0),
	(209, 76, 1, '2025-08-26 12:04:58', 0, '2025-08-26 12:04:58', 0),
	(210, 76, 1, '2025-08-28 13:21:42', 0, '2025-08-28 13:21:42', 0),
	(211, 76, 1, '2025-08-29 15:27:03', 0, '2025-08-29 15:27:03', 0),
	(212, 76, 1, '2025-08-29 16:28:39', 0, '2025-08-29 16:28:39', 0),
	(213, 76, 1, '2025-09-01 15:27:01', 0, '2025-09-01 15:27:01', 0),
	(214, 76, 1, '2025-09-01 16:50:02', 0, '2025-09-01 16:50:02', 0),
	(215, 76, 1, '2025-09-01 16:55:14', 0, '2025-09-01 16:55:14', 0),
	(216, 76, 1, '2025-09-01 19:00:00', 0, '2025-09-01 19:00:00', 0),
	(217, 76, 1, '2025-09-02 12:36:07', 0, '2025-09-02 12:36:07', 0),
	(218, 76, 1, '2025-09-02 12:39:32', 0, '2025-09-02 12:39:32', 0),
	(219, 76, 1, '2025-09-02 13:26:57', 0, '2025-09-02 13:26:57', 0),
	(220, 76, 1, '2025-09-02 13:30:11', 0, '2025-09-02 13:30:11', 0),
	(221, 76, 1, '2025-09-02 13:59:44', 0, '2025-09-02 13:59:44', 0),
	(222, 76, 1, '2025-09-02 14:47:23', 0, '2025-09-02 14:47:23', 0),
	(223, 76, 1, '2025-09-02 14:56:04', 0, '2025-09-02 14:56:04', 0),
	(224, 76, 1, '2025-09-02 14:56:25', 0, '2025-09-02 14:56:25', 0),
	(225, 76, 1, '2025-09-02 15:03:18', 0, '2025-09-02 15:03:18', 0),
	(226, 76, 1, '2025-09-02 15:13:25', 0, '2025-09-02 15:13:25', 0),
	(227, 76, 1, '2025-09-03 13:56:17', 0, '2025-09-03 13:56:17', 0),
	(228, 76, 1, '2025-09-03 16:10:01', 0, '2025-09-03 16:10:01', 0),
	(229, 76, 1, '2025-09-08 13:12:57', 0, '2025-09-08 13:12:57', 0),
	(230, 2, 1, '2025-09-08 15:44:00', 0, '2025-09-08 15:44:00', 0),
	(231, 76, 1, '2025-09-09 11:51:26', 0, '2025-09-09 11:51:26', 0),
	(232, 76, 1, '2025-09-10 12:01:50', 0, '2025-09-10 12:01:50', 0),
	(233, 76, 1, '2025-09-11 11:38:29', 0, '2025-09-11 11:38:29', 0),
	(234, 76, 1, '2025-09-12 12:25:00', 0, '2025-09-12 12:25:00', 0);

-- Dumping structure for table pos_resto.foreign_currency_type
CREATE TABLE IF NOT EXISTS `foreign_currency_type` (
  `fcyid` smallint(6) NOT NULL AUTO_INCREMENT,
  `desc1` varchar(20) DEFAULT NULL,
  `desc2` varchar(20) DEFAULT NULL,
  `desc3` varchar(20) DEFAULT NULL,
  `ratefcy` decimal(5,4) DEFAULT NULL,
  `chgbakfcy` tinyint(4) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`fcyid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.foreign_currency_type: ~2 rows (approximately)
INSERT INTO `foreign_currency_type` (`fcyid`, `desc1`, `desc2`, `desc3`, `ratefcy`, `chgbakfcy`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'HK Dollars ', 'HK Dollars          ', 'HK Dollars          ', 0.1282, 1, 1, '2025-01-01 00:00:00', 1, '2025-04-29 16:05:30', 1),
	(2, 'CNY Dollars ', 'CNY Dollars         ', 'CNY Dollars         ', 0.1410, 1, 1, '2025-01-01 00:00:00', 1, '2025-04-29 16:05:30', 1),
	(3, 'ID Currency', NULL, NULL, 1.0000, 1, 0, '2025-04-29 16:05:12', 1, '2025-04-29 16:05:34', 1);

-- Dumping structure for table pos_resto.member_class
CREATE TABLE IF NOT EXISTS `member_class` (
  `mclass` int(11) NOT NULL AUTO_INCREMENT,
  `desc1` varchar(200) DEFAULT NULL,
  `desc2` varchar(200) DEFAULT NULL,
  `desc3` varchar(200) DEFAULT NULL,
  `discid1` varchar(200) DEFAULT NULL,
  `discid2` varchar(200) DEFAULT NULL,
  `discid3` varchar(200) DEFAULT NULL,
  `discid4` varchar(200) DEFAULT NULL,
  `discid5` varchar(200) DEFAULT NULL,
  `discid6` varchar(200) DEFAULT NULL,
  `discid7` varchar(200) DEFAULT NULL,
  `discid8` varchar(200) DEFAULT NULL,
  `discid9` varchar(200) DEFAULT NULL,
  `discid10` varchar(200) DEFAULT NULL,
  `prilevel` varchar(200) DEFAULT NULL,
  `pridiscid` varchar(200) DEFAULT NULL,
  `periodra1` varchar(200) DEFAULT NULL,
  `periodra2` varchar(200) DEFAULT NULL,
  `periodra3` varchar(200) DEFAULT NULL,
  `periodra4` varchar(200) DEFAULT NULL,
  `periodra5` varchar(200) DEFAULT NULL,
  `outletra1` varchar(200) DEFAULT NULL,
  `outletra2` varchar(200) DEFAULT NULL,
  `outletra3` varchar(200) DEFAULT NULL,
  `outletra4` varchar(200) DEFAULT NULL,
  `outletra5` varchar(200) DEFAULT NULL,
  `starange1` varchar(200) DEFAULT NULL,
  `starange2` varchar(200) DEFAULT NULL,
  `starange3` varchar(200) DEFAULT NULL,
  `starange4` varchar(200) DEFAULT NULL,
  `starange5` varchar(200) DEFAULT NULL,
  `minremain` varchar(200) DEFAULT NULL,
  `accexpday` varchar(200) DEFAULT NULL,
  `balexpday` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`mclass`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.member_class: ~2 rows (approximately)
INSERT INTO `member_class` (`mclass`, `desc1`, `desc2`, `desc3`, `discid1`, `discid2`, `discid3`, `discid4`, `discid5`, `discid6`, `discid7`, `discid8`, `discid9`, `discid10`, `prilevel`, `pridiscid`, `periodra1`, `periodra2`, `periodra3`, `periodra4`, `periodra5`, `outletra1`, `outletra2`, `outletra3`, `outletra4`, `outletra5`, `starange1`, `starange2`, `starange3`, `starange4`, `starange5`, `minremain`, `accexpday`, `balexpday`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'test', NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2', '3', '4', NULL, NULL, NULL, NULL, '5', NULL, NULL, NULL, NULL, '6', NULL, NULL, NULL, NULL, '7', '8', '9', 1, '2025-04-30 15:36:44', 1, '2025-04-30 15:36:56', 1),
	(2, 'test4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-04-30 15:37:01', 1, '2025-04-30 15:37:06', 1);

-- Dumping structure for table pos_resto.member_transaction_type
CREATE TABLE IF NOT EXISTS `member_transaction_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transtype` varchar(0) DEFAULT NULL,
  `desc1` varchar(0) DEFAULT NULL,
  `desc2` varchar(0) DEFAULT NULL,
  `desc3` varchar(0) DEFAULT NULL,
  `seq` varchar(0) DEFAULT NULL,
  `type` varchar(0) DEFAULT NULL,
  `opendesc` varchar(0) DEFAULT NULL,
  `opendrw` varchar(0) DEFAULT NULL,
  `payid` varchar(0) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.member_transaction_type: ~0 rows (approximately)

-- Dumping structure for table pos_resto.menu
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menuSet` varchar(50) NOT NULL DEFAULT '',
  `menuSetMinQty` tinyint(4) NOT NULL DEFAULT 0,
  `name` varchar(200) NOT NULL DEFAULT '',
  `descm` varchar(200) NOT NULL DEFAULT '',
  `descs` varchar(200) NOT NULL DEFAULT '',
  `menuLookupId` smallint(6) NOT NULL DEFAULT 0,
  `startDate` date NOT NULL DEFAULT '2020-01-01',
  `endDate` date NOT NULL DEFAULT '2030-01-01',
  `discountGroupId` smallint(6) NOT NULL DEFAULT 0,
  `adjustItemsId` varchar(20) DEFAULT NULL,
  `menuTaxScId` tinyint(4) NOT NULL DEFAULT 0,
  `qty` int(11) NOT NULL DEFAULT 0,
  `sku` varchar(200) NOT NULL DEFAULT '',
  `barcode` varchar(200) NOT NULL DEFAULT '',
  `keyword` varchar(200) NOT NULL DEFAULT '',
  `price1` decimal(9,2) DEFAULT NULL,
  `price2` decimal(9,2) DEFAULT NULL,
  `price3` decimal(12,2) DEFAULT NULL,
  `price4` decimal(9,2) DEFAULT NULL,
  `price5` decimal(9,2) DEFAULT NULL,
  `specialPrice1` decimal(9,2) DEFAULT NULL,
  `specialPrice2` decimal(9,2) DEFAULT NULL,
  `specialPrice3` decimal(9,2) DEFAULT NULL,
  `specialPrice4` decimal(9,2) DEFAULT NULL,
  `specialPrice5` decimal(9,2) DEFAULT NULL,
  `cost` decimal(9,2) DEFAULT NULL,
  `printerId` smallint(6) NOT NULL DEFAULT 0,
  `printerGroupId` smallint(6) NOT NULL DEFAULT 0,
  `itemGroupId` varchar(4) DEFAULT NULL,
  `orderLevelGroupId` smallint(6) DEFAULT NULL,
  `menuDepartmentId` int(11) NOT NULL DEFAULT 0,
  `menuCategoryId` int(11) NOT NULL DEFAULT 0,
  `menuClassId` int(11) NOT NULL DEFAULT 0,
  `modifierGroupId` smallint(6) NOT NULL DEFAULT 0,
  `taxStatus` varchar(200) DEFAULT NULL,
  `scStatus` varchar(200) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.menu: ~83 rows (approximately)
INSERT INTO `menu` (`id`, `menuSet`, `menuSetMinQty`, `name`, `descm`, `descs`, `menuLookupId`, `startDate`, `endDate`, `discountGroupId`, `adjustItemsId`, `menuTaxScId`, `qty`, `sku`, `barcode`, `keyword`, `price1`, `price2`, `price3`, `price4`, `price5`, `specialPrice1`, `specialPrice2`, `specialPrice3`, `specialPrice4`, `specialPrice5`, `cost`, `printerId`, `printerGroupId`, `itemGroupId`, `orderLevelGroupId`, `menuDepartmentId`, `menuCategoryId`, `menuClassId`, `modifierGroupId`, `taxStatus`, `scStatus`, `image`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(18, '', 0, 'BUNCIS GRG TLR ASIN', 'BUNCIS GRG TLR ASIN                     ', 'BUNCIS GRG TLR ASIN ', 6, '2020-01-01', '2026-01-08', 3, '14', 1, 100003, '                    ', '                    ', '                    ', 43900.00, 43900.00, 43900.00, 43900.00, 43900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 1, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(19, '', 0, 'JMR THU GRG LD GRM', 'JMR THU GRG LD GRM                      ', 'JMR THU GRG LD GRM  ', 6, '2020-01-01', '2030-01-01', 3, '13', 1, 100002, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 1, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(20, '', 0, 'ENOKI GRG LD GRM', 'ENOKI GRG LD GRM                        ', 'ENOKI GRG LD GRM    ', 6, '2020-01-01', '2030-01-01', 3, '6', 1, 100986, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 1, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(21, '', 0, 'SYP AYM GRG BWG PTH', 'SYP AYM GRG BWG PTH                     ', 'SYP AYM GRG BWG PTH ', 5, '2020-01-01', '2030-01-01', 3, '7', 1, 100986, '                    ', '                    ', '                    ', 43900.00, 43900.00, 43900.00, 43900.00, 43900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 1, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(22, '', 0, 'TAHU GRG TELUR ASIN', 'TAHU GRG TELUR ASIN                     ', 'TAHU GRG TLR ASIN   ', 5, '2020-01-01', '2030-01-01', 3, '8', 1, 100000, '                    ', '                    ', '                    ', 48900.00, 48900.00, 48900.00, 48900.00, 48900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 1, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(23, '', 0, 'TAHU GRG LADA GRM', 'TAHU GRG LADA GRM                       ', 'TAHU GRG LD GRM     ', 5, '2020-01-01', '2030-01-01', 3, '9', 1, 100000, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 1, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(24, '', 0, 'MANGGO KYOTO', 'MANGGO KYOTO                            ', 'MANGGO KYOTO        ', 3, '2020-01-01', '2030-01-01', 3, 'A0120', 1, 500, '                    ', '                    ', '                    ', 30000.00, 32000.00, 33000.00, 34000.00, 35000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 1, 5, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(25, '', 0, 'PASSION CCNT DELIGHT', 'PASSION CCNT DELIGHT                    ', 'PASSION CCNT DELIGHT', 3, '2020-01-01', '2030-01-01', 3, '3', 1, 107, '                    ', '                    ', '                    ', 20000.00, 29900.00, 29900.00, 29900.00, 29900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 1, 5, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(26, '', 0, 'STRAWBERRY MOJITO', 'STRAWBERRY MOJITO                       ', 'STRAWBERRY MOJITO   ', 3, '2020-01-01', '2030-01-01', 3, '', 1, 0, '                    ', '                    ', '                    ', 10000.00, 41900.00, 41900.00, 41900.00, 41900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 1, 5, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(27, '', 0, 'SIEW MAI BOBA', 'SIEW MAI BOBA', 'SIEW MAI BOBA       ', 10, '2020-01-01', '2030-01-01', 3, '', 1, 0, '                    ', '                    ', '                    ', 27900.00, 27900.00, 27900.00, 27900.00, 27900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 7, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(28, '', 0, 'TIM UDG SRG BURUNG', 'TIM UDG SRG BURUNG                      ', 'TIM UDG SRG BURUNG  ', 5, '2020-01-01', '2030-01-01', 3, '', 1, 0, '                    ', '                    ', '                    ', 28900.00, 28900.00, 28900.00, 28900.00, 28900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 7, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(29, '', 0, 'NS GRG SAPI PDS', 'NS GRG SAPI PDS                         ', 'NS GRG SAPI PDS     ', 4, '2020-01-01', '2030-01-01', 3, 'A0110', 1, 50, '                    ', '                    ', '                    ', 46900.00, 46900.00, 46900.00, 46900.00, 46900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 7, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(30, '', 0, 'KW UDG KUAH PDS', 'KW UDG KUAH PDS                         ', 'KW UDG KUAH PDS     ', 6, '2020-01-01', '2030-01-01', 3, '19', 1, 6, '                    ', '                    ', '                    ', 49900.00, 49900.00, 49900.00, 49900.00, 49900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 7, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(31, '', 0, 'BAKSO UDG KEJU', 'BAKSO UDG KEJU                          ', 'BAKSO UDG KEJU      ', 11, '2020-01-01', '2030-01-01', 3, '20', 1, 6, '                    ', '                    ', '                    ', 26900.00, 26900.00, 26900.00, 26900.00, 26900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 7, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(32, '', 0, 'OREO GRG', 'OREO GRG                                ', 'OREO GRG            ', 10, '2020-01-01', '2030-01-01', 3, '21', 1, 6, '                    ', '                    ', '                    ', 19900.00, 19900.00, 19900.00, 19900.00, 19900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 7, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(33, '', 0, 'KW KUAH SAPI', 'KW KUAH SAPI                            ', 'KW KUAH SAPI        ', 4, '2020-01-01', '2030-01-01', 3, 'A0022', 1, 6, '                    ', '                    ', '                    ', 55900.00, 55900.00, 55900.00, 55900.00, 55900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 7, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(34, '', 0, 'NS TIM AYM PDS', 'NS TIM AYM PDS                          ', 'NS TIM AYM PDS      ', 4, '2020-01-01', '2030-01-01', 3, 'A0023', 1, 6, '                    ', '                    ', '                    ', 42900.00, 42900.00, 42900.00, 42900.00, 42900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 7, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(35, '', 0, 'BUBUR 1 RASA AYM', 'BUBUR 1 RASA AYM                        ', 'BUBUR 1 RASA AYM    ', 11, '2020-01-01', '2030-01-01', 3, 'A0126', 1, 50, '                    ', '                    ', '                    ', 30900.00, 30900.00, 30900.00, 30900.00, 30900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(36, '', 0, 'BUBUR 1 RASA IKAN', 'BUBUR 1 RASA IKAN                       ', 'BUBUR 1 RASA IKAN   ', 11, '2020-01-01', '2030-01-01', 3, 'A0127', 1, 50, '                    ', '                    ', '                    ', 30900.00, 30900.00, 30900.00, 30900.00, 30900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(37, '', 0, 'BUBUR 1 RASA PHITAN', 'BUBUR 1 RASA PHITAN                     ', 'BUBUR 1 RASA PHITAN ', 11, '2020-01-01', '2030-01-01', 3, 'A0129', 1, 2, '                    ', '                    ', '                    ', 30900.00, 30900.00, 30900.00, 30900.00, 30900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(38, '', 0, 'BUBUR 1 RASA UDANG', 'BUBUR 1 RASA UDANG                      ', 'BUBUR 1 RASA UDANG  ', 11, '2020-01-01', '2030-01-01', 2, 'A0048', 1, 5, '                    ', '                    ', '                    ', 30900.00, 30900.00, 30900.00, 30900.00, 30900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(39, '', 0, 'BUBUR 2 RASA AI', 'BUBUR 2 RASA AI                         ', 'BUBUR 2 RASA AI     ', 11, '2020-01-01', '2030-01-01', 2, 'A0030', 1, 50, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(40, '', 0, 'BUBUR 2 RASA AP', 'BUBUR 2 RASA AP                         ', 'BUBUR 2 RASA AP     ', 11, '2020-01-01', '2030-01-01', 2, 'A0049', 1, 50, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(41, '', 0, 'BUBUR 2 RASA AU', 'BUBUR 2 RASA AU                         ', 'BUBUR 2 RASA AU     ', 11, '2020-01-01', '2030-01-01', 2, 'A0050', 1, 50, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(42, '', 0, 'BUBUR 2 RASA I P', 'BUBUR 2 RASA I P                        ', 'BUBUR 2 RASA I P    ', 11, '2020-01-01', '2030-01-01', 2, 'A0051', 1, 50, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(43, '', 0, 'BUBUR 2 RASA I U', 'BUBUR 2 RASA I U                        ', 'BUBUR 2 RASA I U    ', 11, '2020-01-01', '2030-01-01', 2, 'A0052', 1, 50, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(44, '', 0, 'BUBUR 2 RASA PU', 'BUBUR 2 RASA PU                         ', 'BUBUR 2 RASA PU     ', 11, '2020-01-01', '2030-01-01', 2, 'A0053', 1, 50, '                    ', '                    ', '                    ', 36900.00, 36900.00, 36900.00, 36900.00, 36900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(45, '', 0, 'BUBUR 3 RASA AIP', 'BUBUR 3 RASA AIP                        ', 'BUBUR 3 RASA AIP    ', 11, '2020-01-01', '2030-01-01', 2, 'A0054', 1, 50, '                    ', '                    ', '                    ', 42900.00, 42900.00, 42900.00, 42900.00, 42900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(46, '', 0, 'BUBUR 3 RASA AIU', 'BUBUR 3 RASA AIU                        ', 'BUBUR 3 RASA AIU    ', 11, '2020-01-01', '2030-01-01', 2, 'A0055', 1, 50, '                    ', '                    ', '                    ', 42900.00, 42900.00, 42900.00, 42900.00, 42900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(47, '', 0, 'BUBUR 3 RASA APU', 'BUBUR 3 RASA APU                        ', 'BUBUR 3 RASA APU    ', 11, '2020-01-01', '2030-01-01', 2, 'A0056', 1, 50, '                    ', '                    ', '                    ', 42900.00, 42900.00, 42900.00, 42900.00, 42900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(48, '', 0, 'BUBUR 3 RASA IPU', 'BUBUR 3 RASA IPU                        ', 'BUBUR 3 RASA IPU    ', 11, '2020-01-01', '2030-01-01', 2, 'A0114', 1, 3, '                    ', '                    ', '                    ', 42900.00, 42900.00, 42900.00, 42900.00, 42900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(49, '', 0, 'ADD CHICKEN', 'ADD CHICKEN                             ', 'ADD CHICKEN         ', 6, '2020-01-01', '2030-01-01', 2, 'A0058', 1, 50, '                    ', '                    ', '                    ', 10900.00, 10900.00, 10900.00, 10900.00, 10900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(50, '', 0, 'ADD FISH', 'ADD FISH                                ', 'ADD FISH            ', 6, '2020-01-01', '2030-01-01', 2, 'A0059', 1, 50, '                    ', '                    ', '                    ', 14900.00, 14900.00, 14900.00, 14900.00, 14900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:12', 1),
	(51, '', 0, 'ADD PHITAN', 'ADD PHITAN                              ', 'ADD PHITAN          ', 6, '2020-01-01', '2030-01-01', 2, 'A0060', 1, 50, '                    ', '                    ', '                    ', 17900.00, 17900.00, 17900.00, 17900.00, 17900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(52, '', 0, 'ADD SHRIMP', 'ADD SHRIMP                              ', 'ADD SHRIMP          ', 6, '2020-01-01', '2030-01-01', 2, 'A0061', 1, 50, '                    ', '                    ', '                    ', 22900.00, 22900.00, 22900.00, 22900.00, 22900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(53, '', 0, 'SUP JGG DG AYM', 'SUP JGG DG AYM                          ', 'SUP JGG DG AYM      ', 4, '2020-01-01', '2030-01-01', 2, 'A0062', 1, 50, '                    ', '                    ', '                    ', 31900.00, 31900.00, 31900.00, 31900.00, 31900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(54, '', 0, 'SUP KPTG ASPRGS', 'SUP KPTG ASPRGS                         ', 'SUP KPTG ASPRGS     ', 4, '2020-01-01', '2030-01-01', 2, 'A0063', 1, 50, '                    ', '                    ', '                    ', 37900.00, 37900.00, 37900.00, 37900.00, 37900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(55, '', 0, 'SUP WAN TON', 'SUP WAN TON                             ', 'SUP WAN TON         ', 4, '2020-01-01', '2030-01-01', 2, 'A0064', 1, 50, '                    ', '                    ', '                    ', 41900.00, 41900.00, 41900.00, 41900.00, 41900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(56, '', 0, 'BUBUR 1 RASA', 'BUBUR 1 RASA                            ', 'BUBUR 1 RASA        ', 11, '2020-01-01', '2030-01-01', 2, 'A0065', 1, 50, '                    ', '                    ', '                    ', 29900.00, 29900.00, 29900.00, 29900.00, 29900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(57, '', 0, 'BUBUR 2 RASA', 'BUBUR 2 RASA                            ', 'BUBUR 2 RASA        ', 11, '2020-01-01', '2030-01-01', 2, 'A0066', 1, 1, '                    ', '                    ', '                    ', 35900.00, 35900.00, 35900.00, 35900.00, 35900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(58, '', 0, 'BUBUR 3 RASA', 'BUBUR 3 RASA                            ', 'BUBUR 3 RASA        ', 11, '2020-01-01', '2030-01-01', 2, 'A0067', 1, 1, '                    ', '                    ', '                    ', 41900.00, 41900.00, 41900.00, 41900.00, 41900.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 9, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(59, '', 0, 'AYAM GRG KEJU DD', 'AYAM GRG KEJU DD                        ', 'AYAM GRG KEJU DD    ', 6, '2020-01-01', '2030-01-01', 2, 'A0068', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(60, '', 0, 'BAKPAO DUCKLING DD', 'BAKPAO DUCKLING DD                      ', 'BAKPAO DUCKLING DD  ', 6, '2020-01-01', '2030-01-01', 2, 'A0069', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(61, '', 0, 'BAKPAO MANGGIS DD', 'BAKPAO MANGGIS DD                       ', 'BAKPAO MANGGIS DD   ', 6, '2020-01-01', '2030-01-01', 2, 'A0070', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(62, '', 0, 'BAKPAO PANDA DD', 'BAKPAO PANDA DD                         ', 'BAKPAO PANDA DD     ', 6, '2020-01-01', '2030-01-01', 2, 'A0071', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(63, '', 0, 'BAKPAO TLR ASIN DD', 'BAKPAO TLR ASIN DD                      ', 'BAKPAO TLR ASIN DD  ', 6, '2020-01-01', '2030-01-01', 2, 'A0072', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(64, '', 0, 'BAKPAO BIRTHDAY DD', 'BAKPAO BIRTHDAY DD                      ', 'BAKPAO BIRTHDAY DD  ', 6, '2020-01-01', '2030-01-01', 2, 'A0073', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(65, '', 0, 'CAKWE UDG MAYO DD', 'CAKWE UDG MAYO DD                       ', 'CAKWE UDG MAYO DD   ', 6, '2020-01-01', '2030-01-01', 2, 'A0074', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(66, '', 0, 'FONG ZAU DD', 'FONG ZAU DD                             ', 'FONG ZAU DD         ', 6, '2020-01-01', '2030-01-01', 2, 'A0075', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(67, '', 0, 'GAO ZI DD', 'GAO ZI DD                               ', 'GAO ZI DD           ', 6, '2020-01-01', '2030-01-01', 2, 'A0076', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(68, '', 0, 'IMPERIAL HA KAU DD', 'IMPERIAL HA KAU DD                      ', 'IMPERIAL HA KAU DD  ', 6, '2020-01-01', '2030-01-01', 1, 'A0077', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(69, '', 0, 'LMP AYM TIRAM DD', 'LMP AYM TIRAM DD                        ', 'LMP AYM TIRAM DD    ', 4, '2020-01-01', '2030-01-01', 1, 'A0078', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(70, '', 0, 'LMP AYM JMR DD', 'LMP AYM JMR DD                          ', 'LMP AYM JMR DD      ', 4, '2020-01-01', '2030-01-01', 1, 'A0079', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(71, '', 0, 'LMP KLT TH UDG DD', 'LMP KLT TH UDG DD                       ', 'LMP KLT TH UDG DD   ', 4, '2020-01-01', '2030-01-01', 1, 'A0080', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(72, '', 0, 'LMP SYRAN GRG DD', 'LMP SYRAN GRG DD                        ', 'LMP SYRAN GRG DD    ', 4, '2020-01-01', '2030-01-01', 1, 'A0081', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(73, '', 0, 'MANTAO PGG SAPI DD', 'MANTAO PGG SAPI DD                      ', 'MANTAO PGG SAPI DD  ', 4, '2020-01-01', '2030-01-01', 1, 'A0082', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(74, '', 0, 'MANTAO GRG DD', 'MANTAO GRG DD                           ', 'MANTAO GRG DD       ', 4, '2020-01-01', '2030-01-01', 1, 'A0083', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(75, '', 0, 'MANTAO KKS DD', 'MANTAO KKS DD                           ', 'MANTAO KKS DD       ', 4, '2020-01-01', '2030-01-01', 1, 'A0084', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(76, '', 0, 'SIEW MAI DD', 'SIEW MAI DD                             ', 'SIEW MAI DD         ', 10, '2020-01-01', '2030-01-01', 1, 'A0085', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(77, '', 0, 'SIEW MAI DORI DD', 'SIEW MAI DORI DD                        ', 'SIEW MAI DORI DD    ', 7, '2020-01-01', '2030-01-01', 1, 'A0086', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(78, '', 0, 'SIEW MAI RPT LT DD', 'SIEW MAI RPT LT DD                      ', 'SIEW MAI RPT LT DD  ', 7, '2020-01-01', '2030-01-01', 1, 'A0087', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(79, '', 0, 'SIEW MAI UDG DD', 'SIEW MAI UDG DD                         ', 'SIEW MAI UDG DD     ', 7, '2020-01-01', '2030-01-01', 1, 'A0088', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(80, '', 0, 'BAKPAO TALAS DD', 'BAKPAO TALAS DD                         ', 'BAKPAO TALAS DD     ', 7, '2020-01-01', '2030-01-01', 1, 'A0089', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(81, '', 0, 'BAKPAO CHASIEW DD', 'BAKPAO CHASIEW DD                       ', 'BAKPAO CHASIEW DD   ', 7, '2020-01-01', '2030-01-01', 1, 'A0090', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(82, '', 0, 'TIM UDG SYRN DD', 'TIM UDG SYRN DD                         ', 'TIM UDG SYRN DD     ', 7, '2020-01-01', '2030-01-01', 1, 'A0091', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(83, '', 0, 'TIM BAKSO SAPI DD', 'TIM BAKSO SAPI DD                       ', 'TIM BAKSO SAPI DD   ', 7, '2020-01-01', '2030-01-01', 1, 'A0092', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(84, '', 0, 'TIM UDG JMR DD', 'TIM UDG JMR DD                          ', 'TIM UDG JMR DD      ', 7, '2020-01-01', '2030-01-01', 1, 'A0093', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(85, '', 0, 'TIM UDG SHMJ DD', 'TIM UDG SHMJ DD                         ', 'TIM UDG SHMJ DD     ', 7, '2020-01-01', '2030-01-01', 1, 'A0094', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(86, '', 0, 'WAN TON GRG DD', 'WAN TON GRG DD                          ', 'WAN TON GRG DD      ', 7, '2020-01-01', '2030-01-01', 1, 'A0095', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(87, '', 0, 'XIAO LONG BAO DD', 'XIAO LONG BAO DD                        ', 'XIAO LONG BAO DD    ', 7, '2020-01-01', '2030-01-01', 1, 'A0096', 1, 1, '                    ', '                    ', '                    ', 15000.00, 15000.00, 15000.00, 15000.00, 15000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 15, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(88, '', 0, 'AYAM GRG KEJU DF', 'AYAM GRG KEJU DF                        ', 'AYAM GRG KEJU DF    ', 7, '2020-01-01', '2030-01-01', 1, 'A0097', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(89, '', 0, 'BAKPAO DUCKLING DF', 'BAKPAO DUCKLING DF                      ', 'BAKPAO DUCKLING DF  ', 7, '2020-01-01', '2030-01-01', 1, 'A0098', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(90, '', 0, 'BAKPAO MANGGIS DF', 'BAKPAO MANGGIS DF                       ', 'BAKPAO MANGGIS DF   ', 7, '2020-01-01', '2030-01-01', 1, 'A0099', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(91, '', 0, 'BAKPAO PANDA DF', 'BAKPAO PANDA DF                         ', 'BAKPAO PANDA DF     ', 7, '2020-01-01', '2030-01-01', 1, 'A0100', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(92, '', 0, 'BAKPAO TLR ASIN DF', 'BAKPAO TLR ASIN DF                      ', 'BAKPAO TLR ASIN DF  ', 7, '2020-01-01', '2030-01-01', 1, 'A0101', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(93, '', 0, 'BAKPAO BIRTHDAY DF', 'BAKPAO BIRTHDAY DF                      ', 'BAKPAO BIRTHDAY DF  ', 7, '2020-01-01', '2030-01-01', 1, 'A0102', 1, 201, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(94, '', 0, 'CAKWE UDG MAYO DF', 'CAKWE UDG MAYO DF                       ', 'CAKWE UDG MAYO DF   ', 6, '2020-01-01', '2030-01-01', 1, 'A0103', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(95, '', 0, 'FONG ZAU DF', 'FONG ZAU DF                             ', 'FONG ZAU DF         ', 6, '2020-01-01', '2030-01-01', 1, 'A0104', 5, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(96, '', 0, 'GAO ZI DF', 'GAO ZI DF                               ', 'GAO ZI DF           ', 6, '2020-01-01', '2030-01-01', 1, 'A0105', 2, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(97, '', 0, 'IMPERIAL HA KAU DF', 'IMPERIAL HA KAU DF                      ', 'IMPERIAL HA KAU DF  ', 6, '2020-01-01', '2030-01-01', 1, 'A0106', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(98, '', 0, 'LMP AYM TIRAM DF', 'LMP AYM TIRAM DF                        ', 'LMP AYM TIRAM DF    ', 4, '2020-01-01', '2030-01-01', 1, 'A0107', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(99, '', 0, 'LMP AYM JMR DF Jr', 'LMP AYM JMR DF                          ', 'LMP AYM JMR DF      ', 4, '2020-01-01', '2029-10-19', 1, 'A0108', 1, 1, '                    ', '                    ', '                    ', 9999.00, 9999.00, 9999.00, 9999.00, 9999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 1, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(100, 'FIXED', 0, 'PAKET 1', 'PAKET 1', 'PAKET 1', 19, '2020-01-01', '2030-01-01', 1, 'A0130', 1, 500, '                    ', '                    ', '                    ', 120000.00, 122000.00, 123000.00, 124000.00, 125000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 8, '    ', 1, 2, 16, 0, 1, '1', '1', '                              ', 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1),
	(101, 'SELECT', 3, 'PAKET 2', 'PAKET 2', 'PAKET 2', 19, '2020-01-01', '2030-01-01', 1, 'A0131', 1, 507, '', '', '', 130000.00, 130000.00, 130000.00, 130000.00, 130000.00, NULL, NULL, NULL, NULL, NULL, NULL, 1, 8, NULL, 1, 2, 16, 0, 1, NULL, NULL, NULL, 1, '2025-01-01 00:00:00', 1, '2025-08-13 13:25:13', 1);

-- Dumping structure for table pos_resto.menu_category
CREATE TABLE IF NOT EXISTS `menu_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idx` varchar(10) NOT NULL DEFAULT '0',
  `desc1` varchar(200) NOT NULL DEFAULT '',
  `mjcat` varchar(200) NOT NULL DEFAULT '',
  `kmcolor` varchar(200) NOT NULL DEFAULT '',
  `srvorder` tinyint(4) DEFAULT NULL,
  `sttime` varchar(200) DEFAULT NULL,
  `endtime` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.menu_category: ~66 rows (approximately)
INSERT INTO `menu_category` (`id`, `idx`, `desc1`, `mjcat`, `kmcolor`, `srvorder`, `sttime`, `endtime`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'AP02', 'APPETIZER K2                  ', '    2', '      3', 2, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(2, 'AP03', 'APPETIZER K2 OL               ', '    6', '      5', 2, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(3, 'BR01', 'BAR RECOMENDATION             ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(4, 'BR02', 'BAR RECOMENDATION K2 OL       ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(5, 'CM02', 'COCKTAIL&MOCKTAIL K2          ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(6, 'CM03', 'COCKTAIL&MOCKTAIL K2 OL       ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(7, 'CR02', 'CHEF RECOMENDATION K2         ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(8, 'CR03', 'CHEF RECOMENDATION K2 OL      ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(9, 'CS02', 'COUNGE & SOUP K2              ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(10, 'CS03', 'COUNGE & SOUP K2 OL           ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(11, 'D102', 'DIMSUM REG K2                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(12, 'D103', 'DIMSUM REG K2 OL              ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(13, 'D202', 'DESSERT K2                    ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(14, 'D203', 'DESSERT K2 OL                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(15, 'DD02', 'DIMSUM DAY K2                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(16, 'DF02', 'DIMSUM FIESTA K2              ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(17, 'DR02', 'DRINK RECOMENDATION           ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(18, 'DR03', 'DESSERT RECOMENDATION         ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(19, 'DR04', 'DESSERT RECOMENDATION OL      ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(20, 'DS01', 'DIMSUM SMALL K2               ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(21, 'DS02', 'DIMSUM SMALL K2 OL            ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(22, 'E002', 'EZEELINK                      ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(23, 'FI02', 'FREE ITEM                     ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(24, 'HC02', 'HOT COFFEE K2                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(25, 'HC03', 'HOT COFFEE K2 OL              ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(26, 'HT02', 'HOT TEA K2                    ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(27, 'HT03', 'HOT TEA K2 OL                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(28, 'IT02', 'ICED TEA K2                   ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(29, 'IT03', 'ICED TEA K2 OL                ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(30, 'J002', 'JUICES K2                     ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(31, 'J003', 'JUICES K2 OL                  ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(32, 'M002', 'MILKSHAKE K2                  ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(33, 'M003', 'MILKSHAKE K2 OL               ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(34, 'MB01', 'MINI BOWL K2                  ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(35, 'MB02', 'MINI BOWL K2 OL               ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(36, 'MC02', 'MOON CAKE K2                  ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(37, 'MP01', 'MARKET PLACE K2               ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(38, 'MP02', 'MARKET PLACE K2 OL            ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(39, 'N002', 'NOODLE K2                     ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(40, 'N003', 'NOODLE K2 OL                  ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(41, 'O002', 'OTHER K2                      ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(42, 'O003', 'OTHER K2 OL                   ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(43, 'P002', 'PACKAGING                     ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(44, 'R002', 'RICE(CHINESE FOOD) K2         ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(45, 'R003', 'RICE(CHINESE FOOD) K2 OL      ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(46, 'R101', 'RETAIL                        ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(47, 'S002', 'SEAFOOD K2                    ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(48, 'S003', 'SEAFOOD K2 OL                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(49, 'SD12', 'SPECIAL DISHES(CHINESE FOOD)K2', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(50, 'SD13', 'SPECIAL DISHES K2 OL          ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(51, 'SD22', 'SOFT DRINK K2                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(52, 'SD23', 'SOFT DRINK K2 OL              ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(53, 'SE01', 'SPECIAL EVENT K2              ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(54, 'SE02', 'SPECIAL EVENT K2 OL           ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(55, 'SM02', 'SET MENU K2                   ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(56, 'SO02', 'SIDE ORDER K2                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(57, 'SO03', 'SIDE ORDER K2 OL              ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(58, 'SP02', 'PROMO FOOD K2                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(59, 'SP03', 'PROMO FOOD  K2 OL             ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(60, 'SP04', 'PROMO BEVERAGE K2             ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(61, 'SP05', 'PROMO BEVERAGE OL K2          ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(62, 'TA02', 'FOOD TAKE AWAY K2             ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(63, 'TA03', 'FOOD TAKE AWAY K2 OL          ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(64, 'V002', 'VEGETABLES K2                 ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(65, 'V003', 'VEGETABLES K2 OL              ', '    ', '      ', 0, '      ', '      ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:50:22', 1),
	(66, '0', 'Set 1', '', '', NULL, NULL, NULL, 0, '2025-05-08 17:35:23', 1, '2025-05-08 17:36:21', 1);

-- Dumping structure for table pos_resto.menu_class
CREATE TABLE IF NOT EXISTS `menu_class` (
  `id` varchar(200) NOT NULL DEFAULT '0',
  `desc1` varchar(200) DEFAULT NULL,
  `mjclass` varchar(200) DEFAULT NULL,
  `kmcolor` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.menu_class: ~0 rows (approximately)
INSERT INTO `menu_class` (`id`, `desc1`, `mjclass`, `kmcolor`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	('0', '123', '1', '3', 0, '2025-05-08 17:56:41', 1, '2025-05-08 17:57:30', 1);

-- Dumping structure for table pos_resto.menu_department
CREATE TABLE IF NOT EXISTS `menu_department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idx` varchar(200) NOT NULL DEFAULT '0',
  `desc1` varchar(200) DEFAULT NULL,
  `mjdept` varchar(200) DEFAULT NULL,
  `kmcolor` varchar(200) DEFAULT NULL,
  `printseq` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.menu_department: ~7 rows (approximately)
INSERT INTO `menu_department` (`id`, `idx`, `desc1`, `mjdept`, `kmcolor`, `printseq`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'B101', 'BEVERAGE', '    2', '      3', '  4', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:49:52', 1),
	(2, 'F101', 'FOOD', '    1', '      ', '  ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:49:52', 1),
	(3, 'IC01', 'IMPERIAL CARD', '    ', '      ', '0 ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:49:52', 1),
	(4, 'M101', 'MISC.', '    ', '      ', '  ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:49:52', 1),
	(5, 'R101', 'RETAIL', '    ', '      ', '0 ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:49:52', 1),
	(6, 'V001', 'VOUCHER', '    ', '      ', '0 ', 1, '2025-01-01 00:00:00', 1, '2025-05-08 17:49:52', 1);

-- Dumping structure for table pos_resto.menu_lookup
CREATE TABLE IF NOT EXISTS `menu_lookup` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `departmentId` smallint(6) NOT NULL DEFAULT 0,
  `parentId` smallint(6) NOT NULL DEFAULT 0,
  `name` varchar(200) NOT NULL,
  `sorting` smallint(6) NOT NULL DEFAULT 999,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` varchar(50) NOT NULL DEFAULT '',
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.menu_lookup: ~14 rows (approximately)
INSERT INTO `menu_lookup` (`id`, `departmentId`, `parentId`, `name`, `sorting`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 1, 0, 'Beverage', 1, 1, '2025-01-01 00:00:00', '', '2025-08-04 16:32:27', ''),
	(2, 2, 0, 'Food', 2, 1, '2025-01-01 00:00:00', '', '2025-07-30 13:33:14', ''),
	(3, 0, 1, 'Soft Drink', 1, 1, '2025-01-01 00:00:00', '', '2025-08-04 16:32:21', ''),
	(4, 0, 1, 'Coffee', 2, 1, '2025-01-01 00:00:00', '', '2025-08-04 16:32:21', ''),
	(5, 0, 1, 'Alcohol', 3, 1, '2025-01-01 00:00:00', '', '2025-01-01 00:00:00', ''),
	(6, 0, 2, 'APPETIZER', 999, 1, '2025-01-01 00:00:00', '', '2025-01-01 00:00:00', ''),
	(7, 0, 2, 'DIMSUM', 999, 1, '2025-01-01 00:00:00', '', '2025-01-01 00:00:00', ''),
	(10, 0, 2, 'DESSERT', 999, 1, '2025-01-01 00:00:00', '', '2025-01-01 00:00:00', ''),
	(11, 0, 2, 'BUBUR', 999, 1, '2025-01-01 00:00:00', '', '2025-01-01 00:00:00', ''),
	(16, 0, 7, 'child of DIMSUM 2', 999, 1, '2025-06-17 21:08:11', '', '2025-06-17 21:08:21', ''),
	(17, 0, 7, 'child of DIMSUM 1', 999, 1, '2025-06-17 21:08:15', '', '2025-06-17 21:08:19', ''),
	(18, 0, 7, 'child of DIMSUM 3', 999, 1, '2025-06-17 21:08:17', '', '2025-06-17 21:08:22', ''),
	(19, 0, 2, 'Paket', 999, 1, '2025-07-28 17:30:26', '', '2025-07-28 17:30:30', ''),
	(20, 0, 0, 'Paket Promo', 999, 1, '2025-07-30 14:09:41', '', '2025-07-30 14:10:10', '');

-- Dumping structure for table pos_resto.menu_set
CREATE TABLE IF NOT EXISTS `menu_set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menuId` int(11) NOT NULL DEFAULT 0,
  `detailMenuId` int(11) NOT NULL DEFAULT 0,
  `minQty` smallint(1) NOT NULL DEFAULT 1,
  `maxQty` smallint(1) NOT NULL DEFAULT 1,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.menu_set: ~27 rows (approximately)
INSERT INTO `menu_set` (`id`, `menuId`, `detailMenuId`, `minQty`, `maxQty`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(101, 100, 92, 1, 2, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:54:02', 1),
	(102, 100, 49, 1, 3, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:54:02', 1),
	(103, 100, 35, 1, 3, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:54:02', 1),
	(104, 101, 51, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:40:47', 1),
	(105, 101, 52, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:40:47', 1),
	(106, 101, 53, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:40:47', 1),
	(107, 101, 54, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:40:47', 1),
	(108, 101, 55, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:40:47', 1),
	(109, 101, 56, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:40:47', 1),
	(110, 101, 57, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:40:47', 1),
	(111, 101, 58, 1, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 13:40:47', 1),
	(112, 100, 64, 1, 1, 0, '2025-07-30 19:38:37', 1, '2025-07-30 20:00:01', 1),
	(113, 100, 56, 1, 1, 0, '2025-07-30 19:39:14', 1, '2025-07-30 19:58:33', 1),
	(114, 100, 86, 1, 1, 0, '2025-07-30 19:39:15', 1, '2025-07-30 19:58:32', 1),
	(115, 100, 49, 1, 1, 0, '2025-07-30 19:58:42', 1, '2025-07-30 20:00:00', 1),
	(116, 100, 35, 1, 1, 0, '2025-07-30 19:58:59', 1, '2025-07-30 19:59:59', 1),
	(117, 100, 0, 1, 1, 0, '2025-07-30 20:00:02', 1, '2025-07-30 20:02:40', 1),
	(118, 100, 0, 1, 1, 0, '2025-07-30 20:00:30', 1, '2025-07-30 20:02:40', 1),
	(119, 100, 0, 1, 1, 0, '2025-07-30 20:00:50', 1, '2025-07-30 20:02:39', 1),
	(120, 100, 49, 1, 3, 1, '2025-07-30 20:02:41', 1, '2025-07-31 13:54:02', 1),
	(121, 100, 50, 1, 2, 1, '2025-07-30 20:02:51', 1, '2025-07-31 13:54:02', 1),
	(122, 100, 52, 1, 2, 1, '2025-07-30 20:03:00', 1, '2025-07-31 13:54:02', 1),
	(123, 99, 31, 1, 1, 1, '2025-07-30 20:10:33', 1, '2025-07-31 13:58:25', 1),
	(124, 99, 63, 1, 1, 1, '2025-07-30 20:10:34', 1, '2025-07-31 13:58:25', 1),
	(125, 99, 0, 1, 1, 1, '2025-07-30 20:12:15', 1, '2025-07-31 13:58:25', 1),
	(126, 99, 0, 1, 1, 1, '2025-07-30 20:12:16', 1, '2025-07-31 13:58:25', 1),
	(127, 100, 31, 1, 1, 1, '2025-07-31 13:24:17', 1, '2025-07-31 13:54:02', 1);

-- Dumping structure for table pos_resto.menu_tax_sc
CREATE TABLE IF NOT EXISTS `menu_tax_sc` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `desc` varchar(200) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `taxRate` tinyint(4) NOT NULL DEFAULT 0,
  `taxNote` varchar(50) NOT NULL DEFAULT '',
  `taxStatus` tinyint(4) DEFAULT NULL,
  `scRate` tinyint(4) NOT NULL DEFAULT 0,
  `scNote` varchar(50) NOT NULL DEFAULT '',
  `scStatus` tinyint(4) DEFAULT NULL,
  `scTaxIncluded` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.menu_tax_sc: ~5 rows (approximately)
INSERT INTO `menu_tax_sc` (`id`, `desc`, `name`, `taxRate`, `taxNote`, `taxStatus`, `scRate`, `scNote`, `scStatus`, `scTaxIncluded`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Tax & S.C.', 'Tax & S.C.', 10, '10% Tax ', 1, 5, 'S.C. 5%', 1, 0, 1, '2025-01-01 00:00:00', 1, '2025-08-19 18:33:34', 1),
	(2, 'Tax', 'Tax', 10, '10% Tax ', 1, 0, 'No S.C', 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-19 18:33:34', 1),
	(3, 'Tax Only', 'Tax Only', 10, 'Include Tax ', 2, 0, 'No S.C', 0, 1, 1, '2025-01-01 00:00:00', 1, '2025-08-19 18:33:35', 1),
	(4, 'EzeeLink', 'EzeeLink', 10, 'Include Tax ', 2, 0, 'No S.C', 0, 0, 1, '2025-01-01 00:00:00', 1, '2025-08-19 18:33:35', 1),
	(5, 'Tax & S.C.Include', 'Tax & S.C.Include', 10, 'Include Tax ', 2, 5, 'Include No S.C 5%', 2, 0, 1, '2025-01-01 00:00:00', 1, '2025-08-19 18:33:35', 1),
	(6, NULL, 'test', 0, '434', 1, 0, '', 0, 0, 0, '2025-08-06 17:56:42', 1, '2025-08-06 17:56:55', 1);

-- Dumping structure for table pos_resto.menu_tax_sc_status
CREATE TABLE IF NOT EXISTS `menu_tax_sc_status` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.menu_tax_sc_status: ~3 rows (approximately)
INSERT INTO `menu_tax_sc_status` (`id`, `name`) VALUES
	(0, 'Disable'),
	(1, 'Enable'),
	(2, 'Item Total Include');

-- Dumping structure for table pos_resto.menu_transaction_del
CREATE TABLE IF NOT EXISTS `menu_transaction_del` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) NOT NULL DEFAULT '',
  `adjustItemsId` varchar(50) NOT NULL DEFAULT '',
  `menuId` varchar(50) NOT NULL DEFAULT '',
  `void` tinyint(2) NOT NULL DEFAULT 0,
  `sendOrder` varchar(50) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.menu_transaction_del: ~8 rows (approximately)
INSERT INTO `menu_transaction_del` (`id`, `cartId`, `adjustItemsId`, `menuId`, `void`, `sendOrder`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, '250729000290', 'DELETE', '100', 1, '', 0, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(2, '250729000290', '14', '18', 0, '', 1, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(3, '250729000290', 'A0126', '35', 0, '', 1, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(4, '250729000290', 'A0069', '60', 0, '', 1, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(5, '250729000290', 'DELETE', '100', 1, '', 0, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(6, '250729000290', '14', '18', 0, '', 1, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(7, '250729000290', 'A0126', '35', 0, '', 1, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(8, '250729000290', 'A0069', '60', 0, '', 1, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(9, '250729000290', 'A0130', '100', 0, '', 1, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1),
	(10, '250729000290', 'A0130', '100', 0, '', 1, '2025-07-29 17:45:21', 1, '2025-07-29 17:45:21', 1);

-- Dumping structure for table pos_resto.modifier
CREATE TABLE IF NOT EXISTS `modifier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modifierListId` mediumint(9) NOT NULL DEFAULT 0,
  `modifierGroupId` smallint(6) NOT NULL DEFAULT 0,
  `descl` varchar(200) NOT NULL DEFAULT '',
  `descm` varchar(40) NOT NULL DEFAULT '',
  `descs` varchar(20) NOT NULL DEFAULT '',
  `printing` tinyint(4) NOT NULL DEFAULT 0,
  `price1` int(11) NOT NULL DEFAULT 0,
  `price2` int(11) NOT NULL DEFAULT 0,
  `price3` int(11) NOT NULL DEFAULT 0,
  `price4` int(11) NOT NULL DEFAULT 0,
  `price5` int(11) NOT NULL DEFAULT 0,
  `sublist` varchar(6) DEFAULT NULL,
  `issublist` varchar(1) DEFAULT NULL,
  `sorting` smallint(6) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.modifier: ~34 rows (approximately)
INSERT INTO `modifier` (`id`, `modifierListId`, `modifierGroupId`, `descl`, `descm`, `descs`, `printing`, `price1`, `price2`, `price3`, `price4`, `price5`, `sublist`, `issublist`, `sorting`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(36, 1, 1, 'Tidak Pedas1', 'Tidak Pedas2', 'Tidak Pedas3', 0, 0, 0, 0, 0, 0, NULL, NULL, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:27', 1),
	(37, 1, 1, 'Pedas', 'Pedas', 'Pedas', 0, 0, 0, 0, 0, 0, NULL, NULL, 2, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:27', 1),
	(38, 1, 1, 'No oil', 'No oil', 'No oil', 0, 0, 0, 0, 0, 0, NULL, NULL, 3, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:27', 1),
	(39, 1, 1, 'Less oil', 'Less oil', 'Less oil', 0, 0, 0, 0, 0, 0, NULL, NULL, 4, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(40, 1, 1, 'Jgn Asin', 'Jgn Asin', 'Jgn Asin', 0, 0, 0, 0, 0, 0, NULL, NULL, 5, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(41, 1, 1, 'No Vetsin', 'No Vetsin', 'No Vetsin', 0, 0, 0, 0, 0, 0, NULL, NULL, 6, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(42, 1, 2, 'No Garlic', 'No Garlic', 'No Garlic', 0, 0, 0, 0, 0, 0, NULL, NULL, 7, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(43, 1, 2, 'Very Spicy', 'Very Spicy', 'Very Spicy', 0, 0, 0, 0, 0, 0, NULL, NULL, 8, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(44, 1, 0, 'Less Spicy', 'Less Spicy', 'Less Spicy', 0, 0, 0, 0, 0, 0, NULL, NULL, 9, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(45, 1, 0, 'Less Salt', 'Less Salt', 'Less Salt', 0, 0, 0, 0, 0, 0, NULL, NULL, 10, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(46, 1, 0, 'Gak pake lama', 'Gak pake lama', 'Gak pake lama', 0, 0, 0, 0, 0, 0, NULL, NULL, 11, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(47, 2, 1, 'Less sugar', 'Less sugar', 'Less sugar', 0, 0, 0, 0, 0, 0, NULL, NULL, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(48, 2, 1, 'dingin', 'dingin', 'dingin', 0, 0, 0, 0, 0, 0, NULL, NULL, 2, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(49, 2, 1, 'no ice', 'no ice', 'no ice', 0, 2, 0, 0, 0, 0, NULL, NULL, 3, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(50, 2, 1, 'less ice', 'less ice', 'less ice', 0, 0, 0, 0, 0, 0, NULL, NULL, 4, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(51, 2, 1, 'no milk', 'no milk', 'no milk', 0, 0, 0, 0, 0, 0, NULL, NULL, 5, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(52, 2, 1, 'w/ milk', 'w/ milk', 'w/ milk', 0, 0, 0, 0, 0, 0, NULL, NULL, 6, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(53, 2, 0, 'no cream', 'no cream', 'no cream', 0, 0, 0, 0, 0, 0, NULL, NULL, 7, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(54, 2, 0, 'no syrup', 'no syrup', 'no syrup', 0, 0, 0, 0, 0, 0, NULL, NULL, 8, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(55, 2, 0, 'pisah gula', 'pisah gula', 'pisah gula', 0, 0, 0, 0, 0, 0, NULL, NULL, 9, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(56, 1, 0, 'no mushroom', 'no mushroom', 'no mushroom', 0, 0, 0, 0, 0, 0, NULL, NULL, 12, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(57, 1, 0, 'no chicken', 'no chicken', 'no chicken', 0, 0, 0, 0, 0, 0, NULL, NULL, 13, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(58, 1, 0, 'no beef', 'no beef', 'no beef', 0, 0, 0, 0, 0, 0, NULL, NULL, 14, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(59, 1, 0, 'no shrimp', 'no shrimp', 'no shrimp', 0, 0, 0, 0, 0, 0, NULL, NULL, 15, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(60, 1, 0, 'Ayam', 'Ayam', 'Ayam', 0, 2000, 0, 0, 0, 0, NULL, NULL, 19, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(61, 1, 0, 'Udang', 'Udang', 'Udang', 0, 3000, 0, 0, 0, 0, NULL, NULL, 18, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(62, 1, 0, 'Ikan', 'Ikan', 'Ikan', 0, 0, 0, 0, 0, 0, NULL, NULL, 17, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(63, 1, 0, 'Telur Phitan', 'Telur Phitan', 'Telur Phitan', 0, 0, 0, 0, 0, 0, NULL, NULL, 16, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(64, 4, 0, 'Carrot', 'Carrot', 'Carrot', 0, 0, 0, 0, 0, 0, NULL, NULL, 1, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(65, 4, 0, 'Melon', 'Melon', 'Melon', 0, 0, 0, 0, 0, 0, NULL, NULL, 2, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(66, 4, 0, 'Orange', 'Orange', 'Orange', 0, 0, 0, 0, 0, 0, NULL, NULL, 3, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(67, 4, 0, 'Tomato', 'Tomato', 'Tomato', 0, 0, 0, 0, 0, 0, NULL, NULL, 4, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(68, 2, 0, 'Sweet', 'Sweet', 'Sweet', 0, 0, 0, 0, 0, 0, NULL, NULL, 10, 1, '2025-01-01 00:00:00', 1, '2025-07-31 17:03:28', 1),
	(69, 0, 0, 'test123', 'test123', 'test123', 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, '2025-07-31 17:05:46', 1, '2025-07-31 17:05:54', 1),
	(70, 0, 0, '123', '123', '123', 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, '2025-07-31 17:16:08', 1, '2025-07-31 17:16:33', 1),
	(71, 3, 0, '123123', '123123', '123123', 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, '2025-07-31 17:17:38', 1, '2025-07-31 17:17:46', 1);

-- Dumping structure for table pos_resto.modifier_group
CREATE TABLE IF NOT EXISTS `modifier_group` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.modifier_group: ~4 rows (approximately)
INSERT INTO `modifier_group` (`id`, `name`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Makanan', 1, '2025-01-01 00:00:00', 1, '2025-07-31 16:30:04', 1),
	(2, 'Muniman', 1, '2025-01-01 00:00:00', 1, '2025-07-31 16:30:04', 1),
	(3, 'Lain lain', 1, '2025-07-31 16:29:57', 1, '2025-07-31 16:30:04', 1),
	(4, 'jojo', 0, '2025-07-31 16:30:09', 1, '2025-07-31 16:30:13', 1);

-- Dumping structure for table pos_resto.modifier_list
CREATE TABLE IF NOT EXISTS `modifier_list` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `min` tinyint(4) DEFAULT NULL,
  `max` tinyint(4) DEFAULT NULL,
  `reflist` varchar(6) DEFAULT NULL,
  `autoassig` varchar(10) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.modifier_list: ~7 rows (approximately)
INSERT INTO `modifier_list` (`id`, `name`, `min`, `max`, `reflist`, `autoassig`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Kitchen Info', 0, 0, '      ', ' ', 1, '2025-01-01 00:00:00', 1, '2025-07-31 16:05:59', 1),
	(2, 'Bar Info', 0, 0, '      ', ' ', 1, '2025-01-01 00:00:00', 1, '2025-07-31 16:05:59', 1),
	(3, 'Tamplate Memo', 0, 0, '      ', ' ', 1, '2025-01-01 00:00:00', 1, '2025-07-31 16:05:59', 1),
	(4, 'Juice Mix', 0, 2, '      ', ' ', 1, '2025-01-01 00:00:00', 1, '2025-07-31 16:05:59', 1),
	(5, 'test 34', NULL, NULL, NULL, NULL, 0, '2025-07-31 16:05:00', 1, '2025-07-31 16:06:03', 1),
	(6, 'memo 2', NULL, NULL, NULL, NULL, 0, '2025-07-31 16:05:55', 1, '2025-07-31 16:06:07', 1),
	(7, 'test 1', NULL, NULL, NULL, NULL, 0, '2025-07-31 16:06:31', 1, '2025-07-31 16:06:38', 1),
	(8, 'test 2', NULL, NULL, NULL, NULL, 0, '2025-07-31 16:06:34', 1, '2025-07-31 16:06:38', 1);

-- Dumping structure for table pos_resto.outlet
CREATE TABLE IF NOT EXISTS `outlet` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `priceNo` tinyint(4) NOT NULL DEFAULT 1,
  `printerId` tinyint(4) NOT NULL DEFAULT 1,
  `descs` varchar(200) NOT NULL DEFAULT '',
  `tel` varchar(200) NOT NULL DEFAULT '',
  `fax` varchar(200) NOT NULL DEFAULT '',
  `company` varchar(200) NOT NULL DEFAULT '',
  `address` text NOT NULL DEFAULT '',
  `street` varchar(200) NOT NULL DEFAULT '',
  `city` varchar(200) NOT NULL DEFAULT '',
  `country` varchar(200) NOT NULL DEFAULT '',
  `greeting1` varchar(200) NOT NULL DEFAULT '',
  `greeting2` varchar(200) NOT NULL DEFAULT '',
  `greeting3` varchar(200) NOT NULL DEFAULT '',
  `greeting4` varchar(200) NOT NULL DEFAULT '',
  `greeting5` varchar(200) NOT NULL DEFAULT '',
  `panel` smallint(6) NOT NULL,
  `overDue` time NOT NULL DEFAULT '01:00:00',
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1005 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.outlet: ~4 rows (approximately)
INSERT INTO `outlet` (`id`, `name`, `priceNo`, `printerId`, `descs`, `tel`, `fax`, `company`, `address`, `street`, `city`, `country`, `greeting1`, `greeting2`, `greeting3`, `greeting4`, `greeting5`, `panel`, `overDue`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(15, 'Imperial Kitchen', 1, 2, 'IK MTA-TAMAN ANGGREK', '08119228412', 'fax', 'Imperial Kitchen & Dimsum', 'Mall Taman Anggrek', 'Lantai 1 Unit F12-F12A', 'Jakarta Barat', 'Indonesia', 'Thank You', '1', '2  ', '3    ', '4          ', 1, '02:00:00', 1, '2025-01-01 00:00:00', 1, '2025-07-11 17:28:24', 1),
	(1001, 'Imperial Kitchen Delivery', 2, 7, 'Delivery', '08119228412', '                    ', 'Imperial Kitchen & Dimsum', 'Mall Taman Anggrek', 'Lantai 1 Unit F12-F12A', 'Jakarta Barat', 'Indonesia', 'Thank You                     ', '                              ', '                              ', '                              ', '                              ', 2, '02:00:00', 1, '2025-01-01 00:00:00', 1, '2025-07-11 17:28:36', 1),
	(1002, 'Imperial Kitcehn DH', 3, 7, 'Delivery Hotline', '08119228412', '                    ', 'Imperial Kitchen & Dimsum', 'Mall Taman Anggrek', 'Lantai 1 Unit F12-F12A', 'Jakarta Barat', 'Indonesia', 'Thank You                     ', '                              ', '                              ', '                              ', '                              ', 4, '04:00:00', 1, '2025-01-01 00:00:00', 1, '2025-07-11 17:28:43', 1),
	(1004, 'BSD CITY', 4, 1, 'Description', '1', '2', '', '4', '5', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 0, '03:00:00', 1, '2025-05-07 15:48:32', 1, '2025-07-10 17:01:51', 1);

-- Dumping structure for table pos_resto.outlet_discount
CREATE TABLE IF NOT EXISTS `outlet_discount` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `outletId` int(11) NOT NULL DEFAULT 0,
  `discountId` smallint(6) NOT NULL DEFAULT 0,
  `sorting` tinyint(4) NOT NULL DEFAULT 1,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.outlet_discount: ~4 rows (approximately)
INSERT INTO `outlet_discount` (`id`, `outletId`, `discountId`, `sorting`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(160, 15, 2, 1, 1, '2025-08-19 13:03:09', 1, '2025-01-01 00:00:00', 1),
	(161, 1001, 2, 1, 1, '2025-08-19 13:03:09', 1, '2025-01-01 00:00:00', 1),
	(162, 1002, 2, 1, 1, '2025-08-19 13:03:09', 1, '2025-01-01 00:00:00', 1),
	(163, 1004, 2, 1, 1, '2025-08-19 13:03:09', 1, '2025-01-01 00:00:00', 1);

-- Dumping structure for table pos_resto.outlet_floor_plan
CREATE TABLE IF NOT EXISTS `outlet_floor_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `outletId` smallint(6) DEFAULT NULL,
  `desc1` varchar(200) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `sorting` tinyint(4) DEFAULT 99,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5442 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.outlet_floor_plan: ~8 rows (approximately)
INSERT INTO `outlet_floor_plan` (`id`, `outletId`, `desc1`, `image`, `sorting`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 1002, 'HOTLINE  34', '1.png', 1, 1, '2025-01-01 00:00:00', 1, '2025-08-04 14:52:44', 1),
	(2, 15, 'Other', '2.png', 2, 1, '2025-01-01 00:00:00', 1, '2025-05-07 18:37:16', 1),
	(3, 15, 'Dine In', '3.png', 3, 1, '2025-01-01 00:00:00', 1, '2025-05-07 18:37:16', 1),
	(4, 1001, 'Delivery', '4.png', 4, 1, '2025-01-01 00:00:00', 1, '2025-05-07 18:37:16', 1),
	(5438, 15, 'Foodcort', NULL, 99, 0, '2025-08-01 14:25:17', 1, '2025-08-01 14:30:17', 1),
	(5439, 1002, 'CK', '4.png', 99, 1, '2025-08-04 14:55:20', 1, '2025-08-04 14:55:23', 1),
	(5440, 1002, 'TEST 3', NULL, 99, 0, '2025-08-04 15:03:29', 1, '2025-08-04 15:05:00', 1),
	(5441, 1002, 'TEST3', '2.png', 99, 1, '2025-08-04 15:05:50', 1, '2025-01-01 00:00:00', 1);

-- Dumping structure for table pos_resto.outlet_table_map
CREATE TABLE IF NOT EXISTS `outlet_table_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `outletId` smallint(6) DEFAULT NULL,
  `outletFloorPlandId` smallint(6) DEFAULT 1,
  `tableName` varchar(200) DEFAULT NULL,
  `tableNameExt` varchar(200) DEFAULT NULL,
  `desc1` varchar(200) DEFAULT NULL,
  `desc2` varchar(200) DEFAULT NULL,
  `desc3` varchar(200) DEFAULT NULL,
  `class` tinyint(4) DEFAULT NULL,
  `seatcnt` tinyint(4) DEFAULT NULL,
  `posY` smallint(6) DEFAULT NULL,
  `posX` smallint(6) DEFAULT NULL,
  `width` tinyint(4) DEFAULT NULL,
  `height` tinyint(4) DEFAULT NULL,
  `capacity` tinyint(4) DEFAULT NULL,
  `shape` tinyint(4) DEFAULT NULL,
  `seatpos` tinyint(4) DEFAULT NULL,
  `seatarr` tinyint(4) DEFAULT NULL,
  `default` varchar(2) DEFAULT NULL,
  `consume` decimal(3,2) DEFAULT NULL,
  `icon` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.outlet_table_map: ~101 rows (approximately)
INSERT INTO `outlet_table_map` (`id`, `outletId`, `outletFloorPlandId`, `tableName`, `tableNameExt`, `desc1`, `desc2`, `desc3`, `class`, `seatcnt`, `posY`, `posX`, `width`, `height`, `capacity`, `shape`, `seatpos`, `seatarr`, `default`, `consume`, `icon`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 15, 2, 'TA5', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 639, 80, 80, 4, 2, 2, 0, '  ', 0.00, 'cover4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:27', 1),
	(2, 15, 2, 'TA4', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 489, 80, 80, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(3, 15, 2, 'TA3', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 342, 80, 80, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(4, 15, 2, 'TA2', '   ', '                    ', '                    ', '                    ', 0, 0, 15, 203, 80, 80, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(5, 15, 2, 'OC5', '   ', '                    ', '                    ', '                    ', 0, 0, 175, 643, 80, 80, 4, 1, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(6, 15, 2, 'OC4', '   ', '                    ', '                    ', '                    ', 0, 0, 181, 478, 80, 80, 4, 1, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(7, 15, 2, 'OC3', '   ', '                    ', '                    ', '                    ', 0, 0, 183, 332, 80, 80, 4, 1, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(8, 15, 2, 'OC2', '   ', '                    ', '                    ', '                    ', 0, 0, 178, 198, 80, 80, 4, 1, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(9, 15, 2, '500', '   ', '                    ', '                    ', '                    ', 0, 0, 369, 644, 80, 80, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(10, 15, 2, '400', '   ', '                    ', '                    ', '                    ', 0, 0, 369, 488, 80, 80, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(11, 15, 2, '300', '   ', '                    ', '                    ', '                    ', 0, 0, 369, 343, 80, 80, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(12, 15, 2, '200', '   ', '                    ', '                    ', '                    ', 0, 0, 369, 197, 80, 80, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(13, 15, 2, '100', '   ', '                    ', '                    ', '                    ', 0, 0, 369, 37, 80, 80, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(14, 15, 2, 'OC1', '   ', '                    ', '                    ', '                    ', 0, 0, 177, 41, 80, 80, 4, 1, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(15, 15, 2, 'TA1', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 41, 80, 80, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:12:02', 1),
	(16, 15, 3, '1', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 22, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(17, 15, 3, '2', '   ', '                    ', '                    ', '                    ', 0, 0, 37, 22, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(18, 15, 3, '3', '   ', '                    ', '                    ', '                    ', 0, 0, 88, 22, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(19, 15, 3, '4', '   ', '                    ', '                    ', '                    ', 0, 0, 124, 23, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(20, 15, 3, '5', '   ', '                    ', '                    ', '                    ', 0, 0, 177, 22, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(21, 15, 3, '6', '   ', '                    ', '                    ', '                    ', 0, 0, 214, 22, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(22, 15, 3, '7', '   ', '                    ', '                    ', '                    ', 0, 0, 267, 22, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(23, 15, 3, '8', '   ', '                    ', '                    ', '                    ', 0, 0, 304, 22, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(24, 15, 3, '9', '   ', '                    ', '                    ', '                    ', 0, 0, 275, 315, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(25, 15, 3, '10', '   ', '                    ', '                    ', '                    ', 0, 0, 321, 315, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(26, 15, 3, '11', '   ', '                    ', '                    ', '                    ', 0, 0, 389, 65, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(27, 15, 3, '12', '   ', '                    ', '                    ', '                    ', 0, 0, 389, 101, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(28, 15, 3, '13', '   ', '                    ', '                    ', '                    ', 0, 0, 202, 192, 80, 80, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(29, 15, 3, '16', '   ', '                    ', '                    ', '                    ', 0, 0, 202, 310, 80, 80, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(30, 15, 3, '14', '   ', '                    ', '                    ', '                    ', 0, 0, 275, 197, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(31, 15, 3, '15', '   ', '                    ', '                    ', '                    ', 0, 0, 321, 197, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(32, 15, 3, '29', '   ', '                    ', '                    ', '                    ', 0, 0, 140, 429, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(33, 15, 3, '30', '   ', '                    ', '                    ', '                    ', 0, 0, 140, 393, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(34, 15, 3, '31', '   ', '                    ', '                    ', '                    ', 0, 0, 140, 343, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(35, 15, 3, '32', '   ', '                    ', '                    ', '                    ', 0, 0, 140, 307, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(36, 15, 3, '33', '   ', '                    ', '                    ', '                    ', 0, 0, 140, 258, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(37, 15, 3, '00034', '   ', '                    ', '                    ', '                    ', 0, 0, 140, 223, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(38, 15, 3, '00035', '   ', '                    ', '                    ', '                    ', 0, 0, 140, 176, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(39, 15, 3, '00036', '   ', '                    ', '                    ', '                    ', 0, 0, 140, 141, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(40, 15, 3, '00041', '   ', '                    ', '                    ', '                    ', 0, 0, 56, 339, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(41, 15, 3, '00042', '   ', '                    ', '                    ', '                    ', 0, 0, 10, 338, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(42, 15, 3, '00025', '   ', '                    ', '                    ', '                    ', 0, 0, 183, 684, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(43, 15, 3, '00026', '   ', '                    ', '                    ', '                    ', 0, 0, 183, 637, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(44, 15, 3, '00027', '   ', '                    ', '                    ', '                    ', 0, 0, 184, 555, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(45, 15, 3, '00028', '   ', '                    ', '                    ', '                    ', 0, 0, 184, 508, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(46, 15, 3, '00024', '   ', '                    ', '                    ', '                    ', 0, 0, 275, 507, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(47, 15, 3, '00023', '   ', '                    ', '                    ', '                    ', 0, 0, 275, 554, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(48, 15, 3, '00022', '   ', '                    ', '                    ', '                    ', 0, 0, 276, 636, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(49, 15, 3, '00021', '   ', '                    ', '                    ', '                    ', 0, 0, 276, 683, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(50, 15, 3, '00043', '   ', '                    ', '                    ', '                    ', 0, 0, 9, 256, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(51, 15, 3, '00009', '   ', '                    ', '                    ', '                    ', 0, 0, 349, 66, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(52, 15, 3, '00010', '   ', '                    ', '                    ', '                    ', 0, 0, 349, 102, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(53, 15, 3, '00044', '   ', '                    ', '                    ', '                    ', 0, 0, 56, 256, 70, 70, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(54, 15, 3, '00051', '   ', '                    ', '                    ', '                    ', 0, 0, 101, 537, 80, 80, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(55, 15, 3, '00052', '   ', '                    ', '                    ', '                    ', 0, 0, 36, 543, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(56, 15, 3, '00059', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 693, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(57, 15, 3, '00058', '   ', '                    ', '                    ', '                    ', 0, 0, 37, 693, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(58, 15, 3, '00057', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 644, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(59, 15, 3, '00055', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 594, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(60, 15, 3, '00053', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 543, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(61, 15, 3, '00056', '   ', '                    ', '                    ', '                    ', 0, 0, 37, 645, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(62, 15, 3, '00054', '   ', '                    ', '                    ', '                    ', 0, 0, 37, 594, 60, 60, 4, 0, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(63, 1001, 4, 'DEL01', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 1, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(64, 1001, 4, 'DEL02', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 76, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(65, 1001, 4, 'DEL03', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 151, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(66, 1001, 4, 'DEL04', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 226, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(67, 1001, 4, 'DEL05', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 302, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(68, 1001, 4, 'DEL06', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 377, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(69, 1001, 4, 'DEL07', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 451, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(70, 1001, 4, 'DEL08', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 526, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(71, 1001, 4, 'DEL09', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 601, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(72, 1001, 4, 'DEL10', '   ', '                    ', '                    ', '                    ', 0, 0, 1, 675, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(73, 1002, 1, 'HOT013+22', '   ', '                    ', '                    ', '                    ', 0, 0, 50, 49, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 0, '2025-01-01 00:00:00', 1, '2025-05-06 15:38:03', 1),
	(74, 1002, 1, 'HOT06', '   ', '                    ', '                    ', '                    ', 0, 0, 364, 1, 85, 85, 6, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:38:12', 1),
	(75, 1002, 1, 'HOT07', '   ', '                    ', '                    ', '                    ', 0, 0, 364, 77, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:38:12', 1),
	(76, 1002, 1, 'HOT08', '   ', '                    ', '                    ', '                    ', 0, 0, 364, 153, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:38:12', 1),
	(77, 1002, 1, 'HOT09', '   ', '                    ', '                    ', '                    ', 0, 0, 364, 230, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:38:12', 1),
	(78, 1002, 1, 'HOT10', '   ', '                    ', '                    ', '                    ', 0, 0, 364, 306, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:38:12', 1),
	(79, 1002, 1, 'T2', '   ', '                    ', '                    ', '                    ', 0, 0, 102, 463, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 0, '2025-01-01 00:00:00', 1, '2025-05-06 15:38:20', 1),
	(80, 1002, 1, 'HOT03', '   ', '                    ', '                    ', '                    ', 0, 0, 278, 152, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:38:12', 1),
	(81, 1002, 1, 'HOT04', '   ', '                    ', '                    ', '                    ', 0, 0, 278, 237, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:38:12', 1),
	(82, 1002, 1, 'HOT05', '   ', '                    ', '                    ', '                    ', 0, 0, 280, 324, 85, 85, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-08-01 17:38:12', 1),
	(83, 1001, 4, 'DEL11', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 1, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(84, 1001, 4, 'DEL12', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 76, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(85, 1001, 4, 'DEL13', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 151, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(86, 1001, 4, 'DEL14', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 226, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(87, 1001, 4, 'DEL15', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 301, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(88, 1001, 4, 'DEL16', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 377, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(89, 1001, 4, 'DEL17', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 452, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(90, 1001, 4, 'DEL18', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 527, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(91, 1001, 4, 'DEL19', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 602, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(92, 1001, 4, 'DEL20', '   ', '                    ', '                    ', '                    ', 0, 0, 80, 677, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(93, 1001, 4, 'DEL21', '   ', '                    ', '                    ', '                    ', 0, 0, 158, 1, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(94, 1001, 4, 'DEL22', '   ', '                    ', '                    ', '                    ', 0, 0, 158, 75, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(95, 1001, 4, 'DEL23', '   ', '                    ', '                    ', '                    ', 0, 0, 158, 150, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(96, 1001, 4, 'DEL24', '   ', '                    ', '                    ', '                    ', 0, 0, 158, 226, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(97, 1001, 4, 'DEL25', '   ', '                    ', '                    ', '                    ', 0, 0, 158, 301, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(98, 1001, 4, 'DEL26', '   ', '                    ', '                    ', '                    ', 0, 0, 158, 376, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(99, 1001, 4, 'DEL27', '   ', '                    ', '                    ', '                    ', 0, 0, 158, 451, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(100, 1001, 4, 'DEL28', '   ', '                    ', '                    ', '                    ', 0, 0, 158, 526, 95, 95, 4, 2, 2, 0, '  ', 0.00, 'table4.png', 1, '2025-01-01 00:00:00', 1, '2025-01-01 00:00:00', 1),
	(147, NULL, 1, 'Class 1 1', NULL, NULL, NULL, NULL, NULL, NULL, 10, 5, 80, 80, 4, NULL, NULL, NULL, NULL, NULL, 'cover4.png', 1, '2025-08-01 17:35:16', 1, '2025-08-01 17:38:12', 1),
	(148, NULL, 1, 'class 2 1', NULL, NULL, NULL, NULL, NULL, NULL, 156, 55, 80, 80, 4, NULL, NULL, NULL, NULL, NULL, 'cover4.png', 1, '2025-08-01 17:36:50', 1, '2025-08-01 17:38:12', 1),
	(149, NULL, 1, 'class 2 2', NULL, NULL, NULL, NULL, NULL, NULL, 173, 560, 80, 80, 4, NULL, NULL, NULL, NULL, NULL, 'cover4.png', 1, '2025-08-01 17:36:50', 1, '2025-08-01 17:38:12', 1),
	(150, NULL, 1, 'class 2 3', NULL, NULL, NULL, NULL, NULL, NULL, 17, 161, 80, 80, 4, NULL, NULL, NULL, NULL, NULL, 'cover4.png', 1, '2025-08-01 17:36:50', 1, '2025-08-01 17:38:12', 1),
	(151, NULL, 1, 'class 2 4', NULL, NULL, NULL, NULL, NULL, NULL, 13, 256, 80, 80, 4, NULL, NULL, NULL, NULL, NULL, 'cover4.png', 1, '2025-08-01 17:36:50', 1, '2025-08-01 17:38:12', 1),
	(152, NULL, 1, 'class 2 5', NULL, NULL, NULL, NULL, NULL, NULL, 19, 371, 80, 80, 4, NULL, NULL, NULL, NULL, NULL, 'cover4.png', 1, '2025-08-01 17:36:50', 1, '2025-08-01 17:38:12', 1);

-- Dumping structure for table pos_resto.outlet_table_map_status
CREATE TABLE IF NOT EXISTS `outlet_table_map_status` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `color` varchar(50) NOT NULL DEFAULT '',
  `bgn` varchar(100) NOT NULL DEFAULT '',
  `showOnUser` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.outlet_table_map_status: ~8 rows (approximately)
INSERT INTO `outlet_table_map_status` (`id`, `name`, `color`, `bgn`, `showOnUser`) VALUES
	(1, 'Avaliable', 'text-avaliable', 'bg-avaliable', 1),
	(10, 'Filled', 'text-filled', 'bg-filled', 1),
	(12, 'SendOrder', 'text-sendOrder', 'bg-sendOrder', 1),
	(13, 'Bill', 'text-bill', 'bg-bill', 1),
	(18, 'Payment', 'text-payment', 'bg-payment', 1),
	(20, 'Paid', 'text-paid', 'bg-paid', 0),
	(30, 'Overdue', 'text-overdue', 'bg-overdue', 1),
	(40, 'Void for Merger', '', '', 0),
	(41, 'Void Transaction', '', '', 0),
	(42, 'Exit without order', '', '', 0);

-- Dumping structure for table pos_resto.pantry_message
CREATE TABLE IF NOT EXISTS `pantry_message` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `desc1` varchar(200) DEFAULT NULL,
  `desc2` varchar(200) DEFAULT NULL,
  `desc3` varchar(200) DEFAULT NULL,
  `seq` smallint(6) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Dumping data for table pos_resto.pantry_message: ~11 rows (approximately)
INSERT INTO `pantry_message` (`id`, `desc1`, `desc2`, `desc3`, `seq`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 'Immediate ', 'Immediate           ', 'Immediate           ', 1, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(2, 'Suspended ', 'Suspended           ', 'Suspended           ', 2, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(3, 'Wait For Callup ', 'Wait For Callup     ', 'Wait For Callup     ', 3, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(4, 'Take Away ', 'Take Away           ', 'Take Away           ', 4, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(5, 'BE QUICK ', 'BE QUICK            ', 'BE QUICK            ', 5, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(6, 'Come Together ', 'Come Together       ', 'Come Together       ', 6, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(7, 'Prepare ', 'Prepare             ', 'Prepare             ', 7, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(8, 'Add Later ', 'Add Later           ', 'Add Later           ', 8, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(9, 'Rice Come First ', 'Rice Come First     ', 'Rice Come First     ', 9, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(10, 'Noodle First ', 'Noodle First        ', 'Noodle First        ', 10, 1, '2025-01-01 00:00:00', 1, '2025-04-30 12:50:51', 1),
	(11, 'test334', NULL, NULL, 24, 0, '2025-04-30 12:50:46', 1, '2025-04-30 12:50:56', 1);

-- Dumping structure for table pos_resto.printer
CREATE TABLE IF NOT EXISTS `printer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `printerGroupId` smallint(6) NOT NULL DEFAULT 0,
  `printerTypeCon` varchar(50) NOT NULL DEFAULT 'ip',
  `name` varchar(50) NOT NULL DEFAULT '',
  `ipAddress` varchar(50) NOT NULL DEFAULT '',
  `port` varchar(50) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pos_resto.printer: ~6 rows (approximately)
INSERT INTO `printer` (`id`, `printerGroupId`, `printerTypeCon`, `name`, `ipAddress`, `port`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 8, 'ip', 'Dapur', '10.51.122.20', '9100', 1, '2025-05-09 18:09:20', 1, '2025-08-13 13:27:20', 1),
	(2, 9, 'ip', 'Bar', '10.51.122.21', '9100', 1, '2025-05-09 18:09:23', 1, '2025-08-13 13:27:20', 1),
	(3, 10, 'com1', 'Office 1', '10.51.122.23', '9100', 1, '2025-05-09 18:09:50', 1, '2025-08-13 13:27:20', 1),
	(4, 11, 'ip', 'Kasir', '10.51.122.20', '9101', 1, '2025-07-11 15:09:46', 1, '2025-08-13 13:27:20', 1),
	(5, 12, 'ip', 'Office 2', '10.51.122.20', '9101', 1, '2025-07-11 15:10:06', 1, '2025-08-13 13:27:20', 1),
	(6, 13, 'com7', 'Office 3', '10.51.122.20', '9101', 1, '2025-07-11 15:10:46', 1, '2025-08-13 13:27:20', 1),
	(7, 14, 'com1', 'Office 5', '123', '123', 1, '2025-07-11 15:11:13', 1, '2025-08-13 13:27:20', 1);

-- Dumping structure for table pos_resto.printer_group
CREATE TABLE IF NOT EXISTS `printer_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pos_resto.printer_group: ~4 rows (approximately)
INSERT INTO `printer_group` (`id`, `name`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(8, 'Test 1 Printer Global', 1, '2025-08-12 13:24:16', 1, '2025-08-13 13:26:23', 1),
	(9, 'Test 2', 1, '2025-08-12 13:24:20', 1, '2025-08-13 13:26:23', 1),
	(10, 'Test 3', 0, '2025-08-12 13:24:22', 1, '2025-08-12 13:27:21', 1),
	(11, 'rwar 3', 0, '2025-08-12 13:27:17', 1, '2025-08-12 13:27:21', 1);

-- Dumping structure for table pos_resto.print_queue
CREATE TABLE IF NOT EXISTS `print_queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dailyCheckId` varchar(50) NOT NULL DEFAULT '',
  `cartId` varchar(50) NOT NULL DEFAULT '',
  `cartItemId` int(11) NOT NULL DEFAULT 0,
  `menuId` int(11) NOT NULL DEFAULT 0,
  `rushPrinting` tinyint(4) NOT NULL DEFAULT 0,
  `so` varchar(50) NOT NULL DEFAULT '',
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `printerId` smallint(6) NOT NULL DEFAULT 0,
  `consoleError` varchar(200) NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT current_timestamp(),
  `inputBy` int(11) DEFAULT NULL,
  `updateDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.print_queue: ~2 rows (approximately)
INSERT INTO `print_queue` (`id`, `dailyCheckId`, `cartId`, `cartItemId`, `menuId`, `rushPrinting`, `so`, `message`, `printerId`, `consoleError`, `status`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, '000052', '250912000427', 1, 25, 0, 'SO000587', '{"tableName":"TA1","dateTime":"2025-09-12 17:23:40","date":"2025-09-12","time":"17:23:40","cartItemId":1,"qty":3,"descs":"PASSION CCNT DELIGHT","modifier":"dingin, I tried sending a clear screen command to a customer pole display its model LCD210 its baud rate 9600 8 n 1V1 and 20 characters 2 lines display with a command type CD5220 Font USA PC437 I had manual but while I am trying to send commands Its not pick, w/ milk"}', 1, '', 0, 1, '2025-09-12 17:23:40', 76, '2025-09-12 17:33:55', 76),
	(2, '000052', '250912000427', 2, 24, 0, 'SO000587', '{"tableName":"TA1","dateTime":"2025-09-12 17:23:40","date":"2025-09-12","time":"17:23:40","cartItemId":2,"qty":1,"descs":"MANGGO KYOTO        ","modifier":"dingin, w/ milk"}', 1, '', 0, 1, '2025-09-12 17:23:40', 76, '2025-09-12 17:23:40', 76);

-- Dumping structure for table pos_resto.print_queue_status
CREATE TABLE IF NOT EXISTS `print_queue_status` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.print_queue_status: ~4 rows (approximately)
INSERT INTO `print_queue_status` (`id`, `name`) VALUES
	(-1, 'FAILED'),
	(0, 'PENDING'),
	(1, 'PRINTING'),
	(2, 'DONE');

-- Dumping structure for table pos_resto.send_order
CREATE TABLE IF NOT EXISTS `send_order` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `sendOrderDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.send_order: ~1 rows (approximately)
INSERT INTO `send_order` (`id`, `cartId`, `sendOrderDate`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	('SO000587', '250912000427', '2025-09-12 17:23:40', 1, '2025-09-12 17:23:40', 76, '2025-09-12 17:23:40', 76);

-- Dumping structure for table pos_resto.template_table_map
CREATE TABLE IF NOT EXISTS `template_table_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `capacity` tinyint(4) NOT NULL DEFAULT 4,
  `image` varchar(250) NOT NULL DEFAULT '',
  `icon` varchar(250) NOT NULL DEFAULT '',
  `width` smallint(6) NOT NULL DEFAULT 50,
  `height` smallint(6) NOT NULL DEFAULT 50,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.template_table_map: ~6 rows (approximately)
INSERT INTO `template_table_map` (`id`, `name`, `capacity`, `image`, `icon`, `width`, `height`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, '4 Dine In', 4, '', 'cover4.png', 80, 80, 1, '2025-01-01 00:00:00', 1, '2025-08-04 16:29:54', 1),
	(2, '6 Dine In', 6, '', 'cover4.png', 50, 100, 1, '2025-01-01 00:00:00', 1, '2025-08-04 16:29:54', 1),
	(3, 'Single Bar', 1, '', 'table4.png', 50, 50, 1, '2025-01-01 00:00:00', 1, '2025-08-04 16:29:54', 1),
	(4, 'test3', 1, '', 'table4.png', 80, 80, 0, '2025-08-04 16:00:32', 1, '2025-08-04 16:11:13', 1),
	(5, 'test3', 1, '', 'table4.png', 80, 80, 0, '2025-08-04 16:00:36', 1, '2025-08-04 16:11:13', 1),
	(6, 'Kapasitas 6', 6, '', 'cover4.png', 50, 50, 1, '2025-08-04 16:15:08', 1, '2025-08-04 16:29:54', 1);

-- Dumping structure for table pos_resto.terminal
CREATE TABLE IF NOT EXISTS `terminal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `terminalId` varchar(200) NOT NULL DEFAULT '',
  `exp` date NOT NULL DEFAULT '2000-01-01',
  `priceNo` tinyint(4) NOT NULL DEFAULT 0,
  `printerId` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5105 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.terminal: ~4 rows (approximately)
INSERT INTO `terminal` (`id`, `terminalId`, `exp`, `priceNo`, `printerId`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, '0001', '2026-08-20', 0, 1, 1, '2025-07-03 18:32:53', 1, '2025-09-02 13:59:40', 1),
	(5102, '0002', '2025-08-20', 0, 0, 1, '2025-07-11 17:04:44', 1, '2025-07-11 17:04:48', 1),
	(5103, '0003', '2027-01-01', 0, 0, 1, '2025-07-11 17:04:44', 1, '2025-09-08 15:47:51', 1),
	(5104, '0005', '2025-08-20', 0, 0, 1, '2025-07-30 12:51:53', 1, '2025-07-30 12:51:53', 1);

-- Dumping structure for table pos_resto.terminal_token
CREATE TABLE IF NOT EXISTS `terminal_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `terminalId` varchar(200) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5180 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Dumping data for table pos_resto.terminal_token: ~4 rows (approximately)
INSERT INTO `terminal_token` (`id`, `terminalId`, `presence`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(5169, '0002', 1, '2025-07-10 18:17:14', 1, '2025-07-10 18:17:14', 1),
	(5175, '0005', 1, '2025-07-30 12:51:53', 1, '2025-07-30 12:51:53', 1),
	(5178, '0001', 1, '2025-09-02 13:59:40', 1, '2025-09-02 13:59:40', 1),
	(5179, '0003', 1, '2025-09-08 15:47:51', 1, '2025-09-08 15:47:51', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
