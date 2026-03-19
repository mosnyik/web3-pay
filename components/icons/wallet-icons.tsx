import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export function MetaMaskIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M21 3L13.5 8.5L15 5L21 3Z" fill="#E2761B"/>
      <path d="M3 3L10.5 8.5L9 5L3 3Z" fill="#E4761B"/>
      <path d="M18 15.5L16 18.5L20.5 19.5L21.5 15.5H18Z" fill="#E4761B"/>
      <path d="M2.5 15.5L3.5 19.5L8 18.5L6 15.5H2.5Z" fill="#E4761B"/>
      <path d="M7.5 10.5L6 13L10.5 13.2L10.3 8.5L7.5 10.5Z" fill="#E4761B"/>
      <path d="M16.5 10.5L13.6 8.4L13.5 13.2L18 13L16.5 10.5Z" fill="#E4761B"/>
      <path d="M8 18.5L10.2 17.4L8.3 15.5L8 18.5Z" fill="#E4761B"/>
      <path d="M13.8 17.4L16 18.5L15.7 15.5L13.8 17.4Z" fill="#E4761B"/>
      <path d="M16 18.5L13.8 17.4L14 19L13.9 19.5L16 18.5Z" fill="#D7C1B3"/>
      <path d="M8 18.5L10.1 19.5L10 19L10.2 17.4L8 18.5Z" fill="#D7C1B3"/>
      <path d="M10.1 14.5L8.2 14L9.5 13L10.1 14.5Z" fill="#233447"/>
      <path d="M13.9 14.5L14.5 13L15.8 14L13.9 14.5Z" fill="#233447"/>
      <path d="M8 18.5L8.3 15.5L6 15.5L8 18.5Z" fill="#CD6116"/>
      <path d="M15.7 15.5L16 18.5L18 15.5L15.7 15.5Z" fill="#CD6116"/>
      <path d="M18 13L13.5 13.2L13.9 14.5L14.5 13L15.8 14L18 13Z" fill="#CD6116"/>
      <path d="M8.2 14L9.5 13L10.1 14.5L10.5 13.2L6 13L8.2 14Z" fill="#CD6116"/>
      <path d="M6 13L8.3 15.5L8.2 14L6 13Z" fill="#E4751F"/>
      <path d="M15.8 14L15.7 15.5L18 13L15.8 14Z" fill="#E4751F"/>
      <path d="M10.5 13.2L10.1 14.5L10.6 17L10.7 13.8L10.5 13.2Z" fill="#E4751F"/>
      <path d="M13.5 13.2L13.3 13.8L13.4 17L13.9 14.5L13.5 13.2Z" fill="#E4751F"/>
      <path d="M13.9 14.5L13.4 17L13.8 17.4L15.7 15.5L15.8 14L13.9 14.5Z" fill="#F6851B"/>
      <path d="M8.2 14L8.3 15.5L10.2 17.4L10.6 17L10.1 14.5L8.2 14Z" fill="#F6851B"/>
      <path d="M13.9 19.5L14 19L13.8 17.4H10.2L10 19L10.1 19.5L12 20.5L13.9 19.5Z" fill="#C0AD9E"/>
      <path d="M10.2 17.4L10.6 17H13.4L13.8 17.4L13.4 17L12 17.8L10.6 17L10.2 17.4Z" fill="#161616"/>
      <path d="M10.1 19.5L10 19L10.2 17.4L8 18.5L10.1 19.5Z" fill="#763D16"/>
      <path d="M13.9 19.5L16 18.5L13.8 17.4L14 19L13.9 19.5Z" fill="#763D16"/>
      <path d="M10.5 8.5L9 5L3 3L10.5 8.5Z" fill="#763D16"/>
      <path d="M13.5 8.5L21 3L15 5L13.5 8.5Z" fill="#763D16"/>
    </svg>
  )
}

export function WalletConnectIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#3B99FC"/>
      <path
        d="M7.5 10.2C9.9 7.9 13.7 7.9 16.1 10.2L16.4 10.5C16.5 10.6 16.5 10.8 16.4 10.9L15.4 11.9C15.3 12 15.1 12 15 11.9L14.6 11.5C12.9 9.9 10.6 9.9 9 11.5L8.5 12C8.4 12.1 8.2 12.1 8.1 12L7.1 11C7 10.9 7 10.7 7.1 10.6L7.5 10.2Z"
        fill="white"
      />
      <path
        d="M17.5 11.6L18.4 12.5C18.5 12.6 18.5 12.8 18.4 12.9L14.5 16.7C14.4 16.8 14.2 16.8 14.1 16.7L11.4 14L11 14.4C10.9 14.5 10.7 14.5 10.6 14.4L7.9 16.7C7.8 16.8 7.6 16.8 7.5 16.7L5.6 14.9C5.5 14.8 5.5 14.6 5.6 14.5L6.5 13.6C6.6 13.5 6.8 13.5 6.9 13.6L8.6 15.2L9 14.8C9.1 14.7 9.3 14.7 9.4 14.8L12.1 12.5C12.2 12.4 12.4 12.4 12.5 12.5L15.2 15.2L17.1 13.4L16.2 12.5C16.1 12.4 16.1 12.2 16.2 12.1L17.1 11.2C17.2 11.1 17.4 11.1 17.5 11.2V11.6Z"
        fill="white"
      />
    </svg>
  )
}

