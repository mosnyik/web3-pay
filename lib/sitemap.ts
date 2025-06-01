/**
 * Sitemap generation utilities
 */

export interface SitemapEntry {
  url: string
  lastModified?: Date
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

export const staticPages: SitemapEntry[] = [
  {
    url: "/",
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: "/checkout",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "/transactions",
    changeFrequency: "daily",
    priority: 0.7,
  },
  {
    url: "/tron-tokens",
    changeFrequency: "weekly",
    priority: 0.6,
  },
]

export function generateSitemap(baseUrl: string, entries: SitemapEntry[]): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>` : ""}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ""}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`

  return sitemap
}
