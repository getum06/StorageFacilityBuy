import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-navy-300 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

function GaugeRing({ value, label, max = 100, color = '#3d7d52', size = 90 }) {
  const pct = Math.min(Math.max(value ?? 0, 0) / max, 1)
  const r = 32
  const circ = 2 * Math.PI * r
  const stroke = circ * pct
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#1e3a5f" strokeWidth="9" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${stroke} ${circ - stroke}`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="44" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
          {value != null ? `${value.toFixed(0)}%` : '—'}
        </text>
      </svg>
      <div className="text-xs text-gray-500 dark:text-navy-400 text-center leading-tight mt-1 max-w-[80px]">{label}</div>
    </div>
  )
}

export default function MarketCharts({ marketData, competitors, inputs }) {
  if (!marketData) return null

  const { renterPct, multifamilyPct, singleFamilyPct, mobilityPct, multiVehiclePct, noVehiclePct,
    populationGrowthPct, householdGrowthPct, totalPopulation, totalHouseholds, medianIncome,
    totalHousingUnits, multifamilyUnits } = marketData

  // Housing mix pie data
  const sf = totalHousingUnits ? Math.round((singleFamilyPct ?? 0) / 100 * totalHousingUnits) : 0
  const mf = multifamilyUnits ?? 0
  const mobile = totalHousingUnits ? (totalHousingUnits - sf - mf) : 0
  const housingMix = [
    { name: 'Single Family', value: sf, color: '#1e3a5f' },
    { name: 'Multifamily (5+)', value: mf, color: '#3d7d52' },
    { name: 'Small Multi / Other', value: Math.max(0, mobile), color: '#94a3b8' },
  ].filter(d => d.value > 0)

  // Occupancy mix pie
  const ownerVal = totalHouseholds ? Math.round((1 - (renterPct ?? 0) / 100) * totalHouseholds) : 0
  const renterVal = totalHouseholds ? Math.round(((renterPct ?? 0) / 100) * totalHouseholds) : 0
  const occupancyMix = [
    { name: 'Owner-Occupied', value: ownerVal, color: '#2d5a8e' },
    { name: 'Renter-Occupied', value: renterVal, color: '#3d7d52' },
  ]

  // Growth comparison bar
  const growthData = [
    { name: 'Population Growth', value: populationGrowthPct != null ? parseFloat(populationGrowthPct.toFixed(2)) : null, fill: '#3d7d52', benchmark: 0.7 },
    { name: 'Household Growth', value: householdGrowthPct != null ? parseFloat(householdGrowthPct.toFixed(2)) : null, fill: '#3b82f6', benchmark: 0.6 },
  ].filter(d => d.value != null)

  // Competitor sqft per capita
  const totalCompSqFt = competitors.reduce((a, c) => a + (parseFloat(c.totalSqFt) || 0), 0)
  const sqFtPerCap = totalPopulation && totalCompSqFt
    ? (totalCompSqFt / totalPopulation).toFixed(1)
    : null

  const saturationData = [
    { name: 'National Avg', value: 8.5, fill: '#334155' },
    { name: `${inputs.tradeAreaRadius}-mi Trade Area`, value: sqFtPerCap ? parseFloat(sqFtPerCap) : 0, fill: '#3d7d52' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Occupancy gauges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
      >
        <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-4">Demand Indicator Gauges</h4>
        <div className="grid grid-cols-3 gap-2">
          <GaugeRing value={renterPct} label="Renter %" color="#3d7d52" />
          <GaugeRing value={multifamilyPct} label="Multifamily %" color="#3b82f6" />
          <GaugeRing value={mobilityPct} label="Recent Movers" color="#8b5cf6" max={30} />
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-navy-700 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="font-bold text-navy-900 dark:text-white">{renterPct != null ? `${renterPct.toFixed(0)}%` : '—'}</div>
            <div className="text-gray-400 dark:text-navy-500">Renter-occ</div>
          </div>
          <div>
            <div className="font-bold text-navy-900 dark:text-white">{multifamilyPct != null ? `${multifamilyPct.toFixed(0)}%` : '—'}</div>
            <div className="text-gray-400 dark:text-navy-500">Multifamily</div>
          </div>
          <div>
            <div className="font-bold text-navy-900 dark:text-white">{mobilityPct != null ? `${mobilityPct.toFixed(1)}%` : '—'}</div>
            <div className="text-gray-400 dark:text-navy-500">Moved/yr</div>
          </div>
        </div>
      </motion.div>

      {/* Housing mix pie */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
      >
        <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">Housing Stock Mix</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={housingMix} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55}>
                  {housingMix.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  formatter={v => [v.toLocaleString(), '']}
                  contentStyle={{ background: '#0f1f33', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 flex flex-col justify-center">
            {housingMix.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-gray-600 dark:text-navy-300 flex-1 leading-tight">{d.name}</span>
                <span className="font-semibold text-navy-900 dark:text-white">{d.value.toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-1 border-t border-gray-100 dark:border-navy-700 text-xs flex justify-between">
              <span className="text-gray-500 dark:text-navy-400">Total Units</span>
              <span className="font-bold text-navy-900 dark:text-white">{totalHousingUnits?.toLocaleString() ?? '—'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Renter vs owner pie */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
      >
        <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">Tenure Mix</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={occupancyMix} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55}>
                  {occupancyMix.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  formatter={v => [v.toLocaleString(), '']}
                  contentStyle={{ background: '#0f1f33', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 flex flex-col justify-center">
            {occupancyMix.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-gray-600 dark:text-navy-300 flex-1 leading-tight">{d.name}</span>
                <span className="font-semibold text-navy-900 dark:text-white">{d.value.toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-1 border-t border-gray-100 dark:border-navy-700 text-xs flex justify-between">
              <span className="text-gray-500 dark:text-navy-400">Total HH</span>
              <span className="font-bold text-navy-900 dark:text-white">{totalHouseholds?.toLocaleString() ?? '—'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Population growth bar */}
      {growthData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
        >
          <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">Annual Growth Rate (3-yr CAGR)</h4>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {growthData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-gray-400 dark:text-navy-500">
            Comparing ACS 2022 vs 2019. National average: ~0.7%/yr population, ~0.6%/yr households.
          </div>
        </motion.div>
      )}

      {/* Storage saturation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
      >
        <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">Storage Sq Ft Per Capita</h4>
        {sqFtPerCap ? (
          <>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={saturationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, Math.max(12, parseFloat(sqFtPerCap) + 2)]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {saturationData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <span className={`text-2xl font-bold ${parseFloat(sqFtPerCap) < 7 ? 'text-sage-500' : parseFloat(sqFtPerCap) < 9 ? 'text-blue-500' : parseFloat(sqFtPerCap) < 12 ? 'text-yellow-500' : 'text-red-500'}`}>
                {sqFtPerCap} sqft/capita
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center text-sm text-gray-400 dark:text-navy-500">
            <div className="text-3xl mb-2">📐</div>
            Add competitor sq footage below to calculate saturation
          </div>
        )}
      </motion.div>

      {/* Vehicle ownership */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
      >
        <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">Vehicle Ownership (Boat/RV Proxy)</h4>
        <div className="space-y-3">
          {[
            { label: 'Multi-vehicle HH (3+)', value: multiVehiclePct, color: 'bg-sage-500', note: 'RV/boat storage demand' },
            { label: 'No vehicle HH', value: noVehiclePct, color: 'bg-red-400', note: 'Transit-dependent — less storage' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-navy-300">{item.label}</span>
                <span className="font-bold text-navy-900 dark:text-white">{item.value != null ? `${item.value.toFixed(1)}%` : '—'}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-navy-700 rounded-full overflow-hidden">
                {item.value != null && (
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.min(item.value, 100)}%` }} />
                )}
              </div>
              <div className="text-xs text-gray-400 dark:text-navy-500 mt-0.5">{item.note}</div>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100 dark:border-navy-700 text-xs text-gray-500 dark:text-navy-400">
            ACS vehicle data is a proxy — actual RV/boat demand requires local survey or operator intel.
          </div>
        </div>
      </motion.div>
    </div>
  )
}
