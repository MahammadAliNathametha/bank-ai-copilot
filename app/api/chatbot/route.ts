import { createChatbotMessage, listChatbotMessages } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { chatbotMessageCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const sessionId = searchParams.get("sessionId") ?? undefined;
    return { data: await listChatbotMessages(tenantId, sessionId) };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, chatbotMessageCreateSchema);
    const message = await createChatbotMessage(tenantId, input);
    return { data: message, status: 201 };
  });
}
