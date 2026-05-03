CREATE TABLE `HeroAppearanceSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `heroMode` ENUM('IMAGE_DEFAULT', 'IMAGE_CUSTOM', 'VIDEO', 'CAROUSEL') NOT NULL DEFAULT 'IMAGE_DEFAULT',
    `heroImageUrl` VARCHAR(2048) NULL,
    `heroVideoUrl` VARCHAR(2048) NULL,
    `heroVideoSource` ENUM('UPLOAD', 'EXTERNAL_URL') NULL,
    `carouselSlides` JSON NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
