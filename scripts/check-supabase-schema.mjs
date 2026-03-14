const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!projectUrl || !apiKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const requiredTables = [
  "tenants",
  "profiles",
  "accounts",
  "transactions",
  "transfers",
  "payees",
  "bills",
  "support_tickets",
  "notifications",
  "documents"
];

const results = await Promise.all(
  requiredTables.map(async (table) => {
    const response = await fetch(`${projectUrl}/rest/v1/${table}?select=*&limit=1`, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`
      }
    });

    return {
      table,
      status: response.status,
      ok: response.ok
    };
  })
);

for (const result of results) {
  console.log(`${result.table}: ${result.status}${result.ok ? " ok" : " missing"}`);
}
