// Census data via CensusReporter.org public API
// No API key required. Data source: ACS 5-Year (most recent vintage available).
// Docs: https://api.censusreporter.org
//
// The Census Bureau's direct API (api.census.gov) now requires a key for all requests.
// Census Reporter proxies the same ACS data without authentication.

const CR_BASE = 'https://api.censusreporter.org/1.0/data/show/latest'

// Convert 5-digit ZIP to Census Reporter geo_id format
function zipToGeoId(zip) {
  return `86000US${zip.toString().padStart(5, '0')}`
}

// Tables to request — covers all self-storage demand indicators
const TABLES = [
  'B01003', // Total population
  'B11001', // Total households
  'B19013', // Median household income
  'B25003', // Tenure (owner / renter occupied)
  'B25001', // Total housing units
  'B25024', // Units in structure (multifamily proxy)
  'B07013', // Geographic mobility by householder tenure (movers in past year)
  'B08201', // Vehicles available per household
  'B23025', // Employment status
].join(',')

// Variable → friendly name map (Census Reporter returns flat variable codes)
const VAR_MAP = {
  // Population & Households
  B01003001: 'totalPopulation',
  B11001001: 'totalHouseholds',
  // Tenure
  B25003001: 'totalOccupied',
  B25003002: 'ownerOccupied',
  B25003003: 'renterOccupied',
  // Income
  B19013001: 'medianIncome',
  // Housing units
  B25001001: 'totalHousingUnits',
  // Units by structure type (multifamily proxy)
  B25024001: 'housingUnitsTotal',
  B25024002: 'units1DetachedSF',
  B25024003: 'units1AttachedSF',
  B25024004: 'units2',
  B25024005: 'units3to4',
  B25024006: 'units5to9',
  B25024007: 'units10to19',
  B25024008: 'units20to49',
  B25024009: 'units50plus',
  // Geographic mobility (B07013 structure: 001=total, 004=same house, rest=movers)
  B07013001: 'mobilityHouseholders',   // Total householders
  B07013004: 'samHouseHH',             // Same house 1 year ago (did NOT move)
  B07013007: 'movedWithinCounty',
  B07013010: 'movedDiffCounty',
  B07013013: 'movedDiffState',
  B07013016: 'movedFromAbroad',
  // Vehicles available (B08201: 001=total, 002=0 vehicles, 003=1, 004=2, 005=3, 006=4+)
  B08201001: 'vehicleHouseholds',
  B08201002: 'noVehicle',
  B08201003: 'oneVehicle',
  B08201004: 'twoVehicle',
  B08201005: 'threeVehicle',
  B08201006: 'fourPlusVehicle',
  // Employment
  B23025001: 'employmentUniverse',
  B23025002: 'inLaborForce',
  B23025004: 'employed',
}

function cleanNum(v) {
  const n = parseFloat(v)
  return isNaN(n) || n < 0 ? null : n
}

// Geocode address → lat/lng via OpenStreetMap Nominatim (free, no key)
export async function geocodeAddress(address, city, state, zip) {
  const query = [address, city, state, zip].filter(Boolean).join(' ')
  const encoded = encodeURIComponent(query + ', USA')
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=us`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'StorageIQ/1.0 (self-storage acquisition dashboard)' }
  })
  if (!res.ok) throw new Error('Geocoding service unavailable')
  const data = await res.json()
  if (!data.length) throw new Error('Address not found — try entering just the ZIP code')

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  }
}

// Main export: fetch all ACS demographic data for a given ZIP
export async function fetchMarketData(zip) {
  const geoId = zipToGeoId(zip)
  const url = `${CR_BASE}?table_ids=${TABLES}&geo_ids=${geoId}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Census Reporter returned ${res.status}. Check that ZIP ${zip} is a residential ZIP code.`)

  const json = await res.json()
  if (json.error) throw new Error(`Census Reporter: ${json.error}`)
  if (!json.data?.[geoId]) throw new Error(`No ACS data found for ZIP ${zip}. Try a nearby ZIP or enter data manually.`)

  const tables = json.data[geoId]
  const release = json.release?.name ?? 'ACS 5-Year'

  // Flatten all table estimates into a single object keyed by variable code
  const flat = {}
  Object.values(tables).forEach(table => {
    Object.entries(table.estimate ?? {}).forEach(([k, v]) => {
      flat[k] = cleanNum(v)
    })
  })

  // Map to friendly names
  const raw = {}
  Object.entries(VAR_MAP).forEach(([code, name]) => {
    raw[name] = flat[code] ?? null
  })

  // ── Derived metrics ────────────────────────────────────────────────────────

  // Renter %
  const totalOccupied = (raw.ownerOccupied ?? 0) + (raw.renterOccupied ?? 0)
  const renterPct = totalOccupied > 0 ? (raw.renterOccupied / totalOccupied) * 100 : null

  // Multifamily % (5+ unit structures)
  const hu = raw.totalHousingUnits ?? 1
  const multifamilyUnits = (raw.units5to9 ?? 0) + (raw.units10to19 ?? 0) +
    (raw.units20to49 ?? 0) + (raw.units50plus ?? 0)
  const multifamilyPct = hu > 0 ? (multifamilyUnits / hu) * 100 : null
  const singleFamilyPct = hu > 0
    ? (((raw.units1DetachedSF ?? 0) + (raw.units1AttachedSF ?? 0)) / hu) * 100 : null

  // Household mobility: % of householders who moved in past year
  // B07013: total(001) - same house(004) = movers
  const totalMobilityHH = raw.mobilityHouseholders ?? 0
  const sameHouseHH = raw.samHouseHH ?? 0
  const movedHH = totalMobilityHH - sameHouseHH
  const mobilityPct = totalMobilityHH > 0 ? (movedHH / totalMobilityHH) * 100 : null

  // Vehicle ownership
  const vehHH = raw.vehicleHouseholds ?? 1
  const noVehiclePct = vehHH > 0 ? ((raw.noVehicle ?? 0) / vehHH) * 100 : null
  const multiVehiclePct = vehHH > 0
    ? (((raw.threeVehicle ?? 0) + (raw.fourPlusVehicle ?? 0)) / vehHH) * 100 : null

  return {
    zip,
    release,
    geoId,
    // Key figures
    totalPopulation: raw.totalPopulation,
    totalHouseholds: raw.totalHouseholds,
    medianIncome: raw.medianIncome,
    totalHousingUnits: raw.totalHousingUnits,
    // Derived
    renterPct,
    multifamilyPct,
    singleFamilyPct,
    multifamilyUnits,
    mobilityPct,
    noVehiclePct,
    multiVehiclePct,
    // Growth: Census Reporter only serves latest vintage — must be entered manually
    populationGrowthPct: null,
    householdGrowthPct: null,
    // Raw for debugging
    _raw: raw,
  }
}

export function isValidZip(zip) {
  return /^\d{5}$/.test(zip?.toString()?.trim())
}
