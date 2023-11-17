/*
  Warnings:

  - You are about to drop the column `createdAt` on the `InterestedInProject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterestedInProject" DROP COLUMN "createdAt",
ADD COLUMN     "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
