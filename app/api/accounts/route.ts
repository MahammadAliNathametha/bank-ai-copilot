import { createAccount, deleteAccount, findPrimaryUserId, getAccountById, listAccounts, updateAccount } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { accountCreateSchema, accountUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getAccountById(tenantId, Number(id)) : await listAccounts(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, accountCreateSchema);
    const account = await createAccount(tenantId, {
      userId: input.userId ?? (await findPrimaryUserId(tenantId)),
      name: input.name,
      type: input.type,
      balance: input.balance ?? 0,
      currency: "USD",
    });

    return { data: account, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, accountUpdateSchema);
    const account = await updateAccount(tenantId, id, input);
    return { data: account };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const account = await deleteAccount(tenantId, id);
    return { data: account };
  });
}
