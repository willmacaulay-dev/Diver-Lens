-- CreateTable
CREATE TABLE "PublicProfile" (
    "id" SERIAL NOT NULL,
    "profileName" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "animals" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicProfile_pkey" PRIMARY KEY ("id")
);
