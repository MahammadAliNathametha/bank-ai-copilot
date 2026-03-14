import { createBill, deleteBill, getBillById, listBills, updateBill } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { billCreateSchema, billUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getBillById(tenantId, Number(id)) : await listBills(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, billCreateSchema);
    const bill = await createBill(tenantId, {
      ...input,
      status: input.status ?? "scheduled",
      createdAt: new Date().toISOString()
    });
    return { data: bill, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, billUpdateSchema);
    const bill = await updateBill(tenantId, id, input);
    return { data: bill };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const bill = await deleteBill(tenantId, id);
    return { data: bill };
  });
}
