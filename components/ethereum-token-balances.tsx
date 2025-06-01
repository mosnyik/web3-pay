"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Plus } from "lucide-react"
import { useWallet } from "@/lib/wallet/wallet-context"

interface TokenBalance {
  symbol: string
  name: string
  balance: string
  formattedBalance: string
  usdValue?: string
  icon?: string
  color?: string
}

// Mock token data for Ethereum
const mockEthTokens: TokenBalance[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "1.25",
    formattedBalance: "1.25 ETH",
    usdValue: "$2,500.00",
    icon: "⟠",
    color: "bg-blue-500",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "500",
    formattedBalance: "500 USDC",
    usdValue: "$500.00",
    icon: "$",
    color: "bg-blue-600",
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: "750",
    formattedBalance: "750 USDT",
    usdValue: "$750.00",
    icon: "₮",
    color: "bg-green-500",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    balance: "0.05",
    formattedBalance: "0.05 WBTC",
    usdValue: "$2,250.00",
    icon: "₿",
    color: "bg-orange-500",
  },
]

export function EthereumTokenBalances() {
  const { activeAdapter, account } = useWallet()
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = async () => {
    if (!activeAdapter || activeAdapter.id !== "ethereum" || !account) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, we would fetch real token balances
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setTokenBalances(mockEthTokens)
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      console.error("Failed to fetch token balances:", err)
      setError("Failed to load token balances")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeAdapter?.id === "ethereum" && account) {
      fetchBalances()
    } else {
      setTokenBalances([])
    }
  }, [activeAdapter, account])

  if (!activeAdapter || activeAdapter.id !== "ethereum" || !account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ethereum Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">Connect an Ethereum wallet to view your tokens</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ethereum Tokens</CardTitle>
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
              <div key={item.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 ${item.color || "bg-gray-500"} rounded-full flex items-center justify-center text-white text-sm`}
                  >
                    {item.icon || item.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{item.symbol}</div>
                    <div className="text-xs text-muted-foreground">{item.name}</div>
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
            <p className="text-muted-foreground mb-4">No tokens found in this wallet</p>
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
