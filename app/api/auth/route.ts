import {
  createAuthSession,
  createUser,
  findPrimaryUserId,
  getAuthSession,
  signOutSession,
} from "@/lib/data/banking-data";
import { getRequiredStringId, parseJson, withTenantRoute } from "@/lib/services/api";
import { authActionSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const sessionId = searchParams.get("sessionId");
    const session = await getAuthSession(tenantId, sessionId ?? undefined);

    return { data: session };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, authActionSchema);
    let userId: string | undefined;

    if (input.action === "signup") {
      const user = await createUser(tenantId, {
        id: crypto.randomUUID(),
        email: input.email,
        fullName: input.fullName ?? "New Member"
      });
      userId = user.id;
    }

    userId ??= await findPrimaryUserId(tenantId);
    const session = await createAuthSession(tenantId, input.email, userId);

    return {
      data: {
        action: input.action,
        session
      },
      status: 201
    };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const sessionId = getRequiredStringId(searchParams, "sessionId");
    const session = await signOutSession(tenantId, sessionId);

    return {
      data: session
    };
  });
}
