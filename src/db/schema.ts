import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { usersSync } from "drizzle-orm/neon"

// ----- CATEGORIES -----
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
})

// ----- TAGS -----
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
})

export const productTags = pgTable(
  "product_tags",
  {
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "cascade",
    }),
    tagId: uuid("tag_id").references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.productId, table.tagId] })]
)

// ----- PRODUCTS -----
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  barcode: text("barcode").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  plasticScore: integer("plastic_score"), // e.g., from 1–5
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
})

// ----- SOURCES -----
export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  sourceName: text("source_name").notNull(), // e.g. "Amazon"
  sourceUrl: text("source_url").notNull(),
  affiliateTag: text("affiliate_tag"),
  price: numeric("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  availability: text("availability").default("in_stock"),
  lastSynced: timestamp("last_synced").default(sql`now()`),
})

// ----- FAVORITES (using Neon Auth) -----
export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersSync.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.productId] })]
)
