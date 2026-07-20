import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./context";
import path from "path";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { seedAdminUser, seedProducts } from "./seed";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(import.meta.dirname, "../../dist/public")));

// tRPC middleware
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Seed default data on startup
async function runSeed() {
  await seedAdminUser();
  await seedProducts();
}
runSeed();

// All other requests return the SPA's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "../../dist/public/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
