import { withTenantRoute } from "@/lib/services/api";
import { getMigrationStatus } from "@/lib/services/migrations";

export async function GET(request: Request) {
  return withTenantRoute(request, async () => {
    const status = await getMigrationStatus();

    return {
      data: {
        action: "status",
        ...status
      }
    };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async () => {
    const status = await getMigrationStatus();

    return {
      data: {
        action: "refresh",
        message: status.ready
          ? "Migration prerequisites are configured; apply the SQL files through the approved database workflow."
          : "Migration prerequisites are incomplete; configure the missing environment values before applying SQL files.",
        ...status
      }
    };
  });
}
