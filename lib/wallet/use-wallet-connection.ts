"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./wallet-context"
import { authService } from "./auth-service"
import { useToast } from "@/hooks/use-toast"

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "authenticating"
  | "authenticated"
  | "error"

export interface UseWalletConnectionResult {
  connect: (adapterId: string, walletId?: string) => Promise<boolean>
  disconnect: () => Promise<void>
  authenticate: () => Promise<boolean>
  status: ConnectionStatus
  error: Error | null
  isAuthenticated: boolean
  isConnecting: boolean
  isAuthenticating: boolean
}

/**
 * Hook for managing wallet connection with enhanced error handling and authentication
 */
export function useWalletConnection(): UseWalletConnectionResult {
  const { adapters, activeAdapter, account, connect: connectWallet, disconnect: disconnectWallet } = useWallet()
  const { toast } = useToast()

  const [status, setStatus] = useState<ConnectionStatus>("disconnected")
  const [error, setError] = useState<Error | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated())

  // Check authentication status on mount
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())

    if (activeAdapter && account && authService.isAuthenticated()) {
      setStatus("authenticated")
    } else if (activeAdapter && account) {
      setStatus("connected")
    } else {
      setStatus("disconnected")
    }
  }, [activeAdapter, account])

  // Connect to wallet with error handling
  const connect = useCallback(
    async (adapterId: string, walletId?: string): Promise<boolean> => {
      try {
        setStatus("connecting")
        setError(null)

        // Check if adapter exists
        if (!adapters[adapterId]) {
          throw new Error(`Wallet adapter ${adapterId} not found`)
        }

        // Connect to wallet
        await connectWallet(adapterId, { walletId })

        setStatus("connected")
        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${adapters[adapterId].name} wallet`,
        })

        return true
      } catch (err) {
        console.error("Wallet connection error:", err)
        setError(err instanceof Error ? err : new Error("Failed to connect wallet"))
        setStatus("error")

        toast({
          title: "Connection Failed",
          description: err instanceof Error ? err.message : "Failed to connect wallet",
          variant: "destructive",
        })

        return false
      }
    },
    [adapters, connectWallet, toast],
  )

  // Disconnect from wallet
  const disconnect = useCallback(async (): Promise<void> => {
    try {
      await disconnectWallet()

      // Also logout from authentication
      authService.logout()
      setIsAuthenticated(false)

      setStatus("disconnected")
      setError(null)

      toast({
        title: "Wallet Disconnected",
        description: "You have been disconnected from your wallet",
      })
    } catch (err) {
      console.error("Wallet disconnect error:", err)
      toast({
        title: "Disconnect Failed",
        description: err instanceof Error ? err.message : "Failed to disconnect wallet",
        variant: "destructive",
      })
    }
  }, [disconnectWallet, toast])

  // Authenticate with connected wallet
  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!activeAdapter || !account) {
      toast({
        title: "Authentication Failed",
        description: "No wallet connected",
        variant: "destructive",
      })
      return false
    }

    try {
      setStatus("authenticating")

      // Generate a message to sign
      const message = `Sign this message to authenticate with Web3Pay: ${Date.now()}`

      // Sign message with wallet
      let signature: string

      if ("signMessage" in activeAdapter && typeof activeAdapter.signMessage === "function") {
        signature = await activeAdapter.signMessage(message)
      } else {
        throw new Error("This wallet does not support message signing")
      }

      // Authenticate with backend
      await authService.authenticateWithWallet(account.address, signature, account.networkName || "unknown")

      setIsAuthenticated(true)
      setStatus("authenticated")

      toast({
        title: "Authentication Successful",
        description: "You are now authenticated with your wallet",
      })

      return true
    } catch (err) {
      console.error("Authentication error:", err)
      setError(err instanceof Error ? err : new Error("Failed to authenticate"))
      setStatus("connected") // Back to connected but not authenticated

      toast({
        title: "Authentication Failed",
        description: err instanceof Error ? err.message : "Failed to authenticate with wallet",
        variant: "destructive",
      })

      return false
    }
  }, [activeAdapter, account, toast])

  return {
    connect,
    disconnect,
    authenticate,
    status,
    error,
    isAuthenticated,
    isConnecting: status === "connecting",
    isAuthenticating: status === "authenticating",
  }
}
