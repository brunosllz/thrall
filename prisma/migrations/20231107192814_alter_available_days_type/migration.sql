/*
  Warnings:

  - The `available_days` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "available_days",
ADD COLUMN     "available_days" INTEGER[];
