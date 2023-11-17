/*
  Warnings:

  - You are about to drop the `InterestedInProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterestedInProject" DROP CONSTRAINT "InterestedInProject_project_id_fkey";

-- DropForeignKey
ALTER TABLE "InterestedInProject" DROP CONSTRAINT "InterestedInProject_user_id_fkey";

-- DropTable
DROP TABLE "InterestedInProject";

-- CreateTable
CREATE TABLE "interested_in_projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" "INTERESTED_STATUS" NOT NULL DEFAULT 'pending',
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interested_in_projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "interested_in_projects" ADD CONSTRAINT "interested_in_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interested_in_projects" ADD CONSTRAINT "interested_in_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
