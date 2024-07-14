/*
  Warnings:

  - A unique constraint covering the columns `[project_id,recipient_id]` on the table `team_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "team_members_project_id_recipient_id_key" ON "team_members"("project_id", "recipient_id");
