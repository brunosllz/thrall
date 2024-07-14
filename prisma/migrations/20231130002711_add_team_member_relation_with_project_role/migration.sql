/*
  Warnings:

  - You are about to drop the `_ProjectRoleToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectRoleToUser" DROP CONSTRAINT "_ProjectRoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectRoleToUser" DROP CONSTRAINT "_ProjectRoleToUser_B_fkey";

-- DropTable
DROP TABLE "_ProjectRoleToUser";

-- CreateTable
CREATE TABLE "_ProjectRoleToTeamMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectRoleToTeamMember_AB_unique" ON "_ProjectRoleToTeamMember"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectRoleToTeamMember_B_index" ON "_ProjectRoleToTeamMember"("B");

-- AddForeignKey
ALTER TABLE "_ProjectRoleToTeamMember" ADD CONSTRAINT "_ProjectRoleToTeamMember_A_fkey" FOREIGN KEY ("A") REFERENCES "project_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleToTeamMember" ADD CONSTRAINT "_ProjectRoleToTeamMember_B_fkey" FOREIGN KEY ("B") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
