INSERT INTO `pos_resto`.`auto_number` (`id`, `name`) VALUES (2, 'order');
ALTER TABLE `cart`
	ADD COLUMN `sendOrder` TINYINT NOT NULL DEFAULT 0 AFTER `dailyCheckId`;

INSERT INTO `pos_resto`.`outlet_table_map_status` (`id`, `name`) VALUES (42, 'Exit Without Order');
ALTER TABLE `cart`
	ADD COLUMN `lockBy` SMALLINT NOT NULL DEFAULT '0' AFTER `outletTableMapId`;
	
ALTER TABLE `cart`
	CHANGE COLUMN `lockBy` `lockBy` VARCHAR(10) NOT NULL DEFAULT '' AFTER `outletTableMapId`;
INSERT INTO `outlet_table_map_status` VALUES (13, 'Bill', 'text-bill', 'bg-bill', 1);

ALTER TABLE `cart_item`
	ADD COLUMN `qty` SMALLINT NOT NULL DEFAULT 1 AFTER `subgroup`;
	
CREATE TABLE `bill` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`cartId` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`no` TINYINT(4) NOT NULL DEFAULT '1',
	`presence` TINYINT(2) NOT NULL DEFAULT '1',
	`inputDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`inputBy` SMALLINT(6) NOT NULL DEFAULT '1',
	`updateDate` DATETIME NOT NULL DEFAULT '2025-01-01 00:00:00',
	`updateBy` SMALLINT(6) NOT NULL DEFAULT '1',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=27
;

ALTER TABLE `cart`
	ADD COLUMN `billNo` TINYINT NOT NULL DEFAULT 0 AFTER `id`;

ALTER TABLE `cart_item_modifier`
	ADD COLUMN `menuSetQty` TINYINT NOT NULL DEFAULT 0 AFTER `menuSetMenuId`;
