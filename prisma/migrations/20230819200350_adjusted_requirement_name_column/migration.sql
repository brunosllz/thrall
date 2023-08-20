/*
  Warnings:

  - You are about to drop the column `requirementcontent` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `requirementtimeIdentifier` on the `Project` table. All the data in the column will be lost.
  - Added the required column `requirementContent` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirementTimeIdentifier` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "requirementcontent",
DROP COLUMN "requirementtimeIdentifier",
ADD COLUMN     "requirementContent" TEXT NOT NULL,
ADD COLUMN     "requirementTimeIdentifier" "TIME_IDENTIFIER" NOT NULL;
