import { createOpenConnection, deleteOpenConnection, getOpenConnectionById, listOpenConnections, updateOpenConnection } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { openConnectionCreateSchema, openConnectionUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getOpenConnectionById(tenantId, Number(id)) : await listOpenConnections(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, openConnectionCreateSchema);
    const connection = await createOpenConnection(tenantId, {
      ...input,
      status: input.status ?? "connected",
      createdAt: new Date().toISOString()
    });
    return { data: connection, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, openConnectionUpdateSchema);
    const connection = await updateOpenConnection(tenantId, id, input);
    return { data: connection };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const connection = await deleteOpenConnection(tenantId, id);
    return { data: connection };
  });
}
