import { Navbar } from "@/components/navbar"
import { TronTokensPage } from "@/components/tron-tokens-page"

export default function TronTokens() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TronTokensPage />
    </div>
  )
}
