"use client"

/**
 * usePayment — sends a real on-chain transaction to the merchant wallet.
 *
 * Ethereum: EIP-1193 window.ethereum (works with MetaMask, WalletConnect, Coinbase…)
 * Bitcoin:  wallet-specific APIs (Unisat / sats-connect / Hiro)
 * Solana:   @solana/web3.js SystemProgram.transfer via window.solana
 * Tron:     TronWeb transactionBuilder.sendTrx
 *
 * No wagmi hooks used — safe to call from any component tree.
 */

import { useWallet } from "@/lib/wallet/wallet-context"
import { getMerchantAddress } from "@/lib/config/app"
import type { Token } from "@/components/token-selector"

export type PaymentResult = { txId: string }

export function usePayment() {
  const { activeAdapter, account } = useWallet()

  const sendPayment = async (amount: number, token: Token): Promise<PaymentResult> => {
    if (!activeAdapter || !account) {
      throw new Error("No wallet connected")
    }

    const chainId = token.adapterId as "ethereum" | "bitcoin" | "solana" | "tron"
    const recipient = getMerchantAddress(chainId)

    if (!recipient) {
      throw new Error(`No merchant address configured for ${chainId}`)
    }

    switch (chainId) {
      case "ethereum":
        return sendEthereum(amount, recipient, account.address)

      case "bitcoin":
        return sendBitcoin(amount, recipient, activeAdapter)

      case "solana":
        return sendSolana(amount, recipient, account.address)

      case "tron":
        return sendTron(amount, recipient, activeAdapter)

      default:
        throw new Error(`Payment not implemented for chain: ${chainId}`)
    }
  }

  return { sendPayment }
}

// ── Ethereum ──────────────────────────────────────────────────────────────────
// Uses EIP-1193 window.ethereum — no wagmi dependency needed.
// Works with MetaMask, Coinbase Wallet, and WalletConnect (wagmi patches window.ethereum).

async function sendEthereum(
  amount: number,
  recipient: string,
  senderAddress: string,
): Promise<PaymentResult> {
  const provider = (window as any).ethereum
  if (!provider) throw new Error("No Ethereum provider found. Install MetaMask or use WalletConnect.")

  // Convert ETH → wei as hex string
  const weiHex = "0x" + BigInt(Math.round(amount * 1e18)).toString(16)

  const txHash = await provider.request({
    method: "eth_sendTransaction",
    params: [{
      from: senderAddress,
      to: recipient,
      value: weiHex,
    }],
  })

  return { txId: txHash }
}

// ── Bitcoin ───────────────────────────────────────────────────────────────────

async function sendBitcoin(amount: number, recipient: string, adapter: any): Promise<PaymentResult> {
  const satoshis = Math.round(amount * 100_000_000)
  const walletId: string = adapter.walletId ?? ""

  // Unisat
  if (walletId === "unisat") {
    const unisat = (window as any).unisat
    if (!unisat) throw new Error("Unisat not found")
    const txId = await unisat.sendBitcoin(recipient, satoshis)
    return { txId }
  }

  // Hiro / Leather
  if (walletId === "hiro") {
    const btcProvider = (window as any).btc ?? (window as any).LeatherProvider
    if (!btcProvider) throw new Error("Hiro Wallet not found")
    const response = await btcProvider.request("sendTransfer", {
      address: recipient,
      amount: satoshis,
    })
    return { txId: response.result?.txid ?? response.result?.txId }
  }

  // Xverse via sats-connect
  if (walletId === "xverse") {
    const { sendBtcTransaction } = await import("sats-connect")
    return new Promise((resolve, reject) => {
      sendBtcTransaction({
        payload: {
          network: { type: "Mainnet" as any },
          recipients: [{ address: recipient, amountSats: BigInt(satoshis) }],
          senderAddress: adapter.account?.address ?? "",
        },
        onFinish: (response: any) => resolve({ txId: response }),
        onCancel: () => reject(new Error("User cancelled Bitcoin payment")),
      })
    })
  }

  throw new Error(`Bitcoin send not supported for wallet: ${walletId}`)
}

// ── Solana ────────────────────────────────────────────────────────────────────

async function sendSolana(amount: number, recipient: string, senderAddress: string): Promise<PaymentResult> {
  const {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    clusterApiUrl,
  } = await import("@solana/web3.js")

  const lamports = Math.round(amount * 1_000_000_000)
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed")

  const from = new PublicKey(senderAddress)
  const to = new PublicKey(recipient)

  const transaction = new Transaction().add(
    SystemProgram.transfer({ fromPubkey: from, toPubkey: to, lamports }),
  )

  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = from

  // Try standard window.solana provider (Phantom, Backpack…)
  const provider = (window as any).solana ?? (window as any).solflare ?? (window as any).backpack
  if (!provider) throw new Error("No Solana wallet provider found")

  const { signature } = await provider.signAndSendTransaction(transaction)
  return { txId: signature }
}

// ── Tron ──────────────────────────────────────────────────────────────────────

async function sendTron(amount: number, recipient: string, adapter: any): Promise<PaymentResult> {
  // Access TronWeb via the adapter's getTronWeb() method
  const tronWeb = typeof adapter.getTronWeb === "function" ? adapter.getTronWeb() : null

  if (!tronWeb) {
    // Fallback: try window.tronWeb directly
    const tw = (window as any).tronWeb
    if (!tw?.ready) throw new Error("TronWeb not available — make sure TronLink is unlocked")
    const sunAmount = Math.round(amount * 1_000_000)
    const tx = await tw.transactionBuilder.sendTrx(recipient, sunAmount, tw.defaultAddress.base58)
    const signed = await tw.trx.sign(tx)
    const result = await tw.trx.sendRawTransaction(signed)
    if (!result.result) throw new Error("Tron transaction failed")
    return { txId: result.txid }
  }

  const sunAmount = Math.round(amount * 1_000_000)
  const senderAddress = adapter.account?.address
  const tx = await tronWeb.transactionBuilder.sendTrx(recipient, sunAmount, senderAddress)
  const signed = await tronWeb.trx.sign(tx)
  const result = await tronWeb.trx.sendRawTransaction(signed)
  if (!result.result) throw new Error("Tron transaction failed")
  return { txId: result.txid }
}
