import { withTenantRoute, parseJson } from "@/lib/services/api";
import { clientErrorSchema } from "@/lib/validations/observability";
import { logAuditEvent } from "@/lib/services/audit";

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const payload = await parseJson(request, clientErrorSchema);

    await logAuditEvent({
      tenantId,
      action: "client-error",
      details: {
        message: payload.message,
        stack: payload.stack,
        source: payload.source ?? "unknown",
        digest: payload.digest,
        path: payload.path,
        userAgent: payload.userAgent
      }
    });

    return { data: { recorded: true } };
  });
}
