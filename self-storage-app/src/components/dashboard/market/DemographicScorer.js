// Weighted self-storage market attractiveness scoring engine

export const SCORE_WEIGHTS = {
  growth: 0.20,       // Population & household growth
  renter: 0.15,       // Renter + multifamily density
  mobility: 0.15,     // Household mobility / turnover
  income: 0.10,       // Median income fit
  saturation: 0.25,   // Competitor saturation / sqft per capita
  demand: 0.10,       // Vehicles, small business, commercial demand proxies
  supplyRisk: 0.05,   // Institutional competition + new supply risk
}

export const SCORE_LABELS = {
  growth: 'Population & HH Growth',
  renter: 'Renter / Multifamily Density',
  mobility: 'Household Mobility',
  income: 'Income Fit',
  saturation: 'Market Saturation',
  demand: 'Demand Drivers',
  supplyRisk: 'Supply / Institutional Risk',
}

// Score 0–100 for population and household growth
function scoreGrowth(popGrowthPct, hhGrowthPct) {
  if (popGrowthPct == null && hhGrowthPct == null) return { score: 50, notes: 'Growth data unavailable — using neutral score.' }
  const pop = popGrowthPct ?? 0
  const hh = hhGrowthPct ?? 0
  // Ideal: 2%+ population growth, 2%+ household growth
  const popScore = pop >= 3 ? 100 : pop >= 2 ? 85 : pop >= 1 ? 65 : pop >= 0 ? 45 : 20
  const hhScore = hh >= 3 ? 100 : hh >= 2 ? 85 : hh >= 1 ? 65 : hh >= 0 ? 45 : 20
  const score = Math.round(popScore * 0.55 + hhScore * 0.45)
  const notes = pop >= 2
    ? `Strong growth market — ${pop.toFixed(1)}%/yr population + ${hh?.toFixed(1) ?? 'N/A'}%/yr household growth drives demand.`
    : pop >= 0.5
    ? `Moderate growth — ${pop.toFixed(1)}%/yr. Adequate but not a high-velocity market.`
    : `Slow or declining population (-${Math.abs(pop).toFixed(1)}%/yr). Storage demand headwinds.`
  return { score, notes }
}

// Score for renter + multifamily density
function scoreRenter(renterPct, multifamilyPct) {
  if (renterPct == null) return { score: 50, notes: 'Renter data unavailable.' }
  // Renters use storage more — 35%+ renter is favorable
  const renterScore = renterPct >= 50 ? 100 : renterPct >= 40 ? 85 : renterPct >= 30 ? 65 : renterPct >= 20 ? 45 : 30
  const mfScore = multifamilyPct == null ? 50
    : multifamilyPct >= 30 ? 95 : multifamilyPct >= 20 ? 75 : multifamilyPct >= 10 ? 55 : 35
  const score = Math.round(renterScore * 0.6 + mfScore * 0.4)
  const notes = renterPct >= 40
    ? `High renter concentration (${renterPct.toFixed(0)}%) creates strong storage demand — renters use storage ~2x more than homeowners.`
    : renterPct >= 25
    ? `Moderate renter share (${renterPct.toFixed(0)}%). Mixed demand profile.`
    : `Low renter share (${renterPct.toFixed(0)}%). Demand more homeowner-driven — consider boat/RV/seasonal positioning.`
  return { score, notes }
}

// Score for household mobility / recent movers
function scoreMobility(mobilityPct) {
  if (mobilityPct == null) return { score: 50, notes: 'Mobility data unavailable.' }
  // Moving is the #1 trigger for renting storage
  const score = mobilityPct >= 20 ? 95 : mobilityPct >= 15 ? 80 : mobilityPct >= 10 ? 65 : mobilityPct >= 5 ? 45 : 30
  const notes = mobilityPct >= 15
    ? `High mobility (${mobilityPct.toFixed(1)}% moved recently). Moving is the top trigger for first-time storage rentals.`
    : mobilityPct >= 8
    ? `Average mobility (${mobilityPct.toFixed(1)}%). Normal churn — steady demand baseline.`
    : `Low mobility (${mobilityPct.toFixed(1)}%). Established community; demand may be lower and driven by downsizing/4Ds.`
  return { score, notes }
}

