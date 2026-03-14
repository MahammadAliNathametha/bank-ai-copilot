"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Users, UserPlus, Search, ShieldCheck, 
  Trash2, Building, User, ChevronRight,
  Plus
} from "lucide-react";

import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/services/http";
import type { BeneficiaryRecord } from "@/lib/data/mock-bank-store";

export function BeneficiariesWorkspace() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    accountNumber: "",
    routingNumber: "",
    type: "individual" as "individual" | "business"
  });

  const { data: beneficiaries } = useSuspenseQuery({
    queryKey: ["beneficiaries"],
    queryFn: () => apiRequest<BeneficiaryRecord[]>("/api/beneficiaries")
  });

  const addMutation = useMutation({
    mutationFn: (data: typeof newBeneficiary) => 
      apiRequest("/api/beneficiaries", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      setShowAddModal(false);
      setNewBeneficiary({ name: "", accountNumber: "", routingNumber: "", type: "individual" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/beneficiaries?id=${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["beneficiaries"] })
  });

  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.accountNumber.includes(searchTerm)
  );

  return (
    <SectionShell
      eyebrow="Payments"
      title="Beneficiary management for secure transfers & wires"
      description="Manage your trusted payees for internal transfers, ACH, wires, and real-time payments. All beneficiaries are verified against compliance watchlists."
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            placeholder="Search by name or account number..."
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full md:w-auto gap-2">
          <UserPlus className="h-4 w-4" />
          Add Beneficiary
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBeneficiaries.map((ben) => (
          <Card key={ben.id} className="group hover:border-primary/30 transition-all duration-300 overflow-hidden relative">
             <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-2xl p-3 ${ben.type === 'individual' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-400'}`}>
                    {ben.type === 'individual' ? <User className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{ben.name}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{ben.type}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => deleteMutation.mutate(ben.id)}
                  className="rounded-lg p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
             </div>

             <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Account</span>
                  <span className="font-mono text-white tracking-widest">{ben.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Routing</span>
                  <span className="font-mono text-white tracking-widest">{ben.routingNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Status</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>
             </div>

             <button type="button" className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-primary hover:text-black transition-all">
                Send Payment
                <ChevronRight className="h-3.5 w-3.5" />
             </button>
          </Card>
        ))}

        {filteredBeneficiaries.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-800 mb-4" />
            <p className="text-slate-500">No beneficiaries found matching your search.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md space-y-6 shadow-2xl border-white/20">
            <h2 className="font-display text-2xl">Add New Beneficiary</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="ben-name" className="text-xs font-bold text-slate-500 uppercase">Full Name or Entity</label>
                <input 
                  id="ben-name"
                  className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white"
                  value={newBeneficiary.name}
                  onChange={e => setNewBeneficiary({...newBeneficiary, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label htmlFor="ben-account" className="text-xs font-bold text-slate-500 uppercase">Account Number</label>
                   <input 
                    id="ben-account"
                    className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white font-mono"
                    value={newBeneficiary.accountNumber}
                    onChange={e => setNewBeneficiary({...newBeneficiary, accountNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                   <label htmlFor="ben-routing" className="text-xs font-bold text-slate-500 uppercase">Routing Number</label>
                   <input 
                    id="ben-routing"
                    className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white font-mono"
                    value={newBeneficiary.routingNumber}
                    onChange={e => setNewBeneficiary({...newBeneficiary, routingNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ben-type" className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select 
                  id="ben-type"
                  className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white"
                  value={newBeneficiary.type}
                  onChange={e => setNewBeneficiary({...newBeneficiary, type: e.target.value as "individual" | "business"})}
                >
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button 
                className="flex-1 gap-2" 
                onClick={() => addMutation.mutate(newBeneficiary)}
                disabled={!newBeneficiary.name || !newBeneficiary.accountNumber || addMutation.isPending}
              >
                {addMutation.isPending ? "Adding..." : "Add Beneficiary"}
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </SectionShell>
  );
}
