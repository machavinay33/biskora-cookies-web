import { pgTable, serial, text, timestamp, varchar, boolean, pgEnum, integer } from "drizzle-orm/pg-core";

    // Enums must be defined separately before use in table columns (Drizzle ORM requirement)
    export const roleEnum = pgEnum("role", ["user", "admin"]);
    export const statusEnum = pgEnum("status", ["new", "read", "responded"]);
    export const adminRoleEnum = pgEnum("admin_role", ["admin", "superadmin"]);

    /**
    * Core user table backing auth flow.
    */
    export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: roleEnum("role").default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
    });

    export type User = typeof users.$inferSelect;
    export type InsertUser = typeof users.$inferInsert;

    /**
    * Contact inquiries table for storing contact form submissions
    */
    export const contactInquiries = pgTable("contact_inquiries", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    message: text("message").notNull(),
    orderType: varchar("orderType", { length: 100 }).notNull(),
    status: statusEnum("status").default("new").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    });

    export type ContactInquiry = typeof contactInquiries.$inferSelect;
    export type InsertContactInquiry = typeof contactInquiries.$inferInsert;

    /**
    * Admin Users table for managing website administrators
    */
    export const adminUsers = pgTable("admin_users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    passwordHash: text("passwordHash").notNull(),
    name: varchar("name", { length: 255 }),
    role: adminRoleEnum("admin_role").default("admin").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    });

    export type AdminUser = typeof adminUsers.$inferSelect;
    export type InsertAdminUser = typeof adminUsers.$inferInsert;

    /**
    * Products table for managing Biskora Cookies products
    */
    export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }),
    price: integer("price").notNull(), // price in cents
    highlights: text("highlights").array(),
    inStock: boolean("inStock").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    });

    export type Product = typeof products.$inferSelect;
    export type InsertProduct = typeof products.$inferInsert;
    