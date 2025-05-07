/*
  Warnings:

  - You are about to drop the column `followimgId` on the `Follow` table. All the data in the column will be lost.
  - Added the required column `followingId` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_followimgId_fkey`;

-- DropIndex
DROP INDEX `Follow_followimgId_fkey` ON `Follow`;

-- AlterTable
ALTER TABLE `Follow` DROP COLUMN `followimgId`,
    ADD COLUMN `followingId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
