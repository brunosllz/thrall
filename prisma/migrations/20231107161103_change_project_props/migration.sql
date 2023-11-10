/*
  Warnings:

  - The values [draft] on the enum `PROJECT_STATUS` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `meetingDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `meetingOccurredTime` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `meetingType` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Technology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToTechnology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToskill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skill` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `availableTimeUnit` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableTimeValue` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "INTERESTED_STATUS" AS ENUM ('pending', 'rejected', 'approved');

-- CreateEnum
CREATE TYPE "PROJECT_AVAILABLE_TIME_UNIT" AS ENUM ('hour', 'minute');

-- AlterEnum
BEGIN;
CREATE TYPE "PROJECT_STATUS_new" AS ENUM ('recruiting', 'inProgress', 'closed');
ALTER TABLE "Project" ALTER COLUMN "status" TYPE "PROJECT_STATUS_new" USING ("status"::text::"PROJECT_STATUS_new");
ALTER TYPE "PROJECT_STATUS" RENAME TO "PROJECT_STATUS_old";
ALTER TYPE "PROJECT_STATUS_new" RENAME TO "PROJECT_STATUS";
DROP TYPE "PROJECT_STATUS_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_ProjectToTechnology" DROP CONSTRAINT "_ProjectToTechnology_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTechnology" DROP CONSTRAINT "_ProjectToTechnology_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToskill" DROP CONSTRAINT "_UserToskill_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToskill" DROP CONSTRAINT "_UserToskill_B_fkey";

-- AlterTable
ALTER TABLE "InterestedInProject" ADD COLUMN     "status" "INTERESTED_STATUS" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "meetingDate",
DROP COLUMN "meetingOccurredTime",
DROP COLUMN "meetingType",
DROP COLUMN "requirements",
ADD COLUMN     "availableDays" TEXT[],
ADD COLUMN     "availableTimeUnit" "PROJECT_AVAILABLE_TIME_UNIT" NOT NULL,
ADD COLUMN     "availableTimeValue" INTEGER NOT NULL,
ADD COLUMN     "bannerUrl" TEXT,
ALTER COLUMN "status" SET DEFAULT 'recruiting';

-- AlterTable
ALTER TABLE "ProjectRole" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeamMember" ALTER COLUMN "permissionType" SET DEFAULT 'member',
ALTER COLUMN "status" SET DEFAULT 'pending';

-- DropTable
DROP TABLE "Technology";

-- DropTable
DROP TABLE "_ProjectToTechnology";

-- DropTable
DROP TABLE "_UserToskill";

-- DropTable
DROP TABLE "skill";

-- DropEnum
DROP TYPE "MEETING_TYPE";

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SkillToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToSkill_AB_unique" ON "_ProjectToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToSkill_B_index" ON "_ProjectToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillToUser_AB_unique" ON "_SkillToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillToUser_B_index" ON "_SkillToUser"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToSkill" ADD CONSTRAINT "_ProjectToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToSkill" ADD CONSTRAINT "_ProjectToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToUser" ADD CONSTRAINT "_SkillToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToUser" ADD CONSTRAINT "_SkillToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
