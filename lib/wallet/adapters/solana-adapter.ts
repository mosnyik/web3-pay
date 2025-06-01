import type { WalletAdapter, WalletAccount, WalletInfo, ConnectOptions } from "../types"

export class SolanaAdapter implements WalletAdapter {
  id = "solana"
  name = "Solana"
  icon = "◎"

  private account: WalletAccount | null = null
  private walletId: string | null = null

  supportedWallets: WalletInfo[] = [
    {
      id: "phantom",
      name: "Phantom",
      icon: "👻",
      description: "The friendly Solana wallet",
      downloadUrl: "https://phantom.app/",
      isInstalled: typeof window !== "undefined" && !!(window as any).solana?.isPhantom,
    },
    {
      id: "solflare",
      name: "Solflare",
      icon: "☀️",
      description: "Solana wallet for DeFi",
      downloadUrl: "https://solflare.com/",
    },
    {
      id: "backpack",
      name: "Backpack",
      icon: "🎒",
      description: "Crypto super app",
      downloadUrl: "https://backpack.app/",
    },
  ]

  async connect(options?: ConnectOptions): Promise<WalletAccount> {
    // Mock implementation for now
    // In a real implementation, we would connect to the actual wallet
    const walletId = options?.walletId || this.supportedWallets[0].id
    const wallet = this.supportedWallets.find((w) => w.id === walletId)

    if (!wallet) {
      throw new Error(`Wallet ${walletId} not supported`)
    }

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a mock account
    const mockAddress = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const account: WalletAccount = {
      address: mockAddress,
      displayName: `${wallet.name} Wallet`,
      displayAddress: `${mockAddress.substring(0, 6)}...${mockAddress.substring(mockAddress.length - 4)}`,
      balance: "10.5 SOL",
      networkName: "Solana",
    }

    this.account = account
    this.walletId = walletId

    return account
  }

  async disconnect(): Promise<void> {
    this.account = null
    this.walletId = null
  }

  async getAccount(): Promise<WalletAccount | null> {
    return this.account
  }

  // For persistence
  serialize(): any {
    return {
      walletId: this.walletId,
      account: this.account,
    }
  }

  deserialize(data: any): void {
    if (data) {
      this.walletId = data.walletId || null
      this.account = data.account || null
    }
  }
}
