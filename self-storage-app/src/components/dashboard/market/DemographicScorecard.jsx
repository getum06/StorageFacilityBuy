import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { SCORE_WEIGHTS, SCORE_LABELS } from './DemographicScorer'

const ratingConfig = {
  sage: { bg: 'bg-sage-500', text: 'text-white', light: 'bg-sage-50 dark:bg-sage-500/10', border: 'border-sage-200 dark:border-sage-500/30', score: 'text-sage-600 dark:text-sage-400' },
  blue: { bg: 'bg-blue-600', text: 'text-white', light: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/30', score: 'text-blue-600 dark:text-blue-400' },
  yellow: { bg: 'bg-yellow-500', text: 'text-white', light: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/30', score: 'text-yellow-600 dark:text-yellow-400' },
  red: { bg: 'bg-red-600', text: 'text-white', light: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/30', score: 'text-red-600 dark:text-red-400' },
}

const ScoreBar = ({ score, color }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-2 bg-gray-200 dark:bg-navy-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`h-full rounded-full ${color >= 80 ? 'bg-sage-500' : color >= 65 ? 'bg-blue-500' : color >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <span className="text-xs font-mono font-bold text-navy-900 dark:text-white w-8 text-right">{score}</span>
  </div>
)

export default function DemographicScorecard({ scoreResult, marketData, inputs }) {
  if (!scoreResult) return null

  const { overall, rating, ratingColor, components } = scoreResult
  const cfg = ratingConfig[ratingColor]

  const radarData = Object.entries(components).map(([key, val]) => ({
    subject: SCORE_LABELS[key].split(' ').slice(0, 2).join(' '),
    score: val.score,
  }))

  const rows = Object.entries(SCORE_LABELS).map(([key, label]) => ({
    key,
    label,
    weight: Math.round(SCORE_WEIGHTS[key] * 100),
    score: components[key]?.score ?? 0,
    notes: components[key]?.notes ?? '',
    wtd: ((components[key]?.score ?? 0) * SCORE_WEIGHTS[key]).toFixed(1),
  }))

  return (
    <div className="space-y-4">
      {/* Hero score banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl overflow-hidden border ${cfg.border}`}
      >
        <div className={`${cfg.bg} px-6 py-5 flex items-center justify-between flex-wrap gap-4`}>
          <div>
            <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
              Market Attractiveness Score — {inputs.tradeAreaRadius}-Mile Trade Area
            </div>
            <div className="text-5xl font-bold text-white">{overall}</div>
            <div className="text-white font-semibold text-lg mt-0.5">{rating}</div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'ZIP', value: inputs.zip || '—' },
              { label: 'Population', value: marketData?.totalPopulation ? marketData.totalPopulation.toLocaleString() : '—' },
              { label: 'Households', value: marketData?.totalHouseholds ? marketData.totalHouseholds.toLocaleString() : '—' },
              { label: 'Median Income', value: marketData?.medianIncome ? `$${(marketData.medianIncome/1000).toFixed(0)}K` : '—' },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl px-4 py-3 text-center min-w-[80px]">
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-white/70 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Scale bar */}
        <div className={`${cfg.light} px-6 py-3 flex items-center gap-4 flex-wrap`}>
          {[
            { range: '80–100', label: 'Highly Attractive', color: 'bg-sage-500', active: overall >= 80 },
            { range: '65–79', label: 'Attractive', color: 'bg-blue-500', active: overall >= 65 && overall < 80 },
            { range: '50–64', label: 'Mixed', color: 'bg-yellow-500', active: overall >= 50 && overall < 65 },
            { range: '< 50', label: 'Weak/Oversupplied', color: 'bg-red-500', active: overall < 50 },
          ].map((tier, i) => (
            <div key={i} className={`flex items-center gap-1.5 text-xs ${tier.active ? 'font-bold text-navy-900 dark:text-white' : 'text-gray-400 dark:text-navy-500'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${tier.color} ${tier.active ? '' : 'opacity-30'}`} />
              <span>{tier.range}: {tier.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weighted scorecard table */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
          >
            <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950 grid grid-cols-12 gap-2">
              {['Category', 'Score', 'Wt', 'Wtd'].map((h, i) => (
                <div key={i} className={`text-xs font-semibold text-navy-300 uppercase tracking-wider ${i === 0 ? 'col-span-5' : i === 1 ? 'col-span-4' : 'col-span-1 text-center'}`}>{h}</div>
              ))}
            </div>
            <div className="divide-y divide-gray-100 dark:divide-navy-700">
              {rows.map((row, i) => (
                <motion.div
                  key={row.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.05 }}
                  className="px-5 py-3 grid grid-cols-12 items-center gap-2 hover:bg-gray-50 dark:hover:bg-navy-750 transition-colors group"
                >
                  <div className="col-span-5">
                    <div className="text-sm font-medium text-navy-900 dark:text-white">{row.label}</div>
                    <div className="text-xs text-gray-400 dark:text-navy-500 hidden group-hover:block truncate">{row.notes}</div>
                  </div>
                  <div className="col-span-4">
                    <ScoreBar score={row.score} color={row.score} />
                  </div>
                  <div className="col-span-1 text-center text-xs text-gray-400 dark:text-navy-400 font-semibold">{row.weight}%</div>
                  <div className="col-span-1 text-center">
                    <span className={`text-sm font-bold ${cfg.score}`}>{row.wtd}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={`text-xs px-1 py-0.5 rounded font-medium ${
                      row.score >= 80 ? 'bg-sage-50 dark:bg-sage-500/10 text-sage-700 dark:text-sage-400' :
                      row.score >= 65 ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                      row.score >= 50 ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}>
                      {row.score >= 80 ? 'A' : row.score >= 65 ? 'B' : row.score >= 50 ? 'C' : 'D'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-50 dark:bg-navy-900/50 border-t border-gray-200 dark:border-navy-700 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5 font-bold text-navy-900 dark:text-white text-sm">Weighted Total</div>
              <div className="col-span-4" />
              <div className="col-span-1 text-center text-xs font-bold text-gray-600 dark:text-navy-300">100%</div>
              <div className="col-span-1 text-center">
                <span className={`text-xl font-bold ${cfg.score}`}>{overall}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Radar chart */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
        >
          <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">Market Radar</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={ratingColor === 'sage' ? '#3d7d52' : ratingColor === 'blue' ? '#3b82f6' : ratingColor === 'yellow' ? '#eab308' : '#ef4444'}
                  fill={ratingColor === 'sage' ? '#3d7d52' : ratingColor === 'blue' ? '#3b82f6' : ratingColor === 'yellow' ? '#eab308' : '#ef4444'}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Hover tip */}
          <div className="text-xs text-gray-400 dark:text-navy-500 text-center mt-2">
            Hover category rows to see detail
          </div>
        </motion.div>
      </div>
    </div>
  )
}
