import { createAppointment, listAppointments } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { appointmentCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    return { data: await listAppointments(tenantId) };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, appointmentCreateSchema);
    const appointment = await createAppointment(tenantId, {
      ...input,
      status: input.status ?? "requested"
    });
    return { data: appointment, status: 201 };
  });
}
