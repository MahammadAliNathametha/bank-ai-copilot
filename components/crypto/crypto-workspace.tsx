"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  RefreshCw, Plus, Minus, Clock, Star
} from "lucide-react";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ── mock crypto data ──────────────────────────────────────────────── */
const cryptoAssets = [
  { id: 1, symbol: "BTC", name: "Bitcoin", price: 91302.47, change24h: 6.71, balance: 0.4821, value: 44013.82, color: "#F7931A", icon: "₿" },
  { id: 2, symbol: "ETH", name: "Ethereum", price: 3412.85, change24h: 4.23, balance: 8.25, value: 28156.01, color: "#627EEA", icon: "Ξ" },
  { id: 3, symbol: "SOL", name: "Solana", price: 187.32, change24h: -2.14, balance: 125, value: 23415, color: "#9945FF", icon: "◎" },
  { id: 4, symbol: "ADA", name: "Cardano", price: 0.82, change24h: 1.87, balance: 15000, value: 12300, color: "#0033AD", icon: "₳" },
  { id: 5, symbol: "DOT", name: "Polkadot", price: 9.45, change24h: -0.52, balance: 520, value: 4914, color: "#E6007A", icon: "●" },
];

const recentTrades = [
  { id: 1, type: "buy" as const, asset: "BTC", amount: 0.05, price: 89100, total: 4455, time: "2 hours ago" },
  { id: 2, type: "sell" as const, asset: "ETH", amount: 2.5, price: 3380, total: 8450, time: "5 hours ago" },
  { id: 3, type: "buy" as const, asset: "SOL", amount: 25, price: 192.1, total: 4802.5, time: "1 day ago" },
  { id: 4, type: "buy" as const, asset: "ADA", amount: 5000, price: 0.79, total: 3950, time: "2 days ago" },
];

const marketTrending = [
  { symbol: "AVAX", name: "Avalanche", price: 42.18, change: 12.4 },
  { symbol: "LINK", name: "Chainlink", price: 18.92, change: 8.7 },
  { symbol: "MATIC", name: "Polygon", price: 1.24, change: -3.2 },
  { symbol: "UNI", name: "Uniswap", price: 12.45, change: 5.1 },
];

