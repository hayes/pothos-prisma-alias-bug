-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "score" TEXT NOT NULL,
    "valueId" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Value"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
