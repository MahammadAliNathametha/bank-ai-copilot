export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <div className="w-[72px] border-r border-white/10 animate-pulse bg-white/5" />
      <div className="flex-1 p-6 space-y-6">
        <div className="h-14 w-full rounded-xl border border-white/10 bg-white/5 animate-pulse" />
        <div className="h-[400px] rounded-xl border border-white/10 bg-white/5 animate-pulse" />
      </div>
    </main>
  );
}
