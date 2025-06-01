"use client"

import Head from "next/head"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { seoConfig } from "@/lib/config/seo"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "product"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
  alternateLanguages?: Record<string, string>
  ogImage?: string
  structuredData?: Record<string, any>
}

export function SEO({
  title,
  description = seoConfig.defaultDescription,
  keywords = seoConfig.keywords,
  image = seoConfig.ogImage,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = seoConfig.author,
  noindex = false,
  nofollow = false,
  canonical,
  alternateLanguages,
  ogImage,
  structuredData,
}: SEOProps) {
  const pathname = usePathname()

  // Construct full title
  const fullTitle = title ? seoConfig.titleTemplate.replace("%s", title) : seoConfig.defaultTitle

  // Construct full URL
  const fullUrl = url ? `${seoConfig.siteUrl}${url}` : `${seoConfig.siteUrl}${pathname}`

  // Construct full image URL
  const fullImage = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${seoConfig.siteUrl}${ogImage}`
    : image.startsWith("http")
      ? image
      : `${seoConfig.siteUrl}${image}`

  // Robots meta content
  const robotsContent = [noindex ? "noindex" : "index", nofollow ? "nofollow" : "follow"].join(", ")

  useEffect(() => {
    // Update canonical link
    const canonicalUrl = canonical || fullUrl
    const existingCanonical = document.querySelector('link[rel="canonical"]')

    if (existingCanonical) {
      existingCanonical.setAttribute("href", canonicalUrl)
    } else {
      const link = document.createElement("link")
      link.rel = "canonical"
      link.href = canonicalUrl
      document.head.appendChild(link)
    }

    // Add structured data if provided
    if (structuredData) {
      const existingStructuredData = document.querySelector("#structured-data")
      if (existingStructuredData) {
        existingStructuredData.textContent = JSON.stringify(structuredData)
      } else {
        const script = document.createElement("script")
        script.id = "structured-data"
        script.type = "application/ld+json"
        script.textContent = JSON.stringify(structuredData)
        document.head.appendChild(script)
      }
    }

    // Clean up function
    return () => {
      if (structuredData) {
        const script = document.querySelector("#structured-data")
        if (script && script.id === "structured-data") {
          script.remove()
        }
      }
    }
  }, [pathname, canonical, structuredData, fullUrl])

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content={seoConfig.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.twitterHandle} />
      <meta name="twitter:creator" content={seoConfig.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Article specific meta tags */}
      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "article" && <meta property="article:author" content={author} />}

      {/* Alternate language versions */}
      {alternateLanguages &&
        Object.entries(alternateLanguages).map(([lang, href]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}

      {/* Additional SEO tags */}
      <meta name="theme-color" content={seoConfig.themeColor} />
      <meta name="msapplication-TileColor" content={seoConfig.themeColor} />

      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  )
}
