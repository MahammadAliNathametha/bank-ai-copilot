import { Suspense } from "react";

import { ChatbotWorkspace } from "@/components/chatbot/chatbot-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Chatbot" };

export default function ChatbotPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ChatbotWorkspace />
    </Suspense>
  );
}
