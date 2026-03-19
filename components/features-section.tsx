import { CreditCard, History, Smartphone, Palette, Code, Shield, Zap, Globe, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Ethereum, Bitcoin, Solana, Tron, Polygon, BNB Chain — and more. One unified interface for every major network.",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    borderHover: "hover:border-blue-500/30",
    glow: "hover:shadow-blue-500/10",
    large: true,
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Bank-grade encryption, non-custodial connections, and WalletConnect v2 security standards.",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    borderHover: "hover:border-green-500/30",
    glow: "hover:shadow-green-500/10",
    large: false,
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Live payment status with instant confirmation notifications and block explorer links.",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
    borderHover: "hover:border-yellow-500/30",
    glow: "hover:shadow-yellow-500/10",
    large: false,
  },
  {
    icon: CreditCard,
    title: "Crypto Checkout",
    description: "Complete checkout flow — cart summary, token selection, and payment confirmation in seconds.",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    borderHover: "hover:border-violet-500/30",
    glow: "hover:shadow-violet-500/10",
    large: false,
  },
  {
    icon: BarChart3,
    title: "Payment Analytics",
    description: "Detailed analytics and reporting for all your crypto payment transactions.",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    borderHover: "hover:border-pink-500/30",
    glow: "hover:shadow-pink-500/10",
    large: true,
  },
  {
    icon: History,
    title: "Transaction History",
    description: "Full transaction log with search, filtering, and status tracking across all networks.",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    borderHover: "hover:border-cyan-500/30",
    glow: "hover:shadow-cyan-500/10",
    large: false,
  },
  {
    icon: Code,
    title: "Developer Ready",
    description: "Clean TypeScript codebase, modular architecture, and easy integration with existing backends.",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    borderHover: "hover:border-orange-500/30",
    glow: "hover:shadow-orange-500/10",
    large: false,
  },
  {
    icon: Palette,
    title: "Theme Support",
    description: "Light and dark mode with smooth transitions and system preference detection.",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    borderHover: "hover:border-purple-500/30",
    glow: "hover:shadow-purple-500/10",
    large: false,
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description: "Pixel-perfect on mobile, tablet, and desktop. Built mobile-first.",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    borderHover: "hover:border-teal-500/30",
    glow: "hover:shadow-teal-500/10",
    large: false,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-950 dark:bg-[#060B18] relative overflow-hidden">
      {/* Subtle top separator glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-violet-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-violet-300 tracking-wide uppercase">Everything included</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Complete Payment Solution
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to accept crypto payments — secure, fast, and developer-friendly out of the box.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Row 1: Large + Small + Small */}
          <div className={`md:col-span-2 group relative bg-slate-900/60 border border-slate-800 ${features[0].borderHover} rounded-2xl p-7 transition-all duration-300 hover:shadow-xl ${features[0].glow} cursor-default`}>
            <div className={`w-12 h-12 ${features[0].iconBg} rounded-xl flex items-center justify-center mb-5`}>
              <Globe className={`w-6 h-6 ${features[0].iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{features[0].title}</h3>
            <p className="text-slate-400 leading-relaxed">{features[0].description}</p>
            {/* Chain dots decoration */}
            <div className="absolute bottom-6 right-6 flex gap-2">
              {["bg-blue-500","bg-orange-500","bg-purple-500","bg-red-500","bg-violet-500","bg-yellow-500"].map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${c} opacity-70`} />
              ))}
            </div>
          </div>

          <div className={`group relative bg-slate-900/60 border border-slate-800 ${features[1].borderHover} rounded-2xl p-7 transition-all duration-300 hover:shadow-xl ${features[1].glow} cursor-default`}>
            <div className={`w-12 h-12 ${features[1].iconBg} rounded-xl flex items-center justify-center mb-5`}>
              <Shield className={`w-6 h-6 ${features[1].iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{features[1].title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{features[1].description}</p>
          </div>

          {/* Row 2: Three equal */}
          {[features[2], features[3], features[5]].map((f) => (
            <div
              key={f.title}
              className={`group relative bg-slate-900/60 border border-slate-800 ${f.borderHover} rounded-2xl p-7 transition-all duration-300 hover:shadow-xl ${f.glow} cursor-default`}
            >
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}

          {/* Row 3: Small + Large */}
          {[features[6], features[7]].map((f) => (
            <div
              key={f.title}
              className={`group relative bg-slate-900/60 border border-slate-800 ${f.borderHover} rounded-2xl p-7 transition-all duration-300 hover:shadow-xl ${f.glow} cursor-default`}
            >
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}

          <div className={`group relative bg-gradient-to-br from-violet-900/40 to-purple-900/20 border border-violet-700/30 ${features[4].borderHover} rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/15 cursor-default`}>
            <div className={`w-12 h-12 ${features[4].iconBg} rounded-xl flex items-center justify-center mb-5`}>
              <BarChart3 className={`w-6 h-6 ${features[4].iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{features[4].title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{features[4].description}</p>
            {/* Mini bar chart decoration */}
            <div className="absolute bottom-6 right-6 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-sm bg-pink-500/40"
                  style={{ height: `${h * 0.4}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
