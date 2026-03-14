import { createSupportTicket, deleteSupportTicket, getSupportTicketById, listSupportTickets, updateSupportTicket } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { supportTicketCreateSchema, supportTicketUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getSupportTicketById(tenantId, Number(id)) : await listSupportTickets(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, supportTicketCreateSchema);
    const ticket = await createSupportTicket(tenantId, {
      ...input,
      status: input.status ?? "open",
      createdAt: new Date().toISOString()
    });
    return { data: ticket, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, supportTicketUpdateSchema);
    const ticket = await updateSupportTicket(tenantId, id, input);
    return { data: ticket };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const ticket = await deleteSupportTicket(tenantId, id);
    return { data: ticket };
  });
}
