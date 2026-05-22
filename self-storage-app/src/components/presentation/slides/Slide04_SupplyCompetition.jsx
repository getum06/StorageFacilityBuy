import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { marketComparables } from '../../../data/mockData'

const supplyMetrics = [
  { label: 'Sq Ft Per Capita (3-mi)', value: '7.2', benchmark: '< 8.0', risk: 'low', note: 'Below national avg — room for growth' },
  { label: 'Competitor Density', value: '4 within 5mi', benchmark: '< 6', risk: 'low', note: 'Limited direct competition' },
  { label: 'Market Occupancy', value: '89%', benchmark: '> 85%', risk: 'low', note: 'Tight market — pricing power exists' },
  { label: 'New Dev Pipeline (3mi)', value: '0 units', benchmark: '0', risk: 'low', note: 'No near-term supply threat' },
  { label: 'REIT Competition', value: 'Public Storage 0.8mi', benchmark: 'Manageable', risk: 'medium', note: 'Institutional comp, but stable pricing' },
  { label: 'Pricing Pressure', value: 'Low–Moderate', benchmark: 'Low', risk: 'medium', note: 'Street rates 8% below market' },
]

const riskLevels = {
  low: { color: 'text-sage-600 dark:text-sage-400', bg: 'bg-sage-50 dark:bg-sage-500/10', border: 'border-sage-200 dark:border-sage-500/20', icon: CheckCircle, label: 'Low Risk' },
  medium: { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20', icon: AlertTriangle, label: 'Medium Risk' },
  high: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', icon: XCircle, label: 'High Risk' },
}

const heatMapData = [
  { zone: 'N', sqftCap: 6.8, occupancy: 91, competition: 'Low', color: 'bg-sage-400' },
  { zone: 'NE', sqftCap: 7.2, occupancy: 87, competition: 'Med', color: 'bg-sage-300' },
  { zone: 'E', sqftCap: 9.1, occupancy: 81, competition: 'High', color: 'bg-yellow-400' },
  { zone: 'S', sqftCap: 8.4, occupancy: 84, competition: 'Med', color: 'bg-yellow-300' },
  { zone: 'W', sqftCap: 7.9, occupancy: 88, competition: 'Low', color: 'bg-sage-300' },
]

export default function Slide04_SupplyCompetition() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-white dark:bg-navy-900 py-10 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-sage-500 rounded-full" />
            <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold uppercase tracking-widest">Slide 04</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">Supply & Competition Analysis</h2>
          <p className="text-gray-500 dark:text-navy-300 text-lg">Competitive landscape and supply risk evaluation</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Supply Risk Scorecard */}
          <div className="space-y-3">
            <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wider mb-4">Supply Risk Indicators</h3>
            {supplyMetrics.map((m, i) => {
              const r = riskLevels[m.risk]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className={`rounded-lg border ${r.border} ${r.bg} p-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <r.icon className={`w-4 h-4 ${r.color}`} />
                        <span className="font-medium text-navy-900 dark:text-white text-sm">{m.label}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-navy-400">{m.note}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-navy-900 dark:text-white text-sm">{m.value}</div>
                      <div className="text-xs text-gray-400 dark:text-navy-500">Target: {m.benchmark}</div>
                      <div className={`text-xs font-medium mt-0.5 ${r.color}`}>{r.label}</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Right side: heat map + competitive table */}
          <div className="space-y-5">
            {/* Market heat map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
            >
              <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Submarket Heat Map — SqFt/Capita vs Occupancy</h4>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {heatMapData.map((zone, i) => (
                  <div key={i} className={`${zone.color} rounded-lg p-3 text-center`}>
                    <div className="font-bold text-white text-sm">{zone.zone}</div>
                    <div className="text-white text-xs opacity-80">{zone.sqftCap} sf/cap</div>
                    <div className="text-white text-xs opacity-80">{zone.occupancy}% occ</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-navy-400">
                  <div className="w-3 h-3 rounded-full bg-sage-400" /> Low Supply
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-navy-400">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" /> Moderate Supply
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-navy-400">
                  <div className="w-3 h-3 rounded-full bg-red-400" /> Oversupplied
                </div>
              </div>
            </motion.div>

            {/* Competitive Positioning Table */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden"
            >
              <div className="px-5 py-3 bg-navy-900 dark:bg-navy-950">
                <h4 className="font-semibold text-white text-sm">Competitive Positioning</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-navy-700 bg-gray-100 dark:bg-navy-750">
                      {['Facility', 'SqFt', 'Occ %', '$/SqFt', 'Dist'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-navy-300 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-navy-700">
                    {marketComparables.map((comp, i) => (
                      <tr
                        key={i}
                        className={`hover:bg-gray-100 dark:hover:bg-navy-750 transition-colors ${
                          comp.name === 'Subject Property' ? 'bg-sage-50 dark:bg-sage-500/10 font-semibold' : ''
                        }`}
                      >
                        <td className={`px-3 py-2.5 ${comp.name === 'Subject Property' ? 'text-sage-700 dark:text-sage-400' : 'text-navy-900 dark:text-navy-200'}`}>
                          {comp.name === 'Subject Property' ? '★ Subject' : comp.name.replace(/Competitor [A-D] \(/, '').replace(/\)/, '')}
                        </td>
                        <td className="px-3 py-2.5 text-gray-700 dark:text-navy-300">{(comp.sqFt/1000).toFixed(0)}K</td>
                        <td className={`px-3 py-2.5 font-mono ${comp.occupancy >= 88 ? 'text-sage-600 dark:text-sage-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {comp.occupancy}%
                        </td>
                        <td className="px-3 py-2.5 text-gray-700 dark:text-navy-300">${comp.ratePerSqFt}</td>
                        <td className="px-3 py-2.5 text-gray-500 dark:text-navy-400">{comp.distance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
