ALTER TABLE `cart_item_modifier`
	ADD COLUMN `menuSetAdjustItemsId` VARCHAR(50) NOT NULL DEFAULT '' AFTER `menuSetMenuId`;


ALTER TABLE `cart_item_modifier`
	CHANGE COLUMN `menuSetAdjustItemsId` `menuSetAdjustItemsId` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci' AFTER `menuSetMenuId`,
	CHANGE COLUMN `cartId` `cartId` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci' AFTER `menuSetAdjustItemsId`;
