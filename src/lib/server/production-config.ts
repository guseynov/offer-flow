const REQUIRED_MIGRATION_VERSION = 2;

export function validateProductionConfiguration() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const missing = ["DATABASE_URL"].filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(", ")}`,
    );
  }
}

export { REQUIRED_MIGRATION_VERSION };
