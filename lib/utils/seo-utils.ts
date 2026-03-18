import { seoConfig, pageConfigs } from "@/lib/config/seo"

// Server-safe function to get page-specific SEO config
export function getPageSEO(page: keyof typeof pageConfigs) {
  const cfg = pageConfigs[page]
  return { ...cfg, keywords: [...cfg.keywords] }
}

// Server-safe function to generate metadata
export function generatePageMetadata(page: keyof typeof pageConfigs) {
  const pageSEO = pageConfigs[page]

  return {
    title: pageSEO.title,
    description: pageSEO.description,
    keywords: pageSEO.keywords,
    openGraph: {
      title: pageSEO.title,
      description: pageSEO.description,
      images: [seoConfig.ogImage],
    },
    twitter: {
      title: pageSEO.title,
      description: pageSEO.description,
      images: [seoConfig.ogImage],
    },
  }
}
