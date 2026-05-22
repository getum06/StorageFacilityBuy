import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { mockAcquisition, sensitivityData } from '../../../data/mockData'

const { noi, debt, purchasePrice } = mockAcquisition

const capRate = ((noi / purchasePrice) * 100).toFixed(2)
const cashOnCash = (((noi - debt.annualDebtService) / (purchasePrice * (1 - debt.ltv / 100))) * 100).toFixed(1)
const equity = purchasePrice * (1 - debt.ltv / 100)

const debtServiceData = [
  { name: 'Principal', value: Math.round(debt.annualDebtService * 0.28), color: '#1e3a5f' },
  { name: 'Interest', value: Math.round(debt.annualDebtService * 0.72), color: '#2d5a8e' },
  { name: 'NOI Remaining', value: noi - debt.annualDebtService, color: '#3d7d52' },
]

const sensitivityRows = sensitivityData.capRates.map((cr, i) => ({
  capRate: `${cr}%`,
  ...Object.fromEntries(sensitivityData.noiLevels.map((noi, j) => [
    `noi_${j}`,
    `$${(sensitivityData.values[i][j] / 1000).toFixed(0)}K`
  ]))
}))

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-navy-300 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.fill }} className="font-semibold">{p.name}: ${p.value?.toLocaleString()}</div>
      ))}
    </div>
  )
}

const noiLevelsK = sensitivityData.noiLevels.map(v => `$${(v/1000).toFixed(0)}K NOI`)

export default function Slide08_NOIFinancing() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 08</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">NOI & Financing</h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg">Return metrics, debt structure & valuation sensitivity</p>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Cap Rate', value: `${capRate}%`, sub: 'Going-in', color: 'text-sage-600 dark:text-sage-400', bg: 'bg-sage-50 dark:bg-sage-500/10 border-sage-200 dark:border-sage-500/20' },
            { label: 'DSCR', value: debt.dscr.toFixed(2), sub: '> 1.25x target', color: `${debt.dscr >= 1.25 ? 'text-sage-600 dark:text-sage-400' : 'text-red-600 dark:text-red-400'}`, bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
            { label: 'Cash-on-Cash', value: `${cashOnCash}%`, sub: 'Year 1 unlevered', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20' },
            { label: 'LTV', value: `${debt.ltv}%`, sub: `$${(debt.loanAmount/1000000).toFixed(1)}M loan`, color: 'text-navy-600 dark:text-navy-300', bg: 'bg-gray-50 dark:bg-navy-800 border-gray-200 dark:border-navy-700' },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`rounded-xl border p-4 text-center ${kpi.bg}`}
            >
              <div className="text-xs text-gray-500 dark:text-navy-400 mb-1">{kpi.label}</div>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs text-gray-400 dark:text-navy-500">{kpi.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Debt Service Visualization */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
            >
              <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">NOI Waterfall & Debt Coverage</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={debtServiceData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {debtServiceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {[
                  { label: 'Annual NOI', value: `$${noi.toLocaleString()}` },
                  { label: 'Annual Debt Service', value: `-$${debt.annualDebtService.toLocaleString()}`, neg: true },
                  { label: 'Cash Flow (Pre-Tax)', value: `$${(noi - debt.annualDebtService).toLocaleString()}`, highlight: true },
                ].map((r, i) => (
                  <div key={i} className={`flex justify-between py-1 ${i === 2 ? 'border-t border-gray-200 dark:border-navy-700 font-bold' : ''}`}>
                    <span className="text-gray-600 dark:text-navy-300">{r.label}</span>
                    <span className={r.highlight ? 'text-sage-600 dark:text-sage-400' : r.neg ? 'text-red-500' : 'text-navy-900 dark:text-white'}>{r.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Loan Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-navy-900 dark:bg-navy-950 rounded-xl border border-navy-700 p-5"
            >
              <h4 className="font-semibold text-white text-sm mb-3">Debt Structure</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Loan Amount', value: `$${(debt.loanAmount/1000000).toFixed(2)}M` },
                  { label: 'Interest Rate', value: `${debt.interestRate}%` },
                  { label: 'Amortization', value: `${debt.amortization} years` },
                  { label: 'Monthly Payment', value: `$${debt.monthlyPayment.toLocaleString()}` },
                  { label: 'Equity Required', value: `$${(equity/1000000).toFixed(2)}M` },
                  { label: 'DSCR', value: `${debt.dscr.toFixed(2)}x ✓` },
                ].map((item, i) => (
                  <div key={i} className="bg-navy-800 rounded-lg px-3 py-2">
                    <div className="text-navy-400 text-xs">{item.label}</div>
                    <div className="text-white font-semibold text-sm mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sensitivity Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
          >
            <div className="px-5 py-4 bg-navy-900 dark:bg-navy-950">
              <h4 className="font-semibold text-white text-sm">Valuation Sensitivity — NOI vs Exit Cap Rate</h4>
              <p className="text-navy-400 text-xs mt-1">Property value = NOI / Cap Rate (thousands)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-navy-700">
                    <th className="px-3 py-2.5 text-left text-gray-500 dark:text-navy-400 font-semibold w-20">Exit Cap</th>
                    {sensitivityData.noiLevels.map((noi, i) => (
                      <th key={i} className={`px-2 py-2.5 text-center font-semibold ${noi === mockAcquisition.noi ? 'text-sage-600 dark:text-sage-400' : 'text-gray-500 dark:text-navy-400'}`}>
                        ${(noi/1000).toFixed(0)}K
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-navy-700">
                  {sensitivityData.capRates.map((cr, i) => (
                    <tr key={i} className="hover:bg-gray-100 dark:hover:bg-navy-750 transition-colors">
                      <td className="px-3 py-2.5 font-mono font-semibold text-navy-900 dark:text-white">{cr}%</td>
                      {sensitivityData.values[i].map((val, j) => {
                        const isCurrentScenario = sensitivityData.capRates[i] === 8.0 && j === 2
                        const isBetter = val > purchasePrice * 1.1
                        return (
                          <td
                            key={j}
                            className={`px-2 py-2.5 text-center font-mono text-xs ${
                              isCurrentScenario
                                ? 'bg-sage-100 dark:bg-sage-500/20 text-sage-700 dark:text-sage-400 font-bold'
                                : isBetter
                                ? 'text-sage-600 dark:text-sage-300'
                                : val < purchasePrice * 0.9
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-700 dark:text-navy-300'
                            }`}
                          >
                            ${(val/1000).toFixed(0)}K
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-blue-50 dark:bg-blue-500/10 border-t border-blue-200 dark:border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
              <strong>Current scenario highlighted.</strong> Purchase price: $4.2M. Green = value creation. Red = below basis.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
