const isProd = process.env.NODE_ENV === "production";

export const logger = {
  info: (obj: unknown, msg?: string) => {
    if (typeof obj === "string") {
      console.log(`[INFO] ${obj}`);
    } else {
      console.log(`[INFO] ${msg || ""}`, obj);
    }
  },
  warn: (obj: unknown, msg?: string) => {
    if (typeof obj === "string") {
      console.warn(`[WARN] ${obj}`);
    } else {
      console.warn(`[WARN] ${msg || ""}`, obj);
    }
  },
  error: (obj: unknown, msg?: string) => {
    if (typeof obj === "string") {
      console.error(`[ERROR] ${obj}`);
    } else {
      console.error(`[ERROR] ${msg || ""}`, obj);
    }
  },
  debug: (obj: unknown, msg?: string) => {
    if (!isProd) {
      if (typeof obj === "string") {
        console.debug(`[DEBUG] ${obj}`);
      } else {
        console.debug(`[DEBUG] ${msg || ""}`, obj);
      }
    }
  },
};

export function logError(err: unknown, extra?: Record<string, unknown>) {
  const message = err instanceof Error ? err.message : String(err);
  logger.error({ err, ...extra }, message);
}
