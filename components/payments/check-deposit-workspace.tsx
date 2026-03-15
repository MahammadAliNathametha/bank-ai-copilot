"use client";

import { useState } from "react";
import { Camera, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export function CheckDepositWorkspace() {
  const [step, setStep] = useState<"upload" | "processing" | "success">("upload");
  const [amount, setAmount] = useState<number | null>(null);

  const handleSimulateOCR = () => {
    setStep("processing");
    // Simulate OCR processing time
    setTimeout(() => {
      const simulatedAmount = Math.floor(Math.random() * 5000) + 100;
      setAmount(simulatedAmount);
      setStep("success");
      toast.success(`OCR Processed: Check for $${simulatedAmount.toLocaleString()} verified.`);
    }, 2500);
  };

  return (
    <SectionShell 
      eyebrow="Payments" 
      title="Mobile Check Deposit" 
      description="Deposit checks instantly by capturing or uploading front and back images. Our BlinkScan™ OCR automatically verifies amounts."
    >
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          {step === "upload" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/2] rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-500 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <Camera className="h-8 w-8 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Front of Check</span>
                </div>
                <div className="aspect-[3/2] rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-500 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <Camera className="h-8 w-8 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Back of Check</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-sky-400 shrink-0" />
                  <p className="text-[11px] text-sky-400/80 leading-5">
                    Ensure the check is signed and endorsed with &quot;For Mobile Deposit Only at Ahmedabad Bank&quot;.
                  </p>
                </div>
                <Button onClick={handleSimulateOCR} className="w-full py-6 text-base font-bold">
                  <Upload className="mr-2 h-5 w-5" /> Upload & Process Check
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">BlinkScan™ OCR Active</h3>
                <p className="text-sm text-slate-500">Extracting amount and routing data...</p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 flex flex-col items-center justify-center space-y-6">
              <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/20">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Deposit Successful</h3>
                <p className="text-slate-400 mb-6">
                  Amount: <span className="text-white font-bold ml-1">${amount?.toLocaleString()}</span>
                </p>
                <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 text-[11px] text-slate-500 text-left space-y-2">
                  <p>• Reference: <span className="text-white">CK-99281-001</span></p>
                  <p>• Funds Available: <span className="text-white">Instantly ($200) / 1-2 Days (Balance)</span></p>
                </div>
                <Button variant="secondary" onClick={() => setStep("upload")} className="mt-8 text-xs font-bold uppercase tracking-widest border-white/10">
                  Deposit Another Check
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </SectionShell>
  );
}
