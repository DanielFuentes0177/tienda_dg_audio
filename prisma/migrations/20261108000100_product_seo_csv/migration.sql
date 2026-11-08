-- Migración aditiva: no modifica inventario, imágenes, publicaciones ni IDs.
-- PRECONDICIÓN: respaldo recuperable de la base comercial.
ALTER TABLE `Product`
  ADD COLUMN `seoTitle` VARCHAR(191) NULL,
  ADD COLUMN `seoDescription` TEXT NULL,
  ADD COLUMN `slug` VARCHAR(191) NULL,
  ADD COLUMN `seoImageAlt` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `Product_slug_key` ON `Product`(`slug`);

-- Únicamente los cuatro slugs previamente aprobados en el piloto.
UPDATE `Product` SET `slug` = 'biamp-voltera-d-1200-2m' WHERE `id` = 'd40b51e9-bb0b-4aa6-bc97-ac9aae7dc1c3' AND `slug` IS NULL;
UPDATE `Product` SET `slug` = 'barco-clickshare-bar-pro' WHERE `id` = '35682066-ab42-41ba-aacb-0ff7b86f8796' AND `slug` IS NULL;
UPDATE `Product` SET `slug` = 'hisense-65we3fe' WHERE `id` = '984d626a-5b96-4904-b5d5-9e1527541283' AND `slug` IS NULL;
UPDATE `Product` SET `slug` = 'bowers-wilkins-isw-8' WHERE `id` = '31056167-e2dd-417d-8de4-443aa5066709' AND `slug` IS NULL;
