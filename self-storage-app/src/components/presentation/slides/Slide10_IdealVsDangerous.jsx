import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const goodTraits = [
  { trait: 'Growing Market', detail: 'Population & household growth > 2% YoY', score: 'High' },
  { trait: 'Under-Managed Operations', detail: 'Below-market rents, manual processes, no revenue mgmt', score: 'High' },
  { trait: 'Limited New Supply', detail: '< 1 new facility within 3 miles in 24-month pipeline', score: 'Medium' },
  { trait: 'Expansion Opportunity', detail: 'Adjacent land or unused parcel for Phase 2', score: 'High' },
  { trait: 'Strong Occupancy Base', detail: 'Physical occupancy > 85%, market > 88%', score: 'High' },
  { trait: 'Modern Systems', detail: 'Or manageable upgrade path for tech/security', score: 'Medium' },
  { trait: 'Income-Oriented Seller', detail: 'Motivated by cash-out, not strategic position', score: 'High' },
  { trait: 'Clean Environmental', detail: 'Phase I clear, no liens, no underground tanks', score: 'Required' },
]

const badTraits = [
  { trait: 'Oversupplied Market', detail: '> 10 sqft/capita or 2+ new facilities in pipeline', risk: 'Critical' },
  { trait: 'Weak Occupancy', detail: 'Physical < 75% with no operational explanation', risk: 'High' },
  { trait: 'Heavy Discounting', detail: 'Economic occupancy > 15% below physical — structural issue', risk: 'High' },
  { trait: 'Deferred Maintenance', detail: 'Roof, asphalt, or structural capex > $200K unpriced', risk: 'High' },
  { trait: 'Unrealistic Seller Proforma', detail: 'Pro forma includes unachievable rents or occupancy', risk: 'Medium' },
  { trait: 'Tax Reassessment Ignored', detail: 'Sale triggers major tax increase not modeled in NOI', risk: 'Critical' },
  { trait: 'REIT Dominance Nearby', detail: 'Multiple REITs within 1 mile, actively discounting', risk: 'Medium' },
  { trait: 'Single-Access Location', detail: 'Traffic-exposed or hard to reach drives churn', risk: 'Medium' },
]

const riskColors = {
  Critical: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/10',
  High: 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10',
  Medium: 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10',
}

const scoreColors = {
  High: 'text-sage-700 dark:text-sage-400 bg-sage-50 dark:bg-sage-500/10',
  Medium: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
  Required: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10',
}

export default function Slide10_IdealVsDangerous() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 10</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Ideal vs. Dangerous Deals</h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg">Pattern recognition framework for acquisition triage</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Good Deal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-sage-200 dark:border-sage-500/30 overflow-hidden"
          >
            <div className="px-5 py-4 bg-sage-500 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-white" />
              <h3 className="font-bold text-white">Ideal Deal Characteristics</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-navy-700 bg-white dark:bg-navy-800">
              {goodTraits.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="px-5 py-3 flex items-start gap-3 hover:bg-sage-50 dark:hover:bg-sage-500/5 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-navy-900 dark:text-white text-sm">{t.trait}</div>
                    <div className="text-xs text-gray-500 dark:text-navy-400 mt-0.5">{t.detail}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreColors[t.score]}`}>{t.score}</span>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-3 bg-sage-50 dark:bg-sage-500/10 border-t border-sage-200 dark:border-sage-500/20">
              <div className="flex items-center gap-2 text-sage-700 dark:text-sage-400 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                This deal matches {goodTraits.length}/{goodTraits.length} ideal characteristics
              </div>
            </div>
          </motion.div>

          {/* Bad Deal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-red-200 dark:border-red-500/30 overflow-hidden"
          >
            <div className="px-5 py-4 bg-red-600 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-white" />
              <h3 className="font-bold text-white">Dangerous Deal Red Flags</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-navy-700 bg-white dark:bg-navy-800">
              {badTraits.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="px-5 py-3 flex items-start gap-3 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-navy-900 dark:text-white text-sm">{t.trait}</div>
                    <div className="text-xs text-gray-500 dark:text-navy-400 mt-0.5">{t.detail}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColors[t.risk]}`}>{t.risk}</span>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-3 bg-red-50 dark:bg-red-500/10 border-t border-red-200 dark:border-red-500/20">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Subject property: 0 critical red flags | 2 medium flags identified
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subject assessment */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-5 bg-navy-900 dark:bg-navy-950 rounded-xl border border-navy-700 p-5 flex flex-wrap gap-8"
        >
          <div>
            <div className="text-navy-400 text-xs mb-1">DFW Northgate Assessment</div>
            <div className="text-white font-bold text-lg">Strong Match — Proceed to LOI</div>
          </div>
          {[
            { label: 'Ideal Matches', value: '8/8', color: 'text-sage-400' },
            { label: 'Critical Red Flags', value: '0', color: 'text-sage-400' },
            { label: 'Medium Flags', value: '2', color: 'text-yellow-400' },
            { label: 'Recommendation', value: 'Strong Buy', color: 'text-sage-400' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-navy-400 text-xs">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
