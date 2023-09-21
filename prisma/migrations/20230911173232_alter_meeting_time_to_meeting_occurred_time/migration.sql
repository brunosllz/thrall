/*
  Warnings:

  - You are about to drop the column `meetingTime` on the `Project` table. All the data in the column will be lost.
  - Added the required column `meetingOccurredTime` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "meetingTime",
ADD COLUMN     "meetingOccurredTime" TEXT NOT NULL;
