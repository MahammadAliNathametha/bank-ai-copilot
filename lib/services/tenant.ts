import { headers } from "next/headers";

import { resolveTenantFromHeaders as resolveTenantFromHeadersBase, type ResolvedTenant } from "@/lib/tenantResolver";

export type { ResolvedTenant };

export async function resolveTenant(): Promise<ResolvedTenant | null> {
  const headerStore = await headers();
  const resolution = resolveTenantFromHeadersBase(headerStore);
  return resolution.tenant;
}

export async function resolveTenantFromHeadersLegacy(headerStore: Headers): Promise<ResolvedTenant | null> {
  const resolution = resolveTenantFromHeadersBase(headerStore);
  return resolution.tenant;
}

export async function resolveTenantFromHeaders(headerStore: Headers): Promise<ResolvedTenant | null> {
  const resolution = resolveTenantFromHeadersBase(headerStore);
  return resolution.tenant;
}
