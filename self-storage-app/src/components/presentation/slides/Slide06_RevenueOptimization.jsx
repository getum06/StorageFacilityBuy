import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { mockAcquisition } from '../../../data/mockData'

const opportunities = mockAcquisition.revenueOpportunities

const strategies = [
  {
    category: 'Dynamic Pricing',
    color: 'bg-sage-500',
    items: [
      'Implement revenue management software (SiteLink/Storable)',
      'Price by unit size, floor, and demand curve',
      'Existing tenant rate optimization — 8% gap',
      'Seasonal rate adjustments',
    ],
    uplift: 45900,
  },
  {
    category: 'Ancillary Revenue',
    color: 'bg-blue-500',
    items: [
      'Tenant insurance program — $12–15/unit/mo',
      'Moving supplies & truck rental referrals',
      'Admin fee on new move-ins ($25–50)',
      'Enhanced late fee policy',
    ],
    uplift: 23400,
  },
  {
    category: 'Occupancy Growth',
    color: 'bg-purple-500',
    items: [
      'Digital marketing — Google/Meta ads',
      'Google My Business optimization',
      'Online reservation / contactless move-in',
      'Corporate account & referral programs',
    ],
    uplift: 40000,
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-navy-300 mb-0.5">{label}</div>
      <div className="font-bold text-sage-400">+${payload[0]?.value?.toLocaleString()}/yr</div>
    </div>
  )
}

export default function Slide06_RevenueOptimization() {
  const totalUplift = opportunities.reduce((a, o) => a + o.annualUplift, 0)
  const currentNOI = mockAcquisition.noi
  const optimizedNOI = currentNOI + totalUplift

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 06</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Revenue Optimization</h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg">Identified value-add opportunities post-acquisition</p>
        </motion.div>

        {/* Before vs After Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-navy-900 dark:bg-navy-800 rounded-xl p-5 mb-6 flex flex-wrap items-center gap-6 border border-navy-700"
        >
          <div className="flex-1 min-w-[120px]">
            <div className="text-navy-400 text-xs mb-1">Current NOI</div>
            <div className="text-2xl font-bold text-white">${currentNOI.toLocaleString()}</div>
            <div className="text-navy-400 text-xs">Year 1 (as-is)</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-center">
              <ArrowRight className="w-6 h-6 text-sage-400" />
              <span className="text-sage-400 text-xs mt-1">+${totalUplift.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-sage-400 text-xs mb-1">Optimized NOI</div>
            <div className="text-2xl font-bold text-sage-400">${optimizedNOI.toLocaleString()}</div>
            <div className="text-sage-500 text-xs">Year 3 target</div>
          </div>
          <div className="w-px h-12 bg-navy-700 hidden sm:block" />
          <div className="flex-1 min-w-[120px]">
            <div className="text-navy-400 text-xs mb-1">Cap Rate — Current</div>
            <div className="text-2xl font-bold text-white">8.0%</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-sage-400 text-xs mb-1">Cap Rate — Optimized</div>
            <div className="text-2xl font-bold text-sage-400">10.4%</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-navy-400 text-xs mb-1">Value Creation</div>
            <div className="text-2xl font-bold text-sage-300">+$1.5M</div>
            <div className="text-navy-400 text-xs">At 7.5% exit cap</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Uplift chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
          >
            <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Annual Revenue Uplift by Initiative</h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={opportunities} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="item" tick={{ fontSize: 9, fill: '#94a3b8' }} width={160} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="annualUplift" radius={[0, 4, 4, 0]}>
                    {opportunities.map((_, i) => (
                      <Cell key={i} fill={i % 3 === 0 ? '#3d7d52' : i % 3 === 1 ? '#3b82f6' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm border-t border-gray-200 dark:border-navy-700 pt-3">
              <span className="text-gray-500 dark:text-navy-400 font-medium">Total Annual Uplift</span>
              <span className="text-sage-600 dark:text-sage-400 font-bold text-lg">+${totalUplift.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Strategy Cards */}
          <div className="space-y-3">
            {strategies.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                    <span className="font-semibold text-navy-900 dark:text-white text-sm">{s.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sage-600 dark:text-sage-400 text-sm font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +${s.uplift.toLocaleString()}/yr
                  </div>
                </div>
                <ul className="space-y-1">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-600 dark:text-navy-300">
                      <span className="text-sage-500 mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
