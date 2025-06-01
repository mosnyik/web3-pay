"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/lib/wallet/wallet-context"
import { TronTokenBalances } from "@/components/tron-token-balances"
import { TronTokenTransfer } from "@/components/tron-token-transfer"
import { AlertCircle, Wallet } from "lucide-react"

export function TronTokensPage() {
  const { activeAdapter, account, connect } = useWallet()

  // Check if we have a Tron adapter and it's connected
  const isTronConnected = activeAdapter?.id === "tron" && !!account

  // Handle connect button click
  const handleConnect = async () => {
    if (!activeAdapter || activeAdapter.id !== "tron") {
      await connect("tron")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tron TRC-20 Tokens</h1>
        <p className="text-muted-foreground">Manage your TRC-20 tokens on the Tron blockchain</p>
      </div>

      {!isTronConnected ? (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Tron Wallet</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Connect your Tron wallet to view and manage your TRC-20 tokens like USDT, USDC, and more.
            </p>
            <Button onClick={handleConnect}>Connect Tron Wallet</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-mono">{account?.displayAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span>{account?.networkName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TRX Balance</span>
                    <span>{account?.balance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <TronTokenBalances />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Always verify the recipient address before sending tokens. Blockchain transactions cannot be reversed.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <TronTokenTransfer />
          </div>
        </div>
      )}
    </div>
  )
}
