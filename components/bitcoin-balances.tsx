"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { useWallet } from "@/lib/wallet/wallet-context"

interface UTXOData {
  txid: string
  vout: number
  value: number
  confirmations: number
  scriptType: string
}

export function BitcoinBalances() {
  const { activeAdapter, account } = useWallet()
  const [balance, setBalance] = useState<string | null>(null)
  const [utxos, setUtxos] = useState<UTXOData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = async () => {
    if (!activeAdapter || activeAdapter.id !== "bitcoin" || !account) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, we would fetch real Bitcoin balance and UTXOs
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setBalance(account.balance || "0.05 BTC")

        // Mock UTXOs
        setUtxos([
          {
            txid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
            vout: 0,
            value: 0.03,
            confirmations: 6,
            scriptType: "p2wpkh",
          },
          {
            txid: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
            vout: 1,
            value: 0.02,
            confirmations: 12,
            scriptType: "p2wpkh",
          },
        ])

        setIsLoading(false)
      }, 1000)
    } catch (err) {
      console.error("Failed to fetch Bitcoin data:", err)
      setError("Failed to load Bitcoin data")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeAdapter?.id === "bitcoin" && account) {
      fetchBalances()
    } else {
      setBalance(null)
      setUtxos([])
    }
  }, [activeAdapter, account])

  if (!activeAdapter || activeAdapter.id !== "bitcoin" || !account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bitcoin Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">Connect a Bitcoin wallet to view your balance</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bitcoin Balance</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchBalances} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : balance ? (
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{balance}</div>
              <div className="text-muted-foreground">≈ ${Number.parseFloat(balance.split(" ")[0]) * 45000} USD</div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No balance information available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>UTXOs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : utxos.length > 0 ? (
            <div className="space-y-3">
              {utxos.map((utxo, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">TXID</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">{utxo.txid}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Value</span>
                    <span>{utxo.value} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Confirmations</span>
                    <Badge variant={utxo.confirmations >= 6 ? "outline" : "secondary"}>{utxo.confirmations}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No UTXOs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
