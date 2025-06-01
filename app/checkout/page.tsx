import { Navbar } from "@/components/navbar"
import { CheckoutPage } from "@/components/checkout-page"
import { getPageSEO } from "@/lib/utils/seo-utils"
import { SEO } from "@/components/seo"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const pageSEO = getPageSEO("checkout")

  return {
    title: pageSEO.title,
    description: pageSEO.description,
    keywords: pageSEO.keywords,
  }
}

export default function Checkout() {
  const pageSEO = getPageSEO("checkout")

  return (
    <>
      <SEO title={pageSEO.title} description={pageSEO.description} keywords={pageSEO.keywords} url="/checkout" />
      <div className="min-h-screen bg-background">
        <Navbar />
        <CheckoutPage />
      </div>
    </>
  )
}
