import { Navbar } from "@/components/navbar"
import { WalletTokensPage } from "@/components/wallet-tokens-page"
import { SEO } from "@/components/seo"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Wallet Tokens",
    description: "Manage your tokens across multiple blockchains including Ethereum, Bitcoin, Solana, and Tron.",
    keywords: ["wallet tokens", "crypto tokens", "token management", "multi-chain wallet"],
  }
}

export default function WalletTokens() {
  return (
    <>
      <SEO
        title="Wallet Tokens"
        description="Manage your tokens across multiple blockchains including Ethereum, Bitcoin, Solana, and Tron."
        keywords={["wallet tokens", "crypto tokens", "token management", "multi-chain wallet"]}
        url="/wallet-tokens"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <WalletTokensPage />
      </div>
    </>
  )
}
