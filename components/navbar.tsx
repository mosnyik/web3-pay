"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, CreditCard, History, Home, Wallet } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { WalletErrorBoundary } from "@/components/wallet-error-boundary"
import { useWallet } from "@/lib/wallet/wallet-context"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { account } = useWallet()

  useEffect(() => { setMounted(true) }, [])

  const isConnected = mounted && !!account

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Checkout", href: "/checkout", icon: CreditCard },
    { name: "Transactions", href: "/transactions", icon: History },
    { name: "Wallet Tokens", href: "/wallet-tokens", icon: Wallet },
  ]

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 dark:bg-[#060B18]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-wide">Web3Pay</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    active
                      ? "text-white bg-slate-800/70"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-500 rounded-full" />
                  )}
                </Link>
              )
            })}

            {/* Wallet Connect Button with Error Boundary */}
            <div className="ml-4">
              <WalletErrorBoundary>
                <WalletConnectButton />
              </WalletErrorBoundary>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Menu className="w-5 h-5" />
                  {isConnected && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400 ring-2 ring-slate-950">
                      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-950 border-slate-800">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col space-y-1 mt-8">
                  {navigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200",
                          active
                            ? "text-white bg-slate-800 border-l-2 border-violet-500"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5", active ? "text-violet-400" : "")} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}

                  <div className="pt-4 border-t border-slate-800">
                    <WalletErrorBoundary>
                      <WalletConnectButton />
                    </WalletErrorBoundary>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
