/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         WEB3PAY — APP CONFIG                               ║
 * ║                                                                              ║
 * ║  This is the single file you edit to customise the entire app:              ║
 * ║    • Which chains and wallets buyers can use                                ║
 * ║    • Your merchant receiving addresses                                       ║
 * ║    • Theme colours, brand name, feature flags                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. MERCHANT WALLETS
//    Payments from buyers are sent to these addresses.
//    Use environment variables (set in .env) for production deployments.
//    Leave a chain's address empty ("") to disable that chain entirely.
// ─────────────────────────────────────────────────────────────────────────────
export const merchantWallets = {
  /** Ethereum mainnet — receives ETH and ERC-20 tokens (USDC, USDT, DAI …) */
  ethereum: process.env.NEXT_PUBLIC_MERCHANT_ETH_ADDRESS || "",

  /** Bitcoin mainnet — receives BTC (native SegWit / Taproot addresses supported) */
  bitcoin:  process.env.NEXT_PUBLIC_MERCHANT_BTC_ADDRESS || "",

  /** Solana mainnet — receives SOL and SPL tokens */
  solana:   process.env.NEXT_PUBLIC_MERCHANT_SOL_ADDRESS || "",

  /** Tron mainnet — receives TRX and TRC-20 tokens (USDT, USDC …) */
  tron:     process.env.NEXT_PUBLIC_MERCHANT_TRX_ADDRESS || "",
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 2. SUPPORTED WALLETS
//    Control exactly which wallets appear in the connect modal per chain.
//    Comment out or remove a wallet ID to hide it from buyers.
//    The order here is the display order (first = top / recommended).
// ─────────────────────────────────────────────────────────────────────────────
export const supportedWallets = {
  ethereum: [
    "metamask",       // MetaMask browser extension
    "walletconnect",  // WalletConnect v2 — covers 300+ mobile wallets
    "coinbase",       // Coinbase Wallet
  ],

  bitcoin: [
    "xverse",   // Xverse — Ordinals + BRC-20 support
    "unisat",   // Unisat — Ordinals specialist
    "hiro",     // Hiro / Leather — Bitcoin + Stacks
  ],

  solana: [
    "phantom",    // Phantom — most popular Solana wallet
    "solflare",   // Solflare — DeFi-focused
    "backpack",   // Backpack — xNFT super-app
  ],

  tron: [
    "tronlink",  // TronLink — official Tron wallet
    "trust",     // Trust Wallet
    "math",      // Math Wallet
    "klever",    // Klever Wallet
  ],
} as const

// Derive the enabled chain IDs automatically from merchantWallets.
// A chain is enabled when it has a non-empty merchant address.
export const enabledChains = (
  Object.entries(merchantWallets) as [keyof typeof merchantWallets, string][]
)
  .filter(([, addr]) => addr.length > 0)
  .map(([chain]) => chain)

export type ChainId = keyof typeof merchantWallets
export type SupportedWalletId<C extends ChainId> = (typeof supportedWallets)[C][number]

// ─────────────────────────────────────────────────────────────────────────────
// 3. THEME
//    Change any hex value here to restyle the entire app.
//    No other files need to be touched.
// ─────────────────────────────────────────────────────────────────────────────
export const theme = {
  primary:            "#8B5CF6",  // Violet  — buttons, links, active states
  primaryForeground:  "#FFFFFF",  // Text on primary backgrounds
  accent:             "#F59E0B",  // Amber   — badges, stats, decorative highlights
  background:         "#060B18",  // OLED dark navy — page background
  surface:            "#0D1526",  // Card / panel background
  surfaceHover:       "#111D35",  // Elevated surface (hover, nested cards)
  foreground:         "#E2E8F0",  // Primary text
  muted:              "#64748B",  // Secondary / muted text
  border:             "#1E2D45",  // Default border
  destructive:        "#EF4444",  // Error red
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 4. BRAND
// ─────────────────────────────────────────────────────────────────────────────
export const brand = {
  name:      "Web3Pay",
  shortName: "W3P",
  logo:      "/images/logo.svg",
  logoAlt:   "Web3Pay Logo",
  favicon:   "/favicon.ico",
  gradients: {
    primary: "from-violet-600 to-purple-600",
    hero:    "from-violet-500 via-purple-500 to-blue-500",
  },
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 5. FEATURES
// ─────────────────────────────────────────────────────────────────────────────
export const features = {
  enableAnalytics:      true,
  enableErrorReporting: true,
  enablePWA:            true,
  enableMultiLanguage:  false,
  enableNotifications:  true,
  enableWalletConnect:  true,
  enableTokenSwap:      false,
  enableNFTSupport:     false,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 6. ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────
export const analytics = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  mixpanelToken:     process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  hotjarId:          process.env.NEXT_PUBLIC_HOTJAR_ID,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 7. API
// ─────────────────────────────────────────────────────────────────────────────
export const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 30_000,
  retries: 3,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY — flat appConfig object for backwards compatibility with existing code
// ─────────────────────────────────────────────────────────────────────────────
export const appConfig = {
  theme,
  brand,
  features,
  analytics,
  api,
  merchantWallets,
  supportedWallets,
  enabledChains,
  networks: {
    supportedNetworks: Object.keys(merchantWallets) as ChainId[],
    defaultNetwork:    "ethereum" as ChainId,
    testnetEnabled:    process.env.NODE_ENV === "development",
    customRPCs: {
      ethereum: process.env.NEXT_PUBLIC_ETHEREUM_RPC || "",
      polygon:  process.env.NEXT_PUBLIC_POLYGON_RPC  || "",
      bsc:      process.env.NEXT_PUBLIC_BSC_RPC      || "",
    },
  },
  ui: {
    layout:      "default" as const,
    animations:  true,
    compactMode: false,
    showBranding: true,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true when a chain is active (has a merchant address set). */
export const isChainEnabled = (chainId: string): chainId is ChainId =>
  enabledChains.includes(chainId as ChainId)

/** Returns the merchant receiving address for a chain (or "" if not set). */
export const getMerchantAddress = (chainId: ChainId): string =>
  merchantWallets[chainId]

/** Returns the enabled wallet IDs for a given chain. */
export const getEnabledWallets = (chainId: ChainId): readonly string[] =>
  supportedWallets[chainId]

export const isFeatureEnabled = (feature: keyof typeof features): boolean =>
  features[feature]
