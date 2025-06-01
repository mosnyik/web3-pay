"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { WalletAdapter, WalletAccount, WalletStatus, WalletContextType, ConnectOptions } from "./types"
import { saveWalletState, loadWalletState, clearWalletState } from "./storage"
import { EthereumAdapter } from "./adapters/ethereum-adapter"
import { BitcoinAdapter } from "./adapters/bitcoin-adapter"
import { SolanaAdapter } from "./adapters/solana-adapter"
import { TronAdapter } from "./adapters/tron-adapter"

// Create the context
const WalletContext = createContext<WalletContextType | null>(null)

// Create the provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  // Initialize adapters
  const [adapters] = useState<Record<string, WalletAdapter>>({
    ethereum: new EthereumAdapter(),
    bitcoin: new BitcoinAdapter(),
    solana: new SolanaAdapter(),
    tron: new TronAdapter(),
  })

  // State
  const [activeAdapter, setActiveAdapter] = useState<WalletAdapter | null>(null)
  const [status, setStatus] = useState<WalletStatus>("disconnected")
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // Connect to a wallet
  const connect = async (adapterId: string, options?: ConnectOptions): Promise<WalletAccount | null> => {
    try {
      const adapter = adapters[adapterId]
      if (!adapter) {
        throw new Error(`Adapter ${adapterId} not found`)
      }

      setStatus("connecting")
      setError(null)

      const account = await adapter.connect(options)

      setActiveAdapter(adapter)
      setAccount(account)
      setStatus("connected")

      // Save state for persistence
      saveWalletState(adapterId, options?.walletId || null, adapter.serialize())

      return account
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  // Disconnect from the current wallet
  const disconnect = async (): Promise<void> => {
    try {
      if (activeAdapter) {
        await activeAdapter.disconnect()
      }

      setActiveAdapter(null)
      setAccount(null)
      setStatus("disconnected")

      // Clear saved state
      clearWalletState()
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  // Switch to a different adapter
  const switchAdapter = async (adapterId: string): Promise<void> => {
    if (activeAdapter) {
      await disconnect()
    }

    // Don't auto-connect, just set the active adapter
    const adapter = adapters[adapterId]
    if (adapter) {
      setActiveAdapter(adapter)
    }
  }

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      const savedState = loadWalletState()
      if (savedState && savedState.adapterId) {
        const adapter = adapters[savedState.adapterId]
        if (adapter) {
          try {
            // Deserialize the adapter state
            adapter.deserialize(savedState.data)

            // Try to reconnect
            setStatus("connecting")
            const account = await adapter.getAccount()

            if (account) {
              setActiveAdapter(adapter)
              setAccount(account)
              setStatus("connected")
            } else {
              // If no account, try to connect with saved wallet ID
              if (savedState.walletId) {
                await connect(savedState.adapterId, { walletId: savedState.walletId })
              }
            }
          } catch (err) {
            console.error("Failed to restore wallet connection:", err)
            clearWalletState()
          }
        }
      }
    }

    loadSavedState()
  }, [])

  const value: WalletContextType = {
    adapters,
    activeAdapter,
    status,
    account,
    error,
    connect,
    disconnect,
    switchAdapter,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Custom hook to use the wallet context
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
