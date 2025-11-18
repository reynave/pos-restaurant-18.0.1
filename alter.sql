ALTER TABLE `discount`
	ADD COLUMN `requiredItemTotal` INT(11) NOT NULL DEFAULT '0' AFTER `maxDiscount`;


CREATE TABLE `cashback` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(250) NOT NULL COLLATE 'utf16_bin',
	`description` TEXT(32767) NOT NULL COLLATE 'utf16_bin',
	`earningStartDate` DATE NOT NULL DEFAULT '2025-01-01',
	`earningEndDate` DATE NOT NULL DEFAULT '2025-01-01',
	`redeemStartDate` DATE NOT NULL DEFAULT '2025-01-01',
	`redeemEndDate` DATE NOT NULL DEFAULT '2025-01-01',
	`status` TINYINT(4) NOT NULL DEFAULT '1',
	`presence` TINYINT(4) NOT NULL DEFAULT '1',
	`inputDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`inputBy` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf16_bin',
	`updateDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`updateBy` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf16_bin',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf16_bin'
ENGINE=InnoDB
AUTO_INCREMENT=4
;
CREATE TABLE `cashback_amount` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`earnMin` INT(11) NOT NULL DEFAULT '0',
	`earnMax` INT(11) NOT NULL DEFAULT '0',
	`cashbackMin` INT(11) NOT NULL DEFAULT '0',
	`cashbackMax` INT(11) NOT NULL DEFAULT '0',
	`status` TINYINT(4) NOT NULL DEFAULT '1',
	`presence` TINYINT(4) NOT NULL DEFAULT '1',
	`inputDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`inputBy` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf16_bin',
	`updateDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`updateBy` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf16_bin',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf16_bin'
ENGINE=InnoDB
AUTO_INCREMENT=4
;


CREATE TABLE `cashback_outlet` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`outletId` VARCHAR(250) NOT NULL COLLATE 'utf16_bin',
	`status` TINYINT(4) NOT NULL DEFAULT '1',
	`presence` TINYINT(4) NOT NULL DEFAULT '1',
	`inputDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`inputBy` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf16_bin',
	`updateDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`updateBy` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf16_bin',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf16_bin'
ENGINE=InnoDB
AUTO_INCREMENT=4
;


CREATE TABLE `cashback_payment` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`paymentId` TINYINT(4) NOT NULL DEFAULT '0',
	`status` TINYINT(4) NOT NULL DEFAULT '1',
	`presence` TINYINT(4) NOT NULL DEFAULT '1',
	`inputDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`inputBy` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf16_bin',
	`updateDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`updateBy` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf16_bin',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf16_bin'
ENGINE=InnoDB
AUTO_INCREMENT=4
;


CREATE TABLE `cart_cashback` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`cartId` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`cashbackId` SMALLINT(6) NOT NULL DEFAULT '0',
	`presence` TINYINT(2) NOT NULL DEFAULT '1',
	`inputDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`inputBy` SMALLINT(6) NOT NULL DEFAULT '1',
	`updateDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`updateBy` SMALLINT(6) NOT NULL DEFAULT '1',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf16_bin'
ENGINE=InnoDB
;


ALTER TABLE `printer`
	ADD COLUMN `printerId2` TINYINT NOT NULL DEFAULT 0 AFTER `port`;


ALTER TABLE `print_queue`
	ADD COLUMN `printerId2` SMALLINT(6) NOT NULL DEFAULT '0' AFTER `printerId`;


--- Alterations End Here
CREATE TABLE `module` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`sorting` TINYINT(4) NOT NULL DEFAULT '0',
	`name` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`category` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`presence` TINYINT(2) NOT NULL DEFAULT '1',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `name` (`name`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=44
;


CREATE TABLE `employee_access_right` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`authLevelId` SMALLINT(6) NOT NULL DEFAULT '0',
	`moduleId` INT(11) NOT NULL DEFAULT '0',
	`status` TINYINT(4) NOT NULL DEFAULT '0',
	`presence` TINYINT(2) NOT NULL DEFAULT '1',
	`inputDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`inputBy` SMALLINT(6) NOT NULL DEFAULT '1',
	`updateDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`updateBy` SMALLINT(6) NOT NULL DEFAULT '1',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=98
;

INSERT INTO `module` VALUES (9, 0, 'sendOrder', 'menu', 1);
INSERT INTO `module` VALUES (10, 0, 'bill', 'menu', 1);
INSERT INTO `module` VALUES (11, 0, 'payment', 'menu', 1);
INSERT INTO `module` VALUES (12, 0, 'exitWithoutOrder', 'menu', 1);
INSERT INTO `module` VALUES (13, 0, 'transferItems', 'menu', 1);
INSERT INTO `module` VALUES (14, 0, 'takeOut', 'menu', 1);
INSERT INTO `module` VALUES (15, 0, 'merge', 'menu', 1);
INSERT INTO `module` VALUES (16, 0, 'changeCover', 'menu', 1);
INSERT INTO `module` VALUES (17, 0, 'changeTable', 'menu', 1);
INSERT INTO `module` VALUES (18, 0, 'transferLog', 'menu', 1);
INSERT INTO `module` VALUES (19, 0, 'mergerLog', 'menu', 1);
INSERT INTO `module` VALUES (20, 0, 'voidTransaction', 'menu', 1);
INSERT INTO `module` VALUES (21, 0, 'voidItem', 'menu', 1);
INSERT INTO `module` VALUES (22, 0, 'modifier', 'menu', 1);
INSERT INTO `module` VALUES (23, 0, 'itemDiscount', 'menu', 1);
INSERT INTO `module` VALUES (24, 0, 'kitchen', 'menu', 1);
INSERT INTO `module` VALUES (25, 0, 'menu', 'menu', 1);
INSERT INTO `module` VALUES (26, 0, 'tableChecker', 'menu', 1);
INSERT INTO `module` VALUES (27, 0, 'info', 'menu', 1);
INSERT INTO `module` VALUES (28, 0, 'dailyOpen', 'general', 1);
INSERT INTO `module` VALUES (29, 0, 'dailyClose', 'general', 1);
INSERT INTO `module` VALUES (30, 0, 'adjustmentItem', 'items', 1);
INSERT INTO `module` VALUES (31, 0, 'printQueue', 'general', 1);
INSERT INTO `module` VALUES (32, 0, 'printing', 'setting', 1);
INSERT INTO `module` VALUES (33, 0, 'tableLogoutTime', 'setting', 1);
INSERT INTO `module` VALUES (34, 0, 'terminalKey', 'setting', 1);
INSERT INTO `module` VALUES (35, 0, 'transaction', 'transaction', 1);
INSERT INTO `module` VALUES (36, 0, 'cashBalance', 'cash', 1);
INSERT INTO `module` VALUES (37, 0, 'openCashDrawer', 'cash', 1);
INSERT INTO `module` VALUES (38, 0, 'openingBalance', 'cash', 1);
INSERT INTO `module` VALUES (39, 0, 'userLogs', 'general', 1);
INSERT INTO `module` VALUES (40, 0, 'deletePaid', 'payment', 1);
INSERT INTO `module` VALUES (42, 0, 'voidClosedPayment', 'transaction', 1);
INSERT INTO `module` VALUES (43, 0, 'rePrintBill', 'transaction', 1);
