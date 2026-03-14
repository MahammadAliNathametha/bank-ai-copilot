import { createCard, deleteCard, getCardById, listCards, updateCard } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { cardCreateSchema, cardUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getCardById(tenantId, Number(id)) : await listCards(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, cardCreateSchema);
    const card = await createCard(tenantId, {
      ...input,
      status: input.status ?? "inactive",
      alertsEnabled: input.alertsEnabled ?? true,
      createdAt: new Date().toISOString()
    });
    return { data: card, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, cardUpdateSchema);
    const card = await updateCard(tenantId, id, input);
    return { data: card };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const card = await deleteCard(tenantId, id);
    return { data: card };
  });
}
