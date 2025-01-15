/*
  Warnings:

  - You are about to drop the column `satus` on the `Workflow` table. All the data in the column will be lost.
  - Added the required column `status` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "satus",
ADD COLUMN     "status" TEXT NOT NULL;
