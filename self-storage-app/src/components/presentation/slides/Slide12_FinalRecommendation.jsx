import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, TrendingUp, Shield, Target } from 'lucide-react'

const gatingFactors = [
  { factor: 'DSCR ≥ 1.25x', status: 'pass', value: '1.39x' },
  { factor: 'Going-in Cap Rate ≥ 7.5%', status: 'pass', value: '8.01%' },
  { factor: 'Physical Occupancy ≥ 80%', status: 'pass', value: '87%' },
  { factor: 'Market Occupancy ≥ 85%', status: 'pass', value: '89%' },
  { factor: 'No Critical Red Flags', status: 'pass', value: 'Clean' },
  { factor: 'Financing Available', status: 'pass', value: 'Confirmed' },
  { factor: 'Environmental Clear', status: 'pass', value: 'Phase I OK' },
]

const nextSteps = [
  { step: '1', action: 'Submit LOI', detail: 'At $4.2M with 45-day due diligence period', icon: Target },
  { step: '2', action: 'Order Phase I & Structural', detail: 'Environmental and structural engineering reports', icon: Shield },
  { step: '3', action: 'Financial Audit', detail: '24-month P&L, rent rolls, expense verification', icon: TrendingUp },
  { step: '4', action: 'Lender Pre-Qualification', detail: 'Agency or bridge debt at 70% LTV, 25-yr am', icon: CheckCircle },
]

export default function Slide12_FinalRecommendation() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 12</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Final Recommendation</h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg">DFW Northgate Self-Storage — Investment Decision</p>
        </motion.div>

        {/* Big Recommendation Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-sage-600 to-sage-500 rounded-2xl p-6 mb-6 flex items-center justify-between gap-6 flex-wrap"
        >
          <div>
            <div className="text-sage-100 text-sm font-semibold uppercase tracking-widest mb-1">Investment Decision</div>
            <div className="text-4xl font-bold text-white mb-1">STRONG BUY</div>
            <div className="text-sage-100 text-sm">DFW Northgate Self-Storage | $4,200,000 | Fort Worth, TX</div>
          </div>
          <div className="flex gap-5 flex-wrap">
            {[
              { label: 'Weighted Score', value: '79.4', sub: 'out of 100' },
              { label: 'Going-in Cap', value: '8.01%', sub: 'Strong yield' },
              { label: 'Y3 NOI Target', value: '$445K', sub: '+32% upside' },
              { label: 'Target CoC', value: '14.2%', sub: 'Stabilized' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white/10 rounded-xl px-4 py-3">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sage-100 text-xs font-semibold">{s.label}</div>
                <div className="text-sage-200 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gating Factors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
          >
            <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950">
              <h4 className="font-semibold text-white text-sm">Gating Criteria</h4>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-navy-700 p-2">
              {gatingFactors.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-750 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-sage-500 flex-shrink-0" />
                  <span className="flex-1 text-sm text-navy-900 dark:text-navy-200">{g.factor}</span>
                  <span className="text-xs font-semibold text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-500/10 px-2 py-0.5 rounded-full">{g.value}</span>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-3 bg-sage-50 dark:bg-sage-500/10 border-t border-sage-200 dark:border-sage-500/20">
              <div className="text-sage-700 dark:text-sage-400 text-sm font-semibold">All {gatingFactors.length} criteria PASS ✓</div>
            </div>
          </motion.div>

          {/* Decision Tree */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
          >
            <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Decision Framework</h4>
            <div className="space-y-2">
              {[
                { label: 'Score ≥ 75', decision: 'Strong Buy', icon: CheckCircle, color: 'text-sage-600 dark:text-sage-400', bg: 'bg-sage-50 dark:bg-sage-500/10 border-sage-200 dark:border-sage-500/20', active: true },
                { label: 'Score 60–74', decision: 'Investigate Further', icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20', active: false },
                { label: 'Score < 60', decision: 'Reject', icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20', active: false },
              ].map((d, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${d.bg} ${d.active ? 'ring-2 ring-sage-400' : 'opacity-50'}`}>
                  <d.icon className={`w-5 h-5 ${d.color}`} />
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${d.color}`}>{d.decision}</div>
                    <div className="text-xs text-gray-500 dark:text-navy-400">{d.label}</div>
                  </div>
                  {d.active && <ChevronRight className={`w-4 h-4 ${d.color}`} />}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-navy-900 dark:bg-navy-950 rounded-lg border border-navy-700">
              <div className="text-xs text-navy-400 mb-1">Subject Property Score</div>
              <div className="text-2xl font-bold text-sage-400">79.4 / 100</div>
              <div className="text-sage-400 text-xs font-semibold">→ STRONG BUY Threshold</div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
          >
            <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Recommended Next Steps</h4>
            <div className="space-y-3">
              {nextSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-navy-900 dark:bg-navy-950 border border-navy-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sage-400 text-xs font-bold">{step.step}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-navy-900 dark:text-white text-sm">{step.action}</div>
                    <div className="text-xs text-gray-500 dark:text-navy-400 mt-0.5">{step.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-navy-700">
              <h5 className="font-semibold text-navy-900 dark:text-white text-xs uppercase tracking-wider mb-3">Key Risk Monitors</h5>
              <ul className="space-y-1.5">
                {[
                  'Roof CapEx timing (Year 4–6)',
                  'Tax reassessment at close',
                  'HVAC unit lifecycle (~3 yrs)',
                  'Rate compression if REIT discounts',
                ].map((risk, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-navy-400">
                    <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
