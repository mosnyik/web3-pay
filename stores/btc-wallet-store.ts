import { create } from "zustand"
import { persist } from "zustand/middleware"

interface BTCWalletState {
  isConnected: boolean
  walletId: string        // "xverse" | "unisat" | "hiro"
  paymentAddress: string  // bc1... or 1... or 3...
  ordinalsAddress: string // bc1... (taproot)
  stacksAddress: string   // STX address (Xverse only)
  publicKey: string
  setWallet: (wallet: Partial<Omit<BTCWalletState, "setWallet" | "disconnect">>) => void
  disconnect: () => void
}

export const useBTCWalletStore = create(
  persist<BTCWalletState>(
    (set) => ({
      isConnected: false,
      walletId: "",
      paymentAddress: "",
      ordinalsAddress: "",
      stacksAddress: "",
      publicKey: "",
      setWallet: (wallet) => set((s) => ({ ...s, ...wallet, isConnected: true })),
      disconnect: () =>
        set({
          isConnected: false,
          walletId: "",
          paymentAddress: "",
          ordinalsAddress: "",
          stacksAddress: "",
          publicKey: "",
        }),
    }),
    { name: "btc-wallet-storage" },
  ),
)
