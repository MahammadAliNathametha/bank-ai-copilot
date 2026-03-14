import { createNotification, deleteNotification, getNotificationById, listNotifications, updateNotification } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { notificationCreateSchema, notificationUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getNotificationById(tenantId, Number(id)) : await listNotifications(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, notificationCreateSchema);
    const notification = await createNotification(tenantId, {
      ...input,
      status: input.status ?? "active",
      createdAt: new Date().toISOString()
    });
    return { data: notification, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, notificationUpdateSchema);
    const notification = await updateNotification(tenantId, id, input);
    return { data: notification };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const notification = await deleteNotification(tenantId, id);
    return { data: notification };
  });
}
