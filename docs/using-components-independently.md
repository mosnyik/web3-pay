# Using Web3 Payment Gateway Components Independently

This guide explains how to use individual components from the Web3 Payment Gateway in your own projects.

## Minimal Setup for Wallet Connection Only

If you only need the wallet connection functionality, follow these steps:

### 1. Required Dependencies

```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
```

### 2. Setup Providers

Create a minimal providers setup:

```tsx
// components/minimal-providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet } from "wagmi/chains"

const queryClient = new QueryClient()

// Minimal configuration
const config = getDefaultConfig({
  appName: "Your App Name",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [mainnet],
  ssr: true,
})

export function MinimalProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### 3. Use the Standalone Wallet Connect Button

```tsx
// components/my-page.tsx
"use client"

import { MinimalProviders } from "./minimal-providers"
import { WalletConnectStandalone } from "@/components/standalone/wallet-connect-standalone"

export function MyPage() {
  const handleConnect = (account: any) => {
    console.log("Connected account:", account)
  }

  const handleDisconnect = () => {
    console.log("Wallet disconnected")
  }

  return (
    <MinimalProviders>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Custom Page</h1>
        <WalletConnectStandalone 
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </div>
    </MinimalProviders>
  )
}
```

## Using Specific Chain Adapters

### Bitcoin Adapter Only

```tsx
// components/bitcoin-only.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BitcoinAdapter } from "@/lib/wallet/adapters/bitcoin-adapter"
import type { WalletAccount } from "@/lib/wallet/types"

export function BitcoinOnly() {
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const bitcoinAdapter = new BitcoinAdapter()
  
  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const connectedAccount = await bitcoinAdapter.connect()
      setAccount(connectedAccount)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect")
    } finally {
      setIsConnecting(false)
    }
  }
  
  const handleDisconnect = async () => {
    await bitcoinAdapter.disconnect()
    setAccount(null)
  }
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Bitcoin Connection</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {account ? (
        <div className="space-y-2">
          <div className="p-2 bg-green-100 text-green-700 rounded-md">
            Connected to {account.displayAddress}
          </div>
          <Button onClick={handleDisconnect}>Disconnect</Button>
        </div>
      ) : (
        <Button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Bitcoin Wallet"}
        </Button>
      )}
    </div>
  )
}
```

### Ethereum Only with RainbowKit

```tsx
// components/ethereum-only.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet } from "wagmi/chains"
import { ConnectButton } from "@rainbow-me/rainbowkit"

const queryClient = new QueryClient()

// Ethereum only configuration
const config = getDefaultConfig({
  appName: "Ethereum Only Demo",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [mainnet],
  ssr: true,
})

export function EthereumOnly() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Ethereum Connection</h2>
            <ConnectButton />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## Using the Checkout Component Independently

```tsx
// components/standalone-checkout.tsx
"use client"

import { useState } from "react"
import { MinimalProviders } from "./minimal-providers"
import { CheckoutPage } from "@/components/checkout-page"
import { WalletConnectStandalone } from "@/components/standalone/wallet-connect-standalone"

export function StandaloneCheckout() {
  const [isConnected, setIsConnected] = useState(false)
  
  return (
    <MinimalProviders>
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <WalletConnectStandalone 
            onConnect={() => setIsConnected(true)}
            onDisconnect={() => setIsConnected(false)}
          />
        </div>
        
        {isConnected ? (
          <CheckoutPage 
            amount="100" 
            currency="USD" 
            merchantName="Example Store" 
            orderId="ORDER-123"
          />
        ) : (
          <div className="p-8 text-center border rounded-lg">
            <p className="text-lg">Please connect your wallet to continue checkout</p>
          </div>
        )}
      </div>
    </MinimalProviders>
  )
}
```

## Customizing Components

Most components accept standard props for customization:

```tsx
<WalletConnectStandalone 
  variant="outline"  // default, outline, secondary, ghost
  size="lg"          // default, sm, lg
  onConnect={handleConnect}
  onDisconnect={handleDisconnect}
/>
```

For more advanced customization, you can copy the component code and modify it to suit your needs.
