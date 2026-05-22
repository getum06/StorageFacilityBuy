import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts'
import { mockAcquisition } from '../../../data/mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-navy-300 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? (p.name === 'Revenue' ? `$${p.value.toLocaleString()}` : `${p.value}%`) : p.value}</div>
      ))}
    </div>
  )
}

const monthlyTrend = [
  { month: 'Jan', physical: 83, economic: 78 },
  { month: 'Feb', physical: 82, economic: 77 },
  { month: 'Mar', physical: 84, economic: 79 },
  { month: 'Apr', physical: 85, economic: 80 },
  { month: 'May', physical: 87, economic: 82 },
  { month: 'Jun', physical: 89, economic: 84 },
  { month: 'Jul', physical: 90, economic: 85 },
  { month: 'Aug', physical: 89, economic: 83 },
  { month: 'Sep', physical: 87, economic: 82 },
  { month: 'Oct', physical: 86, economic: 81 },
  { month: 'Nov', physical: 85, economic: 80 },
  { month: 'Dec', physical: 84, economic: 79 },
]

const GaugeChart = ({ value, label, color, size = 120 }) => {
  const pct = value / 100
  const angle = pct * 180
  const r = size * 0.42
  const cx = size / 2
  const cy = size / 2 + 10
  const toRad = (deg) => (deg - 90) * (Math.PI / 180)
  const arcPath = (startAngle, endAngle, radius) => {
    const start = toRad(startAngle)
    const end = toRad(endAngle)
    const x1 = cx + radius * Math.cos(start)
    const y1 = cy + radius * Math.sin(start)
    const x2 = cx + radius * Math.cos(end)
    const y2 = cy + radius * Math.sin(end)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.7}>
        <path d={arcPath(-90, 90, r)} stroke="#334155" strokeWidth={size * 0.1} fill="none" />
        <path d={arcPath(-90, -90 + angle, r)} stroke={color} strokeWidth={size * 0.1} fill="none" strokeLinecap="round" />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize={size * 0.2} fontWeight="bold">{value}%</text>
      </svg>
      <div className="text-xs text-gray-500 dark:text-navy-400 text-center mt-1">{label}</div>
    </div>
  )
}

export default function Slide05_OccupancyRevenue() {
  const { physicalOccupancy, economicOccupancy, delinquencyRate, revenueByMonth, grossRevenue, avgRentPerUnit, streetRate } = mockAcquisition

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 05</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Occupancy & Revenue Analysis</h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg">DFW Northgate — Current Performance Dashboard</p>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Physical Occupancy', value: `${physicalOccupancy}%`, sub: 'Current', color: 'text-sage-600 dark:text-sage-400', bg: 'bg-sage-50 dark:bg-sage-500/10' },
            { label: 'Economic Occupancy', value: `${economicOccupancy}%`, sub: 'After discounts', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Delinquency Rate', value: `${delinquencyRate}%`, sub: 'Needs improvement', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
            { label: 'Discount Rate', value: '7.5%', sub: 'Below market', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`${kpi.bg} rounded-xl p-4 border border-gray-200 dark:border-navy-700`}
            >
              <div className="text-xs text-gray-500 dark:text-navy-400 mb-1">{kpi.label}</div>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs text-gray-400 dark:text-navy-500">{kpi.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gauges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
          >
            <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-5">Occupancy Gauges</h4>
            <div className="flex flex-col items-center gap-4">
              <GaugeChart value={physicalOccupancy} label="Physical Occupancy" color="#3d7d52" size={140} />
              <GaugeChart value={economicOccupancy} label="Economic Occupancy" color="#3b82f6" size={140} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-navy-400">Avg Rent / Unit</span>
                <span className="font-semibold text-navy-900 dark:text-white">${avgRentPerUnit}/mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-navy-400">Street Rate</span>
                <span className="font-semibold text-sage-600 dark:text-sage-400">${streetRate}/mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-navy-400">Revenue Upside</span>
                <span className="font-semibold text-sage-600 dark:text-sage-400">8.2%</span>
              </div>
            </div>
          </motion.div>

          {/* Occupancy trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
              <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Occupancy Trend — 12 Months</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis domain={[70, 95]} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="physical" stroke="#3d7d52" strokeWidth={2.5} dot={false} name="Physical" />
                    <Line type="monotone" dataKey="economic" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Economic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-navy-400">
                  <div className="w-4 h-0.5 bg-sage-500 rounded" /> Physical Occupancy
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-navy-400">
                  <div className="w-4 h-0.5 bg-blue-500 rounded border-dashed" style={{ borderTop: '2px dashed' }} /> Economic Occupancy
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
              <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Monthly Revenue — $612K Annual</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueByMonth}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3d7d52" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3d7d52" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#3d7d52" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
