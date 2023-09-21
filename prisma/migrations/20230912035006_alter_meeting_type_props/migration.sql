/*
  Warnings:

  - The values [mothly] on the enum `MEETING_TYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MEETING_TYPE_new" AS ENUM ('daily', 'weekly', 'monthly');
ALTER TABLE "Project" ALTER COLUMN "meetingType" TYPE "MEETING_TYPE_new" USING ("meetingType"::text::"MEETING_TYPE_new");
ALTER TYPE "MEETING_TYPE" RENAME TO "MEETING_TYPE_old";
ALTER TYPE "MEETING_TYPE_new" RENAME TO "MEETING_TYPE";
DROP TYPE "MEETING_TYPE_old";
COMMIT;
