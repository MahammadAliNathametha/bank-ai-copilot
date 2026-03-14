import { headers } from "next/headers";

import { demoTenants, type TenantTheme } from "@/lib/data/demo";

export type ResolvedTenant = TenantTheme;

export async function resolveTenant() {
  const headerStore = await headers();
  return resolveTenantFromHeaders(headerStore);
}

export async function resolveTenantFromHeaders(headerStore: Headers) {
  const requestedTenantId = headerStore.get("x-tenant-id");
  const requestedSlug = headerStore.get("x-tenant-slug");
  const host = headerStore.get("host") ?? "";
  const hostSlug = host.split(".")[0];

  return (
    demoTenants.find((tenant) => tenant.id === requestedTenantId) ??
    demoTenants.find((tenant) => tenant.slug === requestedSlug) ??
    demoTenants.find((tenant) => tenant.slug === hostSlug) ??
    demoTenants[0]
  );
}
