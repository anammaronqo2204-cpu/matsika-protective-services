import { defineConfig } from "drizzle-kit";
import { getConnectionString } from "@netlify/database";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? getConnectionString(),
  },
});
