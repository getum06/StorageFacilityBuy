import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, Legend
} from 'recharts'
import { mockAcquisition } from '../../data/mockData'

const COLORS = ['#1e3a5f', '#2d5a8e', '#4178b4', '#3d7d52', '#57a96e', '#6793c3', '#8daed2', '#94a3b8', '#334155']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-navy-300 mb-1 font-medium">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: {typeof p.value === 'number'
            ? (p.name?.includes('Rate') || p.name?.includes('%') || p.name?.includes('Margin')
              ? `${p.value.toFixed(1)}%`
              : `$${p.value.toLocaleString()}`)
            : p.value}
        </div>
      ))}
    </div>
  )
}

const GaugeRing = ({ value, max = 100, label, color = '#3d7d52', size = 100 }) => {
  const pct = Math.min(value / max, 1)
  const r = 36
  const circ = 2 * Math.PI * r
  const stroke = circ * pct
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#1e3a5f" strokeWidth="10" />
        <circle
          cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${stroke} ${circ - stroke}`}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="45" y="48" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {typeof value === 'number' ? (value > 1 ? `${value.toFixed(0)}%` : value.toFixed(2)) : value}
        </text>
      </svg>
      <span className="text-xs text-gray-500 dark:text-navy-400 text-center leading-tight">{label}</span>
    </div>
  )
}

export default function DashboardMetrics({ formData, metrics }) {
  const { noi, capRate, dscr, cashOnCash, noiBankMargin, expenseRatio, egr, totalExpenses, cashFlow, loanAmount, equity, annualDebtService } = metrics

  // Expense breakdown for pie
  const mgmtFee = egr * (formData.managementFeePercent / 100)
  const expenseData = [
    { name: 'Property Tax', value: formData.propertyTax },
    { name: 'Insurance', value: formData.insurance },
    { name: 'Payroll', value: formData.payroll },
    { name: 'Utilities', value: formData.utilities },
    { name: 'Maintenance', value: formData.maintenance },
    { name: 'Marketing', value: formData.marketing },
    { name: 'Mgmt Fee', value: Math.round(mgmtFee) },
    { name: 'Software', value: formData.software },
    { name: 'Other/Res', value: formData.otherExpenses + formData.reserves },
  ]

  // NOI waterfall
  const waterfallData = [
    { name: 'Gross Rev', value: formData.grossRevenue, fill: '#2d5a8e' },
    { name: 'EGR', value: Math.round(egr), fill: '#3b82f6' },
    { name: 'Expenses', value: -Math.round(totalExpenses), fill: '#ef4444' },
    { name: 'NOI', value: Math.round(noi), fill: '#3d7d52' },
    { name: 'Debt Svc', value: -Math.round(annualDebtService), fill: '#f59e0b' },
    { name: 'Cash Flow', value: Math.round(cashFlow), fill: '#10b981' },
  ]

  // Risk radar
  const { scores } = metrics
  const radarData = [
    { subject: 'Market', score: scores.marketScore },
    { subject: 'Occupancy', score: scores.occupancyScore },
    { subject: 'NOI', score: scores.noiScore },
    { subject: 'Competition', score: scores.competitionScore },
    { subject: 'Expansion', score: scores.expansionScore },
    { subject: 'Infrastructure', score: scores.infraScore },
    { subject: 'Financing', score: scores.finScore },
  ]

  // Revenue monthly trend
  const revData = mockAcquisition.revenueByMonth

  return (
    <div className="space-y-5">
      {/* KPI Gauges */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
      >
        <h3 className="font-semibold text-navy-900 dark:text-white text-sm mb-5 uppercase tracking-wider">Key Performance Indicators</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <GaugeRing value={formData.physicalOccupancy} label="Physical Occ" color="#3d7d52" />
          <GaugeRing value={formData.economicOccupancy} label="Economic Occ" color="#3b82f6" />
          <GaugeRing value={capRate} max={15} label="Cap Rate %" color="#8b5cf6" />
          <GaugeRing value={Math.min(dscr * 50, 100)} max={100} label="DSCR" color={dscr >= 1.25 ? '#3d7d52' : '#ef4444'} />
          <GaugeRing value={Math.max(0, Math.min(cashOnCash, 100))} label="Cash-on-Cash" color="#f59e0b" />
          <GaugeRing value={noiBankMargin} label="NOI Margin" color="#10b981" />
          <GaugeRing value={100 - expenseRatio} label="Eff. Ratio" color="#ec4899" />
          <GaugeRing value={scores.weightedScore} label="Inv. Score" color={scores.weightedScore >= 75 ? '#3d7d52' : scores.weightedScore >= 60 ? '#f59e0b' : '#ef4444'} />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* NOI Waterfall */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
        >
          <h3 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Revenue → Cash Flow Waterfall</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `$${(Math.abs(v)/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {waterfallData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Pie */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
        >
          <h3 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Expense Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={65}>
                    {expenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`$${v.toLocaleString()}`]}
                    contentStyle={{ background: '#0f1f33', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-48">
              {expenseData.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-600 dark:text-navy-300 flex-1 truncate">{e.name}</span>
                  <span className="font-semibold text-navy-900 dark:text-white">${(e.value/1000).toFixed(1)}K</span>
                </div>
              ))}
              <div className="pt-1.5 mt-1 border-t border-gray-100 dark:border-navy-700 flex justify-between text-xs font-bold">
                <span className="text-gray-700 dark:text-navy-200">Total</span>
                <span className="text-red-500">${(totalExpenses/1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
        >
          <h3 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Monthly Revenue (Mock Historical)</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revData}>
                <defs>
                  <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3d7d52" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3d7d52" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ background: '#0f1f33', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3d7d52" strokeWidth={2.5} fill="url(#revArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Radar */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
        >
          <h3 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Acquisition Risk Radar</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Radar name="Score" dataKey="score" stroke="#3d7d52" fill="#3d7d52" fillOpacity={0.35} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {radarData.map((d, i) => (
              <div key={i} className="text-center bg-gray-50 dark:bg-navy-900 rounded-lg p-2">
                <div className={`text-sm font-bold ${d.score >= 80 ? 'text-sage-500' : d.score >= 65 ? 'text-blue-500' : 'text-yellow-500'}`}>{d.score.toFixed(0)}</div>
                <div className="text-xs text-gray-400 dark:text-navy-500">{d.subject}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Financial Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
      >
        <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950">
          <h3 className="font-semibold text-white text-sm">Full Financial Summary</h3>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-navy-700">
          {[
            {
              title: 'Revenue',
              rows: [
                { label: 'Gross Revenue', value: `$${formData.grossRevenue.toLocaleString()}` },
                { label: 'Vacancy Loss', value: `-$${(formData.grossRevenue - Math.round(egr)).toLocaleString()}`, neg: true },
                { label: 'Effective Gross Revenue', value: `$${Math.round(egr).toLocaleString()}`, bold: true },
              ]
            },
            {
              title: 'Expenses',
              rows: [
                { label: 'Total Expenses', value: `-$${Math.round(totalExpenses).toLocaleString()}`, neg: true },
                { label: 'Expense Ratio', value: `${expenseRatio.toFixed(1)}%` },
                { label: 'NOI', value: `$${Math.round(noi).toLocaleString()}`, bold: true, highlight: true },
              ]
            },
            {
              title: 'Returns',
              rows: [
                { label: 'Cap Rate', value: `${capRate.toFixed(2)}%`, highlight: true },
                { label: 'DSCR', value: `${dscr.toFixed(2)}x`, highlight: dscr >= 1.25 },
                { label: 'Cash-on-Cash', value: `${cashOnCash.toFixed(1)}%`, highlight: true },
              ]
            },
          ].map((section, i) => (
            <div key={i} className="p-5">
              <div className="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wider mb-3">{section.title}</div>
              <div className="space-y-2.5">
                {section.rows.map((row, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-navy-300">{row.label}</span>
                    <span className={`text-sm font-${row.bold ? 'bold' : 'semibold'} ${
                      row.highlight ? 'text-sage-600 dark:text-sage-400' :
                      row.neg ? 'text-red-500' :
                      'text-navy-900 dark:text-white'
                    }`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
