"use client"

import { Check, Wallet } from "lucide-react"
import { EthereumIcon, BitcoinIcon, SolanaIcon, TronIcon } from "@/components/icons/chain-icons"
import { useWallet } from "@/lib/wallet/wallet-context"
import { isChainEnabled } from "@/lib/config/app"

export interface Token {
  id: string
  name: string
  symbol: string
  network: string
  balance: string
  usdValue: string
  Icon: React.ComponentType<{ size?: number }>
  borderColor: string
  glowColor: string
  adapterId: string
}

const ALL_TOKENS: Token[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum",
    balance: "—",
    usdValue: "—",
    Icon: EthereumIcon,
    borderColor: "border-blue-500/40",
    glowColor: "shadow-blue-500/10",
    adapterId: "ethereum",
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    network: "Ethereum",
    balance: "—",
    usdValue: "—",
    Icon: EthereumIcon,
    borderColor: "border-blue-400/40",
    glowColor: "shadow-blue-400/10",
    adapterId: "ethereum",
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin",
    balance: "—",
    usdValue: "—",
    Icon: BitcoinIcon,
    borderColor: "border-orange-500/40",
    glowColor: "shadow-orange-500/10",
    adapterId: "bitcoin",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    network: "Solana",
    balance: "—",
    usdValue: "—",
    Icon: SolanaIcon,
    borderColor: "border-purple-500/40",
    glowColor: "shadow-purple-500/10",
    adapterId: "solana",
  },
  {
    id: "trx",
    name: "Tron",
    symbol: "TRX",
    network: "Tron",
    balance: "—",
    usdValue: "—",
    Icon: TronIcon,
    borderColor: "border-red-500/40",
    glowColor: "shadow-red-500/10",
    adapterId: "tron",
  },
]

interface TokenSelectorProps {
  onTokenSelect: (token: Token) => void
  selectedToken: Token | null
}

export function TokenSelector({ onTokenSelect, selectedToken }: TokenSelectorProps) {
  const { account, activeAdapter } = useWallet()

  // Only show tokens for chains that have a merchant address configured
  const enabledTokens = ALL_TOKENS.filter((t) => isChainEnabled(t.adapterId))

  const tokens = enabledTokens.map((t) => {
    if (activeAdapter?.id === t.adapterId && account?.balance) {
      return { ...t, balance: account.balance }
    }
    return t
  })

  const connectedTokens = tokens.filter((t) => t.adapterId === activeAdapter?.id)
  const otherTokens = tokens.filter((t) => t.adapterId !== activeAdapter?.id)
  const orderedTokens = [...connectedTokens, ...otherTokens]

  return (
    <div className="space-y-3">
      {!activeAdapter && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 text-sm text-slate-400">
          <Wallet className="w-4 h-4 text-violet-400 shrink-0" />
          Connect a wallet to see your live balances
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {orderedTokens.map((token) => {
          const isSelected = selectedToken?.id === token.id
          const isConnectedNetwork = activeAdapter?.id === token.adapterId

          return (
            <button
              key={token.id}
              type="button"
              onClick={() => onTokenSelect(token)}
              className={`
                relative w-full text-left p-4 rounded-2xl border transition-all duration-200
                min-h-[72px] cursor-pointer group
                ${isSelected
                  ? `${token.borderColor} bg-slate-800/80 shadow-lg ${token.glowColor}`
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="shrink-0">
                  <token.Icon size={36} />
                </div>

                {/* Name + network */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-sm">{token.symbol}</span>
                    {isConnectedNetwork && (
                      <span className="text-[10px] font-medium text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-1.5 py-0.5">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{token.name}</p>
                </div>

                {/* Balance */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-white">{token.balance}</p>
                  <p className="text-xs text-slate-500">{token.usdValue}</p>
                </div>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
