import { listTransactions } from "@/lib/data/banking-data";
import { withTenantRoute } from "@/lib/services/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const transactions = await listTransactions(tenantId);
    
    // Simple CSV generation
    const headers = ["ID", "Date", "Description", "Amount", "Category", "Status"];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.category,
      t.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions-${tenantId}.csv"`
      }
    });
  });
}
