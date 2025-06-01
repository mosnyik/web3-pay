import type { WalletAdapter, WalletAccount, WalletInfo, ConnectOptions } from "../types"
import { TRC20Helper, type TokenBalance } from "../tron/trc20-helper"
import { TRC20_TOKENS, type TRC20Token } from "../tron/trc20-tokens"

// TronWeb types
interface TronWebInstance {
  ready: boolean
  defaultAddress: {
    base58: string
    hex: string
  }
  trx: {
    getBalance: (address: string) => Promise<number>
    sign: (transaction: any) => Promise<any>
    signMessageV2: (message: string) => Promise<string>
  }
  contract: (abi: any, address: string) => any
  isConnected: () => boolean
  request: (args: { method: string; params?: any }) => Promise<any>
}

interface TronLinkResponse {
  code: number
  message: string
  data?: any
}

// Wallet detection functions
const isTronLinkInstalled = (): boolean => {
  if (typeof window === "undefined") return false
  return !!(window as any).tronLink || !!(window as any).tronWeb
}

const isTrustWalletInstalled = (): boolean => {
  if (typeof window === "undefined") return false
  return !!(window as any).trustwallet?.tron
}

const isMathWalletInstalled = (): boolean => {
  if (typeof window === "undefined") return false
  return !!(window as any).tronWeb && (window as any).tronWeb.isMathWallet
}

const isKleverInstalled = (): boolean => {
  if (typeof window === "undefined") return false
  return !!(window as any).kleverWeb
}

// Check if TronLink is logged in
const isTronLinkLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false
  const tronWeb = (window as any).tronWeb
  return !!(tronWeb && tronWeb.ready && tronWeb.defaultAddress && tronWeb.defaultAddress.base58)
}

export class TronAdapter implements WalletAdapter {
  id = "tron"
  name = "Tron"
  icon = "⚡"

  private account: WalletAccount | null = null
  private walletId: string | null = null
  private tronWeb: TronWebInstance | null = null
  private trc20Helper: TRC20Helper | null = null
  private tokenBalances: TokenBalance[] = []

  supportedWallets: WalletInfo[] = [
    {
      id: "tronlink",
      name: "TronLink",
      icon: "🔗",
      description: "Official Tron wallet extension",
      downloadUrl: "https://www.tronlink.org/",
      isInstalled: isTronLinkInstalled(),
    },
    {
      id: "trust",
      name: "Trust Wallet",
      icon: "🛡️",
      description: "Multi-chain mobile wallet with Tron support",
      downloadUrl: "https://trustwallet.com/",
      isInstalled: isTrustWalletInstalled(),
    },
    {
      id: "math",
      name: "Math Wallet",
      icon: "🧮",
      description: "Multi-platform crypto wallet",
      downloadUrl: "https://mathwallet.org/",
      isInstalled: isMathWalletInstalled(),
    },
    {
      id: "klever",
      name: "Klever",
      icon: "💎",
      description: "Crypto wallet & exchange platform",
      downloadUrl: "https://klever.io/",
      isInstalled: isKleverInstalled(),
    },
  ]

  async connect(options?: ConnectOptions): Promise<WalletAccount> {
    const walletId = options?.walletId || this.supportedWallets[0].id
    const wallet = this.supportedWallets.find((w) => w.id === walletId)

    if (!wallet) {
      throw new Error(`Wallet ${walletId} not supported`)
    }

    if (!wallet.isInstalled) {
      throw new Error(`${wallet.name} is not installed. Please install it from ${wallet.downloadUrl}`)
    }

    try {
      let account: WalletAccount

      switch (walletId) {
        case "tronlink":
          account = await this.connectTronLink()
          break
        case "trust":
          account = await this.connectTrustWallet()
          break
        case "math":
          account = await this.connectMathWallet()
          break
        case "klever":
          account = await this.connectKlever()
          break
        default:
          throw new Error(`Connection method for ${walletId} not implemented`)
      }

      this.account = account
      this.walletId = walletId

      // Initialize TRC20 helper if TronWeb is available
      if (this.tronWeb) {
        this.trc20Helper = new TRC20Helper(this.tronWeb)

        // Fetch token balances in the background
        this.fetchTokenBalances().catch(console.error)
      }

      return account
    } catch (error) {
      console.error(`Failed to connect to ${wallet.name}:`, error)
      throw error
    }
  }

