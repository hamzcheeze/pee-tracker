-- CreateTable
CREATE TABLE "Detail" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Detail_pkey" PRIMARY KEY ("id")
);
