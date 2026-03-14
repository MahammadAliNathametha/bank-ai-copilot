import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

import { resolveTenantFromHeaders, type ResolvedTenant } from "@/lib/services/tenant";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RouteResult = {
  data: unknown;
  status?: number;
};

type TenantRouteContext = {
  request: Request;
  tenant: ResolvedTenant;
  tenantId: string;
  searchParams: URLSearchParams;
};

export async function withTenantRoute(
  request: Request,
  handler: (context: TenantRouteContext) => Promise<RouteResult | unknown>
) {
  const tenant = await resolveTenantFromHeaders(request.headers);

  try {
    const result = await handler({
      request,
      tenant,
      tenantId: tenant.id,
      searchParams: new URL(request.url).searchParams
    });

    const normalized = normalizeRouteResult(result);
    return NextResponse.json(
      {
        success: true,
        tenantId: tenant.id,
        data: normalized.data
      },
      { status: normalized.status }
    );
  } catch (error) {
    return handleRouteError(error, tenant.id);
  }
}

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json().catch(() => {
    throw new ApiError(400, "Invalid JSON body");
  });

  return schema.parse(body);
}

export function getRequiredNumberId(searchParams: URLSearchParams, key = "id") {
  const rawValue = searchParams.get(key);

  if (!rawValue) {
    throw new ApiError(400, `Missing query parameter: ${key}`);
  }

  const value = Number(rawValue);
  if (!Number.isInteger(value) || value <= 0) {
    throw new ApiError(400, `Invalid query parameter: ${key}`);
  }

  return value;
}

export function getRequiredStringId(searchParams: URLSearchParams, key = "id") {
  const value = searchParams.get(key);

  if (!value) {
    throw new ApiError(400, `Missing query parameter: ${key}`);
  }

  return value;
}

function normalizeRouteResult(result: RouteResult | unknown): RouteResult {
  if (typeof result === "object" && result !== null && "data" in result) {
    return result as RouteResult;
  }

  return {
    data: result,
    status: 200
  };
}

export function handleRouteError(error: unknown, tenantId: string) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        tenantId,
        error: error.message
      },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        tenantId,
        error: "Validation failed",
        details: error.flatten()
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      tenantId,
      error: error instanceof Error ? error.message : "Unexpected error"
    },
    { status: 500 }
  );
}
