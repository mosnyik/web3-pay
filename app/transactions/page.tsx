import { Navbar } from "@/components/navbar"
import { TransactionHistory } from "@/components/transaction-history"
import { getPageSEO } from "@/lib/utils/seo-utils"
import { SEO } from "@/components/seo"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const pageSEO = getPageSEO("transactions")

  return {
    title: pageSEO.title,
    description: pageSEO.description,
    keywords: pageSEO.keywords,
  }
}

export default function Transactions() {
  const pageSEO = getPageSEO("transactions")

  return (
    <>
      <SEO title={pageSEO.title} description={pageSEO.description} keywords={pageSEO.keywords} url="/transactions" />
      <div className="min-h-screen bg-background">
        <Navbar />
        <TransactionHistory />
      </div>
    </>
  )
}
