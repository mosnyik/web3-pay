import type { WalletAdapter, WalletAccount, WalletInfo, ConnectOptions } from "../types"
import { getEnabledWallets } from "@/lib/config/app"

// ── Wallet detection ──────────────────────────────────────────────────────────

const isPhantomInstalled = (): boolean =>
  typeof window !== "undefined" && !!(window as any).solana?.isPhantom

const isSolflareInstalled = (): boolean =>
  typeof window !== "undefined" && !!(window as any).solflare?.isSolflare

const isBackpackInstalled = (): boolean =>
  typeof window !== "undefined" && !!(window as any).backpack?.isBackpack

// ── Balance fetch via Solana public RPC ──────────────────────────────────────

async function fetchSolanaBalance(publicKey: string): Promise<string> {
  try {
    const response = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [publicKey],
      }),
    })
    const data = await response.json()
    if (data?.result?.value !== undefined) {
      const sol = data.result.value / 1_000_000_000
      return `${sol.toFixed(4)} SOL`
    }
  } catch (err) {
    console.warn("Failed to fetch Solana balance:", err)
  }
  return "0 SOL"
}

function buildAccount(publicKey: string, walletName: string, balance: string): WalletAccount {
  return {
    address: publicKey,
    displayName: `${walletName} Wallet`,
    displayAddress: `${publicKey.substring(0, 4)}...${publicKey.substring(publicKey.length - 4)}`,
    balance,
    networkName: "Solana",
  }
}

// ── Adapter ───────────────────────────────────────────────────────────────────

// Full wallet catalogue — filtered by config at runtime
const ALL_SOLANA_WALLETS: WalletInfo[] = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    description: "The friendly Solana wallet",
    downloadUrl: "https://phantom.app/",
    isInstalled: isPhantomInstalled(),
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "☀️",
    description: "Solana wallet for DeFi",
    downloadUrl: "https://solflare.com/",
    isInstalled: isSolflareInstalled(),
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: "🎒",
    description: "Crypto super app",
    downloadUrl: "https://backpack.app/",
    isInstalled: isBackpackInstalled(),
  },
]

export class SolanaAdapter implements WalletAdapter {
  id = "solana"
  name = "Solana"
  icon = "◎"

  private account: WalletAccount | null = null
  private walletId: string | null = null

  supportedWallets: WalletInfo[] = ALL_SOLANA_WALLETS.filter((w) =>
    getEnabledWallets("solana").includes(w.id),
  )

  async connect(options?: ConnectOptions): Promise<WalletAccount> {
    const walletId = options?.walletId || this.supportedWallets[0].id
    const wallet = this.supportedWallets.find((w) => w.id === walletId)

    if (!wallet) throw new Error(`Wallet ${walletId} not supported`)
    if (!wallet.isInstalled) {
      throw new Error(`${wallet.name} is not installed. Download it at ${wallet.downloadUrl}`)
    }

    let account: WalletAccount

    switch (walletId) {
      case "phantom":  account = await this.connectPhantom();  break
      case "solflare": account = await this.connectSolflare(); break
      case "backpack": account = await this.connectBackpack(); break
      default: throw new Error(`Connection method for ${walletId} not implemented`)
    }

    this.account = account
    this.walletId = walletId
    return account
  }

  // ── Phantom ──────────────────────────────────────────────────────────────

  private async connectPhantom(): Promise<WalletAccount> {
    const provider = (window as any).solana
    if (!provider?.isPhantom) throw new Error("Phantom not found")

    const resp = await provider.connect()
    const publicKey: string = resp.publicKey.toString()
    const balance = await fetchSolanaBalance(publicKey)

    // Listen for account changes
    provider.on("accountChanged", async (newKey: any) => {
      if (newKey && this.account) {
        const pk = newKey.toString()
        const bal = await fetchSolanaBalance(pk)
        this.account = buildAccount(pk, "Phantom", bal)
      }
    })

    return buildAccount(publicKey, "Phantom", balance)
  }

  // ── Solflare ─────────────────────────────────────────────────────────────

  private async connectSolflare(): Promise<WalletAccount> {
    const provider = (window as any).solflare
    if (!provider?.isSolflare) throw new Error("Solflare not found")

    await provider.connect()
    const publicKey: string = provider.publicKey.toString()
    const balance = await fetchSolanaBalance(publicKey)
    return buildAccount(publicKey, "Solflare", balance)
  }

  // ── Backpack ─────────────────────────────────────────────────────────────

  private async connectBackpack(): Promise<WalletAccount> {
    const provider = (window as any).backpack
    if (!provider?.isBackpack) throw new Error("Backpack not found")

    await provider.connect()
    const publicKey: string = provider.publicKey.toString()
    const balance = await fetchSolanaBalance(publicKey)
    return buildAccount(publicKey, "Backpack", balance)
  }

  // ── Core ──────────────────────────────────────────────────────────────────

  async disconnect(): Promise<void> {
    try {
      if (this.walletId === "phantom") (window as any).solana?.disconnect()
      if (this.walletId === "solflare") (window as any).solflare?.disconnect()
      if (this.walletId === "backpack") (window as any).backpack?.disconnect()
    } catch (_) {}
    this.account = null
    this.walletId = null
  }

  async getAccount(): Promise<WalletAccount | null> {
    // Verify the wallet is still connected before returning cached account
    if (!this.account || !this.walletId) return null
    try {
      if (this.walletId === "phantom" && !(window as any).solana?.isConnected) return null
      if (this.walletId === "solflare" && !(window as any).solflare?.isConnected) return null
    } catch (_) {}
    return this.account
  }

  async refreshBalance(): Promise<void> {
    if (!this.account) return
    const balance = await fetchSolanaBalance(this.account.address)
    this.account = { ...this.account, balance }
  }

  serialize(): any {
    return { walletId: this.walletId, account: this.account }
  }

  deserialize(data: any): void {
    if (data) {
      this.walletId = data.walletId || null
      this.account = data.account || null
      // Refresh installation status
      this.supportedWallets = this.supportedWallets.map((w) => ({
        ...w,
        isInstalled:
          w.id === "phantom"  ? isPhantomInstalled()  :
          w.id === "solflare" ? isSolflareInstalled() :
          w.id === "backpack" ? isBackpackInstalled() : false,
      }))
    }
  }
}
