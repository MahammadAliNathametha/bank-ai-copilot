import { createWalletCard, listWalletActivity, listWalletCards, listWalletLoyalty } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { walletCardCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const userId = searchParams.get("userId") ?? undefined;
    const [cards, activity, loyalty] = await Promise.all([
      listWalletCards(tenantId, userId),
      listWalletActivity(tenantId, userId),
      listWalletLoyalty(tenantId, userId)
    ]);
    return { data: { cards, activity, loyalty } };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, walletCardCreateSchema);
    const card = await createWalletCard(tenantId, {
      ...input,
      status: input.status ?? "active"
    });
    return { data: card, status: 201 };
  });
}
