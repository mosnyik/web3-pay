# Web3 Payment Gateway - Wallet Integration Documentation

This document provides comprehensive documentation for the wallet integration system in the Web3 Payment Gateway.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Wallet Adapters](#wallet-adapters)
3. [Authentication](#authentication)
4. [Token Support](#token-support)
5. [Error Handling](#error-handling)
6. [Theme Support](#theme-support)
7. [TypeScript Integration](#typescript-integration)
8. [Usage Examples](#usage-examples)

## Architecture Overview

The wallet integration system follows an adapter pattern, providing a unified interface for interacting with different blockchain wallets. The core components are:

- **Wallet Context**: Provides global state and methods for wallet connections
- **Wallet Adapters**: Blockchain-specific implementations for different networks
- **Authentication Service**: Handles JWT-based authentication with wallet signatures
- **UI Components**: Status indicators, connection modals, and token management interfaces

### Key Files

- `lib/wallet/wallet-context.tsx`: Core context provider for wallet state
- `lib/wallet/types.ts`: TypeScript interfaces for the wallet system
- `lib/wallet/adapters/`: Network-specific wallet adapters
- `lib/wallet/auth-service.ts`: JWT authentication service
- `components/wallet-connect-modal.tsx`: UI for connecting wallets
- `components/wallet-status-indicator.tsx`: UI for displaying wallet status

## Wallet Adapters

The system supports multiple blockchain networks through adapters:

### Ethereum Adapter

- Uses RainbowKit and wagmi for Ethereum wallet connections
- Supports MetaMask, WalletConnect, Coinbase Wallet, and more
- Handles network switching and transaction signing

### Bitcoin Adapter

- Uses sats-connect for Bitcoin wallet connections
- Supports Xverse, Hiro/Leather, and Unisat wallets
- Handles UTXO management and transaction signing

### Tron Adapter

- Uses TronWeb for Tron wallet connections
- Supports TronLink, Trust Wallet, Math Wallet, and Klever
- Handles TRX and TRC-20 token operations

### Solana Adapter

- Supports Phantom, Solflare, and Backpack wallets
- Handles SOL and SPL token operations

## Authentication

The system provides JWT-based authentication using wallet signatures:

1. User connects their wallet
2. System generates a unique message for the user to sign
3. User signs the message with their private key
4. Signature is verified on the backend
5. JWT token is issued and stored for persistent authentication

### Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Connect │     │  Sign   │     │ Verify  │     │  JWT    │
│  Wallet  │────▶│ Message │────▶│ Signature│────▶│ Token   │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
```

## Token Support

### Ethereum Tokens (ERC-20)

- Support for common ERC-20 tokens
- Balance fetching and transfer operations
- Token approval management

### Tron Tokens (TRC-20)

- Support for USDT, USDC, JST, WIN, BTT, SUN
- Balance fetching and transfer operations
- Custom token addition

### Bitcoin (BTC)

- Native Bitcoin support
- UTXO management
- Transaction building and signing

### Solana Tokens (SPL)

- Support for SOL and SPL tokens
- Balance fetching and transfer operations

## Error Handling

The system implements comprehensive error handling:

- Connection errors with user-friendly messages
- Transaction failures with detailed feedback
- Network status monitoring
- Wallet installation and login detection

### Error Categories

1. **Connection Errors**: Issues connecting to wallets
2. **Authentication Errors**: Problems with signing or verifying messages
3. **Transaction Errors**: Failed transfers or contract interactions
4. **Network Errors**: Internet connectivity issues
5. **Wallet State Errors**: Wallet not installed, locked, or on wrong network

## Theme Support

The wallet integration UI components support both light and dark themes:

- Automatic theme detection based on system preferences
- Manual theme switching
- Smooth theme transitions
- High contrast options for accessibility

### Theme Implementation

- Uses Next.js theme provider
- CSS variables for consistent theming
- Tailwind CSS for responsive design
- shadcn/ui components with theme support

## TypeScript Integration

The entire wallet system is built with TypeScript for type safety:

- Comprehensive interface definitions
- Type guards for runtime safety
- Generic types for adapter flexibility
- Strict null checking

### Key Types

```typescript
// Core wallet types
interface WalletAdapter {
  id: string;
  name: string;
  connect(options?: ConnectOptions): Promise<WalletAccount>;
  disconnect(): Promise<void>;
  // ...other methods
}

interface WalletAccount {
  address: string;
  displayName: string;
  displayAddress: string;
  balance?: string;
  networkName?: string;
}

// Authentication types
interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

interface AuthUser {
  id: string;
  address: string;
  network: string;
  displayName?: string;
}
```

## Usage Examples

### Connecting a Wallet

```tsx
import { useWalletConnection } from '@/lib/wallet/use-wallet-connection';

function ConnectButton() {
  const { connect, status, isConnecting } = useWalletConnection();
  
  const handleConnect = async () => {
    await connect('ethereum');
  };
  
  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
```

### Displaying Wallet Status

```tsx
import { WalletStatusIndicator } from '@/components/wallet-status-indicator';

function Header() {
  return (
    <header>
      <h1>Web3 Payment Gateway</h1>
      <WalletStatusIndicator />
    </header>
  );
}
```

### Transferring Tokens

```tsx
import { useWallet } from '@/lib/wallet/wallet-context';

function TokenTransfer() {
  const { activeAdapter } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  
  const handleTransfer = async () => {
    if (activeAdapter?.id === 'tron') {
      const tronAdapter = activeAdapter as any;
      await tronAdapter.transferToken('USDT', recipient, amount);
    }
  };
  
  // Render form...
}
```

### Authenticating with Wallet

```tsx
import { useWalletConnection } from '@/lib/wallet/use-wallet-connection';

function AuthButton() {
  const { authenticate, isAuthenticated, isAuthenticating } = useWalletConnection();
  
  if (isAuthenticated) {
    return <p>You are authenticated!</p>;
  }
  
  return (
    <Button onClick={authenticate} disabled={isAuthenticating}>
      {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
    </Button>
  );
}
```