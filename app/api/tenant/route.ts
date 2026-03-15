import { headers } from "next/headers";

import { resolveTenantFromHeaders } from "@/lib/services/tenant";

export async function GET() {
  const headerStore = await headers();
  const tenant = await resolveTenantFromHeaders(headerStore);
  return Response.json(tenant);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const newTenant = {
    id: crypto.randomUUID(),
    name: body.name || "New Tenant Bank",
    slug: body.slug || "new-tenant",
    primaryHsl: body.primaryHsl || "36.3 100% 50.4%",
    logoUrl: body.logoUrl || "",
    pricingTier: body.pricingTier || "starter"
  };
  return Response.json({ success: true, data: newTenant }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({}));
  const headerStore = await headers();
  const tenant = await resolveTenantFromHeaders(headerStore);
  
  const updatedTenant = {
    ...tenant,
    ...body
  };
  
  return Response.json({ success: true, data: updatedTenant });
}
