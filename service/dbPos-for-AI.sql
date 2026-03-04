-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.28-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.12.0.7122
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

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `counterNo` smallint(6) NOT NULL DEFAULT 0,
  `billNo` tinyint(4) NOT NULL DEFAULT 0,
  `printBill` tinyint(4) NOT NULL DEFAULT 0,
  `paymentId` varchar(10) NOT NULL DEFAULT '',
  `dailyCheckId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `sendOrder` tinyint(4) NOT NULL DEFAULT 0,
  `outletId` int(11) NOT NULL DEFAULT 0,
  `outletTableMapId` int(11) NOT NULL DEFAULT 0,
  `lockBy` varchar(10) NOT NULL DEFAULT '',
  `cover` int(11) NOT NULL DEFAULT 0,
  `tableMapStatusId` int(11) NOT NULL DEFAULT 0,
  `close` tinyint(4) NOT NULL DEFAULT 0,
  `closeBy` int(11) NOT NULL DEFAULT 0,
  `periodId` tinyint(4) NOT NULL DEFAULT 0,
  `totalItem` tinyint(4) NOT NULL DEFAULT 0,
  `totalAmount` int(11) NOT NULL DEFAULT 0,
  `totalTips` int(11) NOT NULL DEFAULT 0,
  `changePayment` int(11) NOT NULL DEFAULT 0,
  `tips` int(11) NOT NULL DEFAULT 0,
  `summaryTotalGroup` tinyint(4) NOT NULL DEFAULT 1,
  `summaryItemTotal` int(11) NOT NULL DEFAULT 0,
  `summaryDiscount` int(11) NOT NULL DEFAULT 0,
  `summarySc` int(11) NOT NULL DEFAULT 0,
  `summaryTax` int(11) NOT NULL DEFAULT 0,
  `grandTotal` int(11) NOT NULL DEFAULT 0,
  `startDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `endDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `overDue` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `timer` smallint(6) NOT NULL DEFAULT 0,
  `limitEndDate` datetime NOT NULL DEFAULT '2000-01-01 00:00:00',
  `void` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_cashback
CREATE TABLE IF NOT EXISTS `cart_cashback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `cashbackId` smallint(6) NOT NULL DEFAULT 0,
  `cartPaymentId` int(11) NOT NULL DEFAULT 0,
  `cashbackMax` int(11) NOT NULL DEFAULT 0,
  `paymentId` smallint(6) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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
  `debit` int(11) NOT NULL DEFAULT 0,
  `credit` int(11) NOT NULL DEFAULT 0,
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_item_discount
CREATE TABLE IF NOT EXISTS `cart_item_discount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cartItemId` int(11) NOT NULL DEFAULT 0,
  `sendOrder` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `discountId` tinyint(4) NOT NULL DEFAULT 0,
  `note` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `rate` tinyint(4) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `debit` float(10,5) NOT NULL DEFAULT 0.00000,
  `credit` float(10,5) NOT NULL DEFAULT 0.00000,
  `void` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_item_group
CREATE TABLE IF NOT EXISTS `cart_item_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cartItemId` int(11) NOT NULL DEFAULT 0,
  `subgroup` smallint(6) NOT NULL DEFAULT 1,
  `qty` smallint(6) NOT NULL DEFAULT 1,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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
  `remark` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `debit` int(11) NOT NULL DEFAULT 0,
  `credit` int(11) NOT NULL DEFAULT 0,
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_item_sc
CREATE TABLE IF NOT EXISTS `cart_item_sc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cartItemId` int(11) NOT NULL DEFAULT 0,
  `sendOrder` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `menuTaxScId` tinyint(4) NOT NULL DEFAULT 0,
  `note` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `rate` tinyint(4) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `debit` int(11) NOT NULL DEFAULT 0,
  `credit` int(11) NOT NULL DEFAULT 0,
  `void` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_item_tax
CREATE TABLE IF NOT EXISTS `cart_item_tax` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cartItemId` int(11) NOT NULL DEFAULT 0,
  `sendOrder` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `menuTaxScId` tinyint(4) NOT NULL DEFAULT 0,
  `note` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `rate` tinyint(4) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `debit` int(11) NOT NULL DEFAULT 0,
  `credit` int(11) NOT NULL DEFAULT 0,
  `void` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_item_void_reason
CREATE TABLE IF NOT EXISTS `cart_item_void_reason` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cartItemId` int(11) NOT NULL DEFAULT 0,
  `qty` smallint(6) NOT NULL DEFAULT 0,
  `reason` varchar(250) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_payment
