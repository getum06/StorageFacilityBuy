// U.S. Census Bureau ACS 5-Year API — Self-Storage Market Data Fetcher
// No API key required for basic usage (500 req/day limit without key)
// Get a free key at: https://api.census.gov/data/key_signup.html

const ACS_YEAR = '2022'
const ACS_YEAR_PREV = '2019'
const ACS_BASE = 'https://api.census.gov/data'
const ACS_DATASET = 'acs/acs5'

// Census ACS variables relevant to self-storage demand analysis
export const CENSUS_VARIABLES = {
  B01003_001E: 'totalPopulation',
  B11001_001E: 'totalHouseholds',
  B25003_002E: 'ownerOccupied',
  B25003_003E: 'renterOccupied',
  B19013_001E: 'medianIncome',
  B25001_001E: 'totalHousingUnits',
  // Housing structure type (multifamily proxy)
  B25024_002E: 'units1DetachedSF',
  B25024_003E: 'units1AttachedSF',
  B25024_004E: 'units2',
  B25024_005E: 'units3to4',
  B25024_006E: 'units5to9',
  B25024_007E: 'units10to19',
  B25024_008E: 'units20to49',
  B25024_009E: 'units50plus',
  B25024_010E: 'unitsMobile',
  // Geographic mobility (recent movers)
  B07003_001E: 'mobilityUniverse',
  B07003_004E: 'movedDiffCounty',
  B07003_007E: 'movedDiffState',
  // Vehicles available
  B08201_001E: 'vehicleHouseholds',
  B08201_002E: 'noVehicle',
  B08201_003E: 'oneVehicle',
  B08201_004E: 'twoVehicle',
  B08201_005E: 'threeVehicle',
  B08201_006E: 'fourPlusVehicle',
  // Employment
  B23025_001E: 'employmentUniverse',
  B23025_002E: 'inLaborForce',
  B23025_004E: 'employed',
}

// Clean a Census returned value (null out suppressed -666666666)
function cleanVal(v) {
  const n = parseFloat(v)
  return isNaN(n) || n < 0 ? null : n
}

// Parse flat array response from Census API into named object
function parseResponse(headers, values) {
  const result = {}
  headers.forEach((h, i) => {
    result[h] = cleanVal(values[i]) ?? values[i]
  })
  return result
}

// Map raw Census keys → friendly names
function mapVariables(raw) {
  const out = {}
  Object.entries(CENSUS_VARIABLES).forEach(([key, name]) => {
    out[name] = raw[key] ?? null
  })
  return out
}

// Fetch ACS data for a given ZIP code and year
async function fetchACSByZip(zip, year = ACS_YEAR, apiKey = '') {
  const paddedZip = zip.toString().padStart(5, '0')
  const vars = ['NAME', ...Object.keys(CENSUS_VARIABLES)].join(',')
  const keyParam = apiKey ? `&key=${apiKey}` : ''
  const url = `${ACS_BASE}/${year}/${ACS_DATASET}?get=${vars}&for=zip%20code%20tabulation%20area:${paddedZip}${keyParam}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Census API returned ${res.status} for ZIP ${paddedZip}`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length < 2) throw new Error('No Census data found for this ZIP code')

  const raw = parseResponse(data[0], data[1])
  return mapVariables(raw)
}

// Geocode an address using the Census Geocoder (free, no key)
export async function geocodeAddress(address, city, state, zip) {
  const query = [address, city, state, zip].filter(Boolean).join(' ')
  const encoded = encodeURIComponent(query + ', USA')
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=us`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'StorageIQ-DashboardApp/1.0' }
  })
  if (!res.ok) throw new Error('Geocoding service unavailable')
  const data = await res.json()
  if (!data.length) throw new Error('Address not found — try entering ZIP code only')

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  }
}

// Main fetch function — gets both current and prior year ACS, computes growth
export async function fetchMarketData(zip, apiKey = '') {
  const [current, previous] = await Promise.all([
    fetchACSByZip(zip, ACS_YEAR, apiKey),
    fetchACSByZip(zip, ACS_YEAR_PREV, apiKey).catch(() => null),
  ])

  // Compute 3-year CAGR for population and households
  const years = 3 // 2022 vs 2019
  let populationGrowthPct = null
  let householdGrowthPct = null

  if (previous && current.totalPopulation && previous.totalPopulation) {
    populationGrowthPct = ((Math.pow(current.totalPopulation / previous.totalPopulation, 1 / years) - 1) * 100)
  }
  if (previous && current.totalHouseholds && previous.totalHouseholds) {
    householdGrowthPct = ((Math.pow(current.totalHouseholds / previous.totalHouseholds, 1 / years) - 1) * 100)
  }

  // Derived metrics
  const renterOccupied = current.renterOccupied ?? 0
  const ownerOccupied = current.ownerOccupied ?? 0
  const totalOccupied = renterOccupied + ownerOccupied
  const renterPct = totalOccupied > 0 ? (renterOccupied / totalOccupied) * 100 : null

  const totalHousingUnits = current.totalHousingUnits ?? 0
  const multifamilyUnits =
    (current.units5to9 ?? 0) + (current.units10to19 ?? 0) +
    (current.units20to49 ?? 0) + (current.units50plus ?? 0)
  const multifamilyPct = totalHousingUnits > 0 ? (multifamilyUnits / totalHousingUnits) * 100 : null

  const singleFamilyPct = totalHousingUnits > 0
    ? (((current.units1DetachedSF ?? 0) + (current.units1AttachedSF ?? 0)) / totalHousingUnits) * 100
    : null

  const movers = (current.movedDiffCounty ?? 0) + (current.movedDiffState ?? 0)
  const mobilityUniverse = current.mobilityUniverse ?? 0
  const mobilityPct = mobilityUniverse > 0 ? (movers / mobilityUniverse) * 100 : null

  const vehicleHouseholds = current.vehicleHouseholds ?? 1
  const noVehiclePct = vehicleHouseholds > 0
    ? ((current.noVehicle ?? 0) / vehicleHouseholds) * 100 : null
  const multiVehiclePct = vehicleHouseholds > 0
    ? (((current.threeVehicle ?? 0) + (current.fourPlusVehicle ?? 0)) / vehicleHouseholds) * 100 : null

  const employmentRate = current.employmentUniverse > 0
    ? (current.employed / current.employmentUniverse) * 100 : null

  return {
    zip,
    year: ACS_YEAR,
    raw: current,
    populationGrowthPct,
    householdGrowthPct,
    renterPct,
    multifamilyPct,
    singleFamilyPct,
    multifamilyUnits,
    mobilityPct,
    noVehiclePct,
    multiVehiclePct,
    employmentRate,
    // Pass through key raw values with friendlier names
    totalPopulation: current.totalPopulation,
    totalHouseholds: current.totalHouseholds,
    medianIncome: current.medianIncome,
    totalHousingUnits,
  }
}

// Validate a ZIP code format
export function isValidZip(zip) {
  return /^\d{5}$/.test(zip?.toString()?.trim())
}
