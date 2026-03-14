import { createLoan, deleteLoan, getLoanById, listLoans, payLoan, updateLoan } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { loanCreateSchema, loanPaymentSchema, loanUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getLoanById(tenantId, Number(id)) : await listLoans(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const action = searchParams.get("action");

    if (action === "pay") {
      const input = await parseJson(request, loanPaymentSchema);
      const loan = await payLoan(tenantId, input.id, input.amount);
      return { data: loan };
    }

    const input = await parseJson(request, loanCreateSchema);
    const loan = await createLoan(tenantId, {
      ...input,
      createdAt: new Date().toISOString()
    });
    return { data: loan, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, loanUpdateSchema);
    const loan = await updateLoan(tenantId, id, input);
    return { data: loan };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const loan = await deleteLoan(tenantId, id);
    return { data: loan };
  });
}
