"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Lock, ChevronLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required")
});

type LoginValues = z.infer<typeof loginSchema>;

type LoginPayload = {
  action: string;
  session: {
    id: string;
    email: string;
  };
};

export function LoginWorkspace() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@tenant.test",
      password: "password123"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: LoginValues) =>
      apiRequest<LoginPayload>("/api/auth", {
        method: "POST",
        body: JSON.stringify({
          action: "login",
          email: values.email
        })
      }),
    onSuccess: (payload) => {
      setStatusMessage("Login successful! Redirecting to dashboard...");
      // Simulate session set
      document.cookie = `tenant_id=${payload.session.id}; path=/`;
      router.push("/dashboard");
    },
    onError: (err) => {
      setStatusMessage(err instanceof Error ? err.message : "Invalid credentials.");
    }
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Branding/Marketing */}
        <div className="hidden lg:block space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 group text-sm font-medium text-slate-400 hover:text-primary mb-4">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to website
          </Link>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-2xl font-bold text-black font-display">B</span>
            </div>
            <h1 className="font-display text-6xl font-bold tracking-tight text-white">
              Access the <br />
              <span className="text-primary italic">future</span> of banking.
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Your institutional gateway to sub-second settlements, AI-driven risk management, and multi-rail liquidity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="space-y-1 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl font-bold font-display text-white">99.9%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Uptime SLA</p>
            </div>
            <div className="space-y-1 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl font-bold font-display text-white">Bank-Grade</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">AES-256 Security</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md p-8 lg:p-10 space-y-8 bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Inner Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.4em] text-primary font-semibold">Sign In</p>
              <h2 className="font-display text-3xl font-bold text-white">Welcome Back</h2>
              <p className="text-sm text-slate-400">Enter your credentials to access your dashboard.</p>
            </div>

            <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
              <div className="space-y-4">
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    placeholder="Email Address"
                    type="email"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-400 mt-1 ml-2">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    placeholder="Password"
                    type="password"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-red-400 mt-1 ml-2">{form.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/10 bg-white/5 accent-primary"
                  />
                  <span>Remember me</span>
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn" type="submit" disabled={mutation.isPending}>
                <span>Sign In to Console</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </form>

            {statusMessage && (
              <p className={`text-center text-sm ${statusMessage.includes("successful") ? "text-primary" : "text-red-400"}`}>
                {statusMessage}
              </p>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f0f0f] px-2 text-slate-500 tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="h-12 border-white/10 bg-transparent hover:bg-white/5 rounded-xl font-medium">Google</Button>
              <Button variant="secondary" className="h-12 border-white/10 bg-transparent hover:bg-white/5 rounded-xl font-medium">SSO</Button>
            </div>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">Start onboarding</Link>
            </p>
          </Card>
          
          <p className="mt-8 text-xs text-slate-600 uppercase tracking-widest">
            Protected by Bank AI Guardian &bull; v1.2.0
          </p>
        </div>
      </div>
    </main>
  );
}
