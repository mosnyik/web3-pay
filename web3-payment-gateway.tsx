"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronRight, Check, Zap, Shield, Globe } from "lucide-react"

interface Network {
  id: string
  name: string
  symbol: string
  icon: string
  color: string
  description: string
  isTestnet?: boolean
}

const networks: Network[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "⟠",
    color: "bg-blue-500",
    description: "The world's programmable blockchain",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    color: "bg-orange-500",
    description: "Digital gold and store of value",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    color: "bg-purple-500",
    description: "Fast, secure, and censorship resistant",
  },
  {
    id: "tron",
    name: "Tron",
    symbol: "TRX",
    icon: "⚡",
    color: "bg-red-500",
    description: "Decentralized entertainment ecosystem",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    icon: "⬟",
    color: "bg-violet-500",
    description: "Ethereum's internet of blockchains",
  },
  {
    id: "binance",
    name: "BNB Chain",
    symbol: "BNB",
    icon: "◆",
    color: "bg-yellow-500",
    description: "Build N Build - High performance blockchain",
  },
]

export default function Web3PaymentGateway() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleNetworkSelect = async (network: Network) => {
    setSelectedNetwork(network)
    setIsConnecting(true)

    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnecting(false)
    setIsConnected(true)
    setIsOpen(false)

    // Reset after demo
    setTimeout(() => {
      setIsConnected(false)
      setSelectedNetwork(null)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/80">Web3 Payment Gateway</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Connect Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Wallet</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Seamlessly connect to multiple blockchain networks and manage your digital assets with our secure payment
            gateway.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Multi-Chain Wallet Connection</h2>
              <p className="text-white/60">Choose your preferred blockchain network to get started</p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">Secure</div>
                  <div className="text-xs text-white/60">Bank-grade security</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm font-medium text-white">Fast</div>
                  <div className="text-xs text-white/60">Instant transactions</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <Globe className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">Global</div>
                  <div className="text-xs text-white/60">Worldwide access</div>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <div className="text-center">
              {isConnected && selectedNetwork ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Connected to {selectedNetwork.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Wallet Connected
                  </Badge>
                </div>
              ) : (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl bg-slate-900/95 backdrop-blur-md border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-center">Select Network</DialogTitle>
                      <DialogDescription className="text-center text-white/70">
                        Choose a blockchain network to connect your wallet
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {networks.map((network) => (
                        <Card
                          key={network.id}
                          className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                          onClick={() => handleNetworkSelect(network)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 ${network.color} rounded-full flex items-center justify-center text-white text-xl font-bold`}
                              >
                                {network.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-white">{network.name}</h3>
                                  <Badge variant="outline" className="text-xs border-white/30 text-white/70">
                                    {network.symbol}
                                  </Badge>
                                </div>
                                <p className="text-sm text-white/60">{network.description}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                            </div>

                            {isConnecting && selectedNetwork?.id === network.id && (
                              <div className="mt-4 flex items-center gap-2 text-blue-400">
                                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm">Connecting...</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-400 mb-1">Security Notice</h4>
                          <p className="text-sm text-white/70">
                            Make sure you're connecting to the official wallet extension. Never share your private keys
                            or seed phrase.
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-white/50 text-sm">
          <p>Powered by Web3 Payment Gateway • Secure • Decentralized • Global</p>
        </div>
      </div>
    </div>
  )
}
