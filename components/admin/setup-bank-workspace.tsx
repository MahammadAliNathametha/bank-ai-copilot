"use client";

import { useState } from "react";
import { Upload, Palette, Globe, Check, Settings2, Image as ImageIcon } from "lucide-react";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export function SetupBankWorkspace() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Bank branding updated successfully!");
    }, 1500);
  };

  return (
    <SectionShell 
      eyebrow="Admin" 
      title="Brand Management" 
      description="Configure logo, colors, and domain settings for your white-labeled banking instance."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Identity & Logo
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="size-24 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-500 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Upload Logo</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Institution Logo</p>
                  <p className="text-[10px] text-slate-500 max-w-[200px]">SVG or high-res PNG. Transparent background recommended.</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="bank-name" className="text-[10px] font-bold uppercase text-slate-500">Legal Name</label>
                <Input defaultValue="Ahmedabad Bank" id="bank-name" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5 text-sky-400" />
              Theming & Colors
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="primary-color" className="text-[10px] font-bold uppercase text-slate-500">Primary Color (HSL)</label>
                <div className="flex gap-2">
                  <Input defaultValue="215 100% 50%" id="primary-color" />
                  <div className="size-10 rounded-lg bg-[#0066ff] shrink-0 border border-white/10 shadow-lg shadow-[#0066ff]/20" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="accent-color" className="text-[10px] font-bold uppercase text-slate-500">Accent Color</label>
                <div className="flex gap-2">
                  <Input defaultValue="35 100% 50%" id="accent-color" />
                  <div className="size-10 rounded-lg bg-[#ff9900] shrink-0 border border-white/10 shadow-lg shadow-[#ff9900]/20" />
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Preview</p>
              <div className="flex gap-2">
                 <div className="h-8 w-24 rounded-lg bg-primary" />
                 <div className="h-8 w-24 rounded-lg border border-primary text-primary flex items-center justify-center text-[10px] font-bold">Button</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-400" />
              Domain & Localization
            </h3>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="subdomain" className="text-[10px] font-bold uppercase text-slate-500">Subdomain</label>
                <div className="flex">
                  <Input defaultValue="ahmedabad" className="rounded-r-none" id="subdomain" />
                  <div className="h-10 px-4 flex items-center bg-white/5 border border-l-0 border-white/10 rounded-r-md text-xs text-slate-500">
                    .bank-copilot.io
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="base-currency" className="text-[10px] font-bold uppercase text-slate-500">Base Currency</label>
                <select id="base-currency" className="flex h-10 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white">
                  <option>USD - United States Dollar</option>
                  <option>INR - Indian Rupee</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Ready for Production</p>
                <p className="text-[10px] text-slate-500">All mandatory fields are configured.</p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full py-6 font-bold text-base shadow-xl shadow-primary/20"
            >
              {isSaving ? "Updating Branding..." : "Save Bank Configuration"}
            </Button>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Settings2 className="h-5 w-5" />
              <h4 className="font-bold text-sm tracking-tight">Advanced JSON Config</h4>
            </div>
            <textarea 
              className="w-full h-32 bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-[10px] font-mono text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
              defaultValue={`{
  "features": {
    "crypto": true,
    "p2p": true,
    "loans": false
  },
  "auth": {
    "mfa_required": true
  }
}`}
            />
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