  private async connectTronLink(): Promise<WalletAccount> {
    return new Promise((resolve, reject) => {
      try {
        // Check if TronLink is installed
        if (!(window as any).tronLink && !(window as any).tronWeb) {
          reject(new Error("TronLink is not installed"))
          return
        }

        // Wait for TronLink to be ready
        const checkTronLink = () => {
          if ((window as any).tronWeb && (window as any).tronWeb.ready) {
            this.handleTronLinkConnection(resolve, reject)
          } else {
            // TronLink is installed but not ready, prompt user to login
            this.promptTronLinkLogin(resolve, reject)
          }
        }

        // Check immediately
        checkTronLink()

        // Also listen for TronLink ready event
        window.addEventListener("message", (event) => {
          if (event.data.message && event.data.message.action === "setAccount") {
            setTimeout(checkTronLink, 100)
          }
        })

        // Timeout after 30 seconds
        setTimeout(() => {
          reject(new Error("TronLink connection timeout. Please make sure you're logged in."))
        }, 30000)
      } catch (error) {
        reject(error)
      }
    })
  }

  private async handleTronLinkConnection(
    resolve: (account: WalletAccount) => void,
    reject: (error: Error) => void,
  ): Promise<void> {
    try {
      const tronWeb = (window as any).tronWeb

      if (!tronWeb.ready || !tronWeb.defaultAddress || !tronWeb.defaultAddress.base58) {
        reject(new Error("TronLink is not logged in. Please login to your TronLink wallet."))
        return
      }

      this.tronWeb = tronWeb
      const address = tronWeb.defaultAddress.base58

      // Get balance
      let balance = "0 TRX"
      try {
        const balanceInSun = await tronWeb.trx.getBalance(address)
        balance = `${(balanceInSun / 1000000).toFixed(2)} TRX`
      } catch (balanceError) {
        console.warn("Failed to get balance:", balanceError)
      }

      const account: WalletAccount = {
        address,
        displayName: "TronLink Wallet",
        displayAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        balance,
        networkName: "Tron",
      }

      resolve(account)
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)))
    }
  }

  private async promptTronLinkLogin(
    resolve: (account: WalletAccount) => void,
    reject: (error: Error) => void,
  ): Promise<void> {
    // Show user-friendly message about logging in
    const shouldRetry = confirm(
      "TronLink is installed but you're not logged in.\n\n" +
        "Please:\n" +
        "1. Click on the TronLink extension icon\n" +
        "2. Login to your wallet\n" +
        "3. Click 'OK' to retry connection\n\n" +
        "Click 'Cancel' to abort connection.",
    )

    if (!shouldRetry) {
      reject(new Error("User cancelled TronLink login"))
      return
    }

    // Wait a bit for user to login
    setTimeout(() => {
      if (isTronLinkLoggedIn()) {
        this.handleTronLinkConnection(resolve, reject)
      } else {
        // Retry prompt
        this.promptTronLinkLogin(resolve, reject)
      }
    }, 1000)
  }

  private async connectTrustWallet(): Promise<WalletAccount> {
    return new Promise((resolve, reject) => {
      try {
        const trustWallet = (window as any).trustwallet?.tron

        if (!trustWallet) {
          reject(new Error("Trust Wallet Tron provider not found"))
          return
        }

        // Request account access
        trustWallet
          .request({ method: "tron_requestAccounts" })
          .then((accounts: string[]) => {
            if (!accounts || accounts.length === 0) {
              reject(new Error("No accounts returned from Trust Wallet"))
              return
            }

            const address = accounts[0]
            const account: WalletAccount = {
              address,
              displayName: "Trust Wallet",
              displayAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
              networkName: "Tron",
            }

            // For Trust Wallet, we need to get the TronWeb instance differently
            if ((window as any).tronWeb) {
              this.tronWeb = (window as any).tronWeb
            }

            resolve(account)
          })
          .catch((error: any) => {
            reject(new Error(`Trust Wallet connection failed: ${error.message}`))
          })
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  private async connectMathWallet(): Promise<WalletAccount> {
    return new Promise((resolve, reject) => {
      try {
        const tronWeb = (window as any).tronWeb

        if (!tronWeb || !tronWeb.isMathWallet) {
          reject(new Error("Math Wallet not found"))
          return
        }

        // Math Wallet uses TronWeb interface
        if (!tronWeb.ready || !tronWeb.defaultAddress) {
          reject(new Error("Math Wallet is not ready. Please login to your Math Wallet."))
          return
        }

        this.tronWeb = tronWeb
        const address = tronWeb.defaultAddress.base58
        const account: WalletAccount = {
          address,
          displayName: "Math Wallet",
          displayAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          networkName: "Tron",
        }

        resolve(account)
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  private async connectKlever(): Promise<WalletAccount> {
    return new Promise((resolve, reject) => {
      try {
        const kleverWeb = (window as any).kleverWeb

        if (!kleverWeb) {
          reject(new Error("Klever Wallet not found"))
          return
        }

        // Request connection
        kleverWeb
          .initialize()
          .then(() => {
            return kleverWeb.getAccount()
          })
          .then((accountInfo: any) => {
            if (!accountInfo || !accountInfo.address) {
              reject(new Error("No account information from Klever Wallet"))
              return
            }

            const address = accountInfo.address
            const account: WalletAccount = {
              address,
              displayName: "Klever Wallet",
              displayAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
              balance: accountInfo.balance ? `${accountInfo.balance} TRX` : undefined,
              networkName: "Tron",
            }

            // For Klever, we might need to get TronWeb differently
            if ((window as any).tronWeb) {
              this.tronWeb = (window as any).tronWeb
            }

            resolve(account)
          })
          .catch((error: any) => {
            reject(new Error(`Klever Wallet connection failed: ${error.message}`))
          })
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  async disconnect(): Promise<void> {
    this.account = null
    this.walletId = null
    this.tronWeb = null
    this.trc20Helper = null
    this.tokenBalances = []

    // Note: Most Tron wallets don't have a programmatic disconnect method
    // The user needs to disconnect from the wallet extension directly
  }

  async getAccount(): Promise<WalletAccount | null> {
    return this.account
  }

  async getBalance(): Promise<string | null> {
    if (!this.account || !this.tronWeb) {
      return null
    }

    try {
      const balanceInSun = await this.tronWeb.trx.getBalance(this.account.address)
      return `${(balanceInSun / 1000000).toFixed(2)} TRX`
    } catch (error) {
      console.error("Failed to get balance:", error)
      return null
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.walletId || !this.account) {
      throw new Error("No wallet connected")
    }

    try {
      switch (this.walletId) {
        case "tronlink":
          if (!this.tronWeb) {
            throw new Error("TronWeb not available")
          }
          // Use TronLink's message signing
          return await this.tronWeb.trx.signMessageV2(message)

        case "trust":
          const trustWallet = (window as any).trustwallet?.tron
          if (trustWallet) {
            const response = await trustWallet.request({
              method: "tron_signMessage",
              params: { message, address: this.account.address },
            })
            return response.signature
          }
          break

        case "math":
          if (this.tronWeb && this.tronWeb.trx.signMessageV2) {
            return await this.tronWeb.trx.signMessageV2(message)
          }
          break

        case "klever":
          const kleverWeb = (window as any).kleverWeb
          if (kleverWeb) {
            const response = await kleverWeb.signMessage(message)
            return response.signature
          }
          break
      }
    } catch (error) {
      console.error("Failed to sign message:", error)
      throw error
    }

    throw new Error(`Message signing not implemented for ${this.walletId}`)
  }

  async signTransaction(transaction: any): Promise<string> {
    if (!this.walletId || !this.account || !this.tronWeb) {
      throw new Error("No wallet connected")
    }

    try {
      const signedTransaction = await this.tronWeb.trx.sign(transaction)
      return signedTransaction
    } catch (error) {
      console.error("Failed to sign transaction:", error)
      throw error
    }
  }

  // TRC-20 Token Methods

  /**
   * Fetch balances for common TRC-20 tokens
   */
  async fetchTokenBalances(): Promise<TokenBalance[]> {
    if (!this.account || !this.trc20Helper) {
      return []
    }

    try {
      // Get balances for common tokens
      const tokens = Object.values(TRC20_TOKENS)
      this.tokenBalances = await this.trc20Helper.getTokenBalances(tokens, this.account.address)
      return this.tokenBalances
    } catch (error) {
      console.error("Failed to fetch token balances:", error)
      return []
    }
  }

  /**
   * Get cached token balances
   */
  getTokenBalances(): TokenBalance[] {
    return this.tokenBalances
  }

  /**
   * Get balance for a specific token
   */
  async getTokenBalance(tokenSymbol: string): Promise<TokenBalance | null> {
    if (!this.account || !this.trc20Helper) {
      return null
    }

    // Check if we have the token in our list
    const token = TRC20_TOKENS[tokenSymbol]
    if (!token) {
      return null
    }

    try {
      return await this.trc20Helper.getFormattedTokenBalance(token, this.account.address)
    } catch (error) {
      console.error(`Failed to get balance for ${tokenSymbol}:`, error)
      return null
    }
  }

  /**
   * Transfer TRC-20 tokens
   */
  async transferToken(
    tokenSymbol: string,
    toAddress: string,
    amount: string,
  ): Promise<{ success: boolean; txId?: string; error?: string }> {
    if (!this.account || !this.trc20Helper) {
      return { success: false, error: "Wallet not connected" }
    }

    // Check if we have the token in our list
    const token = TRC20_TOKENS[tokenSymbol]
    if (!token) {
      return { success: false, error: `Token ${tokenSymbol} not supported` }
    }

    try {
      // Parse amount to token decimals
      const amountInSmallestUnit = (Number.parseFloat(amount) * Math.pow(10, token.decimals)).toString()

      // Transfer tokens
      return await this.trc20Helper.transferToken(token.address, toAddress, amountInSmallestUnit, token.decimals)
    } catch (error) {
      console.error(`Failed to transfer ${tokenSymbol}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during token transfer",
      }
    }
  }

  /**
   * Add a custom TRC-20 token
   */
  async addCustomToken(address: string): Promise<TRC20Token | null> {
    if (!this.trc20Helper) {
      return null
    }

    try {
      // Get token info from contract
      const tokenInfo = await this.trc20Helper.getTokenInfo(address)
      if (!tokenInfo || !tokenInfo.symbol || !tokenInfo.decimals) {
        throw new Error("Invalid token contract")
      }

      // Create token object
      const token: TRC20Token = {
        address,
        symbol: tokenInfo.symbol,
        name: tokenInfo.name || tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        color: "bg-gray-500", // Default color
        logo: "🪙", // Default logo
      }

      return token
    } catch (error) {
      console.error("Failed to add custom token:", error)
      return null
    }
  }

  // Check if wallet is logged in (specific to TronLink)
  isLoggedIn(): boolean {
    if (this.walletId === "tronlink") {
      return isTronLinkLoggedIn()
    }
    return !!this.account
  }

  // Get TronWeb instance for advanced operations
  getTronWeb(): TronWebInstance | null {
    return this.tronWeb
  }

  // Get TRC20 helper for token operations
  getTRC20Helper(): TRC20Helper | null {
    return this.trc20Helper
  }

  // For persistence
  serialize(): any {
    return {
      walletId: this.walletId,
      account: this.account,
      tokenBalances: this.tokenBalances,
    }
  }

  deserialize(data: any): void {
    if (data) {
      this.walletId = data.walletId || null
      this.account = data.account || null
      this.tokenBalances = data.tokenBalances || []

      // Update installation status on deserialize
      this.supportedWallets = this.supportedWallets.map((wallet) => ({
        ...wallet,
        isInstalled:
          wallet.id === "tronlink"
            ? isTronLinkInstalled()
            : wallet.id === "trust"
              ? isTrustWalletInstalled()
              : wallet.id === "math"
                ? isMathWalletInstalled()
                : wallet.id === "klever"
                  ? isKleverInstalled()
                  : false,
      }))

      // Try to restore TronWeb connection if it was TronLink
      if (this.walletId === "tronlink" && (window as any).tronWeb) {
        this.tronWeb = (window as any).tronWeb
        this.trc20Helper = new TRC20Helper(this.tronWeb)
      }
    }
  }

  // Refresh installation status
  refreshInstallationStatus(): void {
    this.supportedWallets = this.supportedWallets.map((wallet) => ({
      ...wallet,
      isInstalled:
        wallet.id === "tronlink"
          ? isTronLinkInstalled()
          : wallet.id === "trust"
            ? isTrustWalletInstalled()
            : wallet.id === "math"
              ? isMathWalletInstalled()
              : wallet.id === "klever"
                ? isKleverInstalled()
                : false,
    }))
  }

  // Check if TronLink needs login prompt
  needsLogin(): boolean {
    return this.walletId === "tronlink" && isTronLinkInstalled() && !isTronLinkLoggedIn()
  }
}
