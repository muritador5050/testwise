-- DropForeignKey
ALTER TABLE "public"."attempts" DROP CONSTRAINT "attempts_testId_fkey";

-- AddForeignKey
ALTER TABLE "public"."attempts" ADD CONSTRAINT "attempts_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
