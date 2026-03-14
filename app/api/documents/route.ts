import { createDocument, deleteDocument, getDocumentById, listDocuments, updateDocument } from "@/lib/data/banking-data";
import { ApiError, getRequiredNumberId, parseJson, withTenantRoute } from "@/lib/services/api";
import { uploadTenantDocument } from "@/lib/services/storage";
import { documentCreateSchema, documentUpdateSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = searchParams.get("id");
    const data = id ? await getDocumentById(tenantId, Number(id)) : await listDocuments(tenantId);
    return { data };
  });
}

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId, request }) => {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const userId = String(formData.get("userId") ?? "");
      const type = String(formData.get("type") ?? "");
      const status = String(formData.get("status") ?? "processing");
      const file = formData.get("file");

      if (!(file instanceof File) || file.size === 0) {
        throw new ApiError(400, "A document file is required");
      }

      const validated = documentCreateSchema.parse({
        userId,
        url: file.name,
        type,
        status
      });

      const upload = await uploadTenantDocument({
        tenantId,
        file,
        folder: validated.type.toLowerCase().includes("check") ? "checks" : "documents"
      });

      const document = await createDocument(tenantId, {
        ...validated,
        url: upload.url,
        createdAt: new Date().toISOString()
      });

      return { data: document, status: 201 };
    }

    const input = await parseJson(request, documentCreateSchema);
    const document = await createDocument(tenantId, {
      ...input,
      status: input.status ?? "processing",
      createdAt: new Date().toISOString()
    });
    return { data: document, status: 201 };
  });
}

export async function PUT(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const input = await parseJson(request, documentUpdateSchema);
    const document = await updateDocument(tenantId, id, input);
    return { data: document };
  });
}

export async function DELETE(request: Request) {
  return withTenantRoute(request, async ({ tenantId, searchParams }) => {
    const id = getRequiredNumberId(searchParams);
    const document = await deleteDocument(tenantId, id);
    return { data: document };
  });
}
