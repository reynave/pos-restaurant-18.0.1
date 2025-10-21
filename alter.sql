ALTER TABLE `menu`
	ADD COLUMN `openPrice` TINYINT NOT NULL DEFAULT '0' AFTER `scStatus`;

ALTER TABLE `cart`
	ADD COLUMN `summaryItemTotal` INT(11) NOT NULL DEFAULT '0' AFTER `tips`,
	ADD COLUMN `summaryDiscount` INT(11) NOT NULL DEFAULT '0' AFTER `summaryItemTotal`,
	ADD COLUMN `summarySc` INT(11) NOT NULL DEFAULT '0' AFTER `summaryDiscount`,
	ADD COLUMN `summaryTax` INT(11) NOT NULL DEFAULT '0' AFTER `summarySc`,
	CHANGE COLUMN `grandTotal` `grandTotal` INT(11) NOT NULL DEFAULT '0' AFTER `summaryTax`;


ALTER TABLE `cart`
	ADD COLUMN `summaryTotalGroup` TINYINT NOT NULL DEFAULT 1 AFTER `tips`;
