import "dotenv/config";

import { sql } from "drizzle-orm";

import { database, pg } from "./";

async function main() {
  const tablesSchema = database._.schema;
  if (!tablesSchema) throw new Error("Schema not loaded");

  await database.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`));

  await database.execute(sql.raw(`DROP SCHEMA public CASCADE;`));
  await database.execute(sql.raw(`CREATE SCHEMA public;`));
  await database.execute(sql.raw(`GRANT ALL ON SCHEMA public TO postgres;`));
  await database.execute(sql.raw(`GRANT ALL ON SCHEMA public TO public;`));
  await database.execute(
    sql.raw(`COMMENT ON SCHEMA public IS 'standard public schema';`),
  );

  await pg.end();
}

main();
