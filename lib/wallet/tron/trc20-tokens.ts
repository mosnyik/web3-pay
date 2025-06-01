// Common TRC-20 tokens on Tron network
export interface TRC20Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logo?: string
  color?: string
}

// List of popular TRC-20 tokens
export const TRC20_TOKENS: Record<string, TRC20Token> = {
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", // USDT contract address on Tron mainnet
    decimals: 6,
    color: "bg-green-500",
    logo: "💵",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8", // USDC contract address on Tron mainnet
    decimals: 6,
    color: "bg-blue-500",
    logo: "💲",
  },
  JST: {
    symbol: "JST",
    name: "JUST",
    address: "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9", // JST contract address on Tron mainnet
    decimals: 18,
    color: "bg-purple-500",
    logo: "🔷",
  },
  WIN: {
    symbol: "WIN",
    name: "WINkLink",
    address: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7", // WIN contract address on Tron mainnet
    decimals: 6,
    color: "bg-yellow-500",
    logo: "🏆",
  },
  BTT: {
    symbol: "BTT",
    name: "BitTorrent",
    address: "TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4", // BTT contract address on Tron mainnet
    decimals: 18,
    color: "bg-blue-700",
    logo: "🌊",
  },
  SUN: {
    symbol: "SUN",
    name: "SUN",
    address: "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S", // SUN contract address on Tron mainnet
    decimals: 18,
    color: "bg-orange-500",
    logo: "☀️",
  },
}

// TRC-20 token ABI (simplified for common functions)
export const TRC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
]

// Format token amount based on decimals
export function formatTokenAmount(amount: string | number, decimals: number): string {
  const amountNum = typeof amount === "string" ? Number.parseFloat(amount) : amount
  const divisor = Math.pow(10, decimals)
  return (amountNum / divisor).toFixed(decimals > 6 ? 4 : decimals)
}

// Parse token amount to contract format
export function parseTokenAmount(amount: string | number, decimals: number): string {
  const amountNum = typeof amount === "string" ? Number.parseFloat(amount) : amount
  const multiplier = Math.pow(10, decimals)
  return (amountNum * multiplier).toString()
}
