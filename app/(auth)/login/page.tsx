import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Login"
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-primary">Secure sign-in</p>
          <h1 className="mt-2 font-display text-4xl">Welcome back</h1>
        </div>
        <div className="space-y-3">
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" />
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Password" type="password" />
        </div>
        <Button className="w-full">Login</Button>
        <p className="text-sm text-slate-600">
          Need an account? <Link href="/signup" className="text-primary">Create one</Link>
        </p>
      </Card>
    </main>
  );
}
