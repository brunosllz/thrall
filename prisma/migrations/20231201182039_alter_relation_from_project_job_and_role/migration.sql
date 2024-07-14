/*
  Warnings:

  - You are about to drop the column `role_id` on the `project_jobs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id,role_slug]` on the table `project_jobs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_slug` to the `project_jobs` table without a default value. This is not possible if the table is not empty.
  - Made the column `slug` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "project_jobs" DROP CONSTRAINT "project_jobs_role_id_fkey";

-- DropIndex
DROP INDEX "project_jobs_project_id_role_id_key";

-- AlterTable
ALTER TABLE "project_jobs" DROP COLUMN "role_id",
ADD COLUMN     "role_slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "project_jobs_project_id_role_slug_key" ON "project_jobs"("project_id", "role_slug");

-- AddForeignKey
ALTER TABLE "project_jobs" ADD CONSTRAINT "project_jobs_role_slug_fkey" FOREIGN KEY ("role_slug") REFERENCES "roles"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
