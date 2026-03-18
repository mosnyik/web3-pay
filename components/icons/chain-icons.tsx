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

export function TronIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2L21 8L17 20H7L3 8L12 2Z" fill="#FF0013" fillOpacity="0.15" stroke="#FF0013" strokeWidth="1.5"/>
      <path d="M12 5L18 9L12 18L6 9L12 5Z" fill="#FF0013"/>
      <path d="M12 5L18 9H6L12 5Z" fill="#FF4444"/>
    </svg>
  )
}

export function PolygonIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M16.5 9.5L12 7L7.5 9.5V14.5L12 17L16.5 14.5V9.5Z"
        stroke="#8247E5"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 7L16.5 9.5M16.5 9.5V14.5M16.5 14.5L12 17M12 17L7.5 14.5M7.5 14.5V9.5M7.5 9.5L12 7"
        stroke="#8247E5"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2" fill="#8247E5"/>
      <circle cx="16.5" cy="9.5" r="1.5" fill="#8247E5"/>
      <circle cx="16.5" cy="14.5" r="1.5" fill="#8247E5"/>
      <circle cx="12" cy="17" r="1.5" fill="#8247E5"/>
      <circle cx="7.5" cy="14.5" r="1.5" fill="#8247E5"/>
      <circle cx="7.5" cy="9.5" r="1.5" fill="#8247E5"/>
      <circle cx="12" cy="7" r="1.5" fill="#8247E5"/>
    </svg>
  )
}

export function BnbIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3L14.5 7.5H9.5L12 3Z" fill="#F3BA2F"/>
      <path d="M12 21L9.5 16.5H14.5L12 21Z" fill="#F3BA2F"/>
      <path d="M3 12L5.5 9.5L8 12L5.5 14.5L3 12Z" fill="#F3BA2F"/>
      <path d="M21 12L18.5 14.5L16 12L18.5 9.5L21 12Z" fill="#F3BA2F"/>
      <path d="M9.5 10L12 7.5L14.5 10L12 12.5L9.5 10Z" fill="#F3BA2F"/>
      <path d="M7 12L9.5 14.5L12 12L9.5 9.5L7 12Z" fill="#F3BA2F"/>
      <path d="M12 11.5L14.5 14L12 16.5L9.5 14L12 11.5Z" fill="#F3BA2F"/>
      <path d="M14.5 9.5L17 12L14.5 14.5L12 12L14.5 9.5Z" fill="#F3BA2F"/>
    </svg>
  )
}
