import { deleteTransfer, getTransferById, listTransfers, runTransfer, updateTransfer } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { transferSchema, transferUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getTransferById(tenantId, Number(id)) : await listTransfers(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, transferSchema);
    const transfer = await runTransfer(tenantId, input);
    return { data: transfer, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, transferUpdateSchema);
    const transfer = await updateTransfer(tenantId, id, input);
    return { data: transfer };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const transfer = await deleteTransfer(tenantId, id);
    return { data: transfer };
  });
}
