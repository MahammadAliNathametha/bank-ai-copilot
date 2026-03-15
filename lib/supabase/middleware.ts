import { type NextRequest, NextResponse } from "next/server";

type TenantHeaders = {
  id: string;
  slug: string;
};

export function updateSession(request: NextRequest, tenant?: TenantHeaders) {
  const requestHeaders = new Headers(request.headers);
  if (tenant) {
    requestHeaders.set("x-tenant-id", tenant.id);
    requestHeaders.set("x-tenant-slug", tenant.slug);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  if (tenant) {
    response.headers.set("x-tenant-id", tenant.id);
    response.headers.set("x-tenant-slug", tenant.slug);
  }

  return response;
}
