/*
  Warnings:

  - You are about to drop the column `userId` on the `UserInventory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[itemId]` on the table `UserInventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserInventory" DROP CONSTRAINT "UserInventory_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProgress" DROP CONSTRAINT "UserProgress_userId_fkey";

-- DropIndex
DROP INDEX "public"."UserInventory_userId_itemId_key";

-- DropIndex
DROP INDEX "public"."UserProgress_userId_key";

-- AlterTable
ALTER TABLE "UserInventory" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "UserProgress" DROP COLUMN "userId",
ALTER COLUMN "id" SET DEFAULT 1,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "userprogress_id_seq";

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- CreateIndex
CREATE UNIQUE INDEX "UserInventory_itemId_key" ON "UserInventory"("itemId");
