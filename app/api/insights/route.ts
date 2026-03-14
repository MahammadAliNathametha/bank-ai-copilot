import { createInsight, deleteInsight, getInsightById, summarizeInsights, updateInsight } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { insightCreateSchema, insightUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");

    if (id) {
      return { data: await getInsightById(tenantId, Number(id)) };
    }

    return { data: await summarizeInsights(tenantId) };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, insightCreateSchema);
    const insight = await createInsight(tenantId, {
      ...input,
      createdAt: new Date().toISOString()
    });
    return { data: insight, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, insightUpdateSchema);
    const insight = await updateInsight(tenantId, id, input);
    return { data: insight };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const insight = await deleteInsight(tenantId, id);
    return { data: insight };
  });
}
