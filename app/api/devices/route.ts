import { deleteDevice, listDevices, updateDevice } from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { deviceUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    return { data: await listDevices(tenantId) };
  });
}

export async function PATCH(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, deviceUpdateSchema);
    return { data: await updateDevice(tenantId, id, input) };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const result = await deleteDevice(tenantId, id);
    return { data: result };
  });
}
