import { headers } from "next/headers";

import { resolveTenantFromHeaders } from "@/lib/services/tenant";

export async function GET() {
  const headerStore = await headers();
  const tenant = await resolveTenantFromHeaders(headerStore);
  return Response.json(tenant);
}
