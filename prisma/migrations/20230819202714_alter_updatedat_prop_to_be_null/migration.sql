-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AnswerComment" ALTER COLUMN "updatedAt" DROP NOT NULL;
