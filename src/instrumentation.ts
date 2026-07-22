export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateProductionConfiguration } = await import(
      "@/lib/server/production-config"
    );
    validateProductionConfiguration();
  }
}

