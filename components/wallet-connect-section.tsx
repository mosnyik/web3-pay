"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Globe } from "lucide-react"

export function WalletConnectSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Multi-Chain Wallet Support</h2>
          <p className="text-lg text-muted-foreground">
            Connect your wallet using the button in the navigation bar above
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Secure Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bank-grade security with encrypted wallet connections and secure transaction processing
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Instant wallet connections with real-time balance updates and transaction confirmations
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Multi-Chain</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Support for Ethereum, Bitcoin, Solana, Tron, and other major blockchain networks
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
