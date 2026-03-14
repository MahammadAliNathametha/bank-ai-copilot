import { createInvestmentAccount, listInvestmentAccounts } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { investmentAccountCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    return { data: await listInvestmentAccounts(tenantId) };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, investmentAccountCreateSchema);
    const account = await createInvestmentAccount(tenantId, {
      ...input,
      status: input.status ?? "active",
      type: input.type ?? "brokerage"
    });
    return { data: account, status: 201 };
  });
}
