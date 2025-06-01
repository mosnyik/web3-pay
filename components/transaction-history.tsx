"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Clock, AlertCircle, ExternalLink, Search, Filter, Download } from "lucide-react"

interface Transaction {
  id: string
  date: string
  amount: string
  token: string
  status: "confirmed" | "pending" | "failed"
  recipient: string
  txHash: string
  network: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15 14:30",
    amount: "0.9",
    token: "ETH",
    status: "confirmed",
    recipient: "Premium NFT Collection",
    txHash: "0x1234...5678",
    network: "Ethereum",
  },
  {
    id: "2",
    date: "2024-01-14 09:15",
    amount: "250.00",
    token: "USDC",
    status: "confirmed",
    recipient: "Digital Art License",
    txHash: "0x2345...6789",
    network: "Ethereum",
  },
  {
    id: "3",
    date: "2024-01-13 16:45",
    amount: "0.05",
    token: "BTC",
    status: "pending",
    recipient: "Web3 Course Access",
    txHash: "0x3456...7890",
    network: "Bitcoin",
  },
  {
    id: "4",
    date: "2024-01-12 11:20",
    amount: "1000",
    token: "TRX",
    status: "failed",
    recipient: "Gaming Credits",
    txHash: "0x4567...8901",
    network: "Tron",
  },
  {
    id: "5",
    date: "2024-01-11 13:10",
    amount: "1.25",
    token: "ETH",
    status: "confirmed",
    recipient: "Subscription Payment",
    txHash: "0x5678...9012",
    network: "Ethereum",
  },
]

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [networkFilter, setNetworkFilter] = useState<string>("all")

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter
    const matchesNetwork = networkFilter === "all" || tx.network === networkFilter

    return matchesSearch && matchesStatus && matchesNetwork
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
          >
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300">
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground">View and manage all your crypto payment transactions</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={networkFilter} onValueChange={setNetworkFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Networks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                <SelectItem value="Tron">Tron</SelectItem>
                <SelectItem value="Solana">Solana</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.date}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tx.recipient}</p>
                        <p className="text-sm text-muted-foreground">{tx.txHash}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {tx.amount} {tx.token}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tx.network}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        {getStatusBadge(tx.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful Payments</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {transactions.filter((tx) => tx.status === "confirmed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {transactions.filter((tx) => tx.status === "pending").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
