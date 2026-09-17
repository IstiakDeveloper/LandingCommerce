import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env");
const schemaPath = path.join(rootDir, "prisma", "schema.prisma");
const sqliteSchemaPath = path.join(rootDir, "prisma", "schema.sqlite.prisma");
const postgresSchemaPath = path.join(rootDir, "prisma", "schema.postgres.prisma");

const prismaBin = `node "${path.join(rootDir, "node_modules", "prisma", "build", "index.js")}"`;
const tsxBin = `node "${path.join(rootDir, "node_modules", "tsx", "dist", "cli.mjs")}"`;

const args = process.argv.slice(2);
const target = (args[0] || "").toLowerCase();
const isFresh = args.includes("--fresh") || target === "fresh";

function run(command) {
  console.log(`\x1b[36m> ${command}\x1b[0m`);
  execSync(command, { stdio: "inherit", cwd: rootDir });
}

function getCurrentProvider() {
  if (!fs.existsSync(schemaPath)) return "unknown";
  const content = fs.readFileSync(schemaPath, "utf-8");
  if (content.includes('provider = "sqlite"')) return "sqlite";
  if (content.includes('provider  = "postgresql"') || content.includes('provider = "postgresql"')) return "postgres";
  return "unknown";
}

function updateEnvForSqlite() {
  let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";
  
  if (/DATABASE_URL=.*/.test(env)) {
    env = env.replace(/DATABASE_URL=.*/g, 'DATABASE_URL="file:./dev.db"');
  } else {
    env += '\nDATABASE_URL="file:./dev.db"';
  }

  if (/DIRECT_URL=.*/.test(env)) {
    env = env.replace(/DIRECT_URL=.*/g, '# DIRECT_URL=""');
  }

  fs.writeFileSync(envPath, env.trim() + "\n", "utf-8");
  console.log("✔ Updated .env -> DATABASE_URL=\"file:./dev.db\"");
}

function updateEnvForPostgres() {
  let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";
  const pgUrl = "postgresql://dokandari:dokandari@localhost:5432/dokandari?schema=public";

  if (/DATABASE_URL=.*/.test(env)) {
    env = env.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${pgUrl}"`);
  } else {
    env += `\nDATABASE_URL="${pgUrl}"`;
  }

  if (/#?\s*DIRECT_URL=.*/.test(env)) {
    env = env.replace(/#?\s*DIRECT_URL=.*/g, `DIRECT_URL="${pgUrl}"`);
  } else {
    env += `\nDIRECT_URL="${pgUrl}"`;
  }

  fs.writeFileSync(envPath, env.trim() + "\n", "utf-8");
  console.log(`✔ Updated .env -> DATABASE_URL="${pgUrl}"`);
}

function safeGenerate() {
  try {
    run(`${prismaBin} generate`);
  } catch (err) {
    console.warn("\x1b[33m⚠️ Dev server may be locking generated/prisma files. Restart 'npm run dev' to complete client generation.\x1b[0m");
  }
}

function executeFresh(provider) {
  console.log(`\n\x1b[33m=== Fresh Database Reset & Seed (${provider.toUpperCase()}) ===\x1b[0m\n`);
  
  if (provider === "postgres") {
    try {
      console.log("Checking Docker Postgres container...");
      execSync("docker compose up -d postgres", { stdio: "inherit", cwd: rootDir });
    } catch {
      console.warn("⚠️ Could not start docker postgres automatically. Make sure Docker is running.");
    }
  }

  // Force reset schema without locking issues
  run(`${prismaBin} db push --force-reset --skip-generate`);
  
  // Seed initial data (Owner account, platform settings)
  run(`${tsxBin} prisma/seed.ts`);

  console.log(`\n\x1b[32m✔ ${provider.toUpperCase()} database freshly reset and seeded successfully!\x1b[0m\n`);
}

async function main() {
  if (target === "status") {
    const current = getCurrentProvider();
    console.log(`\nActive Database: \x1b[32m${current.toUpperCase()}\x1b[0m\n`);
    return;
  }

  if (target === "sqlite") {
    console.log("\x1b[34m[Switching to SQLite]\x1b[0m");
    fs.copyFileSync(sqliteSchemaPath, schemaPath);
    console.log("✔ Copied prisma/schema.sqlite.prisma -> prisma/schema.prisma");
    updateEnvForSqlite();
    safeGenerate();

    if (isFresh) {
      executeFresh("sqlite");
    } else {
      console.log("\n\x1b[32m✔ Switched to SQLite mode!\x1b[0m");
      console.log("Tip: Run 'npm run db:fresh' to reset database and seed if starting fresh.\n");
    }
    return;
  }

  if (target === "postgres" || target === "docker") {
    console.log("\x1b[34m[Switching to Docker (PostgreSQL)]\x1b[0m");
    fs.copyFileSync(postgresSchemaPath, schemaPath);
    console.log("✔ Copied prisma/schema.postgres.prisma -> prisma/schema.prisma");
    updateEnvForPostgres();
    safeGenerate();

    if (isFresh) {
      executeFresh("postgres");
    } else {
      console.log("\n\x1b[32m✔ Switched to PostgreSQL (Docker) mode!\x1b[0m");
      console.log("Tip: Ensure Docker is up ('npm run db:up') and run 'npm run db:fresh' if needed.\n");
    }
    return;
  }

  if (target === "fresh") {
    const current = getCurrentProvider();
    if (current === "unknown") {
      console.error("Unknown provider in schema.prisma. Run 'npm run db:use:sqlite' or 'npm run db:use:postgres' first.");
      process.exit(1);
    }
    executeFresh(current);
    return;
  }

  console.log(`
Usage:
  node scripts/switch-db.mjs sqlite [--fresh]
  node scripts/switch-db.mjs postgres [--fresh]
  node scripts/switch-db.mjs fresh
  node scripts/switch-db.mjs status
  `);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
