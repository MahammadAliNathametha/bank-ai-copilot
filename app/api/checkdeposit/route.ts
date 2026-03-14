import { createDocument, createTransaction, getAccountById, updateAccount } from "@/lib/data/banking-data";
import { ApiError, withTenantRoute } from "@/lib/services/api";
import { analyzeCheckDeposit } from "@/lib/services/check-deposit";
import { uploadTenantDocument } from "@/lib/services/storage";

export async function POST(request: Request) {
  return withTenantRoute(request, async ({ tenantId, request }) => {
    const formData = await request.formData();
    const rawAccountId = Number(formData.get("accountId"));
    const rawAmount = Number(formData.get("amount"));
    const file = formData.get("file");

    if (!Number.isInteger(rawAccountId) || rawAccountId <= 0) {
      throw new ApiError(400, "A valid accountId is required");
    }

    if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
      throw new ApiError(400, "A valid amount is required");
    }

    if (!(file instanceof File) || file.size === 0) {
      throw new ApiError(400, "A check image file is required");
    }

    const account = await getAccountById(tenantId, rawAccountId);
    const analysis = await analyzeCheckDeposit(file, rawAmount);
    const upload = await uploadTenantDocument({
      tenantId,
      file,
      folder: "checks"
    });

    const document = await createDocument(tenantId, {
      userId: account.userId,
      url: upload.url,
      type: "check-image",
      status: analysis.manualReview ? "processing" : "ready",
      createdAt: new Date().toISOString()
    });

    const transaction = await createTransaction(tenantId, {
      accountId: account.id,
      amount: rawAmount,
      description: `Mobile check deposit · ${analysis.payerName}`,
      category: "Deposit",
      status: analysis.manualReview ? "pending" : "posted",
      date: new Date().toISOString()
    });

    const updatedAccount = analysis.manualReview
      ? account
      : await updateAccount(tenantId, account.id, {
          balance: Number((account.balance + rawAmount).toFixed(2))
        });

    return {
      data: {
        account: updatedAccount,
        analysis,
        document,
        transaction
      },
      status: 201
    };
  });
}
