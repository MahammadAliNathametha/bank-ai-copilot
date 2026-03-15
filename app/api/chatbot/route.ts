import { z } from "zod";

import { createChatbotMessage, listChatbotMessages } from "@/lib/data/banking-data";
import { ApiError, parseJson, withTenantRoute } from "@/lib/services/api";
import { chatbotMessageCreateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const rawSessionId = searchParams.get("sessionId");
    const sessionId = rawSessionId?.trim() ? rawSessionId.trim() : undefined;
    if (sessionId && !z.string().uuid().safeParse(sessionId).success) {
      throw new ApiError(400, "Invalid sessionId");
    }
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
