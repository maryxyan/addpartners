// Export your models here. Add one export per file
// export * from "./posts";
//
// Each model/table should ideally be split into different files.
// Each model/table should define a Drizzle table, insert schema, and types:
//
//   import { pgTable, text, serial } from "drizzle-orm/pg-core";
//   import { createInsertSchema } from "drizzle-zod";
//   import { z } from "zod/v4";
//
//   export const postsTable = pgTable("posts", {
//     id: serial("id").primaryKey(),
//     title: text("title").notNull(),
//   });
//
//   export const insertPostSchema = createInsertSchema(postsTable).omit({ id: true });
//   export type InsertPost = z.infer<typeof insertPostSchema>;
//   export type Post = typeof postsTable.$inferSelect;

import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  size: text("size").notNull(),
  category: text("category").notNull(),
  zone: text("zone").notNull(),
  area: text("area").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  location: text("location"),
  propertySlug: text("property_slug"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const propertyCategoriesTable = pgTable("property_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const propertyStatusesTable = pgTable("property_statuses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiriesTable.$inferSelect;

export const insertPropertyCategorySchema = createInsertSchema(propertyCategoriesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPropertyCategory = z.infer<typeof insertPropertyCategorySchema>;
export type PropertyCategory = typeof propertyCategoriesTable.$inferSelect;

export const insertPropertyStatusSchema = createInsertSchema(propertyStatusesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPropertyStatus = z.infer<typeof insertPropertyStatusSchema>;
export type PropertyStatus = typeof propertyStatusesTable.$inferSelect;