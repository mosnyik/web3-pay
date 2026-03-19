import { appConfig } from "@/lib/config/app"

/** Converts a hex color string to the "H S% L%" format used by shadcn CSS vars */
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Server component — injects CSS custom properties derived from appConfig.theme.
 * Changing colors in lib/config/app.ts automatically updates the entire UI.
 */
export function ThemeVars() {
  const t = appConfig.theme

  const primary       = hexToHsl(t.primary)
  const primaryFg     = hexToHsl(t.primaryForeground)
  const accent        = hexToHsl(t.accent)
  const bg            = hexToHsl(t.background)
  const surface       = hexToHsl(t.surface)
  const surfaceHover  = hexToHsl(t.surfaceHover)
  const fg            = hexToHsl(t.foreground)
  const muted         = hexToHsl(t.muted)
  const border        = hexToHsl(t.border)
  const destructive   = hexToHsl(t.destructive)

  const css = `
    :root, .dark {
      --background:              ${bg};
      --foreground:              ${fg};

      --card:                    ${surface};
      --card-foreground:         ${fg};

      --popover:                 ${surface};
      --popover-foreground:      ${fg};

      --primary:                 ${primary};
      --primary-foreground:      ${primaryFg};

      --secondary:               ${surfaceHover};
      --secondary-foreground:    ${fg};

      --muted:                   ${surfaceHover};
      --muted-foreground:        ${muted};

      --accent:                  ${accent};
      --accent-foreground:       ${primaryFg};

      --destructive:             ${destructive};
      --destructive-foreground:  ${primaryFg};

      --border:                  ${border};
      --input:                   ${border};
      --ring:                    ${primary};

      --radius: 0.5rem;
    }
  `.trim()

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
