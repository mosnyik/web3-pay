import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Web3 Payment Gateway</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Accept Crypto
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Payments
            </span>
            <br />
            Across All Chains
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Complete Web3 payment solution with multi-chain wallet support, real-time tracking, and seamless checkout
            experience for your customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/checkout">
              <Button size="lg" className="text-lg px-8 py-6">
                Try Demo Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/transactions">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Transactions
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-sm text-muted-foreground">Advanced encryption and secure wallet connections</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Instant transactions with real-time confirmations</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Multi-Chain Support</h3>
              <p className="text-sm text-muted-foreground">ETH, BTC, SOL, TRON, and more blockchain networks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
