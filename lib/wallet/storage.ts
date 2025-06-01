const STORAGE_KEY = "web3pay_wallet_state"

export interface StoredWalletState {
  adapterId: string | null
  walletId: string | null
  data: any
  timestamp: number
}

export const saveWalletState = (adapterId: string | null, walletId: string | null, data: any): void => {
  try {
    if (typeof window === "undefined") return

    const state: StoredWalletState = {
      adapterId,
      walletId,
      data,
      timestamp: Date.now(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error("Failed to save wallet state:", error)
  }
}

export const loadWalletState = (): StoredWalletState | null => {
  try {
    if (typeof window === "undefined") return null

    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null

    return JSON.parse(data) as StoredWalletState
  } catch (error) {
    console.error("Failed to load wallet state:", error)
    return null
  }
}

export const clearWalletState = (): void => {
  try {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear wallet state:", error)
  }
}
