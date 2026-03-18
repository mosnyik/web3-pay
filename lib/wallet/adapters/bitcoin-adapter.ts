import type { WalletAdapter, WalletAccount, WalletInfo, ConnectOptions } from "../types"
import { getEnabledWallets } from "@/lib/config/app"
import { useBTCWalletStore } from "@/stores/btc-wallet-store"

// ── Real balance via mempool.space ────────────────────────────────────────────
async function fetchBitcoinBalance(address: string): Promise<string> {
  try {
    const res = await fetch(`https://mempool.space/api/address/${address}`)
    if (!res.ok) throw new Error("mempool.space request failed")
    const data = await res.json()
    const confirmed = data?.chain_stats?.funded_txo_sum - data?.chain_stats?.spent_txo_sum
    const unconfirmed = data?.mempool_stats?.funded_txo_sum - data?.mempool_stats?.spent_txo_sum
    const totalSats = (confirmed ?? 0) + (unconfirmed ?? 0)
    return `${(totalSats / 100_000_000).toFixed(8)} BTC`
  } catch (err) {
    console.warn("Failed to fetch Bitcoin balance:", err)
    return "0 BTC"
  }
}

interface BitcoinAddress {
  address: string
  publicKey: string
  purpose: string
}

// Wallet detection functions
const isXverseInstalled = (): boolean => {
  if (typeof window === "undefined") return false
  return !!(window as any).XverseProviders?.BitcoinProvider
}

const isHiroInstalled = (): boolean => {
  if (typeof window === "undefined") return false
  return !!(window as any).btc || !!(window as any).LeatherProvider
}

const isUnisatInstalled = (): boolean => {
  if (typeof window === "undefined") return false
  return !!(window as any).unisat
}

// Full wallet catalogue — filtered by config at runtime
const ALL_BITCOIN_WALLETS: WalletInfo[] = [
  {
    id: "xverse",
    name: "Xverse",
    icon: "⚡",
    description: "Bitcoin & Stacks wallet with Ordinals support",
    downloadUrl: "https://www.xverse.app/",
    isInstalled: isXverseInstalled(),
  },
  {
    id: "unisat",
    name: "Unisat",
    icon: "🌟",
    description: "Bitcoin wallet for Ordinals and BRC-20",
    downloadUrl: "https://unisat.io/",
    isInstalled: isUnisatInstalled(),
  },
  {
    id: "hiro",
    name: "Hiro Wallet (Leather)",
    icon: "🔥",
    description: "Bitcoin & Stacks wallet for Web3",
    downloadUrl: "https://leather.io/",
    isInstalled: isHiroInstalled(),
  },
]

export class BitcoinAdapter implements WalletAdapter {
  id = "bitcoin"
  name = "Bitcoin"
  icon = "₿"

  private account: WalletAccount | null = null
  private walletId: string | null = null
  private connectedAddresses: BitcoinAddress[] = []

  supportedWallets: WalletInfo[] = ALL_BITCOIN_WALLETS.filter((w) =>
    getEnabledWallets("bitcoin").includes(w.id),
  )

  async connect(options?: ConnectOptions): Promise<WalletAccount> {
    const walletId = options?.walletId || this.supportedWallets[0].id
    const wallet = this.supportedWallets.find((w) => w.id === walletId)

    if (!wallet) {
      throw new Error(`Wallet ${walletId} not supported`)
    }

    // For development/demo purposes, if wallet is not installed, simulate a connection
    if (!wallet.isInstalled) {
      console.warn(`${wallet.name} is not installed. Using mock connection for demo purposes.`)
      return this.mockConnect(wallet)
    }

    try {
      let account: WalletAccount

      switch (walletId) {
        case "xverse":
          account = await this.connectXverse()
          break
        case "hiro":
          account = await this.connectHiro()
          break
        case "unisat":
          account = await this.connectUnisat()
          break
        default:
          throw new Error(`Connection method for ${walletId} not implemented`)
      }

      this.account = account
      this.walletId = walletId

      return account
    } catch (error) {
      console.error(`Failed to connect to ${wallet.name}:`, error)

      // For demo purposes, fall back to mock connection if real connection fails
      console.warn(`Falling back to mock connection for demo purposes.`)
      return this.mockConnect(wallet)
    }
  }

