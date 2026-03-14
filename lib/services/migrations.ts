import { access, readdir } from "node:fs/promises";
import path from "node:path";

export type MigrationStatus = {
  databaseUrlConfigured: boolean;
  envLocalPresent: boolean;
  ready: boolean;
  latestMigration: string | null;
  migrationCount: number;
  migrations: string[];
  requiredEnv: {
    nextPublicSupabaseUrl: boolean;
    nextPublicSupabaseAnonKey: boolean;
    supabaseServiceRoleKey: boolean;
    defaultTenantId: boolean;
    databaseUrl: boolean;
  };
};

export async function getMigrationStatus(): Promise<MigrationStatus> {
  const migrationDirectory = path.join(process.cwd(), "supabase", "migrations");
  const envLocalPath = path.join(process.cwd(), ".env.local");
  const migrationFiles = (await readdir(migrationDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();

  const requiredEnv = {
    nextPublicSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    nextPublicSupabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    defaultTenantId: Boolean(process.env.DEFAULT_TENANT_ID),
    databaseUrl: Boolean(process.env.DATABASE_URL)
  };

  const envLocalPresent = await access(envLocalPath)
    .then(() => true)
    .catch(() => false);

  return {
    databaseUrlConfigured: requiredEnv.databaseUrl,
    envLocalPresent,
    ready: Object.values(requiredEnv).every(Boolean) && envLocalPresent,
    latestMigration: migrationFiles.at(-1) ?? null,
    migrationCount: migrationFiles.length,
    migrations: migrationFiles,
    requiredEnv
  };
}
