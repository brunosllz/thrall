/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugProfile]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_userName_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "occupation",
DROP COLUMN "userName",
ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "overallRate" DECIMAL(5,2) NOT NULL DEFAULT 0.0,
ADD COLUMN     "profileUrl" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "seniority" TEXT,
ADD COLUMN     "slugProfile" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_profileUrl_key" ON "User"("profileUrl");

-- CreateIndex
CREATE UNIQUE INDEX "User_slugProfile_key" ON "User"("slugProfile");
