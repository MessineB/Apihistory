-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoLAccount" (
    "id" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "summonerName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "top5Champions" TEXT[],
    "rank" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LoLAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dofus" (
    "id" TEXT NOT NULL,
    "dofusName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "obtained" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Dofus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearthstoneDeck" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HearthstoneDeck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LoLAccount_puuid_key" ON "LoLAccount"("puuid");

-- CreateIndex
CREATE UNIQUE INDEX "Dofus_userId_key" ON "Dofus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HearthstoneDeck_userId_key" ON "HearthstoneDeck"("userId");

-- AddForeignKey
ALTER TABLE "LoLAccount" ADD CONSTRAINT "LoLAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dofus" ADD CONSTRAINT "Dofus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearthstoneDeck" ADD CONSTRAINT "HearthstoneDeck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
