CREATE TABLE `GalleryAsset` (
    `id` VARCHAR(191) NOT NULL,
    `kind` ENUM('IMAGE', 'VIDEO') NOT NULL,
    `publicUrl` VARCHAR(2048) NOT NULL,
    `mimeType` VARCHAR(128) NULL,
    `sizeBytes` INT NULL,
    `originalName` VARCHAR(512) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GalleryAsset_publicUrl_key`(`publicUrl`),
    INDEX `GalleryAsset_kind_idx`(`kind`),
    INDEX `GalleryAsset_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
