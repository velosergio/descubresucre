-- CreateTable
CREATE TABLE `SucreNaturalHub` (
    `id` VARCHAR(32) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `tagline` VARCHAR(500) NULL,
    `introMarkdown` TEXT NULL,
    `coverImageUrl` VARCHAR(2048) NULL,
    `sortOrder` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `ImperdibleDestination`
    MODIFY `cardImageUrl` VARCHAR(2048) NULL,
    MODIFY `mapLat` DECIMAL(10, 7) NULL,
    MODIFY `mapLng` DECIMAL(10, 7) NULL,
    ADD COLUMN `municipality` VARCHAR(200) NULL,
    ADD COLUMN `region` VARCHAR(200) NULL,
    ADD COLUMN `locationLabel` VARCHAR(300) NULL,
    ADD COLUMN `ecosystems` VARCHAR(500) NULL,
    ADD COLUMN `approach` VARCHAR(500) NULL,
    ADD COLUMN `specialWhy` TEXT NULL,
    ADD COLUMN `howToArrive` TEXT NULL,
    ADD COLUMN `climate` VARCHAR(300) NULL,
    ADD COLUMN `recommendedTime` VARCHAR(300) NULL,
    ADD COLUMN `audience` VARCHAR(300) NULL,
    ADD COLUMN `mapNote` VARCHAR(500) NULL,
    ADD COLUMN `liveActivities` JSON NULL,
    ADD COLUMN `responsibleTips` JSON NULL,
    ADD COLUMN `biodiversityChipLabels` JSON NULL,
    ADD COLUMN `showOnHome` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `seedManaged` BOOLEAN NOT NULL DEFAULT false;

-- Destinos preexistentes siguen destacados en la home.
UPDATE `ImperdibleDestination` SET `showOnHome` = 1;

-- CreateIndex
CREATE INDEX `ImperdibleDestination_published_showOnHome_sortOrder_idx` ON `ImperdibleDestination`(`published`, `showOnHome`, `sortOrder`);

-- CreateIndex
CREATE INDEX `ImperdibleDestination_published_municipality_idx` ON `ImperdibleDestination`(`published`, `municipality`);

-- CreateTable
CREATE TABLE `ImperdibleDestinationHub` (
    `destinationId` VARCHAR(191) NOT NULL,
    `hubId` VARCHAR(32) NOT NULL,

    INDEX `ImperdibleDestinationHub_hubId_idx`(`hubId`),
    PRIMARY KEY (`destinationId`, `hubId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImperdibleGalleryItem` (
    `id` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `publicUrl` VARCHAR(2048) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `alt` VARCHAR(300) NULL,

    INDEX `ImperdibleGalleryItem_destinationId_sortOrder_idx`(`destinationId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BiodiversityEntry` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `kind` ENUM('FAUNA', 'FLORA', 'ECOSYSTEM') NOT NULL,
    `groupKey` VARCHAR(80) NOT NULL,
    `commonName` VARCHAR(200) NOT NULL,
    `scientificName` VARCHAR(200) NULL,
    `summary` TEXT NOT NULL,
    `whereFound` TEXT NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `seedManaged` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BiodiversityEntry_slug_key`(`slug`),
    INDEX `BiodiversityEntry_published_kind_sortOrder_idx`(`published`, `kind`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BiodiversityOnDestination` (
    `destinationId` VARCHAR(191) NOT NULL,
    `entryId` VARCHAR(191) NOT NULL,

    INDEX `BiodiversityOnDestination_entryId_idx`(`entryId`),
    PRIMARY KEY (`destinationId`, `entryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NatureExperience` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `tagline` VARCHAR(500) NULL,
    `whereText` TEXT NULL,
    `whatYouDo` JSON NULL,
    `specialWhy` TEXT NULL,
    `recommendations` JSON NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `seedManaged` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NatureExperience_slug_key`(`slug`),
    INDEX `NatureExperience_published_sortOrder_idx`(`published`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceOnDestination` (
    `destinationId` VARCHAR(191) NOT NULL,
    `experienceId` VARCHAR(191) NOT NULL,

    INDEX `ExperienceOnDestination_experienceId_idx`(`experienceId`),
    PRIMARY KEY (`destinationId`, `experienceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentSource` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(80) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `url` VARCHAR(2048) NULL,
    `note` VARCHAR(500) NULL,

    UNIQUE INDEX `ContentSource_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DestinationSource` (
    `destinationId` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,

    INDEX `DestinationSource_sourceId_idx`(`sourceId`),
    PRIMARY KEY (`destinationId`, `sourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImperdibleDestinationHub` ADD CONSTRAINT `ImperdibleDestinationHub_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `ImperdibleDestination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImperdibleDestinationHub` ADD CONSTRAINT `ImperdibleDestinationHub_hubId_fkey` FOREIGN KEY (`hubId`) REFERENCES `SucreNaturalHub`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImperdibleGalleryItem` ADD CONSTRAINT `ImperdibleGalleryItem_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `ImperdibleDestination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BiodiversityOnDestination` ADD CONSTRAINT `BiodiversityOnDestination_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `ImperdibleDestination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BiodiversityOnDestination` ADD CONSTRAINT `BiodiversityOnDestination_entryId_fkey` FOREIGN KEY (`entryId`) REFERENCES `BiodiversityEntry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceOnDestination` ADD CONSTRAINT `ExperienceOnDestination_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `ImperdibleDestination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceOnDestination` ADD CONSTRAINT `ExperienceOnDestination_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `NatureExperience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationSource` ADD CONSTRAINT `DestinationSource_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `ImperdibleDestination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationSource` ADD CONSTRAINT `DestinationSource_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `ContentSource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
