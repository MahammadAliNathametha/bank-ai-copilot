import { createPayment, deletePayment, getPaymentById, listPayments, updatePayment } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { paymentCreateSchema, paymentUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getPaymentById(tenantId, Number(id)) : await listPayments(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, paymentCreateSchema);
    const payment = await createPayment(tenantId, {
      ...input,
      status: "processing",
      createdAt: new Date().toISOString()
    });
    return { data: payment, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, paymentUpdateSchema);
    const payment = await updatePayment(tenantId, id, input);
    return { data: payment };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const payment = await deletePayment(tenantId, id);
    return { data: payment };
  });
}
