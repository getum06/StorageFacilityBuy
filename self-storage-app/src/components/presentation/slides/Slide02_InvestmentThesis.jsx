import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, User, Home, DollarSign } from 'lucide-react'

const reasons = [
  {
    icon: TrendingUp,
    title: 'Recurring Revenue',
    desc: 'Month-to-month leases provide operational flexibility and pricing power that long-term leases cannot match.',
    stat: '~94%',
    statLabel: 'Retention Rate (Avg)',
    color: 'text-sage-500',
    bg: 'bg-sage-50 dark:bg-sage-500/10',
    border: 'border-sage-200 dark:border-sage-500/20',
  },
  {
    icon: Zap,
    title: 'Inflation Resistance',
    desc: 'Self-storage rents have consistently outpaced CPI. Short lease terms enable rapid rent adjustment in inflationary environments.',
    stat: '+7.2%',
    statLabel: 'Avg Annual Rent Growth',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
  },
  {
    icon: Users,
    title: 'Operational Leverage',
    desc: 'Centralized management models allow a single manager to operate 300–500+ units. Technology reduces marginal cost per unit.',
    stat: '1:450',
    statLabel: 'Staff to Unit Ratio',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/20',
  },
  {
    icon: User,
    title: 'Low Labor Intensity',
    desc: 'Unlike multifamily or hospitality, self-storage requires minimal on-site staffing — often 1–2 FTEs per facility.',
    stat: '3–5%',
    statLabel: 'Payroll as % of Revenue',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    border: 'border-orange-200 dark:border-orange-500/20',
  },
  {
    icon: Home,
    title: 'Real Estate Appreciation',
    desc: 'Well-located storage assets benefit from land scarcity and rising replacement costs as industrial land values increase.',
    stat: '+5.8%',
    statLabel: 'Avg Cap Rate Compression',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/20',
  },
  {
    icon: DollarSign,
    title: 'NOI Optimization',
    desc: 'Underperforming facilities offer significant value-add through pricing optimization, ancillary revenue, and expense reduction.',
    stat: '20–35%',
    statLabel: 'Typical Upside on Turnaround',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
  },
]

export default function Slide02_InvestmentThesis() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 02</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-2">
            Investment Thesis
          </h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg max-w-2xl">
            Why self-storage consistently outperforms as an asset class across market cycles
          </p>
        </motion.div>

        {/* Top banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-navy-900 dark:bg-navy-800 rounded-xl p-5 mb-8 flex flex-wrap gap-8 border border-navy-700"
        >
          {[
            { label: 'REIT Sector Performance (10-yr)', value: '+180%' },
            { label: 'Avg Stabilized Cap Rate', value: '5.5–7.5%' },
            { label: 'US Storage Facilities', value: '52,000+' },
            { label: 'Industry Revenue', value: '$39.5B' },
          ].map((stat, i) => (
            <div key={i} className="text-center flex-1 min-w-[100px]">
              <div className="text-2xl font-bold text-sage-400">{stat.value}</div>
              <div className="text-navy-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Thesis cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className={`rounded-xl border ${reason.border} ${reason.bg} p-5 hover:shadow-md transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-white dark:bg-navy-800 flex items-center justify-center shadow-sm`}>
                  <reason.icon className={`w-5 h-5 ${reason.color}`} />
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${reason.color}`}>{reason.stat}</div>
                  <div className="text-xs text-gray-500 dark:text-navy-400">{reason.statLabel}</div>
                </div>
              </div>
              <h3 className="font-semibold text-navy-900 dark:text-white text-base mb-2">{reason.title}</h3>
              <p className="text-gray-600 dark:text-navy-300 text-sm leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-sage-50 dark:bg-sage-500/10 border border-sage-200 dark:border-sage-500/20 rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-2 h-10 bg-sage-500 rounded-full flex-shrink-0" />
          <p className="text-navy-800 dark:text-sage-100 text-sm leading-relaxed">
            <strong>Key Insight:</strong> Self-storage has delivered positive returns in every recession since 1990. The "4 Ds" — Death, Divorce, Dislocation, and Downsizing — drive demand regardless of economic conditions, creating a naturally defensive asset profile.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
