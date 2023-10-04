/*
  Warnings:

  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `linkUrl` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NOTIFICATION_TYPE" AS ENUM ('message', 'action', 'interaction');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
ADD COLUMN     "linkUrl" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "type" "NOTIFICATION_TYPE" NOT NULL;
