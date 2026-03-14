import { createCryptoTrade, listCryptoAssets, listCryptoHoldings, listCryptoTrades } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { cryptoTradeCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const userId = searchParams.get("userId") ?? undefined;
    const [assets, holdings, trades] = await Promise.all([
      listCryptoAssets(tenantId),
      listCryptoHoldings(tenantId, userId),
      listCryptoTrades(tenantId, userId)
    ]);

    return { data: { assets, holdings, trades } };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, cryptoTradeCreateSchema);
    const trade = await createCryptoTrade(tenantId, {
      ...input,
      status: input.status ?? "completed"
    });
    return { data: trade, status: 201 };
  });
}
