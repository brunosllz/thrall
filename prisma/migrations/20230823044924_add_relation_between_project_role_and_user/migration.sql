/*
  Warnings:

  - You are about to drop the column `assigneesId` on the `ProjectRole` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectRole" DROP COLUMN "assigneesId";

-- CreateTable
CREATE TABLE "_ProjectRoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectRoleToUser_AB_unique" ON "_ProjectRoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectRoleToUser_B_index" ON "_ProjectRoleToUser"("B");

-- AddForeignKey
ALTER TABLE "_ProjectRoleToUser" ADD CONSTRAINT "_ProjectRoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleToUser" ADD CONSTRAINT "_ProjectRoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
