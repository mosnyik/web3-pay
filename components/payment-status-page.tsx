"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, Copy, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

type PaymentStatus = "pending" | "confirming" | "confirmed" | "failed"

interface PaymentStatusPageProps {
  transactionId: string
}

export function PaymentStatusPage({ transactionId }: PaymentStatusPageProps) {
  const [status, setStatus] = useState<PaymentStatus>("pending")
  const [confirmations, setConfirmations] = useState(0)
  const [requiredConfirmations] = useState(12)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      if (status === "pending") {
        setStatus("confirming")
        setConfirmations(1)
      } else if (status === "confirming" && confirmations < requiredConfirmations) {
        setConfirmations((prev) => Math.min(prev + 1, requiredConfirmations))
        if (confirmations + 1 >= requiredConfirmations) {
          setStatus("confirmed")
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [status, confirmations, requiredConfirmations])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Transaction ID copied successfully",
    })
  }

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400 animate-pulse" />
      case "confirming":
        return <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      case "confirmed":
        return <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
      case "failed":
        return <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      case "confirming":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      case "failed":
        return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Transaction Pending"
      case "confirming":
        return "Confirming Transaction"
      case "confirmed":
        return "Transaction Confirmed"
      case "failed":
        return "Transaction Failed"
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
          >
            Pending
          </Badge>
        )
      case "confirming":
        return (
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            Confirming
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
            Confirmed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300">
            Failed
          </Badge>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/checkout">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Checkout
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Payment Status</h1>
        <p className="text-muted-foreground">Track your transaction in real-time</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Status Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={getStatusColor()}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">{getStatusIcon()}</div>
              <h2 className="text-2xl font-bold mb-2">{getStatusText()}</h2>
              <div className="mb-4">{getStatusBadge()}</div>

              {status === "confirming" && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Confirmations: {confirmations} / {requiredConfirmations}
                  </p>
                  <Progress value={(confirmations / requiredConfirmations) * 100} className="w-full" />
                </div>
              )}

              {status === "confirmed" && (
                <p className="text-sm text-muted-foreground">
                  Your payment has been successfully processed and confirmed on the blockchain.
                </p>
              )}

              {status === "pending" && (
                <p className="text-sm text-muted-foreground">
                  Your transaction has been submitted and is waiting to be processed.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Transaction Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Transaction Submitted</p>
                    <p className="text-sm text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      status === "pending" ? "bg-muted" : "bg-green-100 dark:bg-green-900/20"
                    }`}
                  >
                    {status === "pending" ? (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Transaction Broadcasted</p>
                    <p className="text-sm text-muted-foreground">
                      {status === "pending" ? "Waiting..." : "1 minute ago"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      status === "pending" || status === "confirming" ? "bg-muted" : "bg-green-100 dark:bg-green-900/20"
                    }`}
                  >
                    {status === "pending" || status === "confirming" ? (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Transaction Confirmed</p>
                    <p className="text-sm text-muted-foreground">
                      {status === "confirmed" ? "Just now" : "Waiting for confirmations..."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono break-all">{transactionId}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={() => copyToClipboard(transactionId)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-sm">Amount</span>
                <span className="text-sm font-medium">0.9 ETH</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Network</span>
                <Badge variant="outline">Ethereum</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Gas Fee</span>
                <span className="text-sm font-medium">0.0025 ETH</span>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>0.9025 ETH</span>
              </div>

              <Button variant="outline" className="w-full" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {status === "confirmed" ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your payment is complete! Here's what you can do next:
                  </p>
                  <Link href="/transactions">
                    <Button variant="outline" className="w-full" size="sm">
                      View All Transactions
                    </Button>
                  </Link>
                  <Link href="/checkout">
                    <Button className="w-full" size="sm">
                      Make Another Payment
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Please wait while your transaction is being processed. This usually takes 2-5 minutes.
                  </p>
                  <Button variant="outline" className="w-full" size="sm" disabled>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Refreshing Status...
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
