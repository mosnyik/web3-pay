"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary component specifically for wallet operations
 * Catches and displays wallet-related errors with recovery options
 */
export class WalletErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Wallet error caught:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        this.props.fallback || (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Error</AlertTitle>
            <AlertDescription>
              <div className="space-y-4">
                <p>
                  There was an error with the wallet connection:
                  <span className="font-mono text-sm block mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    {this.state.error?.message || "Unknown error"}
                  </span>
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" onClick={this.handleReset}>
                    Try Again
                  </Button>
                  <Button variant="outline" size="sm" onClick={this.handleReload}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reload Page
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )
      )
    }

    return this.props.children
  }
}
