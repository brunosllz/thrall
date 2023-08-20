/*
  Warnings:

  - You are about to drop the `Requirement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `requirementTimeAmount` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirementcontent` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirementtimeIdentifier` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "requirementTimeAmount" INTEGER NOT NULL,
ADD COLUMN     "requirementcontent" TEXT NOT NULL,
ADD COLUMN     "requirementtimeIdentifier" "TIME_IDENTIFIER" NOT NULL;

-- DropTable
DROP TABLE "Requirement";
