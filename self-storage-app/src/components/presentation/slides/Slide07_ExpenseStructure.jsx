import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { mockAcquisition } from '../../../data/mockData'

const { operatingExpenses, effectiveGrossRevenue } = mockAcquisition

const expenseItems = [
  { name: 'Property Tax', value: operatingExpenses.propertyTax, benchmark: 9, color: '#1e3a5f' },
  { name: 'Insurance', value: operatingExpenses.insurance, benchmark: 3, color: '#2d5a8e' },
  { name: 'Payroll', value: operatingExpenses.payroll, benchmark: 8, color: '#4178b4' },
  { name: 'Utilities', value: operatingExpenses.utilities, benchmark: 4, color: '#3d7d52' },
  { name: 'Maintenance', value: operatingExpenses.maintenance, benchmark: 3, color: '#57a96e' },
  { name: 'Marketing', value: operatingExpenses.marketing, benchmark: 2, color: '#6793c3' },
  { name: 'Management', value: operatingExpenses.management, benchmark: 6, color: '#8daed2' },
  { name: 'Software', value: operatingExpenses.software, benchmark: 2, color: '#4a90d9' },
  { name: 'Other/Reserves', value: operatingExpenses.other + operatingExpenses.reserves, benchmark: 3, color: '#94a3b8' },
]

const benchmarkData = expenseItems.map(e => ({
  name: e.name.replace('Property ', 'Prop ').replace('Management', 'Mgmt'),
  actual: parseFloat(((e.value / effectiveGrossRevenue) * 100).toFixed(1)),
  benchmark: e.benchmark,
}))

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-navy-300 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}%</div>
      ))}
    </div>
  )
}

export default function Slide07_ExpenseStructure() {
  const totalExpenses = operatingExpenses.total
  const expenseRatio = ((totalExpenses / effectiveGrossRevenue) * 100).toFixed(1)
  const noi = effectiveGrossRevenue - totalExpenses

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 07</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Expense Structure</h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg">Operating cost analysis vs. industry benchmarks</p>
        </motion.div>

        {/* Summary Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Effective Gross Revenue', value: `$${effectiveGrossRevenue.toLocaleString()}`, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Total Operating Expenses', value: `$${totalExpenses.toLocaleString()}`, color: 'text-red-600 dark:text-red-400' },
            { label: 'NOI / Expense Ratio', value: `${expenseRatio}%`, color: expenseRatio < 45 ? 'text-sage-600 dark:text-sage-400' : 'text-yellow-600 dark:text-yellow-400' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-4 text-center"
            >
              <div className="text-xs text-gray-500 dark:text-navy-400 mb-2">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Expense Breakdown Table + Pie */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
          >
            <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950">
              <h4 className="font-semibold text-white text-sm">Expense Waterfall</h4>
            </div>
            {/* Pie + table */}
            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseItems} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                      {expenseItems.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, n) => [`$${v.toLocaleString()}`, n]}
                      contentStyle={{ background: '#0f1f33', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 overflow-y-auto max-h-48">
                {expenseItems.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                    <span className="text-gray-600 dark:text-navy-300 flex-1 truncate">{e.name}</span>
                    <span className="font-semibold text-navy-900 dark:text-white">${(e.value/1000).toFixed(1)}K</span>
                  </div>
                ))}
              </div>
            </div>
            {/* NOI Footer */}
            <div className="px-5 py-3 bg-sage-50 dark:bg-sage-500/10 border-t border-sage-200 dark:border-sage-500/20 flex justify-between items-center">
              <span className="font-semibold text-sage-700 dark:text-sage-400 text-sm">Net Operating Income</span>
              <span className="font-bold text-sage-700 dark:text-sage-400 text-lg">${noi.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Benchmark Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
          >
            <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Actual vs. Benchmark (% of EGR)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="benchmark" fill="#334155" name="Benchmark" radius={[0, 2, 2, 0]} barSize={6} />
                  <Bar dataKey="actual" fill="#3d7d52" name="Actual" radius={[0, 2, 2, 0]} barSize={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-navy-400">
                <div className="w-3 h-3 rounded-sm bg-[#334155]" /> Industry Benchmark
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-navy-400">
                <div className="w-3 h-3 rounded-sm bg-sage-500" /> This Property
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Expense ratio of {expenseRatio}% is in-line with comparable facilities. Payroll and property tax are the primary targets for optimization in Year 1.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
