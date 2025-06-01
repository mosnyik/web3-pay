/**
 * Theme Configuration System
 * Allows easy customization of colors, fonts, and styling
 */

export interface ThemeColors {
  primary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  secondary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  accent: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
}

export interface ThemeConfig {
  colors: ThemeColors
  fonts: {
    sans: string[]
    mono: string[]
    heading: string[]
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  animations: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      default: string
      in: string
      out: string
      inOut: string
    }
  }
}

// Default theme configuration
export const defaultTheme: ThemeConfig = {
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    secondary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7c3aed",
      800: "#6b21a8",
      900: "#581c87",
      950: "#3b0764",
    },
    accent: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
      950: "#083344",
    },
  },
  fonts: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "Consolas", "monospace"],
    heading: ["Inter", "system-ui", "sans-serif"],
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
}

// Function to generate CSS variables from theme
export function generateCSSVariables(theme: ThemeConfig): string {
  const cssVars: string[] = []

  // Colors
  Object.entries(theme.colors).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      cssVars.push(`--color-${colorName}-${shade}: ${value};`)
    })
  })

  // Border radius
  Object.entries(theme.borderRadius).forEach(([size, value]) => {
    cssVars.push(`--radius-${size}: ${value};`)
  })

  // Shadows
  Object.entries(theme.shadows).forEach(([size, value]) => {
    cssVars.push(`--shadow-${size}: ${value};`)
  })

  // Animation durations
  Object.entries(theme.animations.duration).forEach(([speed, value]) => {
    cssVars.push(`--duration-${speed}: ${value};`)
  })

  // Animation easing
  Object.entries(theme.animations.easing).forEach(([type, value]) => {
    cssVars.push(`--easing-${type}: ${value};`)
  })

  return `:root {\n  ${cssVars.join("\n  ")}\n}`
}
