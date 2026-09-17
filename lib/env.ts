import { logger } from "./logger";

export function assertProdSecrets() {
  if (process.env.NODE_ENV !== "production") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const secret = process.env.SESSION_SECRET ?? "";
  if (secret.length < 32 || secret.includes("change-me") || secret.includes("replace-with")) {
    throw new Error("SESSION_SECRET must be a unique 32+ character value in production");
  }
  if ((process.env.ADMIN_PIN ?? "") === "123456") {
    logger.warn("ADMIN_PIN is the default value; set a strong PIN in production");
  }
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
    throw new Error("Production requires PostgreSQL DATABASE_URL");
  }
}