// Score for median household income
function scoreIncome(medianIncome) {
  if (!medianIncome) return { score: 50, notes: 'Income data unavailable.' }
  // Storage demand peaks $40K–$90K. Ultra-wealthy store less (have space). Very low income can't afford it.
  let score, notes
  if (medianIncome >= 40000 && medianIncome <= 90000) {
    score = 85
    notes = `Income sweet spot ($${(medianIncome / 1000).toFixed(0)}K). This range has the highest per-capita self-storage spend.`
  } else if (medianIncome > 90000 && medianIncome <= 130000) {
    score = 72
    notes = `Above-average income ($${(medianIncome / 1000).toFixed(0)}K). Strong ability to pay; may have more home storage space.`
  } else if (medianIncome > 130000) {
    score = 60
    notes = `High-income area ($${(medianIncome / 1000).toFixed(0)}K). Climate-controlled and premium units will command top rates.`
  } else if (medianIncome >= 25000) {
    score = 58
    notes = `Below-average income ($${(medianIncome / 1000).toFixed(0)}K). Affordability sensitive — price non-climate units competitively.`
  } else {
    score = 35
    notes = `Very low income ($${(medianIncome / 1000).toFixed(0)}K). High delinquency risk. Careful underwriting required.`
  }
  return { score, notes }
}

// Score for market saturation (sqft/capita + competitor count)
function scoreSaturation(sqFtPerCapita, competitorCount, tradeAreaRadius) {
  // Industry benchmark: 7–9 sqft/capita = balanced; <7 = undersupplied; >10 = oversupplied
  let satScore, satNotes
  if (sqFtPerCapita == null) {
    satScore = 50
    satNotes = 'SqFt/capita not yet calculated — add competitor data to compute.'
  } else if (sqFtPerCapita < 5) {
    satScore = 98
    satNotes = `Severely undersupplied (${sqFtPerCapita.toFixed(1)} sqft/capita vs. ~8.5 national avg). Excellent supply/demand dynamics.`
  } else if (sqFtPerCapita < 7) {
    satScore = 88
    satNotes = `Undersupplied market (${sqFtPerCapita.toFixed(1)} sqft/capita). Strong pricing power and low competitive risk.`
  } else if (sqFtPerCapita < 9) {
    satScore = 72
    satNotes = `Balanced market (${sqFtPerCapita.toFixed(1)} sqft/capita). Near national average — competitive but workable.`
  } else if (sqFtPerCapita < 12) {
    satScore = 45
    satNotes = `Oversupplied market (${sqFtPerCapita.toFixed(1)} sqft/capita). Pricing pressure likely. Occupancy may lag.`
  } else {
    satScore = 22
    satNotes = `Severely oversupplied (${sqFtPerCapita.toFixed(1)} sqft/capita). Very difficult to achieve target occupancy and rents.`
  }
  // Adjust for raw competitor count
  const compPenalty = Math.max(0, (competitorCount ?? 0) - 4) * 3
  const score = Math.max(5, Math.round(satScore - compPenalty))
  return { score, notes: satNotes }
}

// Score for demand proxy drivers (vehicles, small biz, etc.)
function scoreDemand(multiVehiclePct, smallBizDensity, hasNearbyHub) {
  const vehScore = multiVehiclePct == null ? 50
    : multiVehiclePct >= 15 ? 90 : multiVehiclePct >= 10 ? 75 : multiVehiclePct >= 5 ? 55 : 35
  const bizScore = smallBizDensity == null ? 50
    : smallBizDensity >= 15 ? 90 : smallBizDensity >= 10 ? 75 : smallBizDensity >= 5 ? 55 : 35
  const hubBonus = hasNearbyHub ? 15 : 0
  const score = Math.min(100, Math.round(vehScore * 0.45 + bizScore * 0.45 + hubBonus))
  const notes = hasNearbyHub
    ? 'Nearby employment hub (military/university/hospital) creates stable institutional demand.'
    : multiVehiclePct >= 10
    ? `Multi-vehicle households (${multiVehiclePct?.toFixed(0)}%) suggest boat/RV/seasonal storage potential.`
    : 'Standard residential demand profile.'
  return { score, notes }
}

