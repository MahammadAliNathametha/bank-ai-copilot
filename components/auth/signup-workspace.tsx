"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, User, ChevronLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
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
      setStatusMessage(`Success! Session ${payload.session.id.slice(0, 8)} activated for ${payload.session.email}.`);
      form.reset();
    }
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-6 py-12 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Onboarding Value Prop */}
        <div className="hidden lg:block space-y-10">
          <Link href="/" className="inline-flex items-center gap-2 group text-sm font-medium text-slate-400 hover:text-primary mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Next-Gen Infrastructure
            </div>
            <h1 className="font-display text-6xl font-bold leading-[1.1] tracking-tight text-white">
              Launch your <br />
              <span className="text-primary italic">institutional</span> <br />
              workspace.
            </h1>
            <p className="text-xl text-slate-400 max-w-md leading-relaxed">
              Every signup triggers an automated, tenant-isolated environment deployment with integrated AML/KYC checks.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-white">Tenant Isolation</p>
                <p className="text-sm text-slate-500">Your data never leaves your dedicated silo. Guaranteed by RLS.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-white">Instant API Access</p>
                <p className="text-sm text-slate-500">Full REST & WebSocket support provisioned in under 2 seconds.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="flex flex-col items-center">
          <Card className="w-full max-w-md p-8 lg:p-10 space-y-8 bg-black/40 border-white/10 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Top Glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.5em] text-primary font-bold">Onboarding</p>
              <h2 className="font-display text-4xl font-bold text-white">Get Started</h2>
              <p className="text-sm text-slate-500">Join the elite core of institutional finance.</p>
            </div>

            <form className="space-y-6" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
              <div className="space-y-4">
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-primary transition-colors" />
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                    placeholder="Full Name"
                    {...form.register("fullName")}
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-xs text-red-400 mt-1 ml-2">{form.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-primary transition-colors" />
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                    placeholder="Work Email"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-400 mt-1 ml-2">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group/btn" type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Provisioning...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Initialize Account
                      <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  )}
                </Button>
                
                {statusMessage && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    {statusMessage}
                  </div>
                )}
              </div>
            </form>

            <div className="pt-2 text-center">
              <p className="text-sm text-slate-500">
                Already have a workspace?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline transition-all">Sign in</Link>
              </p>
            </div>
          </Card>

          <div className="mt-8 flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="text-xs text-slate-600 uppercase tracking-widest mb-1">Compliance</div>
              <div className="h-0.5 w-12 bg-primary/20" />
            </div>
            <div className="text-[10px] text-slate-500 max-w-[200px] text-center uppercase tracking-tighter leading-tight">
              By initializing, you agree to the Master Service Agreement and Data Privacy Addendum.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
