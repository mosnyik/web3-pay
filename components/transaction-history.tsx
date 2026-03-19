"use client"

import { useState, useMemo } from "react"
import {
  CheckCircle, Clock, XCircle, ExternalLink,
  Search, Download, Copy, ArrowUpRight,
  TrendingUp, Activity, BarChart3, Percent,
} from "lucide-react"
import { EthereumIcon, BitcoinIcon, SolanaIcon, TronIcon } from "@/components/icons/chain-icons"
import { useToast } from "@/hooks/use-toast"

// ── Types ─────────────────────────────────────────────────────────────────────

type TxStatus = "confirmed" | "pending" | "failed"

interface Transaction {
  id: string
  timestamp: number   // unix ms
  amount: string
  amountUsd: string
  token: string
  network: "ethereum" | "bitcoin" | "solana" | "tron"
  status: TxStatus
  description: string
  recipient: string
  txHash: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK: Transaction[] = [
  { id: "1", timestamp: Date.now() - 1_800_000,    amount: "0.9125",    amountUsd: "2,356.80", token: "ETH",  network: "ethereum", status: "confirmed", description: "Premium NFT Collection",  recipient: "0xAbCd...1234", txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b" },
  { id: "2", timestamp: Date.now() - 86_400_000,   amount: "250.00",    amountUsd: "250.00",   token: "USDC", network: "ethereum", status: "confirmed", description: "Digital Art License",    recipient: "0xBcDe...2345", txHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3" },
  { id: "3", timestamp: Date.now() - 172_800_000,  amount: "0.00341",   amountUsd: "198.44",   token: "BTC",  network: "bitcoin",  status: "pending",   description: "Web3 Course Access",     recipient: "bc1q...9012",   txHash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2" },
  { id: "4", timestamp: Date.now() - 259_200_000,  amount: "1,000",     amountUsd: "68.50",    token: "TRX",  network: "tron",     status: "failed",    description: "Gaming Credits",         recipient: "TXyz...4567",   txHash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4" },
  { id: "5", timestamp: Date.now() - 345_600_000,  amount: "1.25",      amountUsd: "3,225.00", token: "ETH",  network: "ethereum", status: "confirmed", description: "Subscription Payment",   recipient: "0xCdEf...3456", txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4" },
  { id: "6", timestamp: Date.now() - 432_000_000,  amount: "4.20",      amountUsd: "662.30",   token: "SOL",  network: "solana",   status: "confirmed", description: "DeFi Protocol Fee",      recipient: "8xGh...5678",   txHash: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f" },
  { id: "7", timestamp: Date.now() - 518_400_000,  amount: "500.00",    amountUsd: "500.00",   token: "USDT", network: "tron",     status: "confirmed", description: "Marketplace Purchase",   recipient: "TYza...7890",   txHash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5" },
  { id: "8", timestamp: Date.now() - 604_800_000,  amount: "0.00512",   amountUsd: "297.98",   token: "BTC",  network: "bitcoin",  status: "failed",    description: "Hardware Wallet Order",  recipient: "bc1q...2345",   txHash: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3" },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const CHAIN_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  ethereum: EthereumIcon,
  bitcoin:  BitcoinIcon,
  solana:   SolanaIcon,
  tron:     TronIcon,
}

const EXPLORER_URL: Record<string, string> = {
  ethereum: "https://etherscan.io/tx/",
  bitcoin:  "https://mempool.space/tx/",
  solana:   "https://solscan.io/tx/",
  tron:     "https://tronscan.org/#/transaction/",
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms
  const m = Math.floor(diff / 60_000)
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(diff / 86_400_000)
  if (m < 1)  return "Just now"
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function shortHash(hash: string): string {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`
}

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TxStatus, { label: string; icon: React.ReactNode; classes: string; dot: string }> = {
  confirmed: {
    label: "Confirmed",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    classes: "text-green-400 bg-green-400/10 border-green-400/20",
    dot: "bg-green-400",
  },
  pending: {
    label: "Pending",
    icon: <Clock className="w-3.5 h-3.5" />,
    classes: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    dot: "bg-amber-400",
  },
  failed: {
    label: "Failed",
    icon: <XCircle className="w-3.5 h-3.5" />,
    classes: "text-red-400 bg-red-400/10 border-red-400/20",
    dot: "bg-red-400",
  },
}

function StatusBadge({ status }: { status: TxStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${cfg.classes}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

// ── CSV export ────────────────────────────────────────────────────────────────

function exportCSV(txs: Transaction[]) {
  const header = "Date,Description,Recipient,Amount,Token,Network,Status,Tx Hash"
  const rows = txs.map((tx) =>
    [formatDate(tx.timestamp), tx.description, tx.recipient, tx.amount, tx.token, tx.network, tx.status, tx.txHash].join(",")
  )
  const csv = [header, ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `transactions-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Main component ────────────────────────────────────────────────────────────

export function TransactionHistory() {
  const { toast } = useToast()
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState<string>("all")
  const [networkFilter, setNetwork] = useState<string>("all")

  const filtered = useMemo(() => {
    return MOCK.filter((tx) => {
      const q = search.toLowerCase()
      const matchSearch = !q || tx.description.toLowerCase().includes(q) || tx.txHash.toLowerCase().includes(q) || tx.recipient.toLowerCase().includes(q)
      const matchStatus  = statusFilter  === "all" || tx.status  === statusFilter
      const matchNetwork = networkFilter === "all" || tx.network === networkFilter
      return matchSearch && matchStatus && matchNetwork
    })
  }, [search, statusFilter, networkFilter])

  // Stats
  const totalTx      = MOCK.length
  const confirmed    = MOCK.filter((t) => t.status === "confirmed").length
  const pending      = MOCK.filter((t) => t.status === "pending").length
  const successRate  = Math.round((confirmed / totalTx) * 100)

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    toast({ title: "Copied", description: "Transaction hash copied to clipboard" })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

      {/* ── Page heading ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Transaction History</h1>
        <p className="text-sm text-slate-500 mt-1">All crypto payments sent from your connected wallets</p>
      </div>

      {/* ── Stats strip ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Activity className="w-4 h-4 text-violet-400" />}  label="Total Transactions" value={totalTx.toString()}       glow="violet" />
        <StatCard icon={<CheckCircle className="w-4 h-4 text-green-400" />} label="Confirmed"           value={confirmed.toString()}      glow="green"  />
        <StatCard icon={<Clock className="w-4 h-4 text-amber-400" />}       label="Pending"             value={pending.toString()}        glow="amber"  />
        <StatCard icon={<Percent className="w-4 h-4 text-blue-400" />}      label="Success Rate"        value={`${successRate}%`}         glow="blue"   />
      </div>

      {/* ── Filter bar ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by description, address or tx hash…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>

        {/* Status */}
        <FilterSelect
          value={statusFilter}
          onChange={setStatus}
          options={[
            { value: "all",       label: "All Statuses" },
            { value: "confirmed", label: "Confirmed" },
            { value: "pending",   label: "Pending" },
            { value: "failed",    label: "Failed" },
          ]}
        />

        {/* Network */}
        <FilterSelect
          value={networkFilter}
          onChange={setNetwork}
          options={[
            { value: "all",      label: "All Networks" },
            { value: "ethereum", label: "Ethereum" },
            { value: "bitcoin",  label: "Bitcoin" },
            { value: "solana",   label: "Solana" },
            { value: "tron",     label: "Tron" },
          ]}
        />

        {/* Export */}
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* ── Transaction list ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-slate-800 text-xs font-semibold uppercase tracking-widest text-slate-600">
          <span>Transaction</span>
          <span>Amount</span>
          <span>Network</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState hasFilters={!!(search || statusFilter !== "all" || networkFilter !== "all")} />
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filtered.map((tx) => (
              <TxRow key={tx.id} tx={tx} onCopy={copyHash} />
            ))}
          </div>
        )}

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-600">
            Showing {filtered.length} of {MOCK.length} transactions
          </div>
        )}
      </div>
    </div>
  )
}

// ── TxRow ─────────────────────────────────────────────────────────────────────

function TxRow({ tx, onCopy }: { tx: Transaction; onCopy: (h: string) => void }) {
  const ChainIcon = CHAIN_ICONS[tx.network]
  const explorerUrl = EXPLORER_URL[tx.network] + tx.txHash

  return (
    <div className="px-5 py-4 hover:bg-slate-800/30 transition-colors">
      {/* Mobile layout */}
      <div className="lg:hidden flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
          {ChainIcon && <ChainIcon size={22} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{tx.description}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{tx.recipient}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-white">{tx.amount} {tx.token}</p>
              <p className="text-xs text-slate-500">${tx.amountUsd}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <StatusBadge status={tx.status} />
            <span className="text-xs text-slate-600 capitalize">{tx.network}</span>
            <span className="text-xs text-slate-600">{timeAgo(tx.timestamp)}</span>
            <button
              onClick={() => onCopy(tx.txHash)}
              className="ml-auto flex items-center gap-1 text-xs text-slate-600 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              {shortHash(tx.txHash)}
            </button>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-violet-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
        {/* Transaction info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
            {ChainIcon && <ChainIcon size={20} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{tx.description}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <button
                onClick={() => onCopy(tx.txHash)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                title="Copy full hash"
              >
                <Copy className="w-3 h-3" />
                {shortHash(tx.txHash)}
              </button>
              <span className="text-slate-700">·</span>
              <span className="text-xs text-slate-600" title={formatDate(tx.timestamp)}>{timeAgo(tx.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div>
          <p className="text-sm font-semibold text-white">{tx.amount} {tx.token}</p>
          <p className="text-xs text-slate-500 mt-0.5">${tx.amountUsd}</p>
        </div>

        {/* Network */}
        <div>
          <span className="text-xs font-medium text-slate-400 capitalize border border-slate-700 rounded-full px-2.5 py-1">
            {tx.network}
          </span>
        </div>

        {/* Status */}
        <div>
          <StatusBadge status={tx.status} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
            title="View on block explorer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Explorer
          </a>
        </div>
      </div>
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, glow,
}: {
  icon: React.ReactNode
  label: string
  value: string
  glow: "violet" | "green" | "amber" | "blue"
}) {
  const glowMap = {
    violet: "bg-violet-500/5 border-violet-500/20",
    green:  "bg-green-500/5  border-green-500/20",
    amber:  "bg-amber-500/5  border-amber-500/20",
    blue:   "bg-blue-500/5   border-blue-500/20",
  }
  return (
    <div className={`rounded-2xl border p-4 ${glowMap[glow]}`}>
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-slate-500">{label}</span></div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

// ── FilterSelect ──────────────────────────────────────────────────────────────

function FilterSelect({
  value, onChange, options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-slate-900">
          {o.label}
        </option>
      ))}
    </select>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
        <BarChart3 className="w-8 h-8 text-slate-600" />
      </div>
      <p className="text-white font-medium">
        {hasFilters ? "No transactions match your filters" : "No transactions yet"}
      </p>
      <p className="text-sm text-slate-500 mt-1">
        {hasFilters ? "Try adjusting your search or filter criteria" : "Your payment history will appear here"}
      </p>
    </div>
  )
}