CREATE TABLE IF NOT EXISTS `cart_payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `checkPaymentTypeId` int(11) NOT NULL DEFAULT 0,
  `paid` int(11) NOT NULL DEFAULT 0,
  `tips` int(11) NOT NULL DEFAULT 0,
  `cardNumber` varchar(50) NOT NULL DEFAULT '',
  `expCard` varchar(10) NOT NULL DEFAULT '',
  `submit` tinyint(4) NOT NULL DEFAULT 0,
  `void` tinyint(2) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_payment_void_reason
CREATE TABLE IF NOT EXISTS `cart_payment_void_reason` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `reason` varchar(250) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cart_void_reason
CREATE TABLE IF NOT EXISTS `cart_void_reason` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cartId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `reason` varchar(250) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cashback
CREATE TABLE IF NOT EXISTS `cashback` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `description` text NOT NULL,
  `earningStartDate` date NOT NULL DEFAULT '2025-01-01',
  `earningEndDate` date NOT NULL DEFAULT '2025-01-01',
  `redeemStartDate` date NOT NULL DEFAULT '2025-01-01',
  `redeemEndDate` date NOT NULL DEFAULT '2025-01-01',
  `x1` tinyint(4) NOT NULL DEFAULT 0,
  `x2` tinyint(4) NOT NULL DEFAULT 0,
  `outletId` smallint(6) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` varchar(50) NOT NULL DEFAULT '',
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cashback_amount
CREATE TABLE IF NOT EXISTS `cashback_amount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cashbackId` smallint(6) NOT NULL DEFAULT 0,
  `earnMin` int(11) NOT NULL DEFAULT 0,
  `earnMax` int(11) NOT NULL DEFAULT 0,
  `cashbackMin` int(11) NOT NULL DEFAULT 0,
  `cashbackMax` int(11) NOT NULL DEFAULT 0,
  `redeemMinAmount` int(11) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` varchar(50) NOT NULL DEFAULT '',
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cashback_outlet
CREATE TABLE IF NOT EXISTS `cashback_outlet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cashbackId` smallint(6) NOT NULL DEFAULT 0,
  `outletId` varchar(250) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` varchar(50) NOT NULL DEFAULT '',
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.cashback_payment
CREATE TABLE IF NOT EXISTS `cashback_payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cashbackId` smallint(6) NOT NULL DEFAULT 0,
  `paymentId` tinyint(4) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` varchar(50) NOT NULL DEFAULT '',
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.check_payment_type
CREATE TABLE IF NOT EXISTS `check_payment_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setDefault` tinyint(4) NOT NULL DEFAULT 0,
  `paymentGroupId` smallint(6) NOT NULL DEFAULT 0,
  `name` varchar(200) DEFAULT NULL,
  `autoMatchAmount` tinyint(4) DEFAULT 1,
  `maxlimit` decimal(3,2) DEFAULT NULL,
  `openDrawer` tinyint(4) DEFAULT 0,
  `checkPaymentTypePopupId` smallint(6) NOT NULL DEFAULT 0,
  `checkPaymentTypePopupRequirement` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.check_payment_type_popup
CREATE TABLE IF NOT EXISTS `check_payment_type_popup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(240) NOT NULL DEFAULT '',
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=578 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.daily_schedule
CREATE TABLE IF NOT EXISTS `daily_schedule` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `days` tinyint(4) NOT NULL DEFAULT 0,
  `openHour` time NOT NULL DEFAULT '00:00:00',
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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
  `requiredItemTotal` int(11) NOT NULL DEFAULT 0,
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
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.employee_access_right
CREATE TABLE IF NOT EXISTS `employee_access_right` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `authLevelId` smallint(6) NOT NULL DEFAULT 0,
  `moduleId` int(11) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=313 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=434 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.language
CREATE TABLE IF NOT EXISTS `language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `lang1` varchar(200) DEFAULT NULL,
  `lang2` varchar(200) DEFAULT NULL,
  `lang3` varchar(200) DEFAULT NULL,
  `sorting` smallint(6) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=509 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.logs
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` varchar(50) NOT NULL DEFAULT '0',
  `actionDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `bill` varchar(50) DEFAULT NULL,
  `dailyCheckId` varchar(50) DEFAULT NULL,
  `action` varchar(250) DEFAULT NULL,
  `actionBy` varchar(50) DEFAULT NULL,
  `actionId` smallint(6) DEFAULT NULL,
  `actionRelated` varchar(250) DEFAULT NULL,
  `terminalId` varchar(50) CHARACTER SET utf16 COLLATE utf16_bin DEFAULT NULL,
  `outletId` varchar(50) DEFAULT NULL,
  `url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.menu
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plu` varchar(50) NOT NULL DEFAULT '',
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
  `timer` smallint(6) NOT NULL DEFAULT 0,
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
  `openPrice` tinyint(4) NOT NULL DEFAULT 0,
  `image` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.menu_category
CREATE TABLE IF NOT EXISTS `menu_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc1` varchar(200) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.menu_class
CREATE TABLE IF NOT EXISTS `menu_class` (
  `id` varchar(200) NOT NULL DEFAULT '0',
  `desc1` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.menu_department
CREATE TABLE IF NOT EXISTS `menu_department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc1` varchar(200) DEFAULT NULL,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.menu_tax_sc_status
CREATE TABLE IF NOT EXISTS `menu_tax_sc_status` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.module
CREATE TABLE IF NOT EXISTS `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `child` tinyint(4) NOT NULL DEFAULT 0,
  `sorting` int(11) NOT NULL DEFAULT 0,
  `name` varchar(50) NOT NULL DEFAULT '',
  `category` varchar(50) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.outlet
