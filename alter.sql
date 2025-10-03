ALTER TABLE `check_payment_type`
	ADD COLUMN `setDefault` TINYINT NOT NULL DEFAULT 0 AFTER `id`;