// Score for institutional/new supply risk (inverted — lower risk = higher score)
function scoreSupplyRisk(reitCount, newPipelineUnits, competitorCount) {
  const reitPenalty = (reitCount ?? 0) * 12
  const pipelinePenalty = Math.min(40, ((newPipelineUnits ?? 0) / 100) * 15)
  const score = Math.max(10, Math.round(90 - reitPenalty - pipelinePenalty))
  const notes = reitCount > 0
    ? `${reitCount} REIT/institutional operator(s) present. Expect aggressive pricing and high marketing budgets.`
    : newPipelineUnits > 0
    ? `${newPipelineUnits.toLocaleString()} sqft in development pipeline — supply headwind within 24 months.`
    : 'No REIT operators or significant new supply identified. Favorable competitive environment.'
  return { score, notes }
}

// Master scoring function — accepts all market inputs, returns full scorecard
export function computeMarketScore({
  populationGrowthPct,
  householdGrowthPct,
  renterPct,
  multifamilyPct,
  mobilityPct,
  medianIncome,
  sqFtPerCapita,
  competitorCount,
  tradeAreaRadius,
  multiVehiclePct,
  smallBizDensity,
  hasNearbyHub,
  reitCount,
  newPipelineUnits,
}) {
  const growth = scoreGrowth(populationGrowthPct, householdGrowthPct)
  const renter = scoreRenter(renterPct, multifamilyPct)
  const mobility = scoreMobility(mobilityPct)
  const income = scoreIncome(medianIncome)
  const saturation = scoreSaturation(sqFtPerCapita, competitorCount, tradeAreaRadius)
  const demand = scoreDemand(multiVehiclePct, smallBizDensity, hasNearbyHub)
  const supplyRisk = scoreSupplyRisk(reitCount, newPipelineUnits, competitorCount)

  const overall = Math.round(
    growth.score * SCORE_WEIGHTS.growth +
    renter.score * SCORE_WEIGHTS.renter +
    mobility.score * SCORE_WEIGHTS.mobility +
    income.score * SCORE_WEIGHTS.income +
    saturation.score * SCORE_WEIGHTS.saturation +
    demand.score * SCORE_WEIGHTS.demand +
    supplyRisk.score * SCORE_WEIGHTS.supplyRisk
  )

  return {
    overall,
    rating: overall >= 80 ? 'Highly Attractive' : overall >= 65 ? 'Attractive' : overall >= 50 ? 'Mixed — Investigate' : 'Weak / Oversupplied',
    ratingColor: overall >= 80 ? 'sage' : overall >= 65 ? 'blue' : overall >= 50 ? 'yellow' : 'red',
    components: { growth, renter, mobility, income, saturation, demand, supplyRisk },
  }
}

// Generate human-readable insight bullets
export function generateInsights(scoreResult, marketData) {
  const { components, overall, rating } = scoreResult
  const bullets = []
  const sorted = Object.entries(components).sort((a, b) => b[1].score - a[1].score)

  bullets.push({ type: 'summary', text: `Overall market score: ${overall}/100 — ${rating}` })

  // Top 2 strengths
  sorted.slice(0, 2).forEach(([key]) => {
    bullets.push({ type: 'strength', text: components[key].notes })
  })

  // Bottom 2 risks
  sorted.slice(-2).forEach(([key]) => {
    if (components[key].score < 65) {
      bullets.push({ type: 'risk', text: components[key].notes })
    }
  })

  return bullets
}
