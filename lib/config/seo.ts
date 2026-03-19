/**
 * SEO Configuration
 * Centralized SEO settings for easy customization
 */

export interface SEOConfig {
  siteName: string
  siteDescription: string
  siteUrl: string
  defaultTitle: string
  titleTemplate: string
  defaultDescription: string
  keywords: string[]
  author: string
  twitterHandle: string
  ogImage: string
  favicon: string
  themeColor: string
  locale: string
  alternateLocales?: string[]
}

export const seoConfig: SEOConfig = {
  siteName: "Web3Pay",
  siteDescription:
    "Complete Web3 payment solution with multi-chain wallet support, real-time tracking, and seamless checkout experience.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://web3pay.example.com",
  defaultTitle: "Web3Pay - Multi-Chain Payment Gateway",
  titleTemplate: "%s | Web3Pay",
  defaultDescription:
    "Accept crypto payments across all major blockchains. Secure, fast, and user-friendly Web3 payment gateway with support for Ethereum, Bitcoin, Solana, Tron, and more.",
  keywords: [
    "web3",
    "crypto payments",
    "blockchain",
    "ethereum",
    "bitcoin",
    "solana",
    "tron",
    "payment gateway",
    "cryptocurrency",
    "wallet connect",
    "defi",
    "smart contracts",
    "multi-chain",
    "crypto checkout",
  ],
  author: "Web3Pay Team",
  twitterHandle: "@web3pay",
  ogImage: "/images/og-image.png",
  favicon: "/favicon.ico",
  themeColor: "#3b82f6",
  locale: "en_US",
  alternateLocales: ["es_ES", "fr_FR", "de_DE", "ja_JP", "zh_CN"],
}

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: "Multi-Chain Payment Gateway",
    description:
      "Accept crypto payments across all major blockchains with our secure and user-friendly Web3 payment gateway.",
    keywords: ["crypto payment gateway", "web3 payments", "multi-chain wallet", "blockchain payments"],
  },
  checkout: {
    title: "Crypto Checkout",
    description:
      "Complete your crypto payment with our secure checkout system. Support for ETH, BTC, SOL, TRX and more.",
    keywords: ["crypto checkout", "pay with crypto", "blockchain payment", "secure crypto transactions"],
  },
  transactions: {
    title: "Transaction History",
    description:
      "View and manage all your crypto payment transactions with real-time status updates and detailed history.",
    keywords: ["crypto transactions", "payment history", "blockchain explorer", "transaction tracking"],
  },
  tronTokens: {
    title: "Tron TRC-20 Tokens",
    description: "Manage your TRC-20 tokens including USDT, USDC, and more on the Tron blockchain.",
    keywords: ["tron tokens", "trc-20", "usdt tron", "tron wallet", "tron blockchain"],
  },
  paymentStatus: {
    title: "Payment Status",
    description: "Track your crypto payment transaction status in real-time on the blockchain.",
    keywords: ["payment status", "crypto transaction", "blockchain confirmation", "payment tracking"],
  },
} as const
