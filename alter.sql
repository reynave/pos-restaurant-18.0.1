CREATE TABLE `discount_level` (
	`id` SMALLINT(6) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
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
AUTO_INCREMENT=9
;


ALTER TABLE `check_disc_type`
	ADD COLUMN `discountLevelId` SMALLINT(6) NOT NULL DEFAULT '0' AFTER `discountGroupId`;


ALTER TABLE `check_disc_type`
	DROP COLUMN `discmeth`,
	DROP COLUMN `peritem`,
	DROP COLUMN `isdiscpre`,
	DROP COLUMN `isinctax`,
	DROP COLUMN `isincsc`,
	DROP COLUMN `grprange1`,
	DROP COLUMN `grprange2`,
	DROP COLUMN `grprange3`,
	DROP COLUMN `grprange4`,
	DROP COLUMN `grprange5`,
	DROP COLUMN `notonck`,
	DROP COLUMN `notonitem`,
	DROP COLUMN `disclevel`,
	DROP COLUMN `script`,
	DROP COLUMN `useref`,
	DROP COLUMN `notcount`;

CREATE TABLE `discount` (
	`id` SMALLINT(6) NOT NULL AUTO_INCREMENT,
	`discountGroupId` SMALLINT(6) NOT NULL DEFAULT '0',
	`allLevel` TINYINT(4) NOT NULL DEFAULT '1',
	`allOutlet` TINYINT(4) NOT NULL DEFAULT '1',
	`name` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`discRate` DECIMAL(5,2) NULL DEFAULT NULL,
	`discAmount` DECIMAL(9,2) NULL DEFAULT NULL,
	`presence` TINYINT(2) NOT NULL DEFAULT '1',
	`status` TINYINT(2) NOT NULL DEFAULT '1',
	`inputDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`inputBy` SMALLINT(6) NOT NULL DEFAULT '1',
	`updateDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`updateBy` SMALLINT(6) NOT NULL DEFAULT '1',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=39
;


CREATE TABLE `discount_level` (
	`id` INT(11) NOT NULL DEFAULT '0',
	`discountId` SMALLINT(6) NOT NULL DEFAULT '0',
	`employeeAuthLevelId` SMALLINT(6) NOT NULL DEFAULT '0',
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
;


ALTER TABLE `outlet_check_disc`
	CHANGE COLUMN `checkDiscTypeId` `discountId` SMALLINT(6) NOT NULL DEFAULT '0' AFTER `outletId`;


RENAME TABLE `outlet_check_disc` TO `outlet_discount`;


ALTER TABLE `employee`
	CHANGE COLUMN `addr1` `address` TEXT NULL COLLATE 'utf8mb4_general_ci' AFTER `contact`,
	DROP COLUMN `addr2`;

ALTER TABLE `check_payment_type`
	DROP COLUMN `payid`;


ALTER TABLE `daily_check`
	CHANGE COLUMN `totalTables` `totalTables` SMALLINT NOT NULL DEFAULT 0 AFTER `closeBalance`,
	CHANGE COLUMN `totalCover` `totalCover` SMALLINT NOT NULL DEFAULT 0 AFTER `totalTables`,
	CHANGE COLUMN `totalBill` `totalBill` SMALLINT NOT NULL DEFAULT 0 AFTER `totalCover`,
	CHANGE COLUMN `totalItem` `totalItem` SMALLINT NOT NULL DEFAULT 0 AFTER `totalBill`,
	ADD COLUMN `totalVoid` SMALLINT NOT NULL DEFAULT 0 AFTER `totalItem`;
ALTER TABLE `daily_check`
	ADD COLUMN `totalTA` SMALLINT(6) NOT NULL DEFAULT '0' AFTER `totalVoid`;
ALTER TABLE `daily_check`
	ADD COLUMN `scIncluded` INT(11) NOT NULL DEFAULT '0' AFTER `sc`,
	ADD COLUMN `taxIncluded` INT(11) NOT NULL DEFAULT '0' AFTER `tax`;
