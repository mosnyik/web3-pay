"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Copy, ExternalLink, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePayment } from "@/lib/wallet/use-payment"
import type { Token } from "@/components/token-selector"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  token: Token | null
  onSuccess: (transactionId: string) => void
}

type PaymentStep = "confirm" | "processing" | "success" | "failed"

// ── Step indicator ─────────────────────────────────────────────────────────────
function StepDot({ index, label, active, done }: { index: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
          ${done ? "bg-violet-500 text-white" : active ? "bg-violet-500/20 border-2 border-violet-500 text-violet-400" : "bg-slate-800 border border-slate-700 text-slate-600"}`}
      >
        {done ? (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          index
        )}
      </div>
      <span className={`text-[10px] font-medium ${active || done ? "text-slate-300" : "text-slate-600"}`}>{label}</span>
    </div>
  )
}

function StepConnector({ done }: { done: boolean }) {
  return (
    <div className="flex-1 h-px mx-1 mb-4 relative overflow-hidden bg-slate-800 rounded-full">
      <div
        className="absolute inset-y-0 left-0 bg-violet-500 rounded-full transition-all duration-700"
        style={{ width: done ? "100%" : "0%" }}
      />
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
      {/* Spinning arc */}
      <div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500"
        style={{ animation: "spin 1s linear infinite" }}
      />
      {/* Inner pulse */}
      <div className="absolute inset-3 rounded-full bg-violet-500/10 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-violet-500" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  )
}

// ── Animated progress bar ─────────────────────────────────────────────────────
function ProgressBar({ active }: { active: boolean }) {
  const [width, setWidth] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const DURATION = 3000 // ms — matches mock processing time

  useEffect(() => {
    if (!active) { setWidth(0); return }
    startRef.current = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const pct = Math.min((elapsed / DURATION) * 90, 90) // cap at 90%, fills to 100% on success
      setWidth(pct)
      if (pct < 90) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return (
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-200"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

// ── Success checkmark (SVG animated) ─────────────────────────────────────────
function SuccessIcon() {
  return (
    <div className="w-20 h-20 mx-auto relative">
      <div className="absolute inset-0 rounded-full bg-green-500/10" style={{ animation: "ping 1s ease-out 1" }} />
      <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-400" />
      </div>
    </div>
  )
}

// ── Failed icon ───────────────────────────────────────────────────────────────
function FailedIcon() {
  return (
    <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
      <XCircle className="w-10 h-10 text-red-400" />
    </div>
  )
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const { toast } = useToast()
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        toast({ title: "Copied", description: "Transaction ID copied to clipboard" })
      }}
      className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
      aria-label="Copy transaction ID"
    >
      <Copy className="w-3.5 h-3.5" />
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function PaymentModal({ isOpen, onClose, amount, token, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>("confirm")
  const [txId, setTxId] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const { sendPayment } = usePayment()

  // Reset on open
  useEffect(() => {
    if (isOpen) { setStep("confirm"); setTxId(""); setErrorMsg("") }
  }, [isOpen])

  const handleConfirm = async () => {
    if (!token) return
    setStep("processing")
    setErrorMsg("")

    try {
      const { txId: hash } = await sendPayment(amount, token)
      setTxId(hash)
      setStep("success")
      setTimeout(() => onSuccess(hash), 2500)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed"
      setErrorMsg(msg)
      setStep("failed")
    }
  }

  const stepIndex = step === "confirm" ? 1 : step === "processing" ? 2 : 3
  const isDone1 = stepIndex > 1
  const isDone2 = stepIndex > 2

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && step !== "processing") onClose() }}>
      <DialogContent className="sm:max-w-sm p-0 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden gap-0">

        {/* Step indicator */}
        <div className="px-6 pt-6 pb-0">
          <div className="flex items-center">
            <StepDot index={1} label="Confirm" active={step === "confirm"} done={isDone1} />
            <StepConnector done={isDone1} />
            <StepDot index={2} label="Processing" active={step === "processing"} done={isDone2} />
            <StepConnector done={isDone2} />
            <StepDot
              index={3}
              label={step === "failed" ? "Failed" : "Done"}
              active={step === "success" || step === "failed"}
              done={false}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 pt-6 pb-6">
          {step === "confirm" && (
            <ConfirmStep amount={amount} token={token} onConfirm={handleConfirm} onCancel={onClose} />
          )}
          {step === "processing" && (
            <ProcessingStep txId={txId} />
          )}
          {step === "success" && (
            <SuccessStep amount={amount} token={token} txId={txId} />
          )}
          {step === "failed" && (
            <FailedStep errorMsg={errorMsg} onRetry={() => setStep("confirm")} onClose={onClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Confirm step ──────────────────────────────────────────────────────────────
function ConfirmStep({
  amount,
  token,
  onConfirm,
  onCancel,
}: {
  amount: number
  token: Token | null
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-5">
      {/* Amount display */}
      <div className="text-center py-2">
        <p className="text-4xl font-bold text-white">
          {amount.toFixed(4)}
        </p>
        <p className="text-slate-400 text-sm mt-1">{token?.symbol ?? "ETH"} · {token?.network ?? "—"}</p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800 overflow-hidden">
        <Row label="Amount" value={`${amount.toFixed(6)} ${token?.symbol ?? "ETH"}`} />
        <Row
          label="Token"
          value={
            token ? (
              <div className="flex items-center gap-2">
                <token.Icon size={16} />
                <span>{token.symbol}</span>
              </div>
            ) : "—"
          }
        />
        <Row label="Network" value={token?.network ?? "—"} chip />
        <Row label="Network fee" value="~$0.50" muted />
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
        <p className="text-xs text-amber-300/80 leading-relaxed">
          Crypto transactions are irreversible. Confirm you have the correct details before proceeding.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-semibold text-white transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  )
}

// ── Processing step ───────────────────────────────────────────────────────────
function ProcessingStep({ txId }: { txId: string }) {
  return (
    <div className="space-y-6 text-center">
      <Spinner />

      <div>
        <p className="text-lg font-semibold text-white">Processing Transaction</p>
        <p className="text-sm text-slate-400 mt-1">Broadcasting to the network…</p>
      </div>

      {txId && (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-500">Tx ID</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400">
              {txId.slice(0, 8)}…{txId.slice(-6)}
            </span>
            <CopyButton text={txId} />
          </div>
        </div>
      )}

      <ProgressBar active={true} />

      <p className="text-xs text-slate-600">Do not close this window</p>
    </div>
  )
}

// ── Success step ──────────────────────────────────────────────────────────────
function SuccessStep({
  amount,
  token,
  txId,
}: {
  amount: number
  token: Token | null
  txId: string
}) {
  return (
    <div className="space-y-5 text-center">
      <SuccessIcon />

      <div>
        <p className="text-2xl font-bold text-white mt-2">{amount.toFixed(4)} {token?.symbol ?? "ETH"}</p>
        <p className="text-green-400 font-semibold mt-1">Payment confirmed!</p>
        <p className="text-xs text-slate-500 mt-1">Your transaction is on-chain</p>
      </div>

      <div className="rounded-2xl bg-green-500/5 border border-green-500/20 overflow-hidden divide-y divide-green-500/10">
        <Row label="Amount paid" value={`${amount.toFixed(6)} ${token?.symbol ?? "ETH"}`} />
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-xs text-slate-500">Transaction ID</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-300">
              {txId.slice(0, 8)}…{txId.slice(-6)}
            </span>
            <CopyButton text={txId} />
            <button className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer" aria-label="View on explorer">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 animate-pulse">Redirecting…</p>
    </div>
  )
}

// ── Failed step ───────────────────────────────────────────────────────────────
function FailedStep({ errorMsg, onRetry, onClose }: { errorMsg?: string; onRetry: () => void; onClose: () => void }) {
  return (
    <div className="space-y-5 text-center">
      <FailedIcon />

      <div>
        <p className="text-lg font-semibold text-white">Transaction Failed</p>
        <p className="text-sm text-slate-400 mt-1">
          {errorMsg || "The transaction was rejected or timed out. Your funds were not sent."}
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          className="flex items-center gap-2 flex-1 h-11 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors justify-center cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onRetry}
          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// ── Shared row component ──────────────────────────────────────────────────────
function Row({
  label,
  value,
  muted,
  chip,
}: {
  label: string
  value: React.ReactNode
  muted?: boolean
  chip?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-xs text-slate-500">{label}</span>
      {chip ? (
        <span className="text-xs font-medium text-slate-300 border border-slate-700 rounded-full px-2 py-0.5">
          {value}
        </span>
      ) : (
        <span className={`text-xs font-medium ${muted ? "text-slate-500" : "text-slate-300"}`}>{value}</span>
      )}
    </div>
  )
}
