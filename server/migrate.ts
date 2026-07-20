import { Pool } from "pg";

    /**
    * Runs idempotent CREATE TABLE / CREATE TYPE IF NOT EXISTS statements
    * directly via pg so no drizzle-kit binary is needed at runtime.
    */
    export async function runMigrations() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("[Migrate] DATABASE_URL not set — skipping migrations.");
      return;
    }

    const pool = new Pool({ connectionString });
    const client = await pool.connect();
    try {
      console.log("[Migrate] Running migrations...");

      await client.query(`
        DO $$ BEGIN
          CREATE TYPE role_enum AS ENUM ('user', 'admin');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      `);
      await client.query(`
        DO $$ BEGIN
          CREATE TYPE status_enum AS ENUM ('new', 'read', 'responded');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      `);
      await client.query(`
        DO $$ BEGIN
          CREATE TYPE admin_role_enum AS ENUM ('admin', 'superadmin');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT,
          email VARCHAR(320),
          "loginMethod" VARCHAR(64),
          role role_enum NOT NULL DEFAULT 'user',
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS contact_inquiries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(320) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          message TEXT NOT NULL,
          "orderType" VARCHAR(100) NOT NULL,
          status status_enum NOT NULL DEFAULT 'new',
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(320) NOT NULL UNIQUE,
          "passwordHash" TEXT NOT NULL,
          name VARCHAR(255),
          role admin_role_enum NOT NULL DEFAULT 'admin',
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          price INTEGER NOT NULL,
          highlights TEXT[],
          "inStock" BOOLEAN NOT NULL DEFAULT TRUE,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      console.log("[Migrate] All tables ready.");
    } catch (err) {
      console.error("[Migrate] Migration error:", err);
      throw err;
    } finally {
      client.release();
      await pool.end();
    }
    }
    