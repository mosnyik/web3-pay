"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWallet } from "@/lib/wallet/wallet-context"
import { useWalletConnection } from "@/lib/wallet/use-wallet-connection"
import { CheckCircle, XCircle, AlertCircle, Loader2, Shield, Wallet } from "lucide-react"

interface WalletStatusIndicatorProps {
  showTooltip?: boolean
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

export function WalletStatusIndicator({
  showTooltip = true,
  showIcon = true,
  size = "md",
}: WalletStatusIndicatorProps) {
  const { activeAdapter, account } = useWallet()
  const { status, isAuthenticated } = useWalletConnection()
  const [networkStatus, setNetworkStatus] = useState<"online" | "offline">("online")

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus("online")
    const handleOffline = () => setNetworkStatus("offline")

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Determine badge appearance based on status
  const getBadgeClasses = () => {
    if (networkStatus === "offline") {
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }

    switch (status) {
      case "authenticated":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
      case "connected":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "connecting":
      case "authenticating":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "error":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  // Get status icon
  const getStatusIcon = () => {
    if (networkStatus === "offline") {
      return <XCircle className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
    }

    switch (status) {
      case "authenticated":
        return <Shield className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
      case "connected":
        return <CheckCircle className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
      case "connecting":
      case "authenticating":
        return (
          <Loader2 className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} animate-spin`} />
        )
      case "error":
        return <AlertCircle className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
      default:
        return <Wallet className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
    }
  }

  // Get status text
  const getStatusText = () => {
    if (networkStatus === "offline") {
      return "Offline"
    }

    switch (status) {
      case "authenticated":
        return "Authenticated"
      case "connected":
        return "Connected"
      case "connecting":
        return "Connecting..."
      case "authenticating":
        return "Authenticating..."
      case "error":
        return "Error"
      default:
        return "Not Connected"
    }
  }

  // Get tooltip text
  const getTooltipText = () => {
    if (networkStatus === "offline") {
      return "You are currently offline. Please check your internet connection."
    }

    switch (status) {
      case "authenticated":
        return `Authenticated with ${activeAdapter?.name || "wallet"} as ${account?.displayAddress || "unknown"}`
      case "connected":
        return `Connected to ${activeAdapter?.name || "wallet"} as ${account?.displayAddress || "unknown"}`
      case "connecting":
        return "Connecting to wallet..."
      case "authenticating":
        return "Authenticating with wallet..."
      case "error":
        return "Error connecting to wallet"
      default:
        return "No wallet connected"
    }
  }

  const badge = (
    <Badge
      variant="secondary"
      className={`${getBadgeClasses()} ${size === "sm" ? "text-xs py-0 px-1.5" : size === "lg" ? "text-sm py-1 px-3" : "text-xs py-0.5 px-2"}`}
    >
      {showIcon && <span className="mr-1">{getStatusIcon()}</span>}
      {getStatusText()}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
