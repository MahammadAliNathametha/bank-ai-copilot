import { createCreditScore, listCreditScores } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { creditScoreCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const userId = searchParams.get("userId") ?? undefined;
    return { data: await listCreditScores(tenantId, userId) };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, creditScoreCreateSchema);
    const score = await createCreditScore(tenantId, {
      ...input,
      status: input.status ?? "current"
    });
    return { data: score, status: 201 };
  });
}