function formatCrypto(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function orderTextColor(i: number) {
  if (i < 3) return "text-red-400";
  if (i === 3) return "text-primary bg-primary/10";
  return "text-emerald-400";
}

function orderBarColor(i: number) {
  if (i < 3) return "bg-red-500/50";
  if (i === 3) return "bg-primary/50";
  return "bg-emerald-500/50";
}

export function CryptoWorkspace() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "trade" | "market">("portfolio");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [tradeAmount, setTradeAmount] = useState("");

  const totalPortfolioValue = cryptoAssets.reduce((sum, a) => sum + a.value, 0);
  const totalChange = ((cryptoAssets.reduce((sum, a) => sum + a.value * a.change24h / 100, 0) / totalPortfolioValue) * 100);

  const tabs = [
    { key: "portfolio" as const, label: "Portfolio" },
    { key: "trade" as const, label: "Trade" },
    { key: "market" as const, label: "Market" },
  ];

  return (
    <SectionShell
      eyebrow="Crypto"
      title="Digital asset portfolio, trading, and market intelligence"
      description="Buy, sell, and track cryptocurrency holdings with real-time pricing, portfolio analytics, and market trending data."
    >
      {/* Tab bar */}
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

      {/* ── Portfolio Tab ────────────────────────────────────────────── */}
      {activeTab === "portfolio" && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Portfolio Value" value={formatCrypto(totalPortfolioValue)} note="Total holdings across all assets" />
            <MetricCard label="24h Change" value={`${totalChange > 0 ? "+" : ""}${totalChange.toFixed(2)}%`} note={totalChange > 0 ? "Portfolio is up" : "Portfolio is down"} />
            <MetricCard label="Assets Held" value={String(cryptoAssets.length)} note="Diversified digital portfolio" />
            <MetricCard label="Best Performer" value="BTC +6.71%" note="Highest 24h gain" />
          </div>

          {/* Portfolio breakdown */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Holdings</h2>
              <button className="text-slate-400 hover:text-white transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Allocation bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {cryptoAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                  style={{ width: `${(asset.value / totalPortfolioValue) * 100}%`, backgroundColor: asset.color }}
                  title={`${asset.symbol}: ${((asset.value / totalPortfolioValue) * 100).toFixed(1)}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {cryptoAssets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: asset.color }} />
                  {asset.symbol} {((asset.value / totalPortfolioValue) * 100).toFixed(1)}%
                </div>
              ))}
            </div>

            {/* Asset list */}
            <div className="space-y-2 mt-4">
              {cryptoAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-5 py-4 hover:border-white/20 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold" style={{ backgroundColor: `${asset.color}20`, color: asset.color }}>
                      {asset.icon}
                    </div>
                    <div>
                      <p className="font-medium text-white">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.balance} {asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold text-white">{formatCrypto(asset.value)}</p>
                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${asset.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {asset.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {asset.change24h > 0 ? "+" : ""}{asset.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent trades */}
          <Card className="space-y-4">
            <h2 className="font-display text-2xl">Recent Trades</h2>
            <div className="space-y-2">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${trade.type === "buy" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                      {trade.type === "buy" ? <Plus className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{trade.type === "buy" ? "Bought" : "Sold"} {trade.amount} {trade.asset}</p>
                      <p className="text-xs text-slate-500">@ {formatCrypto(trade.price)} per unit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${trade.type === "buy" ? "text-emerald-400" : "text-red-400"}`}>
                      {trade.type === "buy" ? "-" : "+"}{formatCrypto(trade.total)}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 justify-end"><Clock className="h-3 w-3" />{trade.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* ── Trade Tab ────────────────────────────────────────────────── */}
      {activeTab === "trade" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card className="space-y-5">
            <h2 className="font-display text-2xl">Place Order</h2>
            <div className="flex gap-1 rounded-lg border border-white/10 bg-[#0a0a0a] p-1">
              <button
                onClick={() => setTradeType("buy")}
                className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${
                  tradeType === "buy" ? "bg-emerald-500/15 text-emerald-400" : "text-slate-400 hover:text-white"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType("sell")}
                className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${
                  tradeType === "sell" ? "bg-red-500/15 text-red-400" : "text-slate-400 hover:text-white"
                }`}
              >
                Sell
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Asset</p>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                >
                  {cryptoAssets.map((a) => (
                    <option key={a.symbol} value={a.symbol}>{a.name} ({a.symbol}) — {formatCrypto(a.price)}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Amount (USD)</p>
                <input
                  type="number"
                  placeholder="0.00"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2">
                {["$100", "$500", "$1,000", "$5,000"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTradeAmount(amount.replaceAll("$", "").replaceAll(",", ""))}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                  >
                    {amount}
                  </button>
                ))}
              </div>
              {tradeAmount && (
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>You {tradeType === "buy" ? "receive" : "sell"}</span>
                    <span>{(Number.parseFloat(tradeAmount) / (cryptoAssets.find(a => a.symbol === selectedAsset)?.price || 1)).toFixed(6)} {selectedAsset}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Network fee</span>
                    <span>~$2.50</span>
                  </div>
                </div>
              )}
              <Button className={`w-full ${tradeType === "sell" ? "bg-red-500 hover:bg-red-600" : ""}`}>
                {tradeType === "buy" ? <Plus className="h-4 w-4 mr-1" /> : <Minus className="h-4 w-4 mr-1" />}
                {tradeType === "buy" ? "Buy" : "Sell"} {selectedAsset}
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-display text-2xl">Order Book</h2>
            <div className="space-y-1">
              {[91450, 91380, 91320, 91302, 91280, 91220, 91150].map((price, i) => (
                <div key={price} className={`flex items-center justify-between rounded-lg px-4 py-2 text-xs font-mono ${orderTextColor(i)}`}>
                  <span>{formatCrypto(price)}</span>
                  <span>{(Math.random() * 2 + 0.1).toFixed(4)}</span>
                  <div className="h-1 w-16 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${orderBarColor(i)}`} style={{ width: `${Math.random() * 80 + 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Market Tab ───────────────────────────────────────────────── */}
      {activeTab === "market" && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="BTC Dominance" value="54.2%" note="Market cap share" />
            <MetricCard label="Total Market Cap" value="$3.2T" note="All cryptocurrencies" />
            <MetricCard label="24h Volume" value="$142B" note="Global trading volume" />
            <MetricCard label="Fear & Greed" value="72" note="Greed — bullish sentiment" />
          </div>
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Trending Assets</h2>
              <div className="flex items-center gap-1 text-xs text-primary"><Star className="h-3 w-3" /> Hot</div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {marketTrending.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-5 py-4 hover:border-primary/20 transition-colors cursor-pointer group">
                  <div>
                    <p className="font-semibold text-white group-hover:text-primary transition-colors">{asset.name}</p>
                    <p className="text-xs text-slate-500">{asset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold text-white">{formatCrypto(asset.price)}</p>
                    <p className={`text-xs font-semibold flex items-center justify-end gap-1 ${asset.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {asset.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {asset.change > 0 ? "+" : ""}{asset.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </SectionShell>
  );
}
