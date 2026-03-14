import { createMarketingCampaign, listMarketingCampaigns, updateMarketingCampaign } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { marketingCampaignCreateSchema, marketingCampaignUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    return { data: await listMarketingCampaigns(tenantId) };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, marketingCampaignCreateSchema);
    const campaign = await createMarketingCampaign(tenantId, {
      ...input,
      status: input.status ?? "scheduled"
    });
    return { data: campaign, status: 201 };
  });
}

export async function PATCH(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, marketingCampaignUpdateSchema);
    const campaign = await updateMarketingCampaign(tenantId, id, input);
    return { data: campaign };
  });
}
