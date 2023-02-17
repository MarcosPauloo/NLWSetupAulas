/*
  Warnings:

  - You are about to drop the column `data` on the `day` table. All the data in the column will be lost.
  - Added the required column `date` to the `day` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_day" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_day" ("id") SELECT "id" FROM "day";
DROP TABLE "day";
ALTER TABLE "new_day" RENAME TO "day";
CREATE UNIQUE INDEX "day_date_key" ON "day"("date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
