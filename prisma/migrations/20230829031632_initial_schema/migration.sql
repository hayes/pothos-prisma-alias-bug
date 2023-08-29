-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Value" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Value_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
