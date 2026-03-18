"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { EthereumIcon, BitcoinIcon, SolanaIcon, TronIcon, PolygonIcon, BnbIcon } from "@/components/icons/chain-icons"

const stats = [
  { value: "300+", label: "Wallets Supported" },
  { value: "6+", label: "Blockchain Networks" },
  { value: "<3s", label: "Avg Confirmation" },
  { value: "99.9%", label: "Uptime SLA" },
]

const chains = [
  { name: "Ethereum", border: "border-blue-500/30",   Icon: EthereumIcon },
  { name: "Bitcoin",  border: "border-orange-500/30", Icon: BitcoinIcon  },
  { name: "Solana",   border: "border-purple-500/30", Icon: SolanaIcon   },
  { name: "Tron",     border: "border-red-500/30",    Icon: TronIcon     },
  { name: "Polygon",  border: "border-violet-500/30", Icon: PolygonIcon  },
  { name: "BNB Chain",border: "border-yellow-500/30", Icon: BnbIcon      },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center py-20 lg:py-32 bg-slate-950 dark:bg-[#060B18]">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-8">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-sm font-medium text-violet-300 tracking-wide">Web3 Payment Gateway</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Accept{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Crypto
              </span>
              <br />
              Payments
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-slate-300">
                Across All Chains
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Complete Web3 payment solution with multi-chain wallet support, real-time tracking, and a seamless checkout experience your customers will love.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link href="/checkout">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 border-0 shadow-lg shadow-violet-500/25 transition-all duration-200 cursor-pointer"
                >
                  Try Demo Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/transactions">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  View Transactions
                </Button>
              </Link>
            </div>

            {/* Chain badges */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {chains.map((chain) => (
                <span
                  key={chain.name}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${chain.border} bg-slate-900/60 text-xs font-medium text-slate-300 cursor-default`}
                >
                  <chain.Icon size={14} />
                  {chain.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Floating payment card */}
          <div className="flex-1 flex justify-center lg:justify-end animate-float">
            <div className="relative w-full max-w-sm">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-blue-600/30 rounded-3xl blur-2xl scale-110" />

              {/* Main card */}
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Payment Request</p>
                    <p className="text-2xl font-bold text-white font-display">$249.00</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Token row */}
                <div className="space-y-3 mb-6">
                  {[
                    { token: "ETH",  amount: "0.0847",  usd: "$249.00", Icon: EthereumIcon, selected: true  },
                    { token: "USDC", amount: "249.00",  usd: "$249.00", Icon: SolanaIcon,   selected: false },
                    { token: "BTC",  amount: "0.00401", usd: "$249.00", Icon: BitcoinIcon,  selected: false },
                  ].map((t) => (
                    <div
                      key={t.token}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        t.selected
                          ? "border-violet-500/50 bg-violet-500/10"
                          : "border-slate-700/50 bg-slate-800/40"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <t.Icon size={28} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{t.token}</p>
                        <p className="text-xs text-slate-400">{t.amount}</p>
                      </div>
                      <p className="text-xs text-slate-400">{t.usd}</p>
                      {t.selected && (
                        <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pay button */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl py-3.5 text-center">
                  <p className="text-white font-semibold text-sm">Pay 0.0847 ETH</p>
                </div>

                {/* Security badge */}
                <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  Secured by WalletConnect
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-800">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900/60 backdrop-blur-sm px-6 py-6 text-center hover:bg-slate-800/60 transition-colors duration-200"
            >
              <p className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
