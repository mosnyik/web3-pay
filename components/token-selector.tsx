"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface Token {
  id: string
  name: string
  symbol: string
  icon: string
  color: string
  balance: string
  usdValue: string
  network: string
}

const tokens: Token[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    icon: "⟠",
    color: "bg-blue-500",
    balance: "2.45 ETH",
    usdValue: "$4,890.00",
    network: "Ethereum",
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    icon: "$",
    color: "bg-blue-600",
    balance: "1,250.00 USDC",
    usdValue: "$1,250.00",
    network: "Ethereum",
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    color: "bg-orange-500",
    balance: "0.15 BTC",
    usdValue: "$6,750.00",
    network: "Bitcoin",
  },
  {
    id: "trx",
    name: "Tron",
    symbol: "TRX",
    icon: "⚡",
    color: "bg-red-500",
    balance: "5,000 TRX",
    usdValue: "$750.00",
    network: "Tron",
  },
]

interface TokenSelectorProps {
  onTokenSelect: (token: Token) => void
  selectedToken: Token | null
}

export function TokenSelector({ onTokenSelect, selectedToken }: TokenSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tokens.map((token) => (
        <Card
          key={token.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedToken?.id === token.id ? "border-primary shadow-md" : "hover:border-primary/50"
          }`}
          onClick={() => onTokenSelect(token)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${token.color} rounded-full flex items-center justify-center text-white font-bold`}
                >
                  {token.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{token.symbol}</span>
                    <Badge variant="outline" className="text-xs">
                      {token.network}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium">{token.balance}</p>
                <p className="text-sm text-muted-foreground">{token.usdValue}</p>
              </div>

              {selectedToken?.id === token.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
