"use client"

import { Shield, Lock, Code } from "lucide-react"
import { EthereumIcon, BitcoinIcon, SolanaIcon, TronIcon, PolygonIcon, BnbIcon } from "@/components/icons/chain-icons"

const networks = [
  { name: "Ethereum", Icon: EthereumIcon, glow: "shadow-blue-500/20",   border: "border-blue-500/20",   desc: "ERC-20 & Native ETH"     },
  { name: "Bitcoin",  Icon: BitcoinIcon,  glow: "shadow-orange-500/20", border: "border-orange-500/20", desc: "Native BTC payments"      },
  { name: "Solana",   Icon: SolanaIcon,   glow: "shadow-purple-500/20", border: "border-purple-500/20", desc: "SPL tokens & SOL"         },
  { name: "Tron",     Icon: TronIcon,     glow: "shadow-red-500/20",    border: "border-red-500/20",    desc: "TRC-20 & TRX"             },
  { name: "Polygon",  Icon: PolygonIcon,  glow: "shadow-violet-500/20", border: "border-violet-500/20", desc: "MATIC & Polygon tokens"   },
  { name: "BNB Chain",Icon: BnbIcon,      glow: "shadow-yellow-500/20", border: "border-yellow-500/20", desc: "BEP-20 & BNB"             },
]

const trustPoints = [
  {
    icon: Lock,
    title: "Non-Custodial",
    desc: "You never hold private keys. Funds go directly to your wallet.",
  },
  {
    icon: Code,
    title: "Open Source",
    desc: "Fully auditable codebase. No black boxes, no surprises.",
  },
  {
    icon: Shield,
    title: "WalletConnect v2",
    desc: "Industry-standard encrypted pairing protocol for all connections.",
  },
]

export function WalletConnectSection() {
  return (
    <section className="py-24 bg-slate-900/50 dark:bg-slate-900/30 relative overflow-hidden">
      {/* Separator lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-green-300 tracking-wide uppercase">All Networks Live</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Every Major Network.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              One Interface.
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Connect your preferred wallet from the navbar and start accepting payments on any supported chain instantly.
          </p>
        </div>

        {/* Network Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {networks.map((network) => (
            <div
              key={network.name}
              className={`group relative bg-slate-900/80 border ${network.border} rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-lg ${network.glow} hover:-translate-y-1 cursor-default`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-slate-800 group-hover:scale-110 transition-transform duration-200">
                <network.Icon size={32} />
              </div>
              <p className="text-sm font-semibold text-white mb-1">{network.name}</p>
              <p className="text-xs text-slate-500">{network.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="grid md:grid-cols-3 gap-6">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="flex items-start gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
            >
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <point.icon className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{point.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
