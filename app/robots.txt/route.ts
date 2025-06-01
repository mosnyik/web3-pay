import { NextResponse } from "next/server"
import { seoConfig } from "@/lib/config/seo"

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${seoConfig.siteUrl}/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Allow specific important pages
Allow: /
Allow: /checkout
Allow: /transactions
Allow: /tron-tokens

# Crawl delay
Crawl-delay: 1`

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