export function CoinbaseIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#0052FF"/>
      <circle cx="12" cy="12" r="7" fill="#0052FF"/>
      <path
        d="M12 5.5C8.4 5.5 5.5 8.4 5.5 12C5.5 15.6 8.4 18.5 12 18.5C15.6 18.5 18.5 15.6 18.5 12C18.5 8.4 15.6 5.5 12 5.5ZM13.5 14.5H10.5C10.2 14.5 10 14.3 10 14V10C10 9.7 10.2 9.5 10.5 9.5H13.5C13.8 9.5 14 9.7 14 10V14C14 14.3 13.8 14.5 13.5 14.5Z"
        fill="white"
      />
    </svg>
  )
}

export function PhantomIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#AB9FF2"/>
      <path
        d="M19.5 11.5C19.5 8.7 17.1 6.5 14 6.5H10C7.5 6.5 5.5 8.4 5.5 10.8C5.5 11.5 5.7 12.2 6 12.8L5 16.8C4.9 17.2 5.2 17.5 5.6 17.5H7.5C7.5 17.5 8.2 15.5 9.5 15.5H14.5C17.3 15.5 19.5 13.7 19.5 11.5Z"
        fill="white"
      />
      <circle cx="10" cy="11.5" r="1" fill="#AB9FF2"/>
      <circle cx="14" cy="11.5" r="1" fill="#AB9FF2"/>
    </svg>
  )
}

export function SolflareIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#FC7227"/>
      <path d="M12 4L14 9H19L15 12.5L16.5 18L12 15L7.5 18L9 12.5L5 9H10L12 4Z" fill="white"/>
    </svg>
  )
}

export function BackpackIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#E33E3F"/>
      <rect x="8" y="10" width="8" height="8" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
      <path d="M10 10V9C10 7.9 10.9 7 12 7C13.1 7 14 7.9 14 9V10" stroke="white" strokeWidth="1.5"/>
      <path d="M10 13H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function UnisatIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#131722"/>
      <circle cx="12" cy="12" r="6" stroke="#FF9500" strokeWidth="1.5" fill="none"/>
      <circle cx="12" cy="12" r="3" fill="#FF9500"/>
    </svg>
  )
}

export function XverseIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#EE7A30"/>
      <path d="M7 7L12 12M17 7L12 12M12 12L7 17M12 12L17 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function TronLinkIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#FF0013"/>
      <path d="M12 5L20 10L17 19H7L4 10L12 5Z" fill="white" fillOpacity="0.2"/>
      <path d="M12 5L20 10L12 14L4 10L12 5Z" fill="white"/>
    </svg>
  )
}

export function BitKeepIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#7B61FF"/>
      <path d="M8 8H13C14.7 8 16 9.3 16 11C16 12 15.5 12.8 14.7 13.3C15.7 13.8 16.5 14.8 16.5 16C16.5 17.9 14.9 19.5 13 19.5H8V8Z" fill="white"/>
      <circle cx="10.5" cy="11" r="1.5" fill="#7B61FF"/>
      <circle cx="10.5" cy="16" r="1.5" fill="#7B61FF"/>
    </svg>
  )
}

export function OKXIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#000"/>
      <rect x="9" y="9" width="2.5" height="2.5" fill="white"/>
      <rect x="12.5" y="9" width="2.5" height="2.5" fill="white"/>
      <rect x="9" y="12.5" width="2.5" height="2.5" fill="white"/>
      <rect x="12.5" y="12.5" width="2.5" height="2.5" fill="white"/>
    </svg>
  )
}

/** Generic fallback icon — used when no specific wallet icon is found */
export function GenericWalletIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#334155"/>
      <rect x="4" y="8" width="16" height="11" rx="2" stroke="#94A3B8" strokeWidth="1.5" fill="none"/>
      <path d="M4 11H20" stroke="#94A3B8" strokeWidth="1.5"/>
      <circle cx="16" cy="14.5" r="1.5" fill="#94A3B8"/>
    </svg>
  )
}

/** Looks up the right wallet icon component by wallet ID */
export function WalletIcon({ walletId, size = 24 }: { walletId: string; size?: number }) {
  const map: Record<string, React.ComponentType<IconProps>> = {
    metamask:       MetaMaskIcon,
    walletconnect:  WalletConnectIcon,
    coinbase:       CoinbaseIcon,
    phantom:        PhantomIcon,
    solflare:       SolflareIcon,
    backpack:       BackpackIcon,
    unisat:         UnisatIcon,
    xverse:         XverseIcon,
    tronlink:       TronLinkIcon,
    bitkeep:        BitKeepIcon,
    okx:            OKXIcon,
  }
  const Icon = map[walletId] ?? GenericWalletIcon
  return <Icon size={size} />
}
