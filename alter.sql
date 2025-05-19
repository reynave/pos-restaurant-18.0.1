ALTER TABLE `cart`
	ADD COLUMN `outletId` TINYINT NOT NULL DEFAULT 0 AFTER `id`;


ALTER TABLE `outlet_check_period`
	CHANGE COLUMN `sttime` `sttime` TIME NOT NULL DEFAULT '00:00:00' AFTER `desc3`,
	CHANGE COLUMN `endtime` `endtime` TIME NOT NULL DEFAULT '23:59:59' AFTER `sttime`;

ALTER TABLE `outlet_check_disc`
	CHANGE COLUMN `outlet` `outletId` INT NOT NULL DEFAULT '0' AFTER `id`;

ALTER TABLE `outlet_check_disc`
	CHANGE COLUMN `discid` `checkDiscTypeId` SMALLINT(6) NOT NULL DEFAULT '0' AFTER `outletId`,
	CHANGE COLUMN `seq` `sorting` TINYINT NOT NULL DEFAULT '1' COLLATE 'utf8mb4_general_ci' AFTER `checkDiscTypeId`;
