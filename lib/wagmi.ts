import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  bsc,
  arbitrum,
  base,
  optimism,
  polygon,
  sepolia,
  bscTestnet,
  bscGreenfield,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Web3 Payment Gateway",
  projectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [
    mainnet,
    bsc,
    polygon,
    optimism,
    arbitrum,
    base,
    bscTestnet,
    bscGreenfield,

    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});

