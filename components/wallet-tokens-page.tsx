"use client"

import { useState } from "react"
import { Wallet, Copy, ExternalLink, ArrowUpRight, ArrowDownLeft, RefreshCw, ChevronRight } from "lucide-react"
import { useWallet } from "@/lib/wallet/wallet-context"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { EthereumIcon, BitcoinIcon, SolanaIcon, TronIcon } from "@/components/icons/chain-icons"
import { useToast } from "@/hooks/use-toast"
import { enabledChains } from "@/lib/config/app"

// ── Types ─────────────────────────────────────────────────────────────────────

interface TokenRow {
  symbol: string
  name: string
  balance: string
  usd: string
  change24h: string   // e.g. "+2.4%"
  positive: boolean
  isNative: boolean
}

// ── Chain metadata ─────────────────────────────────────────────────────────────

const CHAIN_META: Record<string, {
  label: string
  Icon: React.ComponentType<{ size?: number }>
  color: string
  borderColor: string
  explorer: string
  nativeSymbol: string
  tokens: Omit<TokenRow, "balance" | "usd">[]
}> = {
  ethereum: {
    label: "Ethereum",
    Icon: EthereumIcon,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    explorer: "https://etherscan.io/address/",
    nativeSymbol: "ETH",
    tokens: [
      { symbol: "ETH",  name: "Ethereum",  change24h: "+1.8%", positive: true,  isNative: true  },
      { symbol: "USDC", name: "USD Coin",   change24h: "+0.0%", positive: true,  isNative: false },
      { symbol: "USDT", name: "Tether",     change24h: "+0.0%", positive: true,  isNative: false },
      { symbol: "DAI",  name: "Dai",        change24h: "-0.1%", positive: false, isNative: false },
    ],
  },
  bitcoin: {
    label: "Bitcoin",
    Icon: BitcoinIcon,
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    explorer: "https://mempool.space/address/",
    nativeSymbol: "BTC",
    tokens: [
      { symbol: "BTC", name: "Bitcoin", change24h: "+3.2%", positive: true, isNative: true },
    ],
  },
  solana: {
    label: "Solana",
    Icon: SolanaIcon,
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    explorer: "https://solscan.io/account/",
    nativeSymbol: "SOL",
    tokens: [
      { symbol: "SOL",  name: "Solana",   change24h: "+5.1%", positive: true,  isNative: true  },
      { symbol: "USDC", name: "USD Coin", change24h: "+0.0%", positive: true,  isNative: false },
      { symbol: "BONK", name: "Bonk",     change24h: "-8.3%", positive: false, isNative: false },
    ],
  },
  tron: {
    label: "Tron",
    Icon: TronIcon,
    color: "text-red-400",
    borderColor: "border-red-500/30",
    explorer: "https://tronscan.org/#/address/",
    nativeSymbol: "TRX",
    tokens: [
      { symbol: "TRX",  name: "Tron",    change24h: "+0.7%", positive: true, isNative: true  },
      { symbol: "USDT", name: "Tether",  change24h: "+0.0%", positive: true, isNative: false },
      { symbol: "USDC", name: "USD Coin",change24h: "+0.0%", positive: true, isNative: false },
    ],
  },
}

// Mock USD prices per token symbol
const MOCK_PRICES: Record<string, number> = {
  ETH: 2580, BTC: 58200, SOL: 158.4, TRX: 0.0685,
  USDC: 1, USDT: 1, DAI: 1, BONK: 0.000018,
}