  // Mock connection for demo purposes
  private mockConnect(wallet: WalletInfo): Promise<WalletAccount> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a mock Bitcoin address
        const mockAddress = `bc1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

        const account: WalletAccount = {
          address: mockAddress,
          displayName: `${wallet.name} (Demo — wallet not installed)`,
          displayAddress: `${mockAddress.substring(0, 6)}...${mockAddress.substring(mockAddress.length - 4)}`,
          balance: "N/A",
          networkName: "Bitcoin",
        }

        this.account = account
        this.walletId = wallet.id

        resolve(account)
      }, 1000) // Simulate network delay
    })
  }

  private async connectXverse(): Promise<WalletAccount> {
    const { request, AddressPurpose } = await import("sats-connect")

    const response = await request("getAccounts", {
      purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals, AddressPurpose.Stacks],
      message: "Connect to Web3 Payment Gateway",
    })

    if (response.status !== "success") {
      throw new Error(response.error?.message ?? "Xverse connection cancelled")
    }

    const addresses = response.result
    const paymentAddr = addresses.find((a) => a.purpose === AddressPurpose.Payment)
    const ordinalsAddr = addresses.find((a) => a.purpose === AddressPurpose.Ordinals)
    const stacksAddr = addresses.find((a) => a.purpose === AddressPurpose.Stacks)

    const addr = paymentAddr?.address ?? ordinalsAddr?.address
    if (!addr) throw new Error("No payment address returned from Xverse")

    // Store all addresses in the Zustand store for later use (e.g. Ordinals)
    useBTCWalletStore.getState().setWallet({
      walletId: "xverse",
      paymentAddress: paymentAddr?.address ?? "",
      ordinalsAddress: ordinalsAddr?.address ?? "",
      stacksAddress: stacksAddr?.address ?? "",
      publicKey: paymentAddr?.publicKey ?? "",
    })

    this.connectedAddresses = addresses.map((a) => ({
      address: a.address,
      publicKey: a.publicKey ?? "",
      purpose: a.purpose,
    }))

    const balance = await fetchBitcoinBalance(addr)
    return {
      address: addr,
      displayName: "Xverse Wallet",
      displayAddress: `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`,
      networkName: "Bitcoin",
      balance,
    }
  }

  private async connectHiro(): Promise<WalletAccount> {
    return new Promise((resolve, reject) => {
      try {
        const btcProvider = (window as any).btc || (window as any).LeatherProvider

        if (!btcProvider) {
          reject(new Error("Hiro Wallet not found"))
          return
        }

        // Request connection
        btcProvider
          .request("getAddresses")
          .then((response: any) => {
            if (!response.result || !response.result.addresses || response.result.addresses.length === 0) {
              reject(new Error("No addresses returned from Hiro Wallet"))
              return
            }

            const addresses = response.result.addresses
            const paymentAddress = addresses.find((addr: any) => addr.type === "p2wpkh" || addr.type === "p2tr")

            if (!paymentAddress) {
              reject(new Error("No payment address found"))
              return
            }

            const addr = paymentAddress.address
            useBTCWalletStore.getState().setWallet({
              walletId: "hiro",
              paymentAddress: addr,
              ordinalsAddress: addr,
            })
            fetchBitcoinBalance(addr).then((balance) => {
              resolve({
                address: addr,
                displayName: "Hiro Wallet",
                displayAddress: `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`,
                networkName: "Bitcoin",
                balance,
              })
            })
          })
          .catch((error: any) => {
            reject(new Error(`Hiro Wallet connection failed: ${error.message}`))
          })
      } catch (error) {
        reject(error)
      }
    })
  }

  private async connectUnisat(): Promise<WalletAccount> {
    return new Promise((resolve, reject) => {
      try {
        const unisat = (window as any).unisat

        if (!unisat) {
          reject(new Error("Unisat wallet not found"))
          return
        }

        // Request account access
        unisat
          .requestAccounts()
          .then((accounts: string[]) => {
            if (!accounts || accounts.length === 0) {
              reject(new Error("No accounts returned from Unisat"))
              return
            }

            const address = accounts[0]
            const account: WalletAccount = {
              address,
              displayName: "Unisat Wallet",
              displayAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
              networkName: "Bitcoin",
            }

            useBTCWalletStore.getState().setWallet({
              walletId: "unisat",
              paymentAddress: address,
              ordinalsAddress: address,
            })

            // Get balance if available
            unisat
              .getBalance()
              .then((balance: { confirmed: number; unconfirmed: number; total: number }) => {
                account.balance = `${(balance.total / 100000000).toFixed(8)} BTC`
                resolve(account)
              })
              .catch(() => {
                account.balance = "0 BTC"
                resolve(account)
              })
          })
          .catch((error: any) => {
            reject(new Error(`Unisat connection failed: ${error.message}`))
          })
      } catch (error) {
        reject(error)
      }
    })
  }

  async disconnect(): Promise<void> {
    this.account = null
    this.walletId = null
    this.connectedAddresses = []
    useBTCWalletStore.getState().disconnect()
    // Most Bitcoin wallets don't have a programmatic disconnect method —
    // the user disconnects from the extension directly.
  }

  async getAccount(): Promise<WalletAccount | null> {
    return this.account
  }

  async getBalance(): Promise<string | null> {
    if (!this.account) {
      return null
    }

    return this.account.balance || "0 BTC"
  }

  async signMessage(message: string): Promise<string> {
    if (!this.walletId || !this.account) {
      throw new Error("No wallet connected")
    }

    try {
      switch (this.walletId) {
        case "unisat":
          const unisat = (window as any).unisat
          if (unisat) {
            return await unisat.signMessage(message)
          }
          break
        case "xverse": {
          const { request: satsRequest } = await import("sats-connect")
          const res = await satsRequest("signMessage", {
            address: this.account!.address,
            message,
          })
          if (res.status === "success") return res.result.signature
          throw new Error(res.error?.message ?? "Xverse signing cancelled")
        }
        case "hiro":
          const btcProvider = (window as any).btc || (window as any).LeatherProvider
          if (btcProvider) {
            const response = await btcProvider.request("signMessage", {
              message,
              paymentType: "p2wpkh",
            })
            return response.result.signature
          }
          break
      }
    } catch (error) {
      console.error("Failed to sign message:", error)

      // For demo purposes, return a mock signature
      return `mock_signature_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    }

    // For demo purposes, return a mock signature
    return `mock_signature_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  // Get connected addresses (useful for Bitcoin's multiple address types)
  getConnectedAddresses(): BitcoinAddress[] {
    return this.connectedAddresses
  }

  // For persistence
  serialize(): any {
    return {
      walletId: this.walletId,
      account: this.account,
      connectedAddresses: this.connectedAddresses,
    }
  }

  deserialize(data: any): void {
    if (data) {
      this.walletId = data.walletId || null
      this.account = data.account || null
      this.connectedAddresses = data.connectedAddresses || []

      // Update installation status on deserialize
      this.supportedWallets = this.supportedWallets.map((wallet) => ({
        ...wallet,
        isInstalled:
          wallet.id === "xverse"
            ? isXverseInstalled()
            : wallet.id === "hiro"
              ? isHiroInstalled()
              : wallet.id === "unisat"
                ? isUnisatInstalled()
                : false,
      }))
    }
  }

  // Refresh installation status (useful for checking after page load)
  refreshInstallationStatus(): void {
    this.supportedWallets = this.supportedWallets.map((wallet) => ({
      ...wallet,
      isInstalled:
        wallet.id === "xverse"
          ? isXverseInstalled()
          : wallet.id === "hiro"
            ? isHiroInstalled()
            : wallet.id === "unisat"
              ? isUnisatInstalled()
              : false,
    }))
  }
}
