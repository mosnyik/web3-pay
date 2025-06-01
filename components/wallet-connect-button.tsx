"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletStatusIndicator } from "@/components/wallet-status-indicator"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { useWalletConnection } from "@/lib/wallet/use-wallet-connection"
import { useWallet } from "@/lib/wallet/wallet-context"
import { Wallet, LogOut, Shield, ExternalLink, Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  showStatus?: boolean
}

export function WalletConnectButton({
  variant = "default",
  size = "default",
  showStatus = true,
}: WalletConnectButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { account, activeAdapter } = useWallet()
  const { status, disconnect, authenticate, isAuthenticated } = useWalletConnection()
  const { toast } = useToast()

  const isConnected = status === "connected" || status === "authenticated"

  const handleConnect = () => {
    setIsModalOpen(true)
  }

  const handleDisconnect = async () => {
    await disconnect()
  }

  const handleAuthenticate = async () => {
    await authenticate()
  }

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const openExplorer = () => {
    if (!account?.address) return

    let explorerUrl = ""

    // Determine explorer URL based on network
    switch (activeAdapter?.id) {
      case "ethereum":
        explorerUrl = `https://etherscan.io/address/${account.address}`
        break
      case "bitcoin":
        explorerUrl = `https://mempool.space/address/${account.address}`
        break
      case "tron":
        explorerUrl = `https://tronscan.org/#/address/${account.address}`
        break
      case "solana":
        explorerUrl = `https://explorer.solana.com/address/${account.address}`
        break
      default:
        toast({
          title: "Explorer Not Available",
          description: "Block explorer not configured for this network",
          variant: "destructive",
        })
        return
    }

    window.open(explorerUrl, "_blank")
  }

  // If connected, show dropdown with account info and actions
  if (isConnected) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size={size} className="flex items-center gap-2">
              {showStatus && <WalletStatusIndicator showTooltip={false} size="sm" />}
              <span>{account?.displayAddress || "Connected"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{activeAdapter?.name || "Wallet"}</span>
                <span className="text-xs text-muted-foreground font-normal">{account?.displayAddress}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {account?.balance && (
              <DropdownMenuItem disabled className="flex justify-between">
                <span>Balance</span>
                <span>{account.balance}</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={copyAddress}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Address</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={openExplorer}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>View in Explorer</span>
            </DropdownMenuItem>

            {!isAuthenticated && (
              <DropdownMenuItem onClick={handleAuthenticate}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Authenticate</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleDisconnect} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  }

  // If connecting or error, show appropriate button
  if (status === "connecting" || status === "authenticating") {
    return (
      <Button variant={variant} size={size} disabled className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin" />
        {status === "connecting" ? "Connecting..." : "Authenticating..."}
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
