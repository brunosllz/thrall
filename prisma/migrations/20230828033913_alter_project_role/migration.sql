/*
  Warnings:

  - You are about to drop the column `requirementTimeAmount` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `requirementTimeIdentifier` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `ProjectRole` table. All the data in the column will be lost.
  - Added the required column `requirementPeriodAmount` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirementPeriodIdentifier` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `membersAmount` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "requirementTimeAmount",
DROP COLUMN "requirementTimeIdentifier",
ADD COLUMN     "requirementPeriodAmount" INTEGER NOT NULL,
ADD COLUMN     "requirementPeriodIdentifier" "TIME_IDENTIFIER" NOT NULL;

-- AlterTable
ALTER TABLE "ProjectRole" DROP COLUMN "amount",
ADD COLUMN     "membersAmount" INTEGER NOT NULL;