CREATE TABLE IF NOT EXISTS `outlet` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `posMode` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(200) NOT NULL DEFAULT '',
  `priceNo` tinyint(4) NOT NULL DEFAULT 1,
  `printerId` tinyint(4) NOT NULL DEFAULT 1,
  `descs` varchar(200) NOT NULL DEFAULT '',
  `tel` varchar(200) NOT NULL DEFAULT '',
  `fax` varchar(200) NOT NULL DEFAULT '',
  `email` varchar(200) NOT NULL DEFAULT '',
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
  `sorting` tinyint(4) NOT NULL DEFAULT 9,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=5445 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

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
  `width` smallint(6) DEFAULT NULL,
  `height` smallint(6) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.outlet_table_map_status
CREATE TABLE IF NOT EXISTS `outlet_table_map_status` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `color` varchar(50) NOT NULL DEFAULT '',
  `bgn` varchar(100) NOT NULL DEFAULT '',
  `showOnUser` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.period
CREATE TABLE IF NOT EXISTS `period` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL DEFAULT '',
  `startTime` time NOT NULL DEFAULT '00:00:00',
  `endTime` time NOT NULL DEFAULT '00:00:00',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.printer
CREATE TABLE IF NOT EXISTS `printer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `printerGroupId` smallint(6) NOT NULL DEFAULT 0,
  `printerTypeCon` varchar(50) NOT NULL DEFAULT 'ip',
  `name` varchar(50) NOT NULL DEFAULT '',
  `ipAddress` varchar(50) NOT NULL DEFAULT '',
  `port` varchar(50) NOT NULL DEFAULT '',
  `printerId2` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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
  `printerId2` smallint(6) NOT NULL DEFAULT 0,
  `consoleError` varchar(200) NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `status2` tinyint(4) NOT NULL DEFAULT 0,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT current_timestamp(),
  `inputBy` int(11) DEFAULT NULL,
  `updateDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.print_queue_status
CREATE TABLE IF NOT EXISTS `print_queue_status` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `parentId` smallint(6) NOT NULL DEFAULT 0,
  `name` varchar(250) NOT NULL DEFAULT '',
  `label` varchar(250) NOT NULL DEFAULT '',
  `startDate` tinyint(4) NOT NULL DEFAULT 1,
  `endDate` tinyint(4) NOT NULL DEFAULT 1,
  `employeeId` tinyint(4) NOT NULL DEFAULT 0,
  `outletId` tinyint(4) NOT NULL DEFAULT 0,
  `mapId` varchar(10) NOT NULL DEFAULT '',
  `sorting` smallint(6) NOT NULL DEFAULT 0,
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.reports_token
CREATE TABLE IF NOT EXISTS `reports_token` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `token` varchar(50) NOT NULL DEFAULT '',
  `expTime` varchar(50) NOT NULL DEFAULT '',
  `createdName` varchar(50) NOT NULL DEFAULT '',
  `presence` tinyint(2) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` smallint(6) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` smallint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=5183 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for table pos_resto.ux
CREATE TABLE IF NOT EXISTS `ux` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `pos1Sorting` smallint(6) NOT NULL DEFAULT 99,
  `pos2Sorting` smallint(6) NOT NULL DEFAULT 99,
  `pos3Sorting` smallint(6) NOT NULL DEFAULT 99,
  `pos1Status` tinyint(4) NOT NULL DEFAULT 1,
  `pos2Status` tinyint(4) NOT NULL DEFAULT 1,
  `pos3Status` tinyint(4) NOT NULL DEFAULT 1,
  `pos1Class` varchar(50) NOT NULL DEFAULT '',
  `pos2Class` varchar(50) NOT NULL DEFAULT '',
  `pos3Class` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Dumping structure for view pos_resto.view_cart
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `view_cart` (
	`id` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`cartMenuId` BIGINT(16) NOT NULL,
	`inputDate` DATETIME NULL,
	`sendOrder` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`name` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`type` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`price` DOUBLE(22,5) NOT NULL,
	`total` SMALLINT(6) NULL,
	`totalAmount` DOUBLE(22,5) NULL,
	`employeeName` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci'
);

