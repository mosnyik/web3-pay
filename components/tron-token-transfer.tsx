"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/lib/wallet/wallet-context"
import { TRC20_TOKENS } from "@/lib/wallet/tron/trc20-tokens"
import type { TokenBalance } from "@/lib/wallet/tron/trc20-helper"

export function TronTokenTransfer() {
  const { activeAdapter } = useWallet()
  const { toast } = useToast()

  const [selectedToken, setSelectedToken] = useState<string>("USDT")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])

  // Get token balances when component mounts or when adapter changes
  const refreshBalances = async () => {
    if (!activeAdapter || activeAdapter.id !== "tron") {
      return
    }

    try {
      // Cast to TronAdapter to access token methods
      const tronAdapter = activeAdapter as any
      if (tronAdapter.fetchTokenBalances) {
        const balances = await tronAdapter.fetchTokenBalances()
        setTokenBalances(balances)
      }
    } catch (err) {
      console.error("Failed to fetch token balances:", err)
    }
  }

  const handleTransfer = async () => {
    if (!activeAdapter || activeAdapter.id !== "tron") {
      toast({
        title: "Error",
        description: "Tron wallet not connected",
        variant: "destructive",
      })
      return
    }

    if (!recipient || !amount || !selectedToken) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Validate Tron address (basic check)
    if (!recipient.startsWith("T") || recipient.length !== 34) {
      toast({
        title: "Error",
        description: "Invalid Tron address",
        variant: "destructive",
      })
      return
    }

    // Validate amount
    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Invalid amount",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Cast to TronAdapter to access token methods
      const tronAdapter = activeAdapter as any
      if (tronAdapter.transferToken) {
        const result = await tronAdapter.transferToken(selectedToken, recipient, amount)

        if (result.success) {
          toast({
            title: "Success",
            description: `Successfully transferred ${amount} ${selectedToken} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
          })

          // Clear form
          setAmount("")

          // Refresh balances
          refreshBalances()
        } else {
          toast({
            title: "Transaction Failed",
            description: result.error || "Unknown error",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Token transfer not supported by this wallet",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Transfer error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transfer tokens",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Find the selected token balance
  const selectedTokenBalance = tokenBalances.find((tb) => tb.token.symbol === selectedToken)

  if (!activeAdapter || activeAdapter.id !== "tron") {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer TRC-20 Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Token</Label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TRC20_TOKENS).map(([symbol, token]) => (
                <SelectItem key={symbol} value={symbol}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 ${token.color} rounded-full flex items-center justify-center text-white text-[10px]`}
                    >
                      {token.logo || symbol.charAt(0)}
                    </div>
                    <span>{symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTokenBalance && (
            <p className="text-xs text-muted-foreground mt-1">Available: {selectedTokenBalance.formattedBalance}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="Tron address starting with T..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {selectedTokenBalance && (
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Available: {selectedTokenBalance.formattedBalance}</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => {
                  // Set max amount (remove token symbol from the formatted balance)
                  const maxAmount = selectedTokenBalance.formattedBalance.split(" ")[0]
                  setAmount(maxAmount)
                }}
              >
                Max
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleTransfer} disabled={isLoading}>
          {isLoading ? "Processing..." : `Send ${selectedToken}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
