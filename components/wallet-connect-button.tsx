"use client"

import { useState, useEffect } from "react"
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
  const [mounted, setMounted] = useState(false)
  const { account, activeAdapter } = useWallet()
  const { status, disconnect, authenticate, isAuthenticated } = useWalletConnection()
  const { toast } = useToast()

  useEffect(() => { setMounted(true) }, [])

  const isConnected = mounted && (status === "connected" || status === "authenticated")

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
            <button className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/15 px-3 py-1.5 transition-colors cursor-pointer group">
              {/* Live dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>

              {/* Address + balance stacked */}
              <div className="flex flex-col items-start leading-none">
                <span className="font-mono text-xs text-green-400 group-hover:text-green-300 transition-colors">
                  {account?.displayAddress || "Connected"}
                </span>
                {account?.balance && (
                  <span className="text-[10px] text-slate-400 mt-0.5">{account.balance}</span>
                )}
              </div>

              {/* Chevron */}
              <svg className="w-3 h-3 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-sm font-semibold">{activeAdapter?.name || "Wallet"}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono font-normal pl-3">{account?.displayAddress}</span>
                {account?.balance && (
                  <span className="text-xs text-slate-400 pl-3">{account.balance}</span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

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
  if (mounted && (status === "connecting" || status === "authenticating")) {
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
