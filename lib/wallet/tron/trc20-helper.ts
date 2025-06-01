import type { TRC20Token } from "./trc20-tokens"
import { TRC20_ABI, formatTokenAmount } from "./trc20-tokens"

export interface TokenBalance {
  token: TRC20Token
  balance: string
  formattedBalance: string
  usdValue?: string
}

export class TRC20Helper {
  private tronWeb: any

  constructor(tronWeb: any) {
    this.tronWeb = tronWeb
  }

  /**
   * Get TRC-20 token balance for an address
   */
  async getTokenBalance(tokenAddress: string, walletAddress: string, decimals: number): Promise<string> {
    try {
      if (!this.tronWeb || !this.tronWeb.ready) {
        throw new Error("TronWeb not ready")
      }

      // Create contract instance
      const contract = await this.tronWeb.contract(TRC20_ABI, tokenAddress)

      // Call balanceOf function
      const balance = await contract.balanceOf(walletAddress).call()

      // Return raw balance
      return balance.toString()
    } catch (error) {
      console.error(`Error getting token balance for ${tokenAddress}:`, error)
      return "0"
    }
  }

  /**
   * Get formatted token balance with proper decimals
   */
  async getFormattedTokenBalance(token: TRC20Token, walletAddress: string): Promise<TokenBalance> {
    const rawBalance = await this.getTokenBalance(token.address, walletAddress, token.decimals)
    const formattedBalance = formatTokenAmount(rawBalance, token.decimals)

    return {
      token,
      balance: rawBalance,
      formattedBalance: `${formattedBalance} ${token.symbol}`,
    }
  }

  /**
   * Get balances for multiple tokens
   */
  async getTokenBalances(tokens: TRC20Token[], walletAddress: string): Promise<TokenBalance[]> {
    const balancePromises = tokens.map((token) => this.getFormattedTokenBalance(token, walletAddress))
    return Promise.all(balancePromises)
  }

  /**
   * Transfer TRC-20 tokens
   */
  async transferToken(
    tokenAddress: string,
    toAddress: string,
    amount: string,
    decimals: number,
  ): Promise<{ success: boolean; txId?: string; error?: string }> {
    try {
      if (!this.tronWeb || !this.tronWeb.ready) {
        throw new Error("TronWeb not ready")
      }

      // Create contract instance
      const contract = await this.tronWeb.contract(TRC20_ABI, tokenAddress)

      // Execute transfer
      const transaction = await contract.transfer(toAddress, amount).send()

      return {
        success: true,
        txId: transaction,
      }
    } catch (error) {
      console.error(`Error transferring token ${tokenAddress}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during token transfer",
      }
    }
  }

  /**
   * Check if an address has approved a spender for a token
   */
  async getAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string): Promise<string> {
    try {
      if (!this.tronWeb || !this.tronWeb.ready) {
        throw new Error("TronWeb not ready")
      }

      // Create contract instance
      const contract = await this.tronWeb.contract(TRC20_ABI, tokenAddress)

      // Call allowance function
      const allowance = await contract.allowance(ownerAddress, spenderAddress).call()

      return allowance.toString()
    } catch (error) {
      console.error(`Error getting allowance for ${tokenAddress}:`, error)
      return "0"
    }
  }

  /**
   * Approve a spender for a token
   */
  async approveToken(
    tokenAddress: string,
    spenderAddress: string,
    amount: string,
  ): Promise<{ success: boolean; txId?: string; error?: string }> {
    try {
      if (!this.tronWeb || !this.tronWeb.ready) {
        throw new Error("TronWeb not ready")
      }

      // Create contract instance
      const contract = await this.tronWeb.contract(TRC20_ABI, tokenAddress)

      // Execute approve
      const transaction = await contract.approve(spenderAddress, amount).send()

      return {
        success: true,
        txId: transaction,
      }
    } catch (error) {
      console.error(`Error approving token ${tokenAddress}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during token approval",
      }
    }
  }

  /**
   * Get token information (symbol, name, decimals)
   */
  async getTokenInfo(tokenAddress: string): Promise<Partial<TRC20Token> | null> {
    try {
      if (!this.tronWeb || !this.tronWeb.ready) {
        throw new Error("TronWeb not ready")
      }

      // Create contract instance
      const contract = await this.tronWeb.contract(TRC20_ABI, tokenAddress)

      // Get token info
      const [symbol, name, decimals] = await Promise.all([
        contract.symbol().call(),
        contract.name().call(),
        contract.decimals().call(),
      ])

      return {
        address: tokenAddress,
        symbol,
        name,
        decimals: Number.parseInt(decimals.toString(), 10),
      }
    } catch (error) {
      console.error(`Error getting token info for ${tokenAddress}:`, error)
      return null
    }
  }
}
