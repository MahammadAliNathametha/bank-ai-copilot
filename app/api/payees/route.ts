import { createPayee, listPayees, listUsers } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { z } from "zod";

const payeeSchema = z.object({
  name: z.string().min(2),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional()
});

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const data = await listPayees(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, payeeSchema);
    const users = await listUsers(tenantId);
    
    const payee = await createPayee(tenantId, {
      ...input,
      userId: users[0]?.id
    });

    return { data: payee, status: 201 };
  });
}
