import { getTenantStore, createRecord, deleteRecord } from "@/lib/data/mock-bank-store";
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
    const store = getTenantStore(tenantId);
    return { data: store.beneficiaries };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, beneficiarySchema);
    const userId = getTenantStore(tenantId).users[0]?.id; // Default to first user

    const beneficiary = createRecord(tenantId, "beneficiaries", {
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
    const result = deleteRecord(tenantId, "beneficiaries", id);
    return { data: result };
  });
}
