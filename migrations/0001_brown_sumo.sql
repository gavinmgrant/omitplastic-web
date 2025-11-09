-- Add barcode column as nullable first
ALTER TABLE "products" ADD COLUMN "barcode" text;
-- Update existing rows with a generated barcode (using id as fallback)
UPDATE "products" SET "barcode" = 'TEMP-' || "id"::text WHERE "barcode" IS NULL;
-- Now make it NOT NULL
ALTER TABLE "products" ALTER COLUMN "barcode" SET NOT NULL;
-- Add unique constraint
ALTER TABLE "products" ADD CONSTRAINT "products_barcode_unique" UNIQUE("barcode");

-- Same for tags slug
ALTER TABLE "tags" ADD COLUMN "slug" text;
-- Generate slugs from names (you may want to customize this)
UPDATE "tags" SET "slug" = LOWER(REPLACE("name", ' ', '-')) WHERE "slug" IS NULL;
ALTER TABLE "tags" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "tags" ADD CONSTRAINT "tags_slug_unique" UNIQUE("slug");