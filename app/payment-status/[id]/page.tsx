import { Navbar } from "@/components/navbar"
import { PaymentStatusPage } from "@/components/payment-status-page"
import { getPageSEO } from "@/lib/utils/seo-utils"
import { SEO } from "@/components/seo"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const pageSEO = getPageSEO("paymentStatus")

  return {
    title: `${pageSEO.title} - ${params.id}`,
    description: pageSEO.description,
    keywords: pageSEO.keywords,
  }
}

export default function PaymentStatus({ params }: { params: { id: string } }) {
  const pageSEO = getPageSEO("paymentStatus")

  return (
    <>
      <SEO
        title={`${pageSEO.title} - ${params.id}`}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        url={`/payment-status/${params.id}`}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <PaymentStatusPage transactionId={params.id} />
      </div>
    </>
  )
}
