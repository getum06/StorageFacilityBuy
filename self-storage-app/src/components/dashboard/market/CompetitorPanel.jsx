import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Building2, AlertTriangle } from 'lucide-react'

const EMPTY_COMPETITOR = {
  id: '',
  name: '',
  distance: '',
  totalSqFt: '',
  climateControlPct: '',
  isReit: false,
  avgRateSmall: '',
  avgRateMedium: '',
  avgRateLarge: '',
  discounting: false,
  rvBoatParking: false,
  notes: '',
}

function CompetitorRow({ comp, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  const field = (key, label, type = 'text', prefix, suffix, placeholder) => (
    <div>
      <label className="block text-xs text-gray-500 dark:text-navy-400 mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{prefix}</span>}
        <input
          type={type}
          value={comp[key]}
          placeholder={placeholder}
          onChange={e => onChange(comp.id, key, type === 'number' ? e.target.value : e.target.value)}
          className={`w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg py-2 text-navy-900 dark:text-white text-xs focus:ring-1 focus:ring-sage-400 outline-none ${prefix ? 'pl-6' : 'pl-2.5'} ${suffix ? 'pr-8' : 'pr-2.5'}`}
        />
        {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{suffix}</span>}
      </div>
    </div>
  )

  const toggle = (key) => (
    <button
      onClick={() => onChange(comp.id, key, !comp[key])}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        comp[key] ? 'bg-sage-50 dark:bg-sage-500/10 border-sage-300 dark:border-sage-500/30 text-sage-700 dark:text-sage-400' : 'bg-gray-50 dark:bg-navy-900 border-gray-200 dark:border-navy-700 text-gray-500 dark:text-navy-400'
      }`}
    >
      <div className={`w-3 h-3 rounded-full ${comp[key] ? 'bg-sage-500' : 'bg-gray-300 dark:bg-navy-600'}`} />
    </button>
  )

  return (
    <div className="border border-gray-200 dark:border-navy-700 rounded-xl overflow-hidden">
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-navy-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-750 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-7 h-7 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="w-3.5 h-3.5 text-navy-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-navy-900 dark:text-white text-sm truncate">
            {comp.name || 'Unnamed Facility'}
          </div>
          <div className="text-xs text-gray-400 dark:text-navy-500">
            {comp.distance ? `${comp.distance} mi` : '— mi'} ·{' '}
            {comp.totalSqFt ? `${parseInt(comp.totalSqFt).toLocaleString()} sqft` : '— sqft'}{' '}
            {comp.isReit && <span className="text-yellow-600 dark:text-yellow-400 font-medium">· REIT</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-navy-400 text-xs">{expanded ? '▲' : '▼'}</span>
          <button
            onClick={e => { e.stopPropagation(); onDelete(comp.id) }}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 border-t border-gray-100 dark:border-navy-700">
              {field('name', 'Facility Name', 'text', null, null, 'e.g. Public Storage')}
              {field('distance', 'Distance (mi)', 'number', null, 'mi', '0.8')}
              {field('totalSqFt', 'Total Sq Ft', 'number', null, null, '40000')}
              {field('climateControlPct', 'Climate Control %', 'number', null, '%', '40')}
              {field('avgRateSmall', '5×5 Street Rate', 'number', '$', '/mo', '79')}
              {field('avgRateMedium', '10×10 Street Rate', 'number', '$', '/mo', '149')}
              {field('avgRateLarge', '10×20 Street Rate', 'number', '$', '/mo', '219')}

              <div>
                <label className="block text-xs text-gray-500 dark:text-navy-400 mb-2">Flags</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {toggle('isReit')}
                    <span className="text-xs text-gray-600 dark:text-navy-300">REIT / Institutional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {toggle('discounting')}
                    <span className="text-xs text-gray-600 dark:text-navy-300">Actively discounting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {toggle('rvBoatParking')}
                    <span className="text-xs text-gray-600 dark:text-navy-300">RV/Boat parking</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-xs text-gray-500 dark:text-navy-400 mb-1">Notes</label>
                <textarea
                  value={comp.notes}
                  onChange={e => onChange(comp.id, 'notes', e.target.value)}
                  placeholder="Condition, occupancy, pricing observations..."
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-2.5 py-2 text-navy-900 dark:text-white text-xs focus:ring-1 focus:ring-sage-400 outline-none resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CompetitorPanel({ competitors, onChange }) {
  const addCompetitor = () => {
    onChange([...competitors, { ...EMPTY_COMPETITOR, id: Date.now().toString() }])
  }

  const updateCompetitor = (id, key, value) => {
    onChange(competitors.map(c => c.id === id ? { ...c, [key]: value } : c))
  }

  const deleteCompetitor = (id) => {
    onChange(competitors.filter(c => c.id !== id))
  }

  const totalSqFt = competitors.reduce((a, c) => a + (parseFloat(c.totalSqFt) || 0), 0)
  const reitCount = competitors.filter(c => c.isReit).length
  const discountCount = competitors.filter(c => c.discounting).length

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-navy-700 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-navy-900 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-sage-400" />
          </div>
          <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wide">
            Competitor Storage Facilities
          </h3>
        </div>
        <button
          onClick={addCompetitor}
          className="flex items-center gap-2 px-3 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg text-xs font-semibold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Facility
        </button>
      </div>

      {/* Summary bar */}
      {competitors.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-navy-900 dark:bg-navy-950 rounded-xl border border-navy-700">
          {[
            { label: 'Facilities', value: competitors.length },
            { label: 'Total Sq Ft', value: totalSqFt > 0 ? `${(totalSqFt/1000).toFixed(0)}K` : '—' },
            { label: 'REIT Operators', value: reitCount, warn: reitCount > 0 },
            { label: 'Discounting', value: discountCount, warn: discountCount > 0 },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className={`text-lg font-bold ${s.warn ? 'text-yellow-400' : 'text-white'}`}>{s.value}</div>
              <div className="text-navy-400 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Competitor list */}
      {competitors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="w-10 h-10 text-navy-700 mb-3" />
          <div className="text-sm font-medium text-gray-500 dark:text-navy-400">No competitors added yet</div>
          <div className="text-xs text-gray-400 dark:text-navy-500 mt-1 max-w-sm">
            Add nearby storage facilities to calculate sq ft per capita and competition risk score.
          </div>
          <button
            onClick={addCompetitor}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-navy-200 hover:text-white rounded-lg text-sm font-medium transition-all border border-navy-700"
          >
            <Plus className="w-4 h-4" /> Add first competitor
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {competitors.map(comp => (
            <CompetitorRow
              key={comp.id}
              comp={comp}
              onChange={updateCompetitor}
              onDelete={deleteCompetitor}
            />
          ))}
        </div>
      )}

      {reitCount > 0 && (
        <div className="mt-4 flex items-start gap-2 text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {reitCount} REIT operator(s) detected. Expect aggressive pricing, high marketing budgets, and rate transparency via their websites.
        </div>
      )}
    </div>
  )
}
