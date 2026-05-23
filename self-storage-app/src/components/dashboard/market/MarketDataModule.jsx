import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import TradeAreaInput from './TradeAreaInput'
import DemographicScorecard from './DemographicScorecard'
import MarketCharts from './MarketCharts'
import CompetitorPanel from './CompetitorPanel'
import CSVUploader from './CSVUploader'
import TradeAreaMap from './TradeAreaMap'
import MarketInsights from './MarketInsights'
import { fetchMarketData } from './CensusAPI'
import { computeMarketScore } from './DemographicScorer'

// DFW example pre-seeded data
const DFW_DEMO = {
  address: '4100 NE Loop 820',
  city: 'Fort Worth',
  state: 'TX',
  zip: '76137',
  lat: '32.8373',
  lng: '-97.2737',
  tradeAreaRadius: 3,
}

// Pre-seeded estimated market data for DFW 76137 (sourced from ACS 2022 estimates)
const DFW_ESTIMATED = {
  totalPopulation: 87420,
  totalHouseholds: 34280,
  medianIncome: 71800,
  renterPct: 39.4,
  multifamilyPct: 28.2,
  singleFamilyPct: 55.6,
  mobilityPct: 14.8,
  multiVehiclePct: 12.3,
  noVehiclePct: 6.1,
  populationGrowthPct: 2.6,
  householdGrowthPct: 2.9,
  totalHousingUnits: 36100,
  multifamilyUnits: 10180,
  employmentRate: 62.4,
}

const DFW_COMPETITORS = [
  { id: '1', name: 'Public Storage', distance: '0.8', totalSqFt: '52000', climateControlPct: '45', isReit: true, avgRateSmall: '79', avgRateMedium: '159', avgRateLarge: '239', discounting: false, rvBoatParking: false, notes: 'Brand new facility 2022' },
  { id: '2', name: 'CubeSmart', distance: '1.4', totalSqFt: '44000', climateControlPct: '38', isReit: true, avgRateSmall: '69', avgRateMedium: '149', avgRateLarge: '219', discounting: true, rvBoatParking: false, notes: 'First month free promotion active' },
  { id: '3', name: 'Fort Worth Self Storage', distance: '2.1', totalSqFt: '28000', climateControlPct: '20', isReit: false, avgRateSmall: '59', avgRateMedium: '119', avgRateLarge: '179', discounting: false, rvBoatParking: true, notes: 'Older facility, some deferred maintenance' },
  { id: '4', name: 'Alliance Storage', distance: '3.2', totalSqFt: '18000', climateControlPct: '10', isReit: false, avgRateSmall: '49', avgRateMedium: '109', avgRateLarge: '159', discounting: false, rvBoatParking: false, notes: '' },
]

