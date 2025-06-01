"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  token: any
  onSuccess: (transactionId: string) => void
}

type PaymentStep = "confirm" | "processing" | "success" | "failed"

export function PaymentModal({ isOpen, onClose, amount, token, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>("confirm")
  const [transactionId, setTransactionId] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setStep("confirm")
      setTransactionId("")
    }
  }, [isOpen])

  const handleConfirmPayment = async () => {
    setStep("processing")

    // Generate mock transaction ID
    const mockTxId = `0x${Math.random().toString(16).substr(2, 64)}`
    setTransactionId(mockTxId)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Randomly succeed or fail for demo
    const success = Math.random() > 0.2 // 80% success rate

    if (success) {
      setStep("success")
      setTimeout(() => {
        onSuccess(mockTxId)
      }, 2000)
    } else {
      setStep("failed")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Transaction ID copied successfully",
    })
  }

  const renderStepContent = () => {
    switch (step) {
      case "confirm":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Payment</h3>
              <p className="text-muted-foreground">Review your payment details before confirming</p>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="font-semibold">{amount.toFixed(3)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Token</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 ${token?.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {token?.icon}
                    </div>
                    <span>{token?.symbol}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Network</span>
                  <Badge variant="outline">{token?.network}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{amount.toFixed(3)} ETH</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirmPayment} className="flex-1">
                Confirm Payment
              </Button>
            </div>
          </div>
        )

      case "processing":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
              <p className="text-muted-foreground">Please wait while we process your transaction...</p>
            </div>

            {transactionId && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transaction ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono">
                        {transactionId.slice(0, 10)}...{transactionId.slice(-8)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(transactionId)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
          </div>
        )

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">Payment Successful!</h3>
              <p className="text-muted-foreground">Your transaction has been confirmed on the blockchain</p>
            </div>

            <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span className="font-semibold">{amount.toFixed(3)} ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Transaction ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">
                      {transactionId.slice(0, 10)}...{transactionId.slice(-8)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(transactionId)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground">Redirecting to payment status page...</p>
          </div>
        )

      case "failed":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Payment Failed</h3>
              <p className="text-muted-foreground">There was an issue processing your payment. Please try again.</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button onClick={() => setStep("confirm")} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === "confirm" && "Confirm Payment"}
            {step === "processing" && "Processing..."}
            {step === "success" && "Payment Complete"}
            {step === "failed" && "Payment Failed"}
          </DialogTitle>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  )
}
