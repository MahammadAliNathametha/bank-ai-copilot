import { createSavingsRule, listSavingsRules } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { savingsRuleCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const userId = searchParams.get("userId") ?? undefined;
    return { data: await listSavingsRules(tenantId, userId) };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, savingsRuleCreateSchema);
    const rule = await createSavingsRule(tenantId, {
      ...input,
      status: input.status ?? "active"
    });
    return { data: rule, status: 201 };
  });
}
