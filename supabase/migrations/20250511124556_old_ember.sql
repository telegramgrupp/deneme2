/*
  # Initial Database Schema

  1. New Tables
    - `User`: Store user details with socket-based identification
    - `Match`: Log video chat matches between users
    - `Coin`: Track user coin balances
    - `Transaction`: Record all coin purchases and usage
    - `FakeVideo`: Manage pre-recorded videos for fake matches
  
  2. Security
    - No RLS needed (managed through application logic)
    
  3. Enums
    - `TransactionType`: purchase, usage
    - `PaymentProvider`: stripe, iyzico, admin, system
    - `TransactionStatus`: pending, completed, failed
*/

-- Create enum types
CREATE TYPE "TransactionType" AS ENUM ('purchase', 'usage');
CREATE TYPE "PaymentProvider" AS ENUM ('stripe', 'iyzico', 'admin', 'system');
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'completed', 'failed');

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "socketId" TEXT UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeen" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isBanned" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Match table
CREATE TABLE IF NOT EXISTS "Match" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "matchedWith" TEXT NOT NULL,
  "isFake" BOOLEAN NOT NULL DEFAULT FALSE,
  "startTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endTime" TIMESTAMP WITH TIME ZONE,
  "duration" INTEGER, -- in seconds
  "videoPath" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"("id"),
  FOREIGN KEY ("matchedWith") REFERENCES "User"("id")
);

-- Create Coin table
CREATE TABLE IF NOT EXISTS "Coin" (
  "userId" TEXT PRIMARY KEY,
  "balance" INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
);

-- Create Transaction table
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "type" "TransactionType" NOT NULL,
  "provider" "PaymentProvider" NOT NULL,
  "status" "TransactionStatus" NOT NULL DEFAULT 'completed',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "description" TEXT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
);

-- Create FakeVideo table
CREATE TABLE IF NOT EXISTS "FakeVideo" (
  "id" TEXT PRIMARY KEY,
  "path" TEXT NOT NULL,
  "duration" INTEGER NOT NULL, -- in seconds
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "User_socketId_idx" ON "User"("socketId");
CREATE INDEX IF NOT EXISTS "Match_userId_idx" ON "Match"("userId");
CREATE INDEX IF NOT EXISTS "Match_matchedWith_idx" ON "Match"("matchedWith");
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_createdAt_idx" ON "Transaction"("createdAt");