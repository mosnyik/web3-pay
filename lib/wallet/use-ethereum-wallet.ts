"use client"

import { useEffect, useState } from "react"
import { useAccount, useDisconnect, useChainId, useSwitchChain } from "wagmi"
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains"
import { useWallet } from "@/lib/wallet/wallet-context"
import type { WalletAccount } from "@/lib/wallet/types"
import type { EthereumAdapter } from "@/lib/wallet/adapters/ethereum-adapter"

// Map of chain IDs to names
const chainNames: Record<number, string> = {
  [mainnet.id]: "Ethereum",
  [polygon.id]: "Polygon",
  [optimism.id]: "Optimism",
  [arbitrum.id]: "Arbitrum",
  [sepolia.id]: "Sepolia",
}

export function useEthereumWallet() {
  const { adapters, setAccount } = useWallet()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [isEthereumActive, setIsEthereumActive] = useState(false)

  // Get the Ethereum adapter
  const ethereumAdapter = adapters.ethereum as EthereumAdapter

  // Update the wallet context when the Ethereum wallet state changes
  useEffect(() => {
    if (isConnected && address) {
      const networkName = chainNames[chainId] || `Chain ${chainId}`

      // Create a wallet account object
      const account: WalletAccount = {
        address,
        displayName: "Ethereum Wallet",
        displayAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        networkName,
      }

      // Update the adapter's internal state
      if (ethereumAdapter) {
        ethereumAdapter._setAccount(account)
        ethereumAdapter._setWalletId("ethereum")
        ethereumAdapter._setChainId(chainId)
      }

      // Update the wallet context
      setAccount("ethereum", account)
      setIsEthereumActive(true)
    } else {
      // Clear the adapter's internal state
      if (ethereumAdapter) {
        ethereumAdapter._setAccount(null)
        ethereumAdapter._setWalletId(null)
        ethereumAdapter._setChainId(null)
      }

      setIsEthereumActive(false)
    }
  }, [address, isConnected, chainId, ethereumAdapter, setAccount])

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      await disconnect()

      // Clear the adapter's internal state
      if (ethereumAdapter) {
        ethereumAdapter._setAccount(null)
        ethereumAdapter._setWalletId(null)
        ethereumAdapter._setChainId(null)
      }

      setIsEthereumActive(false)
    } catch (error) {
      console.error("Failed to disconnect Ethereum wallet:", error)
    }
  }

  // Handle chain switch
  const handleSwitchChain = async (chainId: number) => {
    try {
      await switchChain({ chainId })
    } catch (error) {
      console.error("Failed to switch chain:", error)
    }
  }

  return {
    isEthereumActive,
    disconnect: handleDisconnect,
    switchChain: handleSwitchChain,
    chainId,
  }
}
