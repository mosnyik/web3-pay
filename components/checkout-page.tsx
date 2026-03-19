"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, ShoppingCart, Shield, Zap, Lock, Wallet, ChevronRight, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/lib/wallet/wallet-context"
import { TokenSelector } from "@/components/token-selector"
import { PaymentModal } from "@/components/payment-modal"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import type { Token } from "@/components/token-selector"

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  gradient: string
  emoji: string
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Premium NFT Collection",
    description: "Genesis Series · 1 of 1",
    price: 0.5,
    quantity: 1,
    gradient: "from-violet-600 to-purple-700",
    emoji: "🖼",
  },
  {
    id: "2",
    name: "Digital Art License",
    description: "Commercial use · Lifetime",
    price: 0.25,
    quantity: 2,
    gradient: "from-blue-600 to-cyan-600",
    emoji: "🎨",
  },
  {
    id: "3",
    name: "Web3 Course Access",
    description: "12 modules · Self-paced",
    price: 0.1,
    quantity: 1,
    gradient: "from-emerald-600 to-teal-600",
    emoji: "📚",
  },
]

export function CheckoutPage() {
  const router = useRouter()
  const { account, activeAdapter, disconnect } = useWallet()
  const isWalletConnected = !!(activeAdapter && account)

  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const fee = subtotal * 0.025
  const total = subtotal + fee

  const handlePrimaryAction = () => {
    // Step 1: wallet must be connected
    if (!isWalletConnected) {
      setIsWalletModalOpen(true)
      return
    }
    // Step 2: token must be selected
    if (!selectedToken) {
      setTokenError(true)
      document.getElementById("token-selector")?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setTokenError(false)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (transactionId: string) => {
    setIsPaymentModalOpen(false)
    router.push(`/payment-status/${transactionId}`)
  }

  // Derive the button label for the primary CTA
  const ctaLabel = !isWalletConnected
    ? "Connect Wallet to Pay"
    : !selectedToken
      ? "Select a token above"
      : `Pay ${total.toFixed(4)} ${selectedToken.symbol}`

  const ctaIsWallet = !isWalletConnected

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6 pb-32 lg:pb-10">

          {/* Page heading */}
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Checkout</h1>
            <span className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-2 py-0.5">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="lg:grid lg:grid-cols-5 lg:gap-8 lg:items-start">

            {/* ── Left column ─────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-5">

              {/* Connected wallet pill — only visible when a wallet is connected */}
              {isWalletConnected && (
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-green-500/20 bg-green-500/5">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" style={{ boxShadow: "0 0 6px #4ade80" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Connected via {activeAdapter!.name}</p>
                    <p className="text-sm font-medium text-white truncate">{account!.displayAddress}</p>
                  </div>
                  {account!.balance && (
                    <span className="text-xs font-medium text-slate-400 shrink-0">{account!.balance}</span>
                  )}
                  <button
                    onClick={() => disconnect()}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer shrink-0"
                    aria-label="Disconnect wallet"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Cart Items */}
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  Your Order
                </h2>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
                  {cartItems.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                      <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Your cart is empty</p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4">
                        {/* Thumbnail */}
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl shrink-0`}
                        >
                          {item.emoji}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                          <p className="text-xs text-slate-400 mt-1">{item.price} ETH each</p>
                        </div>

                        {/* Quantity stepper */}
                        <div className="flex items-center gap-1 bg-slate-800 rounded-full px-1 py-1 shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, +1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price + remove */}
                        <div className="text-right shrink-0 min-w-[64px]">
                          <p className="text-sm font-semibold text-white">
                            {(item.price * item.quantity).toFixed(3)}
                          </p>
                          <p className="text-xs text-slate-500">ETH</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="mt-1 text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Token Selector — only show once wallet is connected */}
              <section id="token-selector">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  Pay With
                </h2>
                <div
                  className={`rounded-2xl border p-4 transition-colors ${
                    tokenError && !selectedToken
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  {tokenError && !selectedToken && (
                    <p className="text-xs text-red-400 mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      Please select a payment token to continue
                    </p>
                  )}
                  <TokenSelector
                    onTokenSelect={(t) => {
                      setSelectedToken(t)
                      setTokenError(false)
                    }}
                    selectedToken={selectedToken}
                  />
                </div>
              </section>

              {/* Trust badges — mobile only */}
              <div className="flex items-center justify-center gap-6 py-2 lg:hidden">
                <TrustBadge icon={<Shield className="w-3.5 h-3.5" />} label="Non-Custodial" />
                <TrustBadge icon={<Lock className="w-3.5 h-3.5" />} label="Encrypted" />
                <TrustBadge icon={<Zap className="w-3.5 h-3.5" />} label="Instant" />
              </div>
            </div>

            {/* ── Right column — Order Summary ──────────────────── */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  fee={fee}
                  total={total}
                  selectedToken={selectedToken}
                  isWalletConnected={isWalletConnected}
                  account={account}
                  activeAdapter={activeAdapter}
                  onPay={handlePrimaryAction}
                  onConnect={() => setIsWalletModalOpen(true)}
                  onDisconnect={disconnect}
                  ctaLabel={ctaLabel}
                  ctaIsWallet={ctaIsWallet}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile sticky bottom bar ──────────────────────────── */}
        <div className="fixed bottom-0 inset-x-0 z-20 lg:hidden">
          <div className="bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-4 pb-6 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500">
                  {isWalletConnected ? "Total due" : "Not connected"}
                </p>
                <p className="text-xl font-bold text-white">
                  {isWalletConnected ? (
                    <>
                      {total.toFixed(4)}
                      <span className="text-sm font-normal text-slate-400 ml-1">
                        {selectedToken?.symbol ?? "ETH"}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-500 text-base font-medium">Connect to see total</span>
                  )}
                </p>
              </div>
              {isWalletConnected && selectedToken && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full">
                  <selectedToken.Icon size={16} />
                  <span className="text-xs font-medium text-white">{selectedToken.symbol}</span>
                </div>
              )}
              {isWalletConnected && !selectedToken && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-green-400">{account?.displayAddress}</span>
                </div>
              )}
            </div>

            <ActionButton
              onClick={handlePrimaryAction}
              disabled={cartItems.length === 0}
              label={ctaLabel}
              isWallet={ctaIsWallet}
            />
          </div>
        </div>
      </div>

      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        lockedChainId={selectedToken?.adapterId}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        token={selectedToken}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-slate-500">
      <span className="text-green-500">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  )
}

function ActionButton({
  onClick,
  disabled,
  label,
  isWallet,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  isWallet: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 rounded-2xl font-semibold text-sm text-white cursor-pointer
        transition-all duration-200 shadow-lg active:scale-[0.98]
        disabled:opacity-40 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${isWallet
          ? "bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-none"
          : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-violet-500/20"
        }`}
    >
      {isWallet && <Wallet className="w-4 h-4 text-violet-400" />}
      {label}
    </button>
  )
}

function OrderSummary({
  cartItems,
  subtotal,
  fee,
  total,
  selectedToken,
  isWalletConnected,
  account,
  activeAdapter,
  onPay,
  onConnect,
  onDisconnect,
  ctaLabel,
  ctaIsWallet,
}: {
  cartItems: CartItem[]
  subtotal: number
  fee: number
  total: number
  selectedToken: Token | null
  isWalletConnected: boolean
  account: any
  activeAdapter: any
  onPay: () => void
  onConnect: () => void
  onDisconnect: () => void
  ctaLabel: string
  ctaIsWallet: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <h2 className="font-semibold text-white">Order Summary</h2>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Line items */}
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-slate-400 truncate mr-4">
              {item.name}{" "}
              {item.quantity > 1 && <span className="text-slate-600">×{item.quantity}</span>}
            </span>
            <span className="text-slate-300 shrink-0">{(item.price * item.quantity).toFixed(3)} ETH</span>
          </div>
        ))}

        <div className="border-t border-slate-800 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-300">{subtotal.toFixed(3)} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Network fee (2.5%)</span>
            <span className="text-slate-300">{fee.toFixed(6)} ETH</span>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-3 flex justify-between items-baseline">
          <span className="font-semibold text-white">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-white">{total.toFixed(4)}</span>
            <span className="text-sm text-slate-400 ml-1">{selectedToken?.symbol ?? "ETH"}</span>
          </div>
        </div>

        {/* Wallet status inside sidebar */}
        {isWalletConnected ? (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" style={{ boxShadow: "0 0 6px #4ade80" }} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">{activeAdapter?.name}</p>
              <p className="text-xs font-medium text-white truncate">{account?.displayAddress}</p>
            </div>
            <button
              onClick={onDisconnect}
              className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
              aria-label="Disconnect wallet"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 hover:bg-violet-500/10 hover:border-violet-500/40 transition-all cursor-pointer group"
          >
            <Wallet className="w-4 h-4 text-violet-400 shrink-0" />
            <span className="text-xs text-violet-300 font-medium flex-1 text-left">Connect wallet first</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 transition-colors" />
          </button>
        )}

        {/* Selected token preview */}
        {selectedToken && isWalletConnected && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <selectedToken.Icon size={24} />
            <div>
              <p className="text-xs text-slate-500">Paying with</p>
              <p className="text-sm font-medium text-white">{selectedToken.symbol}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-slate-500">Balance</p>
              <p className="text-xs font-medium text-slate-300">{selectedToken.balance}</p>
            </div>
          </div>
        )}

        <ActionButton
          onClick={onPay}
          disabled={cartItems.length === 0}
          label={ctaLabel}
          isWallet={ctaIsWallet}
        />
      </div>

      {/* Trust row */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-center gap-4">
          <TrustBadge icon={<Shield className="w-3 h-3" />} label="Non-Custodial" />
          <TrustBadge icon={<Lock className="w-3 h-3" />} label="Encrypted" />
          <TrustBadge icon={<Zap className="w-3 h-3" />} label="Instant" />
        </div>
      </div>
    </div>
  )
}
