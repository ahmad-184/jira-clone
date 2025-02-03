import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = env.SUPABASE_DATABASE_URL.replace(
  "[YOUR-PASSWORD]",
  env.SUPABASE_DATABASE_PASSWORD,
);

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
  tablesFilter: ["gf_*"],
});
