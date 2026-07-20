import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
const sqlFile = process.argv[2];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run database scripts.");
}

if (!sqlFile) {
  throw new Error("Pass a SQL file path to run.");
}

const absoluteSqlFile = path.resolve(process.cwd(), sqlFile);
const statement = await readFile(absoluteSqlFile, "utf8");
const sql = postgres(databaseUrl, { max: 1, prepare: false });

try {
  await sql.unsafe(statement);
  console.log(`Applied ${path.relative(process.cwd(), absoluteSqlFile)}`);
} finally {
  await sql.end();
}

