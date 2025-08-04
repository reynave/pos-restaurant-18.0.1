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
