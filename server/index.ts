import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./context";
import path from "path";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { seedAdminUser, seedProducts } from "./seed";
import { runMigrations } from "./migrate";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

// Serve static files
app.use(express.static(path.resolve(process.cwd(), "dist/public")));

// tRPC middleware
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Seed database on startup
seedAdminUser();
seedProducts();

// All other requests return the SPA's index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(process.cwd(), "dist/public/index.html"));
});

if (!process.argv.includes("--build")) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
