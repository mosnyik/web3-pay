"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, RefreshCw } from "lucide-react"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { useWallet } from "@/lib/wallet/wallet-context"

interface WalletConnectStandaloneProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  onConnect?: (account: any) => void
  onDisconnect?: () => void
}

export function WalletConnectStandalone({
  variant = "default",
  size = "default",
  onConnect,
  onDisconnect,
}: WalletConnectStandaloneProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { account, disconnect, status } = useWallet()

  const isConnected = status === "connected"
  const isConnecting = status === "connecting"

  useEffect(() => {
    if (isConnected && account && onConnect) {
      onConnect(account)
    }
  }, [isConnected, account, onConnect])

  const handleConnect = () => {
    setIsModalOpen(true)
  }

  const handleDisconnect = async () => {
    await disconnect()
    if (onDisconnect) {
      onDisconnect()
    }
  }

  // If connected, show account info and disconnect button
  if (isConnected && account) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button variant={variant} size={size} className="flex items-center gap-2">
            <span>{account.displayAddress || "Connected"}</span>
          </Button>
          <Button variant="outline" size={size} onClick={handleDisconnect} className="text-red-500">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </>
    )
  }

  // If connecting, show loading state
  if (isConnecting) {
    return (
      <Button variant={variant} size={size} disabled className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  // Default: Not connected
  return (
    <>
      <Button variant={variant} size={size} onClick={handleConnect} className="flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>

      <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
