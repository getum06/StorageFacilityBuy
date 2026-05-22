import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const marketMetrics = [
  { metric: 'Population Growth', value: 2.8, benchmark: 1.5, weight: 20, score: 90, unit: '% YoY', status: 'excellent' },
  { metric: 'Household Growth', value: 3.1, benchmark: 1.2, weight: 18, score: 92, unit: '% YoY', status: 'excellent' },
  { metric: 'Apartment Density', value: 38, benchmark: 30, weight: 12, score: 75, unit: '% renter', status: 'good' },
  { metric: 'Small Biz Density', value: 12.4, benchmark: 8.0, weight: 10, score: 80, unit: 'per 1k pop', status: 'good' },
  { metric: 'Median Income', value: 72400, benchmark: 65000, weight: 15, score: 72, unit: '$', status: 'good' },
  { metric: 'Employment Growth', value: 3.4, benchmark: 2.0, weight: 15, score: 88, unit: '% YoY', status: 'excellent' },
  { metric: 'Residential Turnover', value: 18, benchmark: 14, weight: 10, score: 70, unit: '% annual', status: 'good' },
]

const radarData = [
  { subject: 'Pop Growth', A: 90 },
  { subject: 'Household', A: 92 },
  { subject: 'Apt Density', A: 75 },
  { subject: 'Biz Density', A: 80 },
  { subject: 'Income', A: 72 },
  { subject: 'Employment', A: 88 },
  { subject: 'Turnover', A: 70 },
]

const statusColors = {
  excellent: { bg: 'bg-sage-100 dark:bg-sage-500/10', text: 'text-sage-700 dark:text-sage-400', label: 'Excellent', dot: 'bg-sage-500' },
  good: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', label: 'Good', dot: 'bg-blue-500' },
  caution: { bg: 'bg-yellow-50 dark:bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', label: 'Caution', dot: 'bg-yellow-500' },
  risk: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', label: 'Risk', dot: 'bg-red-500' },
}

const ScoreBar = ({ score, maxWidth = 120 }) => (
  <div className="flex items-center gap-2">
    <div className="w-24 h-1.5 bg-gray-200 dark:bg-navy-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${score >= 80 ? 'bg-sage-500' : score >= 60 ? 'bg-blue-500' : 'bg-yellow-500'}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <span className="text-xs font-mono text-gray-600 dark:text-navy-300">{score}</span>
  </div>
)

export default function Slide03_MarketFundamentals() {
  const overallScore = Math.round(marketMetrics.reduce((acc, m) => acc + (m.score * m.weight / 100), 0))

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 03</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Market Fundamentals</h2>
              <p className="text-gray-500 dark:text-navy-300 text-lg">DFW — Fort Worth Submarket Analysis</p>
            </div>
            <div className="flex items-center gap-3 bg-sage-500 rounded-xl px-5 py-3">
              <div className="text-4xl font-bold text-white">{overallScore}</div>
              <div className="text-sage-100 text-sm leading-tight">
                <div className="font-semibold">Market Score</div>
                <div className="text-xs opacity-80">Weighted Average</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scorecard */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-200 dark:border-navy-700 bg-navy-900 dark:bg-navy-950">
                <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Market Scorecard — DFW Northgate</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-navy-700">
                {marketMetrics.map((m, i) => {
                  const s = statusColors[m.status]
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                      className="px-5 py-3 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-navy-750 transition-colors"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-navy-900 dark:text-white truncate">{m.metric}</div>
                        <div className="text-xs text-gray-400 dark:text-navy-400">
                          Subject: <strong className="text-navy-900 dark:text-navy-200">{typeof m.value === 'number' && m.value > 999 ? `$${m.value.toLocaleString()}` : m.value}{m.unit !== '$' && ` ${m.unit}`}</strong>
                          {' | '}Benchmark: {typeof m.benchmark === 'number' && m.benchmark > 999 ? `$${m.benchmark.toLocaleString()}` : m.benchmark} {m.unit !== '$' && m.unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <ScoreBar score={m.score} />
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                        <span className="text-xs text-gray-400 dark:text-navy-400 w-10 text-right">{m.weight}%</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Radar chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
              <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Market Radar</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Radar name="Score" dataKey="A" stroke="#3d7d52" fill="#3d7d52" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI tiles */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Population', value: '214K', sub: '3-mile ring', icon: '👥' },
                { label: 'SqFt/Capita', value: '7.2', sub: 'vs 8.5 national', icon: '📐' },
                { label: 'Vacancy', value: '11%', sub: 'market avg', icon: '🏢' },
                { label: 'Pipeline', value: '0 units', sub: 'within 3 miles', icon: '🚧' },
              ].map((kpi, i) => (
                <div key={i} className="bg-navy-900 dark:bg-navy-950 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">{kpi.icon}</div>
                  <div className="text-lg font-bold text-white">{kpi.value}</div>
                  <div className="text-xs font-medium text-sage-400">{kpi.label}</div>
                  <div className="text-xs text-navy-400">{kpi.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
