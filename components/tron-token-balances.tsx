"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Plus } from "lucide-react"
import { useWallet } from "@/lib/wallet/wallet-context"
import type { TokenBalance } from "@/lib/wallet/tron/trc20-helper"

export function TronTokenBalances() {
  const { activeAdapter, account } = useWallet()
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = async () => {
    if (!activeAdapter || activeAdapter.id !== "tron" || !account) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Cast to TronAdapter to access token methods
      const tronAdapter = activeAdapter as any
      if (tronAdapter.fetchTokenBalances) {
        const balances = await tronAdapter.fetchTokenBalances()
        setTokenBalances(balances)
      }
    } catch (err) {
      console.error("Failed to fetch token balances:", err)
      setError("Failed to load token balances")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeAdapter?.id === "tron" && account) {
      fetchBalances()
    } else {
      setTokenBalances([])
    }
  }, [activeAdapter, account])

  if (!activeAdapter || activeAdapter.id !== "tron" || !account) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>TRC-20 Tokens</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchBalances} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : tokenBalances.length > 0 ? (
          <div className="space-y-3">
            {tokenBalances.map((item) => (
              <div key={item.token.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 ${item.token.color || "bg-gray-500"} rounded-full flex items-center justify-center text-white text-sm`}
                  >
                    {item.token.logo || item.token.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{item.token.symbol}</div>
                    <div className="text-xs text-muted-foreground">{item.token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.formattedBalance}</div>
                  {item.usdValue && <div className="text-xs text-muted-foreground">{item.usdValue}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No TRC-20 tokens found in this wallet</p>
            <Button variant="outline" size="sm" onClick={fetchBalances}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Balances
            </Button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Token
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
