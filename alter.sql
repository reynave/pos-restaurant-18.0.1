INSERT INTO `pos_resto`.`auto_number` (`id`, `name`) VALUES (2, 'order');
ALTER TABLE `cart`
	ADD COLUMN `sendOrder` TINYINT NOT NULL DEFAULT 0 AFTER `dailyCheckId`;

INSERT INTO `pos_resto`.`outlet_table_map_status` (`id`, `name`) VALUES (42, 'Exit Without Order');
ALTER TABLE `cart`
	ADD COLUMN `lockBy` SMALLINT NOT NULL DEFAULT '0' AFTER `outletTableMapId`;
	
ALTER TABLE `cart`
	CHANGE COLUMN `lockBy` `lockBy` VARCHAR(10) NOT NULL DEFAULT '' AFTER `outletTableMapId`;

