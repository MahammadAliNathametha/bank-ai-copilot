export function Table({
  headers,
  rows
}: {
  headers: string[];
  rows: Array<Array<string>>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-transparent tracking-tight">
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`} className="border-b border-white/10 hover:bg-[#0a0a0a]/[0.02] transition-colors last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-4 text-slate-300 font-medium whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
