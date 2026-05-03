-- CreateTable
CREATE TABLE `ImperdiblesSectionSettings` (
    `id` VARCHAR(191) NOT NULL,
    `displayMode` ENUM('GRID_THREE', 'CAROUSEL') NOT NULL DEFAULT 'GRID_THREE',
    `itemOrder` ENUM('MANUAL', 'RANDOM') NOT NULL DEFAULT 'MANUAL',
    `headingTitle` VARCHAR(200) NULL,
    `headingSubtitle` VARCHAR(500) NULL,
    `carouselIntervalMs` INTEGER NOT NULL DEFAULT 5000,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImperdibleDestination` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `subtitle` VARCHAR(500) NOT NULL,
    `cardImageUrl` VARCHAR(2048) NOT NULL,
    `bodyMarkdown` TEXT NOT NULL,
    `mapLat` DECIMAL(10, 7) NOT NULL,
    `mapLng` DECIMAL(10, 7) NOT NULL,
    `mapZoom` INTEGER NOT NULL DEFAULT 14,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ImperdibleDestination_slug_key`(`slug`),
    INDEX `ImperdibleDestination_published_sortOrder_idx`(`published`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `ImperdiblesSectionSettings` (`id`, `displayMode`, `itemOrder`, `headingTitle`, `headingSubtitle`, `carouselIntervalMs`, `updatedAt`)
VALUES ('singleton', 'GRID_THREE', 'MANUAL', NULL, NULL, 5000, CURRENT_TIMESTAMP(3));
