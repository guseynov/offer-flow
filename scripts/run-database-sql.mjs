import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
const sqlFiles = process.argv.slice(2);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run database scripts.");
}

if (sqlFiles.length === 0) {
  throw new Error("Pass one or more SQL file paths to run.");
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });

try {
  for (const sqlFile of sqlFiles) {
    const absoluteSqlFile = path.resolve(process.cwd(), sqlFile);
    const statement = await readFile(absoluteSqlFile, "utf8");
    await sql.unsafe(statement);
    console.log(`Applied ${path.relative(process.cwd(), absoluteSqlFile)}`);
  }
} finally {
  await sql.end();
}
