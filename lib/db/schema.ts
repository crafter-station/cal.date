import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  username: text("username").unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  bookingUrl: text("booking_url"),
  theme: text("theme").default("clean"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userPhotos = pgTable("user_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  _user: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  _user: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type UserPhoto = InferSelectModel<typeof userPhotos>;
export type NewUserPhoto = InferInsertModel<typeof userPhotos>;

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
