/*
  Warnings:

  - Changed the type of `amount` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;
