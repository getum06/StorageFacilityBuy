import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { mockAcquisition } from '../../../data/mockData'

const { riskScores } = mockAcquisition

const categories = [
  { key: 'marketAttractiveness', label: 'Market Attractiveness', weight: 20, detail: 'Population/job growth, income, demand drivers' },
  { key: 'occupancyQuality', label: 'Occupancy Quality', weight: 18, detail: 'Physical vs economic gap, delinquency, trends' },
  { key: 'noiQuality', label: 'NOI Quality', weight: 18, detail: 'Expense ratio, management quality, revenue stability' },
  { key: 'competitionRisk', label: 'Competition Risk', weight: 12, detail: 'Sqft/capita, pipeline, REIT presence' },
  { key: 'expansionPotential', label: 'Expansion Potential', weight: 10, detail: 'Available land, zoning, market depth' },
  { key: 'infrastructureQuality', label: 'Infrastructure', weight: 10, detail: 'Roof, systems, deferred maintenance burden' },
  { key: 'financingViability', label: 'Financing Viability', weight: 8, detail: 'DSCR, LTV, lender appetite, rate environment' },
  { key: 'managementComplexity', label: 'Mgmt Complexity', weight: 4, detail: 'Operator capacity, turnaround complexity' },
]

const radarData = categories.map(c => ({
  subject: c.label.split(' ').slice(0, 2).join(' '),
  score: riskScores[c.key],
}))

const getRating = (score) => {
  if (score >= 85) return { label: 'Excellent', color: 'text-sage-600 dark:text-sage-400', bg: 'bg-sage-50 dark:bg-sage-500/10' }
  if (score >= 70) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' }
  if (score >= 55) return { label: 'Acceptable', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10' }
  return { label: 'Weak', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' }
}

export default function Slide11_AcquisitionScorecard() {
  const weightedScore = categories.reduce((acc, c) => {
    return acc + (riskScores[c.key] * c.weight / 100)
  }, 0)

  const overallRating = getRating(weightedScore)

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 11</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Acquisition Scorecard</h2>
              <p className="text-gray-500 dark:text-navy-300 text-lg">Weighted investment rating framework</p>
            </div>
            <div className="bg-sage-500 rounded-xl px-6 py-4 text-center">
              <div className="text-5xl font-bold text-white">{weightedScore.toFixed(0)}</div>
              <div className="text-sage-100 text-sm mt-1">Overall Score</div>
              <div className="text-white font-semibold text-sm">Strong Buy</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scorecard Table */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
            >
              <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950">
                <div className="grid grid-cols-12 text-xs font-semibold text-navy-300 uppercase tracking-wider">
                  <div className="col-span-4">Category</div>
                  <div className="col-span-3">Score</div>
                  <div className="col-span-2 text-center">Weight</div>
                  <div className="col-span-2 text-center">Wtd Score</div>
                  <div className="col-span-1 text-center">Rating</div>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-navy-700">
                {categories.map((c, i) => {
                  const score = riskScores[c.key]
                  const wtdScore = (score * c.weight / 100).toFixed(1)
                  const rating = getRating(score)
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      className="px-5 py-3 grid grid-cols-12 items-center hover:bg-gray-100 dark:hover:bg-navy-750 transition-colors gap-2"
                    >
                      <div className="col-span-4">
                        <div className="font-medium text-navy-900 dark:text-white text-sm">{c.label}</div>
                        <div className="text-xs text-gray-400 dark:text-navy-500 truncate">{c.detail}</div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-navy-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${score >= 80 ? 'bg-sage-500' : score >= 65 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-navy-900 dark:text-white w-6 text-right">{score}</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-xs text-gray-500 dark:text-navy-400 font-semibold">{c.weight}%</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-bold text-navy-900 dark:text-white text-sm">{wtdScore}</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${rating.bg} ${rating.color}`}>
                          {rating.label.slice(0, 4)}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              {/* Weighted Total */}
              <div className="px-5 py-3 bg-sage-50 dark:bg-sage-500/10 border-t border-sage-200 dark:border-sage-500/20">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-4 font-bold text-navy-900 dark:text-white">Weighted Total</div>
                  <div className="col-span-3" />
                  <div className="col-span-2 text-center text-xs font-bold text-gray-600 dark:text-navy-300">100%</div>
                  <div className="col-span-2 text-center font-bold text-sage-700 dark:text-sage-400 text-lg">{weightedScore.toFixed(1)}</div>
                  <div className="col-span-1 text-center">
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-sage-100 dark:bg-sage-500/20 text-sage-700 dark:text-sage-400 font-bold">A</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Radar + Rating */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
            >
              <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">Score Radar</h4>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <Radar name="Score" dataKey="score" stroke="#3d7d52" fill="#3d7d52" fillOpacity={0.35} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Investment Rating */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-navy-900 dark:bg-navy-950 rounded-xl border border-navy-700 p-5"
            >
              <h4 className="font-semibold text-white text-sm mb-3">Investment Rating Scale</h4>
              <div className="space-y-2">
                {[
                  { range: '85–100', label: 'Strong Buy', color: 'bg-sage-500', active: weightedScore >= 85 },
                  { range: '70–84', label: 'Moderate Buy', color: 'bg-blue-500', active: weightedScore >= 70 && weightedScore < 85 },
                  { range: '55–69', label: 'Investigate', color: 'bg-yellow-500', active: weightedScore >= 55 && weightedScore < 70 },
                  { range: '< 55', label: 'Reject', color: 'bg-red-500', active: weightedScore < 55 },
                ].map((r, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${r.active ? 'ring-2 ring-sage-400 bg-sage-500/10' : 'opacity-40'}`}>
                    <div className={`w-3 h-3 rounded-full ${r.color}`} />
                    <span className="text-white text-sm font-medium">{r.label}</span>
                    <span className="text-navy-400 text-xs ml-auto">{r.range}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
