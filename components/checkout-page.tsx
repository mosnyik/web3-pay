"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TokenSelector } from "@/components/token-selector"
import { PaymentModal } from "@/components/payment-modal"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/lib/wallet/wallet-context"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Premium NFT Collection",
    price: 0.5,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    name: "Digital Art License",
    price: 0.25,
    quantity: 2,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "3",
    name: "Web3 Course Access",
    price: 0.1,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [selectedToken, setSelectedToken] = useState<any>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const { activeAdapter, account } = useWallet()

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const fees = subtotal * 0.025 // 2.5% processing fee
  const total = subtotal + fees

  const handlePayment = () => {
    if (!selectedToken) {
      alert("Please select a payment token")
      return
    }
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (transactionId: string) => {
    setIsPaymentModalOpen(false)
    router.push(`/payment-status/${transactionId}`)
  }

  useEffect(() => {
    // If a wallet is connected, try to select a token from that wallet
    if (activeAdapter && account) {
      // Find a token that matches the connected wallet network
      const tokens = [
        { symbol: "ETH", name: "Ethereum", balance: "0.00", color: "bg-blue-500", icon: "E" },
        { symbol: "USDC", name: "USD Coin", balance: "0.00", color: "bg-green-500", icon: "U" },
        { symbol: "USDT", name: "Tether", balance: "0.00", color: "bg-green-500", icon: "T" },
        { symbol: "DAI", name: "Dai", balance: "0.00", color: "bg-yellow-500", icon: "D" },
        { symbol: "BTC", name: "Bitcoin", balance: "0.00", color: "bg-orange-500", icon: "B" },
        { symbol: "SOL", name: "Solana", balance: "0.00", color: "bg-purple-500", icon: "S" },
        { symbol: "TRX", name: "Tron", balance: "0.00", color: "bg-red-500", icon: "T" },
      ]
      const networkTokens = tokens.filter((token) => {
        if (activeAdapter.id === "ethereum" && ["ETH", "USDC", "USDT", "DAI"].includes(token.symbol)) return true
        if (activeAdapter.id === "bitcoin" && token.symbol === "BTC") return true
        if (activeAdapter.id === "solana" && ["SOL", "USDC"].includes(token.symbol)) return true
        if (activeAdapter.id === "tron" && ["TRX", "USDT"].includes(token.symbol)) return true
        return false
      })

      if (networkTokens.length > 0) {
        setSelectedToken(networkTokens[0])
      }
    }
  }, [activeAdapter, account])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Review your order and complete payment</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart Items ({cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.price} ETH each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{(item.price * item.quantity).toFixed(3)} ETH</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Token Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Token</CardTitle>
            </CardHeader>
            <CardContent>
              <TokenSelector onTokenSelect={setSelectedToken} selectedToken={selectedToken} />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(3)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee (2.5%)</span>
                <span>{fees.toFixed(6)} ETH</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{total.toFixed(3)} ETH</span>
              </div>

              {selectedToken && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Paying with</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 ${selectedToken.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {selectedToken.icon}
                    </div>
                    <span className="font-medium">{selectedToken.symbol}</span>
                    <Badge variant="secondary">{selectedToken.balance}</Badge>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={!selectedToken || cartItems.length === 0}
              >
                Complete Payment
              </Button>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your payment is secured by blockchain technology and encrypted end-to-end.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        token={selectedToken}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
