"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, LogIn, RefreshCw } from "lucide-react"
import type { WalletInfo } from "@/lib/wallet/types"

interface TronWalletStatusProps {
  wallet: WalletInfo
  onRetry?: () => void
}

export function TronWalletStatus({ wallet, onRetry }: TronWalletStatusProps) {
  const [needsLogin, setNeedsLogin] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Check if TronLink needs login
  useEffect(() => {
    if (wallet.id === "tronlink" && wallet.isInstalled) {
      const checkLoginStatus = () => {
        const tronWeb = (window as any).tronWeb
        const isLoggedIn = !!(tronWeb && tronWeb.ready && tronWeb.defaultAddress && tronWeb.defaultAddress.base58)
        setNeedsLogin(!isLoggedIn)
      }

      checkLoginStatus()

      // Listen for TronLink events
      const handleMessage = (event: MessageEvent) => {
        if (event.data.message && event.data.message.action === "setAccount") {
          setTimeout(checkLoginStatus, 100)
        }
      }

      window.addEventListener("message", handleMessage)
      return () => window.removeEventListener("message", handleMessage)
    }
  }, [wallet.id, wallet.isInstalled])

  const handleLoginPrompt = () => {
    if (wallet.id === "tronlink") {
      alert(
        "Please login to TronLink:\n\n" +
          "1. Click the TronLink extension icon in your browser\n" +
          "2. Enter your password or create a new wallet\n" +
          "3. Make sure you're logged in\n" +
          "4. Try connecting again",
      )
    }
  }

  const handleRefresh = async () => {
    setIsChecking(true)
    // Wait a bit for any state changes
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsChecking(false)
    onRetry?.()
  }

  if (!wallet.isInstalled) {
    return (
      <Badge
        variant="secondary"
        className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
      >
        <AlertCircle className="w-3 h-3 mr-1" />
        Not Installed
      </Badge>
    )
  }

  if (wallet.id === "tronlink" && needsLogin) {
    return (
      <div className="flex flex-col gap-2">
        <Badge
          variant="secondary"
          className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
        >
          <LogIn className="w-3 h-3 mr-1" />
          Login Required
        </Badge>
        <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
          <LogIn className="h-4 w-4" />
          <AlertDescription className="text-sm">
            TronLink is installed but you need to login first.
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleLoginPrompt} className="h-7 text-xs">
                <LogIn className="w-3 h-3 mr-1" />
                Login Guide
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isChecking} className="h-7 text-xs">
                <RefreshCw className={`w-3 h-3 mr-1 ${isChecking ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
    >
      <CheckCircle className="w-3 h-3 mr-1" />
      Ready
    </Badge>
  )
}
