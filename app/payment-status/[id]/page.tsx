import { Navbar } from "@/components/navbar"
import { PaymentStatusPage } from "@/components/payment-status-page"
import { getPageSEO } from "@/lib/utils/seo-utils"
import { SEO } from "@/components/seo"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const pageSEO = getPageSEO("paymentStatus")

  return {
    title: `${pageSEO.title} - ${id}`,
    description: pageSEO.description,
    keywords: pageSEO.keywords,
  }
}

export default async function PaymentStatus({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pageSEO = getPageSEO("paymentStatus")

  return (
    <>
      <SEO
        title={`${pageSEO.title} - ${id}`}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        url={`/payment-status/${id}`}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <PaymentStatusPage transactionId={id} />
      </div>
    </>
  )
}
