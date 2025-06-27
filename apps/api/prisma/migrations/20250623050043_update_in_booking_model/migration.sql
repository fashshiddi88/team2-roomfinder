/*
  Warnings:

  - You are about to drop the column `duration` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingType` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkoutDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('MANUAL', 'GATEWAY');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "duration",
ADD COLUMN     "autoCanceledAt" TIMESTAMP(3),
ADD COLUMN     "bookingType" "BookingType" NOT NULL,
ADD COLUMN     "checkoutDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "deleteAt" TIMESTAMP(3),
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "rejectedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_orderNumber_key" ON "Booking"("orderNumber");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");
