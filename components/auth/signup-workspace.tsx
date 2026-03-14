"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";

const signupSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2)
});

type SignupValues = z.infer<typeof signupSchema>;

type SignupPayload = {
  action: string;
  session: {
    id: string;
    email: string;
  };
};

export function SignupWorkspace() {
  const [statusMessage, setStatusMessage] = useState("Create a member profile and tenant-scoped session.");
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "new.member@tenant.test",
      fullName: "New Tenant Member"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: SignupValues) =>
      apiRequest<SignupPayload>("/api/auth", {
        method: "POST",
        body: JSON.stringify({
          action: "signup",
          email: values.email,
          fullName: values.fullName
        })
      }),
    onSuccess: (payload) => {
      setStatusMessage(`Created signup session ${payload.session.id} for ${payload.session.email}.`);
      form.reset();
    }
  });

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-xl space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-primary">Signup</p>
          <h1 className="mt-2 font-display text-4xl">Bank signup with auto-tenant provisioning</h1>
          <p className="mt-3 text-sm text-slate-400">This page now uses the live auth route to create a tenant-scoped profile and session.</p>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <input className="w-full rounded-2xl border border-white/10 px-4 py-3" placeholder="Email" {...form.register("email")} />
          <input className="w-full rounded-2xl border border-white/10 px-4 py-3" placeholder="Full name" {...form.register("fullName")} />
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="text-sm text-slate-400">{statusMessage}</p>
        <p className="text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
        </p>
      </Card>
    </main>
  );
}
