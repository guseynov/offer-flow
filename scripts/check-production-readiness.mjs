import process from "node:process";
import postgres from "postgres";

const required = ["DATABASE_URL"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  connect_timeout: 10,
  prepare: false,
});

try {
  const rows = await sql`
    SELECT
      to_regclass('public.deals') IS NOT NULL AS has_deals,
      to_regclass('public.deal_audit_events') IS NOT NULL AS has_audit,
      COALESCE((SELECT MAX(version) FROM schema_migrations), 0) AS version
  `;
  const readiness = rows[0];

  if (!readiness?.has_deals || !readiness.has_audit || Number(readiness.version) < 2) {
    throw new Error("Database migrations are incomplete; run npm run db:migrate.");
  }

  console.log("Production configuration and database readiness checks passed.");
} finally {
  await sql.end();
}
