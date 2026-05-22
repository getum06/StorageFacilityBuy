import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Shield, Target, ChevronRight } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

function getRecommendation(score, metrics) {
  const { capRate, dscr, cashOnCash } = metrics
  if (score >= 75 && capRate >= 7 && dscr >= 1.25) {
    return {
      label: 'STRONG BUY',
      color: 'text-sage-600 dark:text-sage-400',
      bg: 'bg-sage-50 dark:bg-sage-500/10',
      border: 'border-sage-300 dark:border-sage-500/30',
      headerBg: 'bg-sage-500',
      icon: CheckCircle,
      summary: 'This acquisition meets all institutional investment criteria. Strong market fundamentals, solid NOI, adequate debt coverage, and meaningful upside potential make this a compelling opportunity.',
      actions: [
        'Submit Letter of Intent immediately',
        'Order Phase I Environmental & Structural',
        'Begin lender engagement for debt pre-approval',
        'Commission 24-month P&L audit',
        'Engage title company and legal counsel',
      ],
    }
  } else if (score >= 60) {
    return {
      label: 'MODERATE OPPORTUNITY',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      border: 'border-blue-300 dark:border-blue-500/30',
      headerBg: 'bg-blue-600',
      icon: AlertTriangle,
      summary: 'This deal has merit but requires deeper diligence on specific risk factors. Consider negotiating purchase price or terms to improve returns before proceeding to LOI.',
      actions: [
        'Request additional financial documentation',
        'Conduct detailed market study',
        'Model downside scenarios (recession, oversupply)',
        'Negotiate price or seller concessions',
        'Reassess after diligence findings',
      ],
    }
  } else if (score >= 45) {
    return {
      label: 'HIGH RISK — INVESTIGATE',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-500/10',
      border: 'border-yellow-300 dark:border-yellow-500/30',
      headerBg: 'bg-yellow-500',
      icon: AlertTriangle,
      summary: 'Significant risks identified. This deal may only work with a substantially reduced purchase price or if key assumptions improve. Recommend a conditional offer with extensive contingencies.',
      actions: [
        'Request significant price reduction (10–20%)',
        'Demand seller financing or earnest money holdback',
        'Require minimum 90-day diligence period',
        'Stress test all income assumptions',
        'Consider passing unless price improves',
      ],
    }
  } else {
    return {
      label: 'REJECT',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-500/10',
      border: 'border-red-300 dark:border-red-500/30',
      headerBg: 'bg-red-600',
      icon: XCircle,
      summary: 'This acquisition fails multiple critical criteria. Risk-adjusted returns are insufficient and there are structural concerns that cannot be resolved through operational improvements alone.',
      actions: [
        'Do not submit LOI at current pricing',
        'Pass and document reasons for rejection',
        'Consider if market stabilizes or price drops 20%+',
        'Redirect capital to better-scoring opportunities',
        'Update database with market learnings',
      ],
    }
  }
}

const categoryLabels = {
  marketScore: { label: 'Market Attractiveness', weight: '20%' },
  occupancyScore: { label: 'Occupancy Quality', weight: '18%' },
  noiScore: { label: 'NOI Quality', weight: '18%' },
  competitionScore: { label: 'Competition Risk', weight: '12%' },
  expansionScore: { label: 'Expansion Potential', weight: '10%' },
  infraScore: { label: 'Infrastructure', weight: '10%' },
  finScore: { label: 'Financing Viability', weight: '8%' },
  mgmtScore: { label: 'Mgmt Complexity', weight: '4%' },
}

