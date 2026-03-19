import type { WalletAdapter, WalletAccount, WalletInfo, ConnectOptions } from "../types"
import { getEnabledWallets } from "@/lib/config/app"

// Full wallet catalogue — filtered by config at runtime
const ALL_ETHEREUM_WALLETS: WalletInfo[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Most popular Ethereum wallet",
    downloadUrl: "https://metamask.io/download/",
    isInstalled: typeof window !== "undefined" && !!(window as any).ethereum?.isMetaMask,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect with 300+ wallets",
    downloadUrl: "https://walletconnect.com/",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Self-custody wallet by Coinbase",
    downloadUrl: "https://www.coinbase.com/wallet",
    isInstalled: typeof window !== "undefined" && !!(window as any).ethereum?.isCoinbaseWallet,
  },
]

// This is a wrapper around RainbowKit/wagmi
export class EthereumAdapter implements WalletAdapter {
  id = "ethereum"
  name = "Ethereum"
  icon = "⟠"

  private account: WalletAccount | null = null
  private walletId: string | null = null
  private chainId: string | number | null = null

  supportedWallets: WalletInfo[] = ALL_ETHEREUM_WALLETS.filter((w) =>
    getEnabledWallets("ethereum").includes(w.id),
  )

  // Note: This adapter is meant to be used with the useWallet hook
  // which will provide the wagmi hooks. This is just the interface.

  async connect(options?: ConnectOptions): Promise<WalletAccount> {
    // This will be implemented by the hook using wagmi's useConnect
    // For now, we'll throw an error if called directly
    throw new Error("EthereumAdapter must be used with useWallet hook")
  }

  async disconnect(): Promise<void> {
    // This will be implemented by the hook using wagmi's useDisconnect
    throw new Error("EthereumAdapter must be used with useWallet hook")
  }

  async getAccount(): Promise<WalletAccount | null> {
    return this.account
  }

  async switchChain(chainId: string | number): Promise<void> {
    // This will be implemented by the hook using wagmi's useSwitchNetwork
    throw new Error("EthereumAdapter must be used with useWallet hook")
  }

  async signMessage(message: string): Promise<string> {
    // This will be implemented by the hook using wagmi's useSignMessage
    throw new Error("EthereumAdapter must be used with useWallet hook")
  }

  // For persistence
  serialize(): any {
    return {
      walletId: this.walletId,
      chainId: this.chainId,
    }
  }

  deserialize(data: any): void {
    if (data) {
      this.walletId = data.walletId || null
      this.chainId = data.chainId || null
    }
  }

  // Internal methods to be called by the hook
  _setAccount(account: WalletAccount | null): void {
    this.account = account
  }

  _setWalletId(walletId: string | null): void {
    this.walletId = walletId
  }

  _setChainId(chainId: string | number | null): void {
    this.chainId = chainId
  }
}
