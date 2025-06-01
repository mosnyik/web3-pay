import { Navbar } from "@/components/navbar"
import { WalletConnectSection } from "@/components/wallet-connect-section"
import { FeaturesSection } from "@/components/features-section"
import { HeroSection } from "@/components/hero-section"
import { SEO } from "@/components/seo"
import { getPageSEO } from "@/lib/utils/seo-utils"
import type { Metadata } from "next"

// Generate metadata for this page
export async function generateMetadata(): Promise<Metadata> {
  const pageSEO = getPageSEO("home")

  return {
    title: pageSEO.title,
    description: pageSEO.description,
    keywords: pageSEO.keywords,
  }
}

export default function HomePage() {
  const pageSEO = getPageSEO("home")

  return (
    <>
      <SEO title={pageSEO.title} description={pageSEO.description} keywords={pageSEO.keywords} url="/" />
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <WalletConnectSection />
        <FeaturesSection />
      </div>
    </>
  )
}
