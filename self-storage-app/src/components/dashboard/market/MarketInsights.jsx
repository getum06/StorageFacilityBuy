import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { SCORE_WEIGHTS, SCORE_LABELS } from './DemographicScorer'

function InsightBullet({ type, text }) {
  const config = {
    strength: { icon: TrendingUp, color: 'text-sage-600 dark:text-sage-400', bg: 'bg-sage-50 dark:bg-sage-500/10', border: 'border-sage-200 dark:border-sage-500/20', label: 'Strength' },
    risk: { icon: TrendingDown, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', label: 'Risk' },
    caution: { icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20', label: 'Watch' },
    info: { icon: Info, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', label: 'Note' },
    summary: { icon: CheckCircle, color: 'text-navy-700 dark:text-navy-200', bg: 'bg-navy-50 dark:bg-navy-900/50', border: 'border-navy-200 dark:border-navy-700', label: 'Summary' },
  }
  const c = config[type] || config.info
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${c.bg} ${c.border}`}>
      <c.icon className={`w-4 h-4 ${c.color} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <span className={`text-xs font-semibold uppercase tracking-wide ${c.color} mr-2`}>{c.label}</span>
        <span className="text-sm text-gray-700 dark:text-navy-200">{text}</span>
      </div>
    </div>
  )
}

export default function MarketInsights({ scoreResult, marketData, competitors, inputs }) {
  if (!scoreResult) return null

  const { overall, rating, ratingColor, components } = scoreResult

  // Generate insights automatically from component scores
  const insights = []

  // Summary
  insights.push({
    type: 'summary',
    text: `This trade area scored ${overall}/100 — "${rating}." ${
      overall >= 80 ? 'This is a highly attractive storage market with strong demand drivers and favorable supply dynamics.' :
      overall >= 65 ? 'Market fundamentals support storage demand, but some factors warrant closer diligence.' :
      overall >= 50 ? 'Mixed signals — some positive drivers offset by risk factors. Model conservative assumptions.' :
      'Weak market conditions. Storage demand drivers are insufficient relative to existing supply or competition.'
    }`
  })

  // Component-based insights (sorted by score)
  const sorted = Object.entries(components).sort((a, b) => b[1].score - a[1].score)

  // Top 3 strengths (score >= 65)
  sorted
    .filter(([, v]) => v.score >= 65)
    .slice(0, 3)
    .forEach(([key, val]) => {
      insights.push({ type: 'strength', text: val.notes })
    })

  // Bottom risks (score < 55)
  sorted
    .reverse()
    .filter(([, v]) => v.score < 55)
    .slice(0, 3)
    .forEach(([key, val]) => {
      insights.push({ type: val.score < 40 ? 'risk' : 'caution', text: val.notes })
    })

  // REIT-specific insight
  const reitCount = competitors.filter(c => c.isReit).length
  if (reitCount > 0) {
    insights.push({
      type: 'caution',
      text: `${reitCount} REIT/institutional operator(s) in the trade area will use sophisticated revenue management software and aggressive digital marketing. Budget accordingly for higher customer acquisition costs and expect competitive street rate pressure.`
    })
  }

  // Supply insight
  if (marketData?.totalPopulation && competitors.length > 0) {
    const totalCompSqFt = competitors.reduce((a, c) => a + (parseFloat(c.totalSqFt) || 0), 0)
    const sqFtPerCap = totalCompSqFt / marketData.totalPopulation
    if (sqFtPerCap < 6) {
      insights.push({
        type: 'strength',
        text: `At ${sqFtPerCap.toFixed(1)} sqft/capita, this trade area is meaningfully undersupplied vs. the ~8.5 national average. New entrant has pricing power to lease-up without discounting.`
      })
    } else if (sqFtPerCap > 10) {
      insights.push({
        type: 'risk',
        text: `At ${sqFtPerCap.toFixed(1)} sqft/capita, this trade area is oversupplied. Expect discounting, lower occupancy during lease-up, and compressed effective rents. Re-underwrite with conservative occupancy assumptions.`
      })
    }
  }

  // Income insight
  if (marketData?.medianIncome) {
    if (marketData.medianIncome > 100000) {
      insights.push({
        type: 'info',
        text: `High median income ($${(marketData.medianIncome/1000).toFixed(0)}K) supports premium climate-controlled pricing. Focus unit mix on larger, higher-rate units. Wine storage and business-grade units may be viable ancillary offerings.`
      })
    } else if (marketData.medianIncome < 35000) {
      insights.push({
        type: 'caution',
        text: `Below-average median income ($${(marketData.medianIncome/1000).toFixed(0)}K) increases delinquency risk. Implement strict lien law procedures, offer payment plans to preserve occupancy, and price non-climate units competitively.`
      })
    }
  }

  // Mobility insight
  if (marketData?.mobilityPct && marketData.mobilityPct > 15) {
    insights.push({
      type: 'strength',
      text: `High residential mobility (${marketData.mobilityPct.toFixed(1)}%/yr) means a large share of households moved recently — the #1 trigger for first-time storage rentals. Invest in move-in season digital marketing (April–September).`
    })
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100 dark:border-navy-700">
        <div className="w-7 h-7 bg-navy-900 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-sage-400" />
        </div>
        <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wide">Market Insights & Analysis</h3>
        <span className="ml-auto text-xs text-gray-400 dark:text-navy-500">Auto-generated from scoring model</span>
      </div>

      <div className="space-y-2.5">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <InsightBullet type={insight.type} text={insight.text} />
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-5 p-4 bg-gray-50 dark:bg-navy-900/60 rounded-xl border border-gray-200 dark:border-navy-700 text-xs text-gray-500 dark:text-navy-400 leading-relaxed"
      >
        <strong className="text-gray-700 dark:text-navy-200 block mb-1">Disclaimer</strong>
        Demographic and market data is directional. Final underwriting must be combined with actual rent roll, T12 financials, occupancy reports, delinquency reports, competitor pricing, supply pipeline, CapEx diligence, tax reassessment estimates, insurance quotes, and financing terms. Census ACS 5-year data reflects survey estimates — actual trade area conditions may differ. Self-storage market saturation is best assessed with a licensed commercial real estate advisor or dedicated platform (Radius+, CoStar, Yardi Matrix).
      </motion.div>
    </div>
  )
}
