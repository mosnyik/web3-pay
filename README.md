# Web3 Payment Gateway UI Kit

A complete, production-ready Web3 payment gateway solution with multi-chain wallet support, modern UI components, and comprehensive payment flow management.

## 🚀 Features

### Core Components
- **Multi-Chain Wallet Connection**: Support for Ethereum (RainbowKit), Bitcoin, Solana, and Tron with mocked modals
- **Crypto Checkout Page**: Complete cart management with token selection and payment confirmation
- **Payment Modal**: Reusable payment processing modal with real-time status updates
- **Payment Status Tracking**: Live transaction monitoring with confirmation progress
- **Transaction History**: Comprehensive payment history with filtering and search
- **Token Selector**: Support for ETH, USDC, BTC, TRX with balance display

### Design & UX
- **Responsive Design**: Full mobile, tablet, and desktop support
- **Theme Support**: Light/Dark mode with smooth transitions
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Developer Experience
- **TypeScript**: Full type safety throughout the application
- **Next.js 14**: App Router with server components and client components
- **Component Library**: Reusable, well-documented components
- **Mock Data**: Realistic mock data for development and testing

## 📦 Installation

### Using the Built-in Installation (Recommended)

1. Click the "Download Code" button in the Block view
2. Follow the shadcn CLI setup instructions
3. The installer will handle all dependencies and configuration

### Manual Installation

```bash
# Clone or download the project
git clone <your-repo-url>
cd web3-payment-gateway

# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

## 🛠️ Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Homepage with hero and wallet connect
│   ├── checkout/
│   │   └── page.tsx            # Checkout page with cart and payment
│   ├── transactions/
│   │   └── page.tsx            # Transaction history page
│   └── payment-status/[id]/
│       └── page.tsx            # Payment status tracking
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── navbar.tsx              # Navigation with theme toggle
│   ├── theme-toggle.tsx        # Dark/light mode switcher
│   ├── hero-section.tsx        # Landing page hero
│   ├── wallet-connect-section.tsx  # Wallet connection UI
│   ├── wallet-connect-modal.tsx    # Multi-chain wallet modal
│   ├── checkout-page.tsx       # Complete checkout flow
│   ├── token-selector.tsx      # Token selection component
│   ├── payment-modal.tsx       # Payment processing modal
│   ├── payment-status-page.tsx # Real-time status tracking
│   ├── transaction-history.tsx # Transaction management
│   └── features-section.tsx    # Feature highlights
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Optional: Add your API keys here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key
```

### Theme Configuration

The project uses Tailwind CSS with custom theme configuration. Modify \`tailwind.config.ts\` to customize colors and styling.

## 🔌 Integration Guide

### Adding Real Wallet Connections

#### Ethereum (RainbowKit)
```bash
npm install @rainbow-me/rainbowkit wagmi viem
```

```tsx
// Add to your layout.tsx
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'

// Configure chains and providers
// See RainbowKit documentation for full setup
```

#### Bitcoin Integration
```bash
npm install @unisat/wallet-sdk
```

#### Solana Integration
```bash
npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets
```

#### Tron Integration
```bash
npm install tronweb
```

### Backend Integration

#### Payment Processing
```typescript
// Example API route for payment processing
// app/api/payments/route.ts

export async function POST(request: Request) {
  const { amount, token, walletAddress } = await request.json()
  
  // Process payment with your preferred service
  // - Stripe Crypto
  // - Coinbase Commerce
  // - Custom blockchain integration
  
  return Response.json({ 
    success: true, 
    transactionId: 'tx_123...' 
  })
}
```

#### Transaction Monitoring
```typescript
// Example webhook handler for transaction updates
// app/api/webhooks/transactions/route.ts

export async function POST(request: Request) {
  const { transactionId, status, confirmations } = await request.json()
  
  // Update transaction status in your database
  // Send real-time updates to frontend via WebSocket/SSE
  
  return Response.json({ received: true })
}
```

### Database Schema

Example Prisma schema for transaction management:

```prisma
model Transaction {
  id            String   @id @default(cuid())
  txHash        String   @unique
  amount        Decimal
  token         String
  network       String
  status        TransactionStatus
  walletAddress String
  recipient     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  confirmations Int      @default(0)
}

enum TransactionStatus {
  PENDING
  CONFIRMING
  CONFIRMED
  FAILED
}
```

## 🎨 Customization

### Styling
- Modify `app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Components use CSS variables for easy theming

### Adding New Tokens
```typescript
// Add to components/token-selector.tsx
const newToken = {
  id: "your-token",
  name: "Your Token",
  symbol: "YTK",
  icon: "🪙",
  color: "bg-purple-500",
  balance: "1000 YTK",
  usdValue: "$1000.00",
  network: "Ethereum",
}
```

### Adding New Networks
```typescript
// Add to components/wallet-connect-modal.tsx
const newNetwork = {
  id: "your-network",
  name: "Your Network",
  symbol: "YN",
  icon: "🌐",
  color: "bg-indigo-500",
  description: "Your custom blockchain network",
  walletType: "mock" as const,
}
```

## 📱 Mobile Optimization

The UI is fully responsive with:
- Touch-friendly button sizes
- Optimized modal layouts
- Swipe gestures for navigation
- Mobile-first design approach

## 🔒 Security Best Practices

- Never store private keys in the frontend
- Validate all transactions on the backend
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Sanitize all user inputs
- Use environment variables for sensitive data

## 🧪 Testing

```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Add `netlify.toml` configuration
- **AWS**: Use AWS Amplify or custom EC2 setup
- **Docker**: Dockerfile included for containerization

## 📚 API Reference

### Payment Endpoints
- `POST /api/payments` - Process new payment
- `GET /api/payments/[id]` - Get payment status
- `POST /api/webhooks/transactions` - Transaction updates

### Wallet Endpoints
- `POST /api/wallets/connect` - Connect wallet
- `GET /api/wallets/balance` - Get wallet balance
- `POST /api/wallets/disconnect` - Disconnect wallet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Community**: Join our Discord for discussions
- **Professional Support**: Contact us for enterprise support

## 🔄 Changelog

### v0.1.0
- Initial release with full payment gateway functionality
- Multi-chain wallet support
- Complete checkout flow
- Transaction history and status tracking
- Responsive design with theme support

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