-- Dumping structure for view pos_resto.view_discount
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `view_discount` (
	`id` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`sendOrder` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`menu` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`discountId` TINYINT(4) NOT NULL,
	`discountName` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`discountAmount` FLOAT(10,5) NOT NULL,
	`qty` SMALLINT(6) NOT NULL,
	`TotalDiscountAmount` DOUBLE(22,5) NOT NULL,
	`inputDate` DATETIME NOT NULL
);

-- Dumping structure for table pos_resto.void_reason
CREATE TABLE IF NOT EXISTS `void_reason` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `presence` tinyint(4) NOT NULL DEFAULT 1,
  `inputDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `inputBy` varchar(50) NOT NULL DEFAULT '',
  `updateDate` datetime NOT NULL DEFAULT '2025-01-01 00:00:00',
  `updateBy` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

-- Data exporting was unselected.

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `view_cart`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `view_cart` AS SELECT t1.* FROM (

 SELECT  
	c.cartId AS 'id',  (c.id * 1000) AS 'cartMenuId',  c.inputDate, c.sendOrder,  m.name,
	'menu' AS 'type',
	 c.debit AS 'price',c.qty AS 'total', 
	c.debit * c.qty  AS 'totalAmount', 
	e.name AS 'employeeName'
FROM cart_item AS c
JOIN menu AS m ON m.id = c.menuId
left join employee as e on e.id = c.inputBy
WHERE  c.presence = 1 AND c.void  = 0 

        
        UNION ALL
        
        SELECT d.cartId AS 'id', (c.id * 1000) + 30 AS 'cartMenuId', d.inputDate,  d.sendOrder, 
 concat(d.note,' - ',m.name) AS 'name', 	'discount' AS 'type',
d.credit  * -1 AS 'price', 
c.qty, d.credit * c.qty * -1 AS 'totalAmount' , 	e.name AS 'employeeName'
FROM cart_item_discount AS d
JOIN cart_item AS c ON c.id = d.cartItemId
JOIN menu AS m ON m.id = c.menuId
left join employee as e on e.id = c.inputBy
WHERE d.presence = 1 AND d.void = 0 AND c.presence = 1 AND c.void = 0
	
	
	UNION ALL 
	
	SELECT  i.cartId AS 'id',   (r.cartItemId * 1000 ) + 20 AS 'cartMenuId', i.inputDate,  
	r.sendOrder, CONCAT('+ ', m.descl,' ',r.remark) AS 'name',  	'modifier' AS 'type',
 r.debit AS 'price',   i.qty AS 'total',
(r.debit - r.credit) * i.qty AS totalAmount, '' AS 'employeeName'
FROM cart_item  AS i 
RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id
JOIN modifier AS m ON m.id = r.modifierId  
WHERE   r.void = 0 AND r.presence = 1 
AND i.presence = 1 AND i.void = 0 

	UNION ALL
	
	SELECT  i.cartId AS 'id',  (r.cartItemId * 1000 ) + 90 AS 'cartMenuId',  r.inputDate, i.sendOrder, 
	r.note AS  'name', 	'sc' AS 'type',
	r.debit AS 'price' ,i.qty, 
	(r.debit - r.credit) * i.qty AS totalAmount, '' AS employeeName
	FROM cart_item AS i
	JOIN cart_item_sc AS r ON r.cartItemId = i.id
	WHERE    r.void = 0 AND r.presence = 1 
	AND i.void = 0  AND i.void = 0
	
	
	UNION ALL
	SELECT r.cartId AS 'id', (r.cartItemId * 1000 ) + 90 AS 'cartMenuId', r.inputDate, r.sendOrder,  
	r.note AS  'name', 'tax' AS 'type',
		 r.debit AS 'price',   i.qty AS 'total',
		(r.debit - r.credit) * i.qty AS totalAmount, '' AS employeeName
	FROM cart_item AS i
	JOIN cart_item_tax AS r ON r.cartItemId = i.id
	WHERE   r.void = 0 AND r.presence = 1 
	AND i.presence = 1 AND i.void = 0 

) AS t1 
ORDER BY t1.cartMenuId ASC 
;

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `view_discount`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `view_discount` AS SELECT d.cartId AS 'id',  d.sendOrder, 
 m.name AS 'menu',
 d.discountId AS 'discountId',
 d.note AS 'discountName',
d.credit AS 'discountAmount', 
i.qty, d.credit * i.qty AS 'TotalDiscountAmount', d.inputDate
FROM cart_item_discount AS d
JOIN cart_item AS i ON i.id = d.cartItemId
JOIN menu AS m ON m.id = i.menuId
WHERE d.presence = 1 AND d.void = 0 AND i.presence = 1 AND i.void = 0 
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
