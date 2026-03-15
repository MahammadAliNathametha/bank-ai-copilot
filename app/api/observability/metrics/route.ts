import { withTenantRoute, parseJson } from "@/lib/services/api";
import { performanceMetricSchema } from "@/lib/validations/observability";
import { logAuditEvent } from "@/lib/services/audit";

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const payload = await parseJson(request, performanceMetricSchema);

    await logAuditEvent({
      tenantId,
      action: `performance:${payload.category ?? "navigation"}`,
      details: {
        path: payload.path,
        duration: payload.duration,
        tags: payload.tags,
        recordedAt: new Date().toISOString()
      }
    });

    return { data: { recorded: true } };
  });
}
