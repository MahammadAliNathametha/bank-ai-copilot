import { createLocation, deleteLocation, getLocationById, listLocations, updateLocation } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { locationCreateSchema, locationUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getLocationById(tenantId, Number(id)) : await listLocations(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, locationCreateSchema);
    const location = await createLocation(tenantId, {
      ...input,
      createdAt: new Date().toISOString()
    });
    return { data: location, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, locationUpdateSchema);
    const location = await updateLocation(tenantId, id, input);
    return { data: location };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const location = await deleteLocation(tenantId, id);
    return { data: location };
  });
}
