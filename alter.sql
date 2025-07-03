ALTER TABLE `employee`
	CHANGE COLUMN `authlevel` `authlevelId` SMALLINT(6) NULL DEFAULT NULL AFTER `id`;
