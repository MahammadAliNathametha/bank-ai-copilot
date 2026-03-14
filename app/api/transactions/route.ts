import { createTransaction, deleteTransaction, getTransactionById, listTransactions, updateTransaction } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { transactionCreateSchema, transactionFilterSchema, transactionUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");

    if (id) {
      return { data: await getTransactionById(tenantId, Number(id)) };
    }

    const filters = transactionFilterSchema.parse({
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined
    });

    const records = (await listTransactions(tenantId)).filter((transaction) => {
      if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      if (filters.startDate && transaction.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && transaction.date > filters.endDate) {
        return false;
      }
      return true;
    });

    return { data: records };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, transactionCreateSchema);
    const transaction = await createTransaction(tenantId, {
      ...input,
      status: input.status ?? "posted",
      date: new Date().toISOString()
    });

    return { data: transaction, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, transactionUpdateSchema);
    const transaction = await updateTransaction(tenantId, id, input);
    return { data: transaction };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const transaction = await deleteTransaction(tenantId, id);
    return { data: transaction };
  });
}
