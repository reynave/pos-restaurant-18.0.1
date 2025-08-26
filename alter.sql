ALTER TABLE `print_queue`
	ADD COLUMN `rushPrinting` TINYINT NOT NULL DEFAULT 0 AFTER `menuId`;
