"use client"

import { useEffect } from "react"
import { useAccount, useDisconnect, useChainId, useSwitchChain, useBalance } from "wagmi"
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains"
import { useWallet } from "@/lib/wallet/wallet-context"
import type { WalletAccount } from "@/lib/wallet/types"
import type { EthereumAdapter } from "@/lib/wallet/adapters/ethereum-adapter"

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

  // Read real on-chain ETH balance via wagmi
  const { data: balanceData } = useBalance({
    address,
    query: { enabled: isConnected && !!address },
  })

  const ethereumAdapter = adapters.ethereum as EthereumAdapter

  useEffect(() => {
    if (isConnected && address) {
      const networkName = chainNames[chainId] || `Chain ${chainId}`
      const balance = balanceData
        ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
        : undefined

      const account: WalletAccount = {
        address,
        displayName: "Ethereum Wallet",
        displayAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        balance,
        networkName,
        chainId,
      }

      if (ethereumAdapter) {
        ethereumAdapter._setAccount(account)
        ethereumAdapter._setWalletId("ethereum")
        ethereumAdapter._setChainId(chainId)
      }

      setAccount("ethereum", account)
    } else {
      if (ethereumAdapter) {
        ethereumAdapter._setAccount(null)
        ethereumAdapter._setWalletId(null)
        ethereumAdapter._setChainId(null)
      }
      setAccount("ethereum", null)
    }
  }, [address, isConnected, chainId, balanceData, ethereumAdapter, setAccount])

  const handleDisconnect = async () => {
    try {
      await disconnect()
      if (ethereumAdapter) {
        ethereumAdapter._setAccount(null)
        ethereumAdapter._setWalletId(null)
        ethereumAdapter._setChainId(null)
      }
      setAccount("ethereum", null)
    } catch (error) {
      console.error("Failed to disconnect Ethereum wallet:", error)
    }
  }

  const handleSwitchChain = async (chainId: number) => {
    try {
      await switchChain({ chainId })
    } catch (error) {
      console.error("Failed to switch chain:", error)
    }
  }

  return {
    isEthereumActive: isConnected && !!address,
    disconnect: handleDisconnect,
    switchChain: handleSwitchChain,
    chainId,
  }
}
