import { type NextRequest, NextResponse } from "next/server";

export function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request
  });

  const host = request.headers.get("host") ?? "";
  const tenantSlug = host.split(".")[0];
  response.headers.set("x-tenant-slug", tenantSlug);

  return response;
}
