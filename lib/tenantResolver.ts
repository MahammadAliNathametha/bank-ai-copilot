import { type NextRequest } from "next/server";

import { demoTenants, type TenantTheme } from "@/lib/data/demo";

export type ResolvedTenant = TenantTheme;

type TenantResolution = {
  tenant: ResolvedTenant | null;
  subdomainTenant: ResolvedTenant | null;
  sessionTenant: ResolvedTenant | null;
  hasConflict: boolean;
};

const defaultTenantId = process.env.DEFAULT_TENANT_ID;

function findTenantByIdOrSlug(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  return (
    demoTenants.find((tenant) => tenant.id === value) ??
    demoTenants.find((tenant) => tenant.slug === value) ??
    null
  );
}

function extractSubdomain(host: string | null) {
  if (!host) {
    return null;
  }
  const hostName = host.split(":")[0] ?? "";
  if (!hostName || hostName === "localhost" || hostName === "127.0.0.1") {
    return null;
  }
  const parts = hostName.split(".");
  // Allow subdomains on localhost (e.g., quantum.localhost) or standard 3-part domains
  if (parts.length >= 2) {
    if (parts.length === 2 && parts[1] !== "localhost") {
      return null; // Standard domains like example.com have no subdomain in this simplified logic
    }
    return parts[0];
  }
  return null;
}

function resolveDefaultTenant() {
  return findTenantByIdOrSlug(defaultTenantId) ?? demoTenants[0] ?? null;
}

export function resolveTenantFromHeaders(headerStore: Headers): TenantResolution {
  const host = headerStore.get("host");
  const subdomain = extractSubdomain(host);
  const subdomainTenant = findTenantByIdOrSlug(subdomain);
  const sessionTenant = findTenantByIdOrSlug(headerStore.get("x-tenant-id"));
  const hasConflict = Boolean(subdomainTenant && sessionTenant && subdomainTenant.id !== sessionTenant.id);
  const tenant = hasConflict ? null : (subdomainTenant ?? sessionTenant ?? resolveDefaultTenant());

  return { tenant, subdomainTenant, sessionTenant, hasConflict };
}

export function resolveTenantFromRequest(request: NextRequest): TenantResolution {
  const hostname = request.nextUrl.hostname;
  const subdomain = extractSubdomain(hostname);
  const subdomainTenant = findTenantByIdOrSlug(subdomain);
  const sessionCookie = request.cookies.get("tenant_id")?.value;
  const headerTenant = request.headers.get("x-tenant-id");
  const sessionTenant = findTenantByIdOrSlug(sessionCookie ?? headerTenant);
  const hasConflict = Boolean(subdomainTenant && sessionTenant && subdomainTenant.id !== sessionTenant.id);
  const tenant = hasConflict ? null : (subdomainTenant ?? sessionTenant ?? resolveDefaultTenant());

  return { tenant, subdomainTenant, sessionTenant, hasConflict };
}
