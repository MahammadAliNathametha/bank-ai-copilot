import { createWebhookEvent, deleteWebhookEvent, getWebhookEventById, listWebhookEvents, updateWebhookEvent } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { webhookCreateSchema, webhookUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getWebhookEventById(tenantId, Number(id)) : await listWebhookEvents(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, webhookCreateSchema);
    const event = await createWebhookEvent(tenantId, {
      ...input,
      status: input.status ?? "received",
      createdAt: new Date().toISOString()
    });
    return { data: event, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, webhookUpdateSchema);
    const event = await updateWebhookEvent(tenantId, id, input);
    return { data: event };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const event = await deleteWebhookEvent(tenantId, id);
    return { data: event };
  });
}