export default function MarketDataModule() {
  const [inputs, setInputs] = useState(DFW_DEMO)
  const [censusData, setCensusData] = useState(null)
  const [overrides, setOverrides] = useState(DFW_ESTIMATED)
  const [competitors, setCompetitors] = useState(DFW_COMPETITORS)
  const [additionalInputs, setAdditionalInputs] = useState({
    smallBizDensity: 12.4,
    hasNearbyHub: false,
    newPipelineUnits: 0,
  })
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)
  const [usingDemo, setUsingDemo] = useState(true)

  const updateInput = (key, value) => setInputs(prev => ({ ...prev, [key]: value }))

  const handleFetch = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const data = await fetchMarketData(inputs.zip)
      setCensusData(data)
      setOverrides({}) // clear manual overrides once real data is loaded
      setUsingDemo(false)
      setLastFetched(Date.now())
    } catch (e) {
      setFetchError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCSVImport = (importedData) => {
    setOverrides(prev => ({ ...prev, ...importedData }))
    if (importedData.smallBizDensity) setAdditionalInputs(prev => ({ ...prev, smallBizDensity: importedData.smallBizDensity }))
    if (importedData.newPipelineUnits) setAdditionalInputs(prev => ({ ...prev, newPipelineUnits: importedData.newPipelineUnits }))
  }

  // Merged market data = census API + CSV overrides
  const marketData = useMemo(() => {
    if (!censusData && Object.keys(overrides).length === 0) return null
    return { ...(censusData || {}), ...overrides }
  }, [censusData, overrides])

  // Compute saturation
  const totalCompSqFt = competitors.reduce((a, c) => a + (parseFloat(c.totalSqFt) || 0), 0)
  const sqFtPerCapita = marketData?.totalPopulation && totalCompSqFt
    ? totalCompSqFt / marketData.totalPopulation : overrides.sqFtPerCapita ?? null

  const reitCount = competitors.filter(c => c.isReit).length

  // Score
  const scoreResult = useMemo(() => {
    if (!marketData && sqFtPerCapita == null) return null
    return computeMarketScore({
      populationGrowthPct: marketData?.populationGrowthPct ?? overrides.populationGrowthPct ?? null,
      householdGrowthPct: marketData?.householdGrowthPct ?? overrides.householdGrowthPct ?? null,
      renterPct: marketData?.renterPct ?? overrides.renterPct ?? null,
      multifamilyPct: marketData?.multifamilyPct ?? overrides.multifamilyPct ?? null,
      mobilityPct: marketData?.mobilityPct ?? overrides.mobilityPct ?? null,
      medianIncome: marketData?.medianIncome ?? null,
      sqFtPerCapita,
      competitorCount: competitors.length,
      tradeAreaRadius: inputs.tradeAreaRadius,
      multiVehiclePct: marketData?.multiVehiclePct ?? null,
      smallBizDensity: additionalInputs.smallBizDensity,
      hasNearbyHub: additionalInputs.hasNearbyHub,
      reitCount,
      newPipelineUnits: additionalInputs.newPipelineUnits,
    })
  }, [marketData, overrides, sqFtPerCapita, competitors, inputs.tradeAreaRadius, additionalInputs, reitCount])

  return (
    <div className="space-y-5">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-navy-900 rounded-xl border border-navy-700 p-4 flex flex-wrap items-center gap-6"
      >
        <div>
          <div className="text-navy-400 text-xs font-semibold uppercase tracking-wider mb-1">Demographic & Market Analysis</div>
          <div className="text-white font-bold text-lg">
            {inputs.city && inputs.state ? `${inputs.city}, ${inputs.state}` : 'Enter Property Location'}
            {inputs.zip && <span className="text-navy-400 font-normal text-sm ml-2">· ZIP {inputs.zip}</span>}
          </div>
        </div>
        {scoreResult && (
          <div className="flex gap-4 flex-wrap">
            {[
              { label: 'Market Score', value: `${scoreResult.overall}/100`, color: scoreResult.overall >= 80 ? 'text-sage-400' : scoreResult.overall >= 65 ? 'text-blue-400' : scoreResult.overall >= 50 ? 'text-yellow-400' : 'text-red-400' },
              { label: 'Rating', value: scoreResult.rating, color: 'text-white' },
              { label: 'Trade Area', value: `${inputs.tradeAreaRadius}-mile`, color: 'text-navy-300' },
              { label: 'Competitors', value: competitors.length, color: 'text-navy-300' },
              { label: 'SqFt/Capita', value: sqFtPerCapita ? sqFtPerCapita.toFixed(1) : '—', color: sqFtPerCapita && sqFtPerCapita < 7 ? 'text-sage-400' : sqFtPerCapita && sqFtPerCapita > 10 ? 'text-red-400' : 'text-white' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-navy-800 rounded-lg px-3 py-2">
                <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                <div className="text-navy-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {!scoreResult && (
          <div className="text-navy-400 text-sm">
            Enter a ZIP code and fetch Census data, or add competitor data below to generate a market score.
          </div>
        )}
      </motion.div>

      {/* Trade area input */}
      <TradeAreaInput
        inputs={inputs}
        onInputChange={updateInput}
        onFetch={handleFetch}
        loading={loading}
        fetchError={fetchError}
        lastFetched={lastFetched}
        usingDemo={usingDemo}
      />

      {/* Score & Charts (show after data available) */}
      {scoreResult && (
        <>
          <DemographicScorecard
            scoreResult={scoreResult}
            marketData={marketData}
            inputs={inputs}
          />
          <MarketCharts
            marketData={marketData}
            competitors={competitors}
            inputs={inputs}
          />
        </>
      )}

      {/* Map */}
      <TradeAreaMap
        lat={inputs.lat}
        lng={inputs.lng}
        tradeAreaRadius={inputs.tradeAreaRadius}
        competitors={competitors}
      />

      {/* Competitor panel */}
      <CompetitorPanel
        competitors={competitors}
        onChange={setCompetitors}
      />

      {/* Additional inputs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
      >
        <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wide mb-4 pb-3 border-b border-gray-100 dark:border-navy-700">
          Additional Demand Inputs
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">
              Small Biz Density (per 1K pop)
            </label>
            <input
              type="number"
              step="0.1"
              value={additionalInputs.smallBizDensity}
              onChange={e => setAdditionalInputs(prev => ({ ...prev, smallBizDensity: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2.5 text-sm text-navy-900 dark:text-white focus:ring-2 focus:ring-sage-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">
              New Pipeline (sqft within 3mi)
            </label>
            <input
              type="number"
              step="1000"
              value={additionalInputs.newPipelineUnits}
              onChange={e => setAdditionalInputs(prev => ({ ...prev, newPipelineUnits: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2.5 text-sm text-navy-900 dark:text-white focus:ring-2 focus:ring-sage-400 outline-none"
            />
          </div>
          <div className="flex items-end pb-1">
            <button
              onClick={() => setAdditionalInputs(prev => ({ ...prev, hasNearbyHub: !prev.hasNearbyHub }))}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                additionalInputs.hasNearbyHub
                  ? 'bg-sage-50 dark:bg-sage-500/10 border-sage-300 dark:border-sage-500/30 text-sage-700 dark:text-sage-400'
                  : 'bg-gray-50 dark:bg-navy-900 border-gray-200 dark:border-navy-700 text-gray-600 dark:text-navy-300'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${additionalInputs.hasNearbyHub ? 'bg-sage-500 border-sage-500' : 'border-gray-300 dark:border-navy-600'}`}>
                {additionalInputs.hasNearbyHub && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              Nearby Hub (Military/University/Hospital)
            </button>
          </div>
        </div>
      </motion.div>

      {/* CSV uploader */}
      <CSVUploader onDataImport={handleCSVImport} />

      {/* Insights */}
      {scoreResult && (
        <MarketInsights
          scoreResult={scoreResult}
          marketData={marketData}
          competitors={competitors}
          inputs={inputs}
        />
      )}

      {/* Show score even without census data if competitors were added */}
      {!scoreResult && competitors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-400"
        >
          Competitors added. Fetch Census data (enter ZIP above and click "Fetch Census ACS Data") to generate a full market attractiveness score.
        </motion.div>
      )}
    </div>
  )
}
