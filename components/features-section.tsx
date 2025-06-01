import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, History, Smartphone, Palette, Code, Shield, Zap, Globe, BarChart3 } from "lucide-react"

const features = [
  {
    icon: CreditCard,
    title: "Crypto Checkout",
    description: "Complete checkout flow with cart summary, token selection, and payment confirmation",
  },
  {
    icon: History,
    title: "Transaction History",
    description: "Comprehensive transaction tracking with detailed payment history and status updates",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Fully responsive interface that works seamlessly across mobile, tablet, and desktop",
  },
  {
    icon: Palette,
    title: "Theme Support",
    description: "Built-in light and dark mode support with smooth transitions and system preference detection",
  },
  {
    icon: Code,
    title: "Developer Ready",
    description: "Complete documentation and easy integration with existing payment backends",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Bank-grade security with encrypted transactions and secure wallet connections",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Live payment status tracking with instant confirmation notifications",
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Support for Ethereum, Bitcoin, Solana, Tron, and other major blockchain networks",
  },
  {
    icon: BarChart3,
    title: "Payment Analytics",
    description: "Detailed analytics and reporting for all your crypto payment transactions",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Complete Payment Solution</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to accept crypto payments with a modern, secure, and user-friendly interface
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
