/*
  Warnings:

  - Added the required column `name` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "name" TEXT NOT NULL;
