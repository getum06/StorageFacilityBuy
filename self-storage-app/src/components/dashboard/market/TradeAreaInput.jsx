import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { geocodeAddress, isValidZip } from './CensusAPI'

const RADIUS_OPTIONS = [
  { value: 1, label: '1 Mile', desc: 'Immediate neighborhood' },
  { value: 3, label: '3 Miles', desc: 'Primary trade area' },
  { value: 5, label: '5 Miles', desc: 'Extended trade area' },
]

export default function TradeAreaInput({ inputs, onInputChange, onFetch, loading, fetchError, lastFetched, usingDemo }) {
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState(null)

  const handleGeocode = async () => {
    if (!inputs.address && !inputs.zip) return
    setGeocoding(true)
    setGeocodeError(null)
    try {
      const result = await geocodeAddress(inputs.address, inputs.city, inputs.state, inputs.zip)
      onInputChange('lat', result.lat.toFixed(6))
      onInputChange('lng', result.lng.toFixed(6))
    } catch (e) {
      setGeocodeError(e.message)
    } finally {
      setGeocoding(false)
    }
  }

  const canFetch = isValidZip(inputs.zip)

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100 dark:border-navy-700">
        <div className="w-7 h-7 bg-navy-900 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-sage-400" />
        </div>
        <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wide">Trade Area Definition</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">Property Address</label>
          <input
            type="text"
            value={inputs.address}
            onChange={e => onInputChange('address', e.target.value)}
            placeholder="123 Main St"
            className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2.5 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-sage-400 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">City</label>
          <input
            type="text"
            value={inputs.city}
            onChange={e => onInputChange('city', e.target.value)}
            placeholder="Fort Worth"
            className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2.5 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-sage-400 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">State</label>
          <input
            type="text"
            value={inputs.state}
            onChange={e => onInputChange('state', e.target.value)}
            placeholder="TX"
            maxLength={2}
            className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2.5 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-sage-400 focus:border-transparent outline-none uppercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">
            ZIP Code <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={inputs.zip}
            onChange={e => onInputChange('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="76120"
            maxLength={5}
            className={`w-full bg-gray-50 dark:bg-navy-900 border rounded-lg px-3 py-2.5 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-sage-400 focus:border-transparent outline-none font-mono ${
              inputs.zip && !isValidZip(inputs.zip)
                ? 'border-red-300 dark:border-red-500'
                : 'border-gray-200 dark:border-navy-600'
            }`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">Latitude (opt)</label>
          <input
            type="text"
            value={inputs.lat}
            onChange={e => onInputChange('lat', e.target.value)}
            placeholder="32.7767"
            className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2.5 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-sage-400 focus:border-transparent outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">Longitude (opt)</label>
          <input
            type="text"
            value={inputs.lng}
            onChange={e => onInputChange('lng', e.target.value)}
            placeholder="-97.2920"
            className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2.5 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-sage-400 focus:border-transparent outline-none font-mono"
          />
        </div>
        <div className="flex flex-col justify-end">
          <button
            onClick={handleGeocode}
            disabled={geocoding || (!inputs.address && !inputs.zip)}
            className="h-[42px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-navy-800 dark:bg-navy-900 text-navy-200 hover:text-white border border-navy-700 text-sm font-medium disabled:opacity-40 transition-all"
          >
            {geocoding ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            Geocode
          </button>
        </div>
      </div>

      {geocodeError && (
        <div className="mb-4 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2 border border-red-200 dark:border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {geocodeError}
        </div>
      )}

      {/* Trade Area Radius */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-2">Trade Area Radius</label>
        <div className="flex gap-2">
          {RADIUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onInputChange('tradeAreaRadius', opt.value)}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                inputs.tradeAreaRadius === opt.value
                  ? 'bg-sage-500 border-sage-500 text-white'
                  : 'bg-gray-50 dark:bg-navy-900 border-gray-200 dark:border-navy-700 text-gray-600 dark:text-navy-300 hover:border-sage-400'
              }`}
            >
              <div className="font-semibold">{opt.label}</div>
              <div className={`text-xs ${inputs.tradeAreaRadius === opt.value ? 'text-sage-100' : 'text-gray-400 dark:text-navy-500'}`}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Data source note */}
      <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
        <strong>Data source:</strong> U.S. Census ACS 5-Year via CensusReporter.org — no API key required.
        Population growth must be entered manually in "Additional Inputs" below (source: Census Bureau, CoStar, or local market research).
      </div>

      {/* Fetch Button */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onFetch}
          disabled={!canFetch || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white rounded-lg font-semibold text-sm transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Fetching Census Data…' : 'Fetch Census ACS Data'}
        </button>
        {!canFetch && inputs.zip && (
          <span className="text-xs text-red-500">Enter a valid 5-digit ZIP</span>
        )}
        {usingDemo && (
          <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-500/20">
            <Info className="w-3.5 h-3.5" />
            Using estimated DFW demo data — fetch real ACS data with the button above
          </span>
        )}
        {lastFetched && !usingDemo && (
          <span className="flex items-center gap-1.5 text-xs text-sage-600 dark:text-sage-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Fetched for ZIP {inputs.zip} · {new Date(lastFetched).toLocaleTimeString()}
          </span>
        )}
      </div>

      {fetchError && (
        <div className="mt-3 flex items-start gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2.5 border border-red-200 dark:border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-0.5">Census fetch failed</div>
            <div>{fetchError}</div>
            <div className="mt-1 text-gray-500 dark:text-navy-500">Try entering data manually below, or upload a CSV export from Census Reporter.</div>
          </div>
        </div>
      )}
    </div>
  )
}
