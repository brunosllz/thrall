/*
  Warnings:

  - You are about to drop the column `requirementContent` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `requirementPeriodAmount` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `requirementPeriodIdentifier` on the `Project` table. All the data in the column will be lost.
  - Added the required column `meetingDate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingTime` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingType` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirements` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `description` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MEETING_TYPE" AS ENUM ('daily', 'weekly', 'mothly');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "requirementContent",
DROP COLUMN "requirementPeriodAmount",
DROP COLUMN "requirementPeriodIdentifier",
ADD COLUMN     "meetingDate" TEXT NOT NULL,
ADD COLUMN     "meetingTime" TEXT NOT NULL,
ADD COLUMN     "meetingType" "MEETING_TYPE" NOT NULL,
ADD COLUMN     "requirements" JSONB NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- DropEnum
DROP TYPE "PERIOD_IDENTIFIER";
