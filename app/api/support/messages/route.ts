import { createSupportMessage, listSupportMessages } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { supportMessageCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const ticketId = searchParams.get("ticketId");
    const data = ticketId ? await listSupportMessages(tenantId, Number(ticketId)) : await listSupportMessages(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, supportMessageCreateSchema);
    const message = await createSupportMessage(tenantId, input);
    return { data: message, status: 201 };
  });
}
