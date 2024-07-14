/*
  Warnings:

  - You are about to drop the `_ProjectRoleToTeamMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectRoleToTeamMember" DROP CONSTRAINT "_ProjectRoleToTeamMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectRoleToTeamMember" DROP CONSTRAINT "_ProjectRoleToTeamMember_B_fkey";

-- DropForeignKey
ALTER TABLE "project_roles" DROP CONSTRAINT "project_roles_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_roles" DROP CONSTRAINT "project_roles_role_id_fkey";

-- DropTable
DROP TABLE "_ProjectRoleToTeamMember";

-- DropTable
DROP TABLE "project_roles";

-- CreateTable
CREATE TABLE "project_jobs" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "members_amount" INTEGER NOT NULL,
    "project_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "project_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectJobToTeamMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "project_jobs_project_id_role_id_key" ON "project_jobs"("project_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectJobToTeamMember_AB_unique" ON "_ProjectJobToTeamMember"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectJobToTeamMember_B_index" ON "_ProjectJobToTeamMember"("B");

-- AddForeignKey
ALTER TABLE "project_jobs" ADD CONSTRAINT "project_jobs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_jobs" ADD CONSTRAINT "project_jobs_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectJobToTeamMember" ADD CONSTRAINT "_ProjectJobToTeamMember_A_fkey" FOREIGN KEY ("A") REFERENCES "project_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectJobToTeamMember" ADD CONSTRAINT "_ProjectJobToTeamMember_B_fkey" FOREIGN KEY ("B") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
