/*
  Warnings:

  - You are about to drop the column `content` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PROJECT_STATUS" AS ENUM ('draft', 'recruiting', 'closed');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" "PROJECT_STATUS" NOT NULL;
