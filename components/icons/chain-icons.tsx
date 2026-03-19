import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export function EthereumIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2L5 12.5L12 16L19 12.5L12 2Z" fill="#627EEA" fillOpacity="0.9"/>
      <path d="M12 2L5 12.5L12 16V2Z" fill="#627EEA"/>
      <path d="M12 17.5L5 13.5L12 22L19 13.5L12 17.5Z" fill="#627EEA" fillOpacity="0.9"/>
      <path d="M12 17.5L5 13.5L12 22V17.5Z" fill="#627EEA"/>
    </svg>
  )
}

export function BitcoinIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" fill="#F7931A"/>
      <path
        d="M15.5 10.5C15.5 9.4 14.7 8.7 13.5 8.5V7H12V8.4H11V7H9.5V8.5H8V10H9V14H8V15.5H9.5V17H11V15.5H12V17H13.5V15.4C14.9 15.1 16 14.3 16 12.9C16 11.9 15.5 11.2 14.8 10.9C15.2 10.6 15.5 10.1 15.5 10.5ZM13.3 14.2H10.8V12.8H13.3C13.9 12.8 14.3 13.1 14.3 13.5C14.3 13.9 13.9 14.2 13.3 14.2ZM13.1 11.5H10.8V10.2H13.1C13.7 10.2 14 10.5 14 10.85C14 11.2 13.7 11.5 13.1 11.5Z"
        fill="white"
      />
    </svg>
  )
}

export function SolanaIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="sol-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9945FF"/>
          <stop offset="100%" stopColor="#14F195"/>
        </linearGradient>
      </defs>
      <path d="M4 16.5H17.5L20 14H6.5L4 16.5Z" fill="url(#sol-grad)"/>
      <path d="M4 10H17.5L20 7.5H6.5L4 10Z" fill="url(#sol-grad)"/>
      <path d="M20 13.25H6.5L4 10.75H17.5L20 13.25Z" fill="url(#sol-grad)"/>
    </svg>
  )
}

export function TronIcon({ size = 24 }: { size?: number }) {
  return (
    <img
      src={`https://img.icons8.com/?size=${size * 2}&id=7NCvsu15urpd&format=png`}
      alt="Tron"
      width={size}
      height={size}
      style={{ display: "inline-block" }}
    />
  )
}

export function PolygonIcon({ size = 24 }: { size?: number }) {
  return (
    <img
      src="https://logo.svgcdn.com/token-branded/polygon.png"
      alt="Polygon"
      width={size}
      height={size}
      style={{ display: "inline-block" }}
    />
  )
}

export function BnbIcon({ size = 24 }: { size?: number }) {
  return (
    <img
      src="https://img.icons8.com/?size=64&id=axJ7sXBmQS2g&format=png"
      alt="BNB"
      width={size}
      height={size}
      style={{ display: "inline-block" }}
    />
  )
}
