"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Shield, ArrowLeft, RefreshCw } from "lucide-react"
import { useWallet } from "@/lib/wallet/wallet-context"
import { useEthereumWallet } from "@/lib/wallet/use-ethereum-wallet"
import { EthereumWalletConnect } from "@/components/ethereum-wallet-connect"
import { WalletInstallationIndicator } from "@/components/wallet-installation-indicator"
import { TronWalletStatus } from "@/components/tron-wallet-status"
import type { WalletInfo } from "@/lib/wallet/types"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { adapters, connect, status } = useWallet()
  const { isEthereumActive } = useEthereumWallet()

  const [selectedAdapterId, setSelectedAdapterId] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const handleNetworkSelect = (adapterId: string) => {
    setSelectedAdapterId(adapterId)
    setConnectionError(null)
  }

  const handleWalletSelect = async (wallet: WalletInfo) => {
    if (!selectedAdapterId) return

    setIsConnecting(wallet.id)
    setConnectionError(null)

    try {
      await connect(selectedAdapterId, { walletId: wallet.id })
      onClose()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setConnectionError(error instanceof Error ? error.message : "Failed to connect wallet")
    } finally {
      setIsConnecting(null)
    }
  }

  const handleRefreshInstallation = () => {
    // Refresh installation status for all adapters
    Object.values(adapters).forEach((adapter) => {
      if ("refreshInstallationStatus" in adapter) {
        ;(adapter as any).refreshInstallationStatus()
      }
    })
    // Force re-render by updating state
    setSelectedAdapterId(selectedAdapterId)
  }

  const handleBack = () => {
    setSelectedAdapterId(null)
    setIsConnecting(null)
    setConnectionError(null)
  }

  const handleClose = () => {
    onClose()
    setSelectedAdapterId(null)
    setIsConnecting(null)
    setConnectionError(null)
  }

  // Refresh installation status when modal opens
  useEffect(() => {
    if (isOpen) {
      Object.values(adapters).forEach((adapter) => {
        if ("refreshInstallationStatus" in adapter) {
          ;(adapter as any).refreshInstallationStatus()
        }
      })
    }
  }, [isOpen, adapters])

  const selectedAdapter = selectedAdapterId ? adapters[selectedAdapterId] : null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {selectedAdapter && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <DialogTitle className="text-2xl font-bold">
              {selectedAdapter ? `Connect to ${selectedAdapter.name}` : "Select Network"}
            </DialogTitle>
            {selectedAdapter && (
              <Button variant="ghost" size="icon" onClick={handleRefreshInstallation} className="h-8 w-8 ml-auto">
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {!selectedAdapter ? (
          // Network Selection
          <>
            <div className="text-center text-muted-foreground mb-6">
              Choose a blockchain network to connect your wallet
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(adapters).map((adapter) => (
                <Card
                  key={adapter.id}
                  className="hover:shadow-md transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20"
                  onClick={() => handleNetworkSelect(adapter.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-${adapter.id === "ethereum" ? "blue" : adapter.id === "bitcoin" ? "orange" : adapter.id === "solana" ? "purple" : "red"}-500 rounded-full flex items-center justify-center text-white text-xl font-bold`}
                      >
                        {adapter.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{adapter.name}</h3>
                          {adapter.id === "ethereum" && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            >
                              RainbowKit
                            </Badge>
                          )}
                          {adapter.id === "bitcoin" && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            >
                              sats-connect
                            </Badge>
                          )}
                          {adapter.id === "tron" && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                            >
                              TronWeb
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {adapter.supportedWallets
                            .map((w) => w.name)
                            .slice(0, 3)
                            .join(", ")}
                          {adapter.supportedWallets.length > 3 ? ", and more" : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Security Notice</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Make sure you're connecting to official wallet extensions. Never share your private keys or seed
                    phrase.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : selectedAdapter.id === "ethereum" ? (
          // Ethereum RainbowKit Connection
          <div className="text-center space-y-6">
            <div className="text-center text-muted-foreground mb-6">Connect your Ethereum wallet using RainbowKit</div>

            <div className="flex justify-center">
              <EthereumWalletConnect />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Ethereum Wallets Supported</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    MetaMask, WalletConnect, Coinbase Wallet, Rainbow, and 300+ other wallets through WalletConnect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Other Network Wallet Selection
          <>
            <div className="text-center text-muted-foreground mb-6">
              Choose a wallet to connect to {selectedAdapter.name}
            </div>

            {connectionError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">Connection Error</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">{connectionError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 max-h-[50vh] overflow-y-auto pr-1">
              {selectedAdapter.supportedWallets.map((wallet) => (
                <Card
                  key={wallet.id}
                  className={`hover:shadow-md transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20 ${
                    !wallet.isInstalled ? "opacity-75" : ""
                  }`}
                  onClick={() => wallet.isInstalled && handleWalletSelect(wallet)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                        {wallet.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{wallet.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{wallet.description}</p>
                        {selectedAdapter.id === "tron" ? (
                          <TronWalletStatus wallet={wallet} onRetry={() => handleRefreshInstallation()} />
                        ) : (
                          <WalletInstallationIndicator wallet={wallet} />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {wallet.isInstalled && (
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        )}
                      </div>
                    </div>

                    {isConnecting === wallet.id && (
                      <div className="mt-4 flex items-center gap-2 text-primary">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Connecting to {wallet.name}...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedAdapter.id === "tron" && (
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">Tron Wallet Setup</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Tron wallets require browser extensions and login. Make sure you're logged into your wallet before
                      connecting. TronLink users need to login to their wallet first.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
