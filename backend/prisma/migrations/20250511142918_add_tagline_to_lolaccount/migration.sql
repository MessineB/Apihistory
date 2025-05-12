/*
  Warnings:

  - Added the required column `tagLine` to the `LoLAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoLAccount" ADD COLUMN     "tagLine" TEXT NOT NULL;
