import { createUser, deleteUser, getUserById, listUsers, updateUser } from "@/lib/data/banking-data";
import { getRequiredStringId, parseJson, withTenantRoute } from "@/lib/services/api";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getUserById(tenantId, id) : await listUsers(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, userCreateSchema);
    const user = await createUser(tenantId, {
      id: crypto.randomUUID(),
      email: input.email,
      fullName: input.fullName,
      role: input.role ?? "member"
    });

    return { data: user, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredStringId(searchParams);
    const input = await parseJson(request, userUpdateSchema);
    const user = await updateUser(tenantId, id, input);
    return { data: user };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredStringId(searchParams);
    const user = await deleteUser(tenantId, id);
    return { data: user };
  });
}