export default function RecommendationEngine({ formData, metrics }) {
  const { scores } = metrics
  const rec = getRecommendation(scores.weightedScore, metrics)
  const RecIcon = rec.icon

  const radarData = Object.entries(categoryLabels).map(([key, { label }]) => ({
    subject: label.split(' ').slice(0, 2).join(' '),
    score: scores[key] || 0,
  }))

  const scoreItems = Object.entries(categoryLabels).map(([key, meta]) => ({
    ...meta,
    score: scores[key] || 0,
    key,
  }))

  return (
    <div className="space-y-5">
      {/* Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl border-2 ${rec.border} overflow-hidden`}
      >
        <div className={`${rec.headerBg} px-6 py-5 flex items-center justify-between flex-wrap gap-4`}>
          <div className="flex items-center gap-4">
            <RecIcon className="w-8 h-8 text-white" />
            <div>
              <div className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-0.5">Investment Decision</div>
              <div className="text-3xl font-bold text-white">{rec.label}</div>
            </div>
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Score', value: `${scores.weightedScore.toFixed(0)}/100` },
              { label: 'Cap Rate', value: `${metrics.capRate.toFixed(2)}%` },
              { label: 'DSCR', value: `${metrics.dscr.toFixed(2)}x` },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-white/70 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${rec.bg} px-6 py-4`}>
          <p className={`${rec.color} text-sm leading-relaxed`}>{rec.summary}</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Score Breakdown */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
          >
            <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950">
              <h3 className="font-semibold text-white text-sm">Weighted Score Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-navy-700">
              {scoreItems.map((item, i) => {
                const wtd = ((item.score * parseFloat(item.weight)) / 100).toFixed(1)
                const color = item.score >= 80 ? 'bg-sage-500' : item.score >= 65 ? 'bg-blue-500' : item.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                const textColor = item.score >= 80 ? 'text-sage-600 dark:text-sage-400' : item.score >= 65 ? 'text-blue-600 dark:text-blue-400' : item.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-navy-750 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-navy-900 dark:text-white">{item.label}</div>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-navy-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                            className={`h-full rounded-full ${color}`}
                          />
                        </div>
                        <span className={`text-xs font-mono font-bold w-6 text-right ${textColor}`}>{item.score.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-navy-400 w-10 text-center font-semibold">{item.weight}</div>
                    <div className={`text-sm font-bold w-8 text-right ${textColor}`}>{wtd}</div>
                  </motion.div>
                )
              })}
            </div>
            <div className="px-5 py-3 bg-gray-50 dark:bg-navy-900/50 border-t border-gray-200 dark:border-navy-700 flex justify-between items-center">
              <span className="font-bold text-navy-900 dark:text-white text-sm">Weighted Total</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 dark:text-navy-400">100%</span>
                <span className={`text-xl font-bold ${rec.color}`}>{scores.weightedScore.toFixed(1)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Radar + Actions */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
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

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
          >
            <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">Recommended Actions</h4>
            <ol className="space-y-2.5">
              {rec.actions.map((action, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-5 h-5 rounded-full ${rec.headerBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-navy-300">{action}</span>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>

      {/* Threshold Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
      >
        <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950">
          <h3 className="font-semibold text-white text-sm">Criteria Threshold Check</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-700 bg-gray-50 dark:bg-navy-900/50">
                {['Criterion', 'Threshold', 'Actual', 'Status'].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-navy-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-navy-700">
              {[
                { criterion: 'Going-in Cap Rate', threshold: '≥ 7.0%', actual: `${metrics.capRate.toFixed(2)}%`, pass: metrics.capRate >= 7 },
                { criterion: 'DSCR', threshold: '≥ 1.25x', actual: `${metrics.dscr.toFixed(2)}x`, pass: metrics.dscr >= 1.25 },
                { criterion: 'Physical Occupancy', threshold: '≥ 80%', actual: `${formData.physicalOccupancy}%`, pass: formData.physicalOccupancy >= 80 },
                { criterion: 'Economic Occupancy', threshold: '≥ 75%', actual: `${formData.economicOccupancy}%`, pass: formData.economicOccupancy >= 75 },
                { criterion: 'Market Occupancy', threshold: '≥ 85%', actual: `${formData.marketOccupancy}%`, pass: formData.marketOccupancy >= 85 },
                { criterion: 'SqFt Per Capita', threshold: '≤ 10.0', actual: `${formData.sqFtPerCapita}`, pass: formData.sqFtPerCapita <= 10 },
                { criterion: 'Weighted Score', threshold: '≥ 60 (buy)', actual: `${scores.weightedScore.toFixed(1)}`, pass: scores.weightedScore >= 60 },
                { criterion: 'Tax Reassessment Risk', threshold: 'No', actual: formData.taxReassessmentRisk ? 'YES ⚠' : 'No', pass: !formData.taxReassessmentRisk },
              ].map((row, i) => (
                <tr key={i} className={`hover:bg-gray-50 dark:hover:bg-navy-750 transition-colors ${row.pass ? '' : 'bg-red-50/30 dark:bg-red-500/5'}`}>
                  <td className="px-5 py-3 text-navy-900 dark:text-navy-200 font-medium">{row.criterion}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-navy-400">{row.threshold}</td>
                  <td className="px-5 py-3 font-semibold text-navy-900 dark:text-white">{row.actual}</td>
                  <td className="px-5 py-3">
                    {row.pass ? (
                      <span className="inline-flex items-center gap-1 text-sage-600 dark:text-sage-400 text-xs font-semibold bg-sage-50 dark:bg-sage-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-semibold bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Fail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
