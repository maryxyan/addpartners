import app from "./app";
import { logger } from "./lib/logger";
import { migrateDatabase } from "./lib/migrate";

if (process.env.NODE_ENV === "production") {
  for (const name of ["DATABASE_URL", "FRONTEND_ORIGIN", "ADMIN_PASSWORD", "SESSION_SECRET"] as const) {
    if (!process.env[name]) throw new Error(`${name} environment variable is required in production`);
  }
  if ((process.env.SESSION_SECRET?.length ?? 0) < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters");
  }
}

const rawPort = process.env["API_PORT"] ?? process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

await migrateDatabase();
logger.info("Database schema is ready");

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
