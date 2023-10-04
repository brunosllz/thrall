/*
  Warnings:

  - You are about to drop the column `linkUrl` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `linkTo` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "linkUrl",
DROP COLUMN "message",
ADD COLUMN     "ctaTitle" TEXT[],
ADD COLUMN     "linkTo" TEXT NOT NULL;
