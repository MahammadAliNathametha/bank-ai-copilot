import { listBeneficiaries, createBeneficiary, deleteBeneficiary, listUsers } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { z } from "zod";

const beneficiarySchema = z.object({
  name: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string(),
  type: z.enum(["individual", "business"])
});

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const data = await listBeneficiaries(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, beneficiarySchema);
    const users = await listUsers(tenantId);
    const userId = users[0]?.id;

    const beneficiary = await createBeneficiary(tenantId, {
      ...input,
      userId,
      createdAt: new Date().toISOString()
    });

    return { data: beneficiary, status: 201 };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = parseInt(searchParams.get("id") || "0");
    const result = await deleteBeneficiary(tenantId, id);
    return { data: result };
  });
}