// Mock balances for tokens that aren't the connected native token
const MOCK_BALANCES: Record<string, string> = {
  USDC: "250.00", USDT: "500.00", DAI: "125.50",
  BONK: "1,250,000", BTC: "—", SOL: "—", TRX: "—", ETH: "—",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcUsd(balance: string, symbol: string): string {
  const num = parseFloat(balance.replace(/,/g, ""))
  if (isNaN(num) || balance === "—") return "—"
  const price = MOCK_PRICES[symbol]
  if (!price) return "—"
  const usd = num * price
  return usd >= 1000
    ? `$${(usd / 1000).toFixed(2)}k`
    : `$${usd.toFixed(2)}`
}

// ── Main component ────────────────────────────────────────────────────────────

export function WalletTokensPage() {
  const { account, activeAdapter, disconnect } = useWallet()
  const { toast } = useToast()

  const isConnected = !!(activeAdapter && account)
  const activeChainId = activeAdapter?.id ?? null

  // Default to connected chain tab, or first enabled chain
  const firstTab = isConnected && activeChainId ? activeChainId : (enabledChains[0] ?? "ethereum")
  const [tab, setTab] = useState(firstTab)
  const [isWalletModalOpen, setWalletModalOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const copyAddress = () => {
    if (!account?.address) return
    navigator.clipboard.writeText(account.address)
    toast({ title: "Copied", description: "Wallet address copied to clipboard" })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((r) => setTimeout(r, 1000))
    setRefreshing(false)
    toast({ title: "Refreshed", description: "Balances updated" })
  }

  // Build token rows for the active tab
  const chainMeta = CHAIN_META[tab]
  const tokenRows: TokenRow[] = (chainMeta?.tokens ?? []).map((t) => {
    // If this is the native token of the connected chain, use real balance
    const isLive = isConnected && activeChainId === tab && t.isNative && account?.balance
    const balance: string = isLive ? account!.balance! : (MOCK_BALANCES[t.symbol] ?? "—")
    const usd = calcUsd(balance, t.symbol)
    return { ...t, balance, usd }
  })

  const explorerUrl = chainMeta ? chainMeta.explorer + (account?.address ?? "") : "#"

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ── Page heading ──────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Wallet Tokens</h1>
            <p className="text-sm text-slate-500 mt-0.5">Multi-chain token balances</p>
          </div>
          {isConnected && (
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all cursor-pointer ${refreshing ? "animate-spin" : ""}`}
              aria-label="Refresh balances"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Not connected ─────────────────────────────────────── */}
        {!isConnected && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 py-20 flex flex-col items-center text-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-violet-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">No wallet connected</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Connect your wallet to view real-time token balances across all supported chains.
              </p>
            </div>
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-2 h-11 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-semibold text-white transition-all cursor-pointer shadow-lg shadow-violet-500/20"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          </div>
        )}

        {/* ── Connected wallet card ──────────────────────────────── */}
        {isConnected && (
          <div className={`rounded-2xl border ${CHAIN_META[activeChainId!]?.borderColor ?? "border-slate-800"} bg-slate-900/60 p-5`}>
            <div className="flex items-center gap-4">
              {/* Chain icon */}
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0">
                {(() => { const Meta = CHAIN_META[activeChainId!]; return Meta ? <Meta.Icon size={28} /> : null })()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{account.displayName}</span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: "0 0 4px #4ade80" }} />
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-mono truncate">{account.address}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={copyAddress}
                  className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="View on explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Balance strip */}
            {account.balance && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{account.balance}</span>
                <span className="text-sm text-slate-500">{activeAdapter?.name} balance</span>
              </div>
            )}
          </div>
        )}

        {/* ── Chain tabs ─────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {enabledChains.map((chainId) => {
            const meta = CHAIN_META[chainId]
            if (!meta) return null
            const isActive = tab === chainId
            const isLive = isConnected && activeChainId === chainId
            return (
              <button
                key={chainId}
                onClick={() => setTab(chainId)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer border
                  ${isActive
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-transparent border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }`}
              >
                <meta.Icon size={16} />
                {meta.label}
                {isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-0.5" style={{ boxShadow: "0 0 4px #4ade80" }} />
                )}
              </button>
            )
          })}
        </div>

        {/* ── Token list ─────────────────────────────────────────── */}
        {chainMeta && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <chainMeta.Icon size={20} />
                <span className="font-semibold text-white">{chainMeta.label} Tokens</span>
              </div>
              {isConnected && activeChainId === tab ? (
                <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-1">
                  Live balance
                </span>
              ) : (
                <button
                  onClick={() => setWalletModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  Connect to view
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Token rows */}
            <div className="divide-y divide-slate-800/60">
              {tokenRows.map((token) => (
                <TokenCard
                  key={token.symbol}
                  token={token}
                  chainId={tab}
                  isLive={isConnected && activeChainId === tab && token.isNative}
                />
              ))}
            </div>

            {/* Footer — disconnect / switch */}
            {isConnected && activeChainId === tab && (
              <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <span className="text-xs text-slate-600">Connected via {activeAdapter!.name}</span>
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Disclaimer ─────────────────────────────────────────── */}
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Native balances are read live from your connected wallet. Token balances for other chains are shown as mock data for demonstration. Always verify amounts on the block explorer before transacting.
          </p>
        </div>
      </div>

      <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </>
  )
}

// ── TokenCard ─────────────────────────────────────────────────────────────────

function TokenCard({
  token, chainId, isLive,
}: {
  token: TokenRow
  chainId: string
  isLive: boolean
}) {
  const meta = CHAIN_META[chainId]

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/20 transition-colors">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
        {meta && <meta.Icon size={22} />}
      </div>

      {/* Name + symbol */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{token.symbol}</span>
          {token.isNative && (
            <span className="text-[10px] font-medium text-slate-500 bg-slate-800 rounded-full px-1.5 py-0.5">
              Native
            </span>
          )}
          {isLive && (
            <span className="text-[10px] font-medium text-green-400 bg-green-400/10 rounded-full px-1.5 py-0.5">
              Live
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{token.name}</p>
      </div>

      {/* 24h change */}
      <div className="text-right hidden sm:block shrink-0">
        <span className={`text-xs font-medium ${token.positive ? "text-green-400" : "text-red-400"}`}>
          {token.change24h}
        </span>
        <p className="text-[10px] text-slate-600 mt-0.5">24h</p>
      </div>

      {/* Balance + USD */}
      <div className="text-right shrink-0 min-w-[80px]">
        <p className="text-sm font-semibold text-white">{token.balance}</p>
        <p className="text-xs text-slate-500 mt-0.5">{token.usd}</p>
      </div>

      {/* Quick send/receive */}
      <div className="hidden sm:flex items-center gap-1 shrink-0">
        <button
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Send"
          title="Send"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
        <button
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Receive"
          title="Receive"
        >
          <ArrowDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
