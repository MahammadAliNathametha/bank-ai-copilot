import { createVoiceCommand, listVoiceCommands } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { voiceCommandCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const userId = searchParams.get("userId") ?? undefined;
    return { data: await listVoiceCommands(tenantId, userId) };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, voiceCommandCreateSchema);
    const command = await createVoiceCommand(tenantId, {
      ...input,
      status: input.status ?? "processed"
    });
    return { data: command, status: 201 };
  });
}
