import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle, Wrench } from 'lucide-react'
import { mockAcquisition } from '../../../data/mockData'

const { infrastructure } = mockAcquisition

const infrastructureItems = [
  { category: 'Roof', value: `${infrastructure.roofAge} yrs old`, risk: 'medium', notes: 'Replacement likely within 7 yrs. Budget $45K reserve.', capex: 45000 },
  { category: 'Asphalt / Drives', value: infrastructure.asphaltCondition, risk: 'low', notes: 'Recent seal coat in 2023. Minor crack repair needed.', capex: 8000 },
  { category: 'Drainage', value: infrastructure.drainage, risk: 'low', notes: 'No flooding history. One French drain needs extension.', capex: 4500 },
  { category: 'Security System', value: infrastructure.securitySystem, risk: 'low', notes: 'Keypads operational. Camera upgrade recommended ($12K).', capex: 12000 },
  { category: 'Lighting', value: infrastructure.lighting, risk: 'low', notes: 'LED upgrade completed. Minimal near-term capex needed.', capex: 0 },
  { category: 'Climate Control', value: infrastructure.climateControl, risk: 'medium', notes: '42 climate units. HVAC units avg 9 yrs — monitor closely.', capex: 18000 },
  { category: 'Deferred Maintenance', value: `$${infrastructure.deferredMaintenance.toLocaleString()}`, risk: 'medium', notes: 'Identified: office remodel, unit doors (12 units), paint.', capex: infrastructure.deferredMaintenance },
  { category: 'Gate / Access', value: 'Roll-up gate', risk: 'low', notes: 'Functional. Keypad upgrade to app-based recommended.', capex: 5000 },
]

const riskConfig = {
  low: { icon: CheckCircle, text: 'text-sage-600 dark:text-sage-400', bg: 'bg-sage-50 dark:bg-sage-500/10', border: 'border-sage-200 dark:border-sage-500/20', label: 'Good Condition', dot: 'bg-sage-500' },
  medium: { icon: AlertTriangle, text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20', label: 'Monitor', dot: 'bg-yellow-500' },
  high: { icon: XCircle, text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', label: 'Action Required', dot: 'bg-red-500' },
}

const capexTimeline = [
  { period: 'Year 0–1', items: ['Deferred maintenance ($85K)', 'Security upgrade ($12K)', 'Office remodel ($15K)'], total: 112000, color: 'bg-red-500' },
  { period: 'Year 2–3', items: ['HVAC units monitoring ($18K)', 'Asphalt repairs ($8K)', 'Gate/keypad upgrade ($5K)'], total: 31000, color: 'bg-yellow-500' },
  { period: 'Year 4–7', items: ['Roof replacement reserve ($45K)', 'Long-term capital plan'], total: 45000, color: 'bg-sage-500' },
]

export default function Slide09_Infrastructure() {
  const totalImmediateCapex = infrastructureItems.reduce((a, i) => a + i.capex, 0)
  const annualReserve = infrastructure.capexReserveAnnual

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 09</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Infrastructure & CapEx</h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg">Physical due diligence findings and capital reserve planning</p>
        </motion.div>

        {/* Summary Tiles */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Deferred Maintenance', value: `$${infrastructure.deferredMaintenance.toLocaleString()}`, sub: 'Immediate need', icon: Wrench, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20' },
            { label: 'Total CapEx Budget', value: `$${totalImmediateCapex.toLocaleString()}`, sub: 'Year 0–7 total', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' },
            { label: 'Annual Reserve', value: `$${annualReserve.toLocaleString()}`, sub: '$0.75/sqft/yr', icon: CheckCircle, color: 'text-sage-600 dark:text-sage-400', bg: 'bg-sage-50 dark:bg-sage-500/10 border-sage-200 dark:border-sage-500/20' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className={`rounded-xl border p-4 flex items-center gap-3 ${s.bg}`}
            >
              <s.icon className={`w-8 h-8 ${s.color} flex-shrink-0`} />
              <div>
                <div className="text-xs text-gray-500 dark:text-navy-400">{s.label}</div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-400 dark:text-navy-500">{s.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Risk Matrix */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
          >
            <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950">
              <h4 className="font-semibold text-white text-sm">Infrastructure Risk Matrix</h4>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-navy-700">
              {infrastructureItems.map((item, i) => {
                const r = riskConfig[item.risk]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="px-4 py-3 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-navy-750 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${r.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-medium text-navy-900 dark:text-white text-sm">{item.category}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {item.capex > 0 && (
                            <span className="text-xs text-gray-500 dark:text-navy-400 font-mono">${item.capex.toLocaleString()}</span>
                          )}
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${r.bg} ${r.text} font-medium border ${r.border}`}>{r.label}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-navy-400">{item.value} — {item.notes}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* CapEx Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
              <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">CapEx Reserve Timeline</h4>
              <div className="space-y-4">
                {capexTimeline.map((t, i) => (
                  <div key={i} className="relative pl-5">
                    <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${t.color}`} />
                    {i < capexTimeline.length - 1 && (
                      <div className="absolute left-[3px] top-3.5 w-0.5 h-8 bg-gray-300 dark:bg-navy-700" />
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-navy-900 dark:text-white text-sm">{t.period}</span>
                      <span className={`text-sm font-bold ${i === 0 ? 'text-red-500' : i === 1 ? 'text-yellow-500' : 'text-sage-500'}`}>
                        ${t.total.toLocaleString()}
                      </span>
                    </div>
                    <ul className="space-y-0.5">
                      {t.items.map((item, j) => (
                        <li key={j} className="text-xs text-gray-500 dark:text-navy-400 flex items-center gap-1.5">
                          <span className="text-gray-300 dark:text-navy-600">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-navy-700 flex justify-between items-center">
                <span className="text-sm font-semibold text-navy-900 dark:text-white">Total 7-Year CapEx</span>
                <span className="text-lg font-bold text-red-500">${(112000 + 31000 + 45000).toLocaleString()}</span>
              </div>
            </div>

            {/* Infrastructure Score */}
            <div className="bg-navy-900 dark:bg-navy-950 rounded-xl border border-navy-700 p-5">
              <h4 className="font-semibold text-white text-sm mb-3">Infrastructure Score</h4>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-yellow-400">65</div>
                <div className="flex-1">
                  <div className="w-full bg-navy-800 rounded-full h-3 mb-2">
                    <div className="bg-yellow-400 h-3 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="text-navy-400 text-xs">Below average — manageable with planned CapEx program</div>
                  <div className="text-yellow-400 text-xs font-semibold mt-1">Monitor / Proceed with budget</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
