-- CreateTable
CREATE TABLE `Convocatoria` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `audience` VARCHAR(200) NOT NULL,
    `type` VARCHAR(80) NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `externalUrl` VARCHAR(2048) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Convocatoria_published_deadline_idx`(`published`, `deadline`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
