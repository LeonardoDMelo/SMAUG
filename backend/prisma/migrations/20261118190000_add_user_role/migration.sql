-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SECONDARY_ADMIN', 'PRIMARY_ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Ensure the primary admin email always has PRIMARY_ADMIN
UPDATE "User"
SET "role" = 'PRIMARY_ADMIN'
WHERE lower("email") = lower('leonardodavimelo@live.com');
