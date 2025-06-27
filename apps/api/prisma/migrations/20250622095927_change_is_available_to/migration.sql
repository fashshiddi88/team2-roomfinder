/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `RoomAvailability` table. All the data in the column will be lost.
  - Added the required column `available` to the `RoomAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoomAvailability" DROP COLUMN "isAvailable",
ADD COLUMN     "available" INTEGER NOT NULL;
