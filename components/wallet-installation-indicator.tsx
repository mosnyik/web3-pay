"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import type { WalletInfo } from "@/lib/wallet/types"

interface WalletInstallationIndicatorProps {
  wallet: WalletInfo
  onInstall?: () => void
}

export function WalletInstallationIndicator({ wallet, onInstall }: WalletInstallationIndicatorProps) {
  const [isInstalled, setIsInstalled] = useState<boolean | undefined>(wallet.isInstalled)
  const [isChecking, setIsChecking] = useState(false)

  // Function to check installation status
  const checkInstallation = () => {
    setIsChecking(true)

    // Different detection methods based on wallet type
    setTimeout(() => {
      let detected = false

      // Ethereum wallets
      if (wallet.id === "metamask") {
        detected = typeof window !== "undefined" && !!(window as any).ethereum?.isMetaMask
      }
      // Bitcoin wallets
      else if (wallet.id === "xverse") {
        detected = typeof window !== "undefined" && !!(window as any).XverseProviders?.BitcoinProvider
      } else if (wallet.id === "unisat") {
        detected = typeof window !== "undefined" && !!(window as any).unisat
      } else if (wallet.id === "hiro") {
        detected = typeof window !== "undefined" && (!!(window as any).btc || !!(window as any).LeatherProvider)
      }
      // Tron wallets
      else if (wallet.id === "tronlink") {
        detected = typeof window !== "undefined" && (!!(window as any).tronLink || !!(window as any).tronWeb)
      }

      setIsInstalled(detected)
      setIsChecking(false)
    }, 500)
  }

  // Check installation status on mount and when wallet changes
  useEffect(() => {
    checkInstallation()
  }, [wallet.id])

  const handleInstall = () => {
    if (wallet.downloadUrl) {
      window.open(wallet.downloadUrl, "_blank")
    }
    onInstall?.()
  }

  const handleRefresh = () => {
    checkInstallation()
  }

  if (isInstalled === true) {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Installed
        </Badge>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
      >
        <AlertCircle className="w-3 h-3 mr-1" />
        Not Installed
      </Badge>

      <div className="flex gap-1">
        {wallet.downloadUrl && (
          <Button variant="outline" size="sm" onClick={handleInstall} className="h-7 px-2 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Install
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-7 w-7 p-0" disabled={isChecking}>
          <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
    </div>
  )
}
