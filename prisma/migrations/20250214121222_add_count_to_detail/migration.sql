/*
  Warnings:

  - Added the required column `count` to the `Detail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Detail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "owner" TEXT NOT NULL,
    "count" INTEGER NOT NULL
);
INSERT INTO "new_Detail" ("date", "id", "owner", "time") SELECT "date", "id", "owner", "time" FROM "Detail";
DROP TABLE "Detail";
ALTER TABLE "new_Detail" RENAME TO "Detail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
