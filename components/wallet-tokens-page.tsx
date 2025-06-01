"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/lib/wallet/wallet-context"
import { TronTokenBalances } from "@/components/tron-token-balances"
import { TronTokenTransfer } from "@/components/tron-token-transfer"
import { EthereumTokenBalances } from "@/components/ethereum-token-balances"
import { BitcoinBalances } from "@/components/bitcoin-balances"
import { SolanaTokenBalances } from "@/components/solana-token-balances"
import { AlertCircle, Wallet } from "lucide-react"

export function WalletTokensPage() {
  const { activeAdapter, account, connect } = useWallet()
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Set the active tab based on the connected wallet
  useEffect(() => {
    if (activeAdapter) {
      setActiveTab(activeAdapter.id)
    } else {
      setActiveTab("overview")
    }
  }, [activeAdapter])

  // Handle connect button click
  const handleConnect = async () => {
    if (!activeAdapter) {
      // Show wallet selection modal
      const walletModal = document.getElementById("wallet-connect-modal")
      if (walletModal) {
        // @ts-ignore
        walletModal.showModal()
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet Tokens</h1>
        <p className="text-muted-foreground">Manage your tokens across multiple blockchains</p>
      </div>

      {!account ? (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Connect your wallet to view and manage your tokens across Ethereum, Bitcoin, Solana, Tron, and more.
            </p>
            <Button onClick={handleConnect}>Connect Wallet</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span>{account?.networkName || activeAdapter?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-mono">{account?.displayAddress}</span>
                </div>
                {account?.balance && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance</span>
                    <span>{account?.balance}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
              <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
              <TabsTrigger value="solana">Solana</TabsTrigger>
              <TabsTrigger value="tron">Tron</TabsTrigger>
            </TabsList>

            <TabsContent value="ethereum">
              <div className="grid md:grid-cols-2 gap-8">
                <EthereumTokenBalances />
              </div>
            </TabsContent>

            <TabsContent value="bitcoin">
              <div className="grid md:grid-cols-2 gap-8">
                <BitcoinBalances />
              </div>
            </TabsContent>

            <TabsContent value="solana">
              <div className="grid md:grid-cols-2 gap-8">
                <SolanaTokenBalances />
              </div>
            </TabsContent>

            <TabsContent value="tron">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <TronTokenBalances />
                </div>
                <div>
                  <TronTokenTransfer />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Always verify the recipient address before sending tokens. Blockchain transactions cannot be reversed.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
