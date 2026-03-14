import { createAdminMetric, deleteAdminMetric, getAdminMetricById, listAdminMetrics, updateAdminMetric } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { adminMetricCreateSchema, adminMetricUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getAdminMetricById(tenantId, Number(id)) : await listAdminMetrics(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, adminMetricCreateSchema);
    const metric = await createAdminMetric(tenantId, {
      ...input,
      createdAt: new Date().toISOString()
    });
    return { data: metric, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, adminMetricUpdateSchema);
    const metric = await updateAdminMetric(tenantId, id, input);
    return { data: metric };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const metric = await deleteAdminMetric(tenantId, id);
    return { data: metric };
  });
}
