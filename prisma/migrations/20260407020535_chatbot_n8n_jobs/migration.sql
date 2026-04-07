-- CreateTable
CREATE TABLE `ChatbotSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `n8nWebhookUrl` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatJob` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'DONE', 'ERROR') NOT NULL DEFAULT 'PENDING',
    `assistantReply` TEXT NULL,
    `errorMessage` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
