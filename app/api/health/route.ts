import { getMigrationStatus } from "@/lib/services/migrations";

export async function GET() {
  const status = await getMigrationStatus();

  return Response.json({
    status: status.ready ? "ok" : "degraded",
    ready: status.ready,
    requiredEnv: status.requiredEnv,
    latestMigration: status.latestMigration,
    migrationCount: status.migrationCount
  });
}
