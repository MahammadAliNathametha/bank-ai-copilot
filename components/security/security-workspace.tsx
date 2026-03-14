"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Shield, Fingerprint, Smartphone, Monitor, Globe,
  ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2,
  Clock, MapPin, Lock, Eye, X, ChevronRight
} from "lucide-react";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/services/http";
import type { AuthSessionRecord, CardRecord, NotificationRecord, DeviceRecord, FraudEventRecord } from "@/lib/data/mock-bank-store";

const DeviceIcon = ({ type }: { type: "mobile" | "desktop" | "browser" }) => {
  if (type === "mobile") return <Smartphone className="h-5 w-5" />;
  if (type === "desktop") return <Monitor className="h-5 w-5" />;
  return <Globe className="h-5 w-5" />;
};

const SeverityBadge = ({ severity }: { severity: "high" | "medium" | "low" }) => {
  const colors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[severity]}`}>
      {severity}
    </span>
  );
};

export function SecurityWorkspace() {
  const queryClient = useQueryClient();
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricStep, setBiometricStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "devices" | "fraud" | "history">("overview");

  // Fetch Data
  const { data: securitySettings } = useSuspenseQuery({
    queryKey: ["security-settings"],
    queryFn: () => apiRequest<{ twoFactorEnabled: boolean; biometricEnabled: boolean }>("/api/users/security")
  });

  const { data: devices } = useSuspenseQuery({
    queryKey: ["devices"],
    queryFn: () => apiRequest<DeviceRecord[]>("/api/devices")
  });

  const { data: fraudEvents } = useSuspenseQuery({
    queryKey: ["fraud"],
    queryFn: () => apiRequest<FraudEventRecord[]>("/api/fraud")
  });

  const { data: session } = useSuspenseQuery({
    queryKey: ["auth-session"],
    queryFn: () => apiRequest<AuthSessionRecord>("/api/auth")
  });

  const { data: cards } = useSuspenseQuery({
    queryKey: ["cards"],
    queryFn: () => apiRequest<CardRecord[]>("/api/cards")
  });

  const { data: notifications } = useSuspenseQuery({
    queryKey: ["notifications"],
    queryFn: () => apiRequest<NotificationRecord[]>("/api/notifications")
  });

  // Mutations
  const securityMutation = useMutation({
    mutationFn: (body: Partial<typeof securitySettings>) => 
      apiRequest("/api/users/security", { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["security-settings"] })
  });

  useMutation({
    mutationFn: ({ id, trusted }: { id: number; trusted: boolean }) => 
      apiRequest(`/api/devices?id=${id}`, { method: "PATCH", body: JSON.stringify({ trusted }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["devices"] })
  });

  const deleteDeviceMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/devices?id=${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["devices"] })
  });

  const { twoFactorEnabled, biometricEnabled } = securitySettings;
  const alertsEnabled = notifications.filter((n) => n.status === "active").length;
  const securityScore = twoFactorEnabled ? (biometricEnabled ? 98 : 92) : 74;

  const startBiometricEnrollment = () => {
    setShowBiometricModal(true);
    setBiometricStep(0);
  };

  const advanceBiometric = () => {
    if (biometricStep < 3) {
      setBiometricStep(biometricStep + 1);
    } else {
      securityMutation.mutate({ biometricEnabled: true });
      setShowBiometricModal(false);
      setBiometricStep(0);
    }
  };

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "devices" as const, label: "Devices" },
    { key: "fraud" as const, label: "Fraud Detection" },
    { key: "history" as const, label: "Login History" },
  ];

  return (
    <SectionShell
      eyebrow="Security"
      title="Security center — 2FA, biometrics, devices & fraud monitoring"
      description="Full security posture management with two-factor authentication controls, trusted device management, biometric enrollment, and real-time fraud detection."
    >
      <div className="flex gap-1 rounded-xl border border-white/10 bg-[#0a0a0a] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-primary/15 text-primary shadow-[0_0_15px_rgba(255,153,0,0.08)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Security Score" value={String(securityScore)} note={securityScore >= 90 ? "Excellent posture" : "Enable 2FA to improve"} />
            <MetricCard label="Session" value={session.status} note={`Current: ${session.email}`} />
            <MetricCard label="Cards Protected" value={String(cards.length)} note="Active card controls" />
            <MetricCard label="Alerts Active" value={String(alertsEnabled)} note="Notification rules on" />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Two-Factor Authentication</h2>
                <button
                  onClick={() => securityMutation.mutate({ twoFactorEnabled: !twoFactorEnabled })}
                  disabled={securityMutation.isPending}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                    twoFactorEnabled
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {twoFactorEnabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
              <div className={`rounded-2xl border px-5 py-5 transition-all duration-300 ${
                twoFactorEnabled ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-2.5 ${twoFactorEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {twoFactorEnabled ? "Your account is protected" : "Account at risk"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {twoFactorEnabled
                        ? "SMS and authenticator app verification is active for all login attempts."
                        : "Enable 2FA to protect against unauthorized access to your account."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Verification methods</p>
                <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span className="text-sm text-white">SMS to +1 •••• 4829</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="text-sm text-white">Authenticator App</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
            </Card>

            <Card className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Biometric Authentication</h2>
                <button
                  onClick={() => biometricEnabled ? securityMutation.mutate({ biometricEnabled: false }) : startBiometricEnrollment()}
                  disabled={securityMutation.isPending}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                    biometricEnabled
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      : "bg-white/10 text-slate-300 border border-white/20 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                  }`}
                >
                  {biometricEnabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  {biometricEnabled ? "Enrolled" : "Set Up"}
                </button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-2.5 ${biometricEnabled ? "bg-primary/20 text-primary" : "bg-white/10 text-slate-400"}`}>
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {biometricEnabled ? "Face ID & Fingerprint active" : "Secure your login with biometrics"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {biometricEnabled
                        ? "Your face and fingerprint are enrolled for instant secure access."
                        : "Use Face ID, Touch ID, or Windows Hello for faster, stronger authentication."}
                    </p>
                  </div>
                </div>
              </div>
              {biometricEnabled && (
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Enrolled methods</p>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-primary" />
                      <span className="text-sm text-white">Face ID</span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-4 w-4 text-primary" />
                      <span className="text-sm text-white">Fingerprint</span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
              )}
              {!biometricEnabled && (
                <Button onClick={startBiometricEnrollment} className="w-full">
                  Start Biometric Enrollment
                </Button>
              )}
            </Card>
          </div>
        </>
      )}

      {activeTab === "devices" && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Trusted Devices</h2>
            <span className="text-xs text-slate-500">{devices.length} devices</span>
          </div>
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-5 py-4 hover:border-white/20 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-2.5 ${device.trusted ? "bg-primary/15 text-primary" : "bg-white/10 text-slate-400"}`}>
                    <DeviceIcon type={device.type} />
                  </div>
                  <div>
                    <p className="font-medium text-white">{device.name}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>{device.os}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {device.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${device.lastSeen === "Active now" ? "text-emerald-400" : "text-slate-500"}`}>
                      {device.lastSeen}
                    </p>
                    {device.trusted && (
                      <p className="mt-0.5 text-[10px] text-emerald-400/70 uppercase tracking-wider">Trusted</p>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteDeviceMutation.mutate(device.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "fraud" && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Threat Level" value="Low" note="No active threats detected" />
            <MetricCard label="Blocked Attempts" value={String(fraudEvents.filter(e => e.status === "blocked").length)} note="In the last 30 days" />
            <MetricCard label="Risk Score" value="12/100" note="ML-based behavioral analysis" />
          </div>
          <Card className="space-y-4">
            <h2 className="font-display text-2xl">Fraud Alerts</h2>
            <div className="space-y-3">
              {fraudEvents.map((alert) => (
                <div key={alert.id} className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-xl p-2.5 mt-0.5 ${
                        alert.severity === "high" ? "bg-red-500/15 text-red-400" :
                        alert.severity === "medium" ? "bg-amber-500/15 text-amber-400" :
                        "bg-emerald-500/15 text-emerald-400"
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{alert.type}</p>
                          <SeverityBadge severity={alert.severity} />
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{alert.description}</p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                          <Clock className="h-3 w-3" />
                          {alert.createdAt}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      alert.status === "blocked" ? "bg-red-500/15 text-red-400" :
                      alert.status === "reviewed" ? "bg-amber-500/15 text-amber-400" :
                      "bg-emerald-500/15 text-emerald-400"
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {showBiometricModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-8 shadow-2xl">
            <button
              onClick={() => setShowBiometricModal(false)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-6">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 ${
                biometricStep >= 2
                  ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                  : "bg-primary/20 text-primary shadow-[0_0_40px_rgba(255,153,0,0.15)]"
              }`}>
                {biometricStep < 2
                  ? <Fingerprint className="h-10 w-10 animate-pulse" />
                  : <CheckCircle2 className="h-10 w-10" />
                }
              </div>

              <div>
                <h3 className="font-display text-2xl text-white">
                  {biometricStep === 0 && "Ready to scan"}
                  {biometricStep === 1 && "Scanning..."}
                  {biometricStep === 2 && "Fingerprint captured"}
                  {biometricStep === 3 && "Face ID ready"}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {biometricStep === 0 && "Place your finger on the sensor or look at the camera."}
                  {biometricStep === 1 && "Hold steady — capturing biometric data..."}
                  {biometricStep === 2 && "Fingerprint enrolled. Now let's set up Face ID."}
                  {biometricStep === 3 && "Both biometric methods are ready to activate."}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step <= biometricStep
                        ? "w-6 bg-primary"
                        : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <Button onClick={advanceBiometric} className="w-full">
                {biometricStep < 3 ? "Continue" : "Activate Biometrics"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
