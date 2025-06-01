import { NextResponse } from "next/server"
import { generateSitemap, staticPages } from "@/lib/sitemap"
import { seoConfig } from "@/lib/config/seo"

export async function GET() {
  const sitemap = generateSitemap(seoConfig.siteUrl, staticPages)

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  })
}
