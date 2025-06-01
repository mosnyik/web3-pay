/**
 * Application Configuration
 * Centralized app settings for easy customization
 */

export interface BrandConfig {
  name: string
  shortName: string
  logo: string
  logoAlt: string
  favicon: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  gradients: {
    primary: string
    hero: string
    card: string
  }
}

export interface FeatureConfig {
  enableAnalytics: boolean
  enableErrorReporting: boolean
  enablePWA: boolean
  enableMultiLanguage: boolean
  enableDarkMode: boolean
  enableNotifications: boolean
  enableWalletConnect: boolean
  enableTokenSwap: boolean
  enableNFTSupport: boolean
}

export interface NetworkConfig {
  supportedNetworks: string[]
  defaultNetwork: string
  testnetEnabled: boolean
  customRPCs: Record<string, string>
}

export interface UIConfig {
  layout: "default" | "minimal" | "dashboard"
  animations: boolean
  compactMode: boolean
  showBranding: boolean
  customCSS?: string
}

export interface AppConfig {
  brand: BrandConfig
  features: FeatureConfig
  networks: NetworkConfig
  ui: UIConfig
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
  analytics: {
    googleAnalyticsId?: string
    mixpanelToken?: string
    hotjarId?: string
  }
}

export const appConfig: AppConfig = {
  brand: {
    name: "Web3Pay",
    shortName: "W3P",
    logo: "/images/logo.svg",
    logoAlt: "Web3Pay Logo",
    favicon: "/favicon.ico",
    colors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#ffffff",
      foreground: "#0f172a",
    },
    gradients: {
      primary: "from-blue-600 to-purple-600",
      hero: "from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20",
      card: "from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
    },
  },
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enablePWA: true,
    enableMultiLanguage: false,
    enableDarkMode: true,
    enableNotifications: true,
    enableWalletConnect: true,
    enableTokenSwap: false,
    enableNFTSupport: false,
  },
  networks: {
    supportedNetworks: ["ethereum", "bitcoin", "solana", "tron"],
    defaultNetwork: "ethereum",
    testnetEnabled: process.env.NODE_ENV === "development",
    customRPCs: {
      ethereum: process.env.NEXT_PUBLIC_ETHEREUM_RPC || "",
      polygon: process.env.NEXT_PUBLIC_POLYGON_RPC || "",
      bsc: process.env.NEXT_PUBLIC_BSC_RPC || "",
    },
  },
  ui: {
    layout: "default",
    animations: true,
    compactMode: false,
    showBranding: true,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
    retries: 3,
  },
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },
}

// Helper function to get feature flag
export const isFeatureEnabled = (feature: keyof FeatureConfig): boolean => {
  return appConfig.features[feature]
}

// Helper function to get brand colors
export const getBrandColor = (color: keyof BrandConfig["colors"]): string => {
  return appConfig.brand.colors[color]
}

// Helper function to get supported networks
export const getSupportedNetworks = (): string[] => {
  return appConfig.networks.supportedNetworks
}
