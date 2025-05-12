/*
  Warnings:

  - You are about to drop the column `quantity` on the `Dofus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,dofusName]` on the table `Dofus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Dofus_userId_key";

-- AlterTable
ALTER TABLE "Dofus" DROP COLUMN "quantity";

-- CreateIndex
CREATE UNIQUE INDEX "Dofus_userId_dofusName_key" ON "Dofus"("userId", "dofusName");
