-- CreateTable
CREATE TABLE `QueHacerCategory` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `description` VARCHAR(500) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `seedManaged` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QueHacerCategory_slug_key`(`slug`),
    INDEX `QueHacerCategory_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QueHacerActivity` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `description` TEXT NOT NULL,
    `iconKey` VARCHAR(64) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `seedManaged` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QueHacerActivity_slug_key`(`slug`),
    INDEX `QueHacerActivity_published_sortOrder_idx`(`published`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QueHacerActivityPhoto` (
    `id` VARCHAR(191) NOT NULL,
    `activityId` VARCHAR(191) NOT NULL,
    `publicUrl` VARCHAR(2048) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `alt` VARCHAR(300) NULL,
    `isCover` BOOLEAN NOT NULL DEFAULT false,

    INDEX `QueHacerActivityPhoto_activityId_sortOrder_idx`(`activityId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QueHacerActivityOnCategory` (
    `activityId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    INDEX `QueHacerActivityOnCategory_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`activityId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QueHacerDestinationOnCategory` (
    `destinationId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    INDEX `QueHacerDestinationOnCategory_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`destinationId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QueHacerActivityOnDestination` (
    `activityId` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `QueHacerActivityOnDestination_destinationId_idx`(`destinationId`),
    PRIMARY KEY (`activityId`, `destinationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QueHacerActivityPhoto` ADD CONSTRAINT `QueHacerActivityPhoto_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `QueHacerActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QueHacerActivityOnCategory` ADD CONSTRAINT `QueHacerActivityOnCategory_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `QueHacerActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QueHacerActivityOnCategory` ADD CONSTRAINT `QueHacerActivityOnCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `QueHacerCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QueHacerDestinationOnCategory` ADD CONSTRAINT `QueHacerDestinationOnCategory_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `ImperdibleDestination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QueHacerDestinationOnCategory` ADD CONSTRAINT `QueHacerDestinationOnCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `QueHacerCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QueHacerActivityOnDestination` ADD CONSTRAINT `QueHacerActivityOnDestination_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `QueHacerActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QueHacerActivityOnDestination` ADD CONSTRAINT `QueHacerActivityOnDestination_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `ImperdibleDestination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
