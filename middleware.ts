import { NextResponse, type NextRequest } from "next/server";

import { resolveTenantFromRequest } from "@/lib/tenantResolver";
import { updateSession } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  const { tenant, hasConflict } = resolveTenantFromRequest(request);

  if (!tenant || hasConflict) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Invalid tenant context." }, { status: 400 });
    }
    const landingUrl = new URL("/landing", request.url);
    return NextResponse.redirect(landingUrl);
  }

  return updateSession(request, { id: tenant.id, slug: tenant.slug });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
