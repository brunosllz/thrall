/*
  Warnings:

  - The values [accepted] on the enum `MEMBER_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MEMBER_STATUS_new" AS ENUM ('pending', 'rejected', 'approved');
ALTER TABLE "TeamMember" ALTER COLUMN "status" TYPE "MEMBER_STATUS_new" USING ("status"::text::"MEMBER_STATUS_new");
ALTER TYPE "MEMBER_STATUS" RENAME TO "MEMBER_STATUS_old";
ALTER TYPE "MEMBER_STATUS_new" RENAME TO "MEMBER_STATUS";
DROP TYPE "MEMBER_STATUS_old";
COMMIT;
