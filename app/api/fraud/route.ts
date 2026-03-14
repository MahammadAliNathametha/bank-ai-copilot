import { listFraudEvents, updateFraudEvent } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { fraudUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    return { data: await listFraudEvents(tenantId) };
  });
}

export async function PATCH(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, fraudUpdateSchema);
    const event = await updateFraudEvent(tenantId, id, input);
    return { data: event };
  });
}
