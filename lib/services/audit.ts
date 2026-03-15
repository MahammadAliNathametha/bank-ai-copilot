import { createRecord } from "@/lib/data/mock-bank-store";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type AuditEvent = {
  tenantId: string;
  action: string;
  userId?: string | null;
  details?: Record<string, unknown> | string | null;
};

function shouldUseMockAudit() {
  if (process.env.BANK_DATA_BACKEND === "mock" || process.env.NODE_ENV === "test") {
    return true;
  }
  return !process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export async function logAuditEvent(event: AuditEvent) {
  if (!event.tenantId) {
    return;
  }

  if (shouldUseMockAudit()) {
    createRecord(event.tenantId, "auditLogs", {
      action: event.action,
      userId: event.userId ?? null,
      details: typeof event.details === "string" ? { message: event.details } : event.details ?? null,
      createdAt: new Date().toISOString()
    });
    return;
  }

  try {
    const supabase = getSupabaseAdminClient();
    const result = await supabase.from("audit_logs").insert({
      action: event.action,
      user_id: event.userId ?? null,
      tenant_id: event.tenantId,
      details: typeof event.details === "string" ? { message: event.details } : event.details ?? {}
    });

    if (result.error) {
      console.error("audit_logs insert failed", result.error.message);
    }
  } catch (error) {
    console.error("audit_logs insert failed", error);
  }
}
