/*
  Warnings:

  - Added the required column `artist` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artist` to the `seats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `artist` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `seats` ADD COLUMN `artist` VARCHAR(191) NOT NULL;
