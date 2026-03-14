import {
  createComplianceRecord,
  deleteComplianceRecord,
  getComplianceRecordById,
  listComplianceRecords,
  updateComplianceRecord
} from "@/lib/data/banking-data";
import { getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { complianceCreateSchema, complianceUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getComplianceRecordById(tenantId, Number(id)) : await listComplianceRecords(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const input = await parseJson(request, complianceCreateSchema);
    const record = await createComplianceRecord(tenantId, {
      ...input,
      createdAt: new Date().toISOString()
    });
    return { data: record, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, complianceUpdateSchema);
    const record = await updateComplianceRecord(tenantId, id, input);
    return { data: record };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const record = await deleteComplianceRecord(tenantId, id);
    return { data: record };
  });
}
