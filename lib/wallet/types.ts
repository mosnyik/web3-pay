import type { ReactNode } from "react"

export type WalletStatus = "disconnected" | "connecting" | "connected" | "error"

export interface WalletInfo {
  id: string
  name: string
  icon: string | ReactNode
  description: string
  downloadUrl?: string
  isInstalled?: boolean
}

export interface WalletAccount {
  address: string
  displayName: string
  displayAddress: string
  balance?: string
  chainId?: string | number
  networkName?: string
}

export interface WalletState {
  status: WalletStatus
  account: WalletAccount | null
  walletId: string | null
  error: Error | null
}

export interface ConnectOptions {
  walletId?: string
  chainId?: string | number
}

export interface WalletAdapter {
  id: string
  name: string
  icon: string | ReactNode
  supportedWallets: WalletInfo[]

  // Core methods
  connect(options?: ConnectOptions): Promise<WalletAccount>
  disconnect(): Promise<void>
  getAccount(): Promise<WalletAccount | null>

  // Optional methods
  switchChain?(chainId: string | number): Promise<void>
  signMessage?(message: string): Promise<string>
  signTransaction?(transaction: unknown): Promise<string>

  // Persistence
  serialize(): any
  deserialize(data: any): void
}

export interface WalletAdapterConfig {
  autoConnect?: boolean
}

export interface WalletContextType {
  adapters: Record<string, WalletAdapter>
  activeAdapter: WalletAdapter | null
  status: WalletStatus
  account: WalletAccount | null
  error: Error | null

  connect(adapterId: string, options?: ConnectOptions): Promise<WalletAccount | null>
  disconnect(): Promise<void>
  switchAdapter(adapterId: string): Promise<void>
}
