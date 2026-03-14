import { createAccountMember, listAccountMembers } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { accountMemberCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const accountId = searchParams.get("accountId");
    const data = accountId ? await listAccountMembers(tenantId, Number(accountId)) : await listAccountMembers(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, accountMemberCreateSchema);
    const member = await createAccountMember(tenantId, {
      ...input,
      role: input.role ?? "viewer"
    });
    return { data: member, status: 201 };
  });
}
