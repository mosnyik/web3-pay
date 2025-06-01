/**
 * Authentication service for wallet-based authentication
 * Handles JWT token management and session persistence
 */

// JWT token storage keys
const AUTH_TOKEN_KEY = "web3pay_auth_token"
const AUTH_REFRESH_TOKEN_KEY = "web3pay_refresh_token"
const AUTH_EXPIRY_KEY = "web3pay_auth_expiry"

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

export interface AuthUser {
  id: string
  address: string
  network: string
  displayName?: string
  profileImage?: string
}

export class AuthService {
  private tokens: AuthTokens | null = null
  private user: AuthUser | null = null

  constructor() {
    this.loadTokens()
  }

  /**
   * Store authentication tokens
   */
  setTokens(tokens: AuthTokens): void {
    this.tokens = tokens

    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, tokens.accessToken)

    if (tokens.refreshToken) {
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, tokens.refreshToken)
    }

    if (tokens.expiresAt) {
      localStorage.setItem(AUTH_EXPIRY_KEY, tokens.expiresAt.toString())
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.tokens?.accessToken || null
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!this.tokens?.accessToken) return false

    // Check expiration if available
    if (this.tokens.expiresAt) {
      return Date.now() < this.tokens.expiresAt
    }

    return true
  }

  /**
   * Clear authentication data
   */
  logout(): void {
    this.tokens = null
    this.user = null

    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY)
    localStorage.removeItem(AUTH_EXPIRY_KEY)
  }

  /**
   * Load tokens from storage
   */
  private loadTokens(): void {
    if (typeof window === "undefined") return

    const accessToken = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!accessToken) return

    const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY) || undefined
    const expiryStr = localStorage.getItem(AUTH_EXPIRY_KEY)
    const expiresAt = expiryStr ? Number.parseInt(expiryStr, 10) : undefined

    this.tokens = { accessToken, refreshToken, expiresAt }
  }

  /**
   * Set current user
   */
  setUser(user: AuthUser): void {
    this.user = user
  }

  /**
   * Get current user
   */
  getUser(): AuthUser | null {
    return this.user
  }

  /**
   * Authenticate with wallet signature
   * @param address Wallet address
   * @param signature Signed message signature
   * @param network Blockchain network
   */
  async authenticateWithWallet(address: string, signature: string, network: string): Promise<AuthUser> {
    try {
      // This would be a real API call in production
      // For demo purposes, we'll simulate a successful response

      // In production:
      // const response = await fetch('/api/auth/wallet', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ address, signature, network })
      // });
      // const data = await response.json();

      // Simulate API response
      const data = {
        user: {
          id: `user_${Math.random().toString(36).substring(2, 9)}`,
          address,
          network,
          displayName: `${network} User`,
        },
        tokens: {
          accessToken: `jwt_${Math.random().toString(36).substring(2, 15)}`,
          refreshToken: `refresh_${Math.random().toString(36).substring(2, 15)}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        },
      }

      // Store tokens
      this.setTokens(data.tokens)

      // Store user
      this.setUser(data.user)

      return data.user
    } catch (error) {
      console.error("Authentication error:", error)
      throw new Error("Failed to authenticate with wallet")
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    if (!this.tokens?.refreshToken) return false

    try {
      // This would be a real API call in production
      // For demo purposes, we'll simulate a successful response

      // In production:
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ refreshToken: this.tokens.refreshToken })
      // });
      // const data = await response.json();

      // Simulate API response
      const data = {
        accessToken: `jwt_${Math.random().toString(36).substring(2, 15)}`,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }

      // Update tokens
      this.tokens = {
        ...this.tokens,
        accessToken: data.accessToken,
        expiresAt: data.expiresAt,
      }

      // Store updated token
      localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken)
      localStorage.setItem(AUTH_EXPIRY_KEY, data.expiresAt.toString())

      return true
    } catch (error) {
      console.error("Token refresh error:", error)
      return false
    }
  }
}

// Create singleton instance
export const authService = new AuthService()
