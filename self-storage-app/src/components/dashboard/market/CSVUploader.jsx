import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'
import Papa from 'papaparse'

const SOURCE_PROFILES = {
  census: {
    label: 'Census / ACS Export',
    hint: 'Exported from data.census.gov or censusreporter.org',
    fieldMap: {
      'Total Population': 'totalPopulation',
      'Total Households': 'totalHouseholds',
      'Renter-occupied': 'renterOccupied',
      'Owner-occupied': 'ownerOccupied',
      'Median household income': 'medianIncome',
    },
  },
  costar: {
    label: 'CoStar Export',
    hint: 'Self-storage market report CSV',
    fieldMap: {
      'Population': 'totalPopulation',
      'Households': 'totalHouseholds',
      'Renter Occupied HH': 'renterOccupied',
      'Median HH Income': 'medianIncome',
      'Self Storage Facilities': 'competitorCount',
      'Total RBA': 'competitorTotalSqFt',
    },
  },
  radiusplus: {
    label: 'Radius+ / Yardi Matrix',
    hint: 'Trade area report from Radius+ or Yardi Matrix',
    fieldMap: {
      'Pop': 'totalPopulation',
      'HH': 'totalHouseholds',
      'MedInc': 'medianIncome',
      'SFperCap': 'sqFtPerCapita',
    },
  },
  generic: {
    label: 'Generic / Custom CSV',
    hint: 'Any CSV — you map the columns manually below',
    fieldMap: {},
  },
}

const TARGET_FIELDS = [
  { key: 'totalPopulation', label: 'Total Population', type: 'number' },
  { key: 'totalHouseholds', label: 'Total Households', type: 'number' },
  { key: 'renterOccupied', label: 'Renter-Occupied HH', type: 'number' },
  { key: 'ownerOccupied', label: 'Owner-Occupied HH', type: 'number' },
  { key: 'medianIncome', label: 'Median HH Income', type: 'number' },
  { key: 'renterPct', label: 'Renter % (override)', type: 'number' },
  { key: 'multifamilyPct', label: 'Multifamily % (override)', type: 'number' },
  { key: 'mobilityPct', label: 'Mobility % (override)', type: 'number' },
  { key: 'populationGrowthPct', label: 'Pop Growth %/yr', type: 'number' },
  { key: 'householdGrowthPct', label: 'HH Growth %/yr', type: 'number' },
  { key: 'sqFtPerCapita', label: 'SqFt Per Capita', type: 'number' },
  { key: 'competitorCount', label: 'Competitor Count', type: 'number' },
  { key: 'competitorTotalSqFt', label: 'Competitor Total SqFt', type: 'number' },
]

export default function CSVUploader({ onDataImport }) {
  const fileRef = useRef()
  const [source, setSource] = useState('generic')
  const [showDropzone, setShowDropzone] = useState(false)
  const [file, setFile] = useState(null)
  const [parsed, setParsed] = useState(null)
  const [columnMap, setColumnMap] = useState({})
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (!f || !f.name.endsWith('.csv')) return
    setFile(f)
    setImportResult(null)
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setParsed(result)
        // Auto-apply profile field map
        const profile = SOURCE_PROFILES[source]
        const auto = {}
        if (result.meta?.fields) {
          result.meta.fields.forEach(col => {
            const match = profile.fieldMap[col]
            if (match) auto[match] = col
          })
        }
        setColumnMap(auto)
      },
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const doImport = () => {
    if (!parsed?.data?.length) return
    setImporting(true)
    try {
      const row = parsed.data[0] // Use first data row
      const result = {}
      TARGET_FIELDS.forEach(({ key, type }) => {
        const col = columnMap[key]
        if (col && row[col] !== undefined) {
          const val = type === 'number' ? parseFloat(row[col].toString().replace(/[^0-9.-]/g, '')) : row[col]
          if (!isNaN(val)) result[key] = val
        }
      })
      onDataImport(result)
      setImportResult({ success: true, count: Object.keys(result).length, fields: Object.keys(result) })
    } catch (e) {
      setImportResult({ success: false, error: e.message })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-navy-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-navy-900 rounded-lg flex items-center justify-center">
            <Upload className="w-4 h-4 text-sage-400" />
          </div>
          <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wide">Upload Market Data CSV</h3>
        </div>
        <button
          onClick={() => setShowDropzone(!showDropzone)}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-navy-400 hover:text-navy-700 dark:hover:text-navy-200"
        >
          {showDropzone ? 'Hide' : 'Upload CSV'}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDropzone ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Source badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(SOURCE_PROFILES).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setSource(key)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              source === key
                ? 'bg-sage-500 border-sage-500 text-white'
                : 'bg-gray-50 dark:bg-navy-900 border-gray-200 dark:border-navy-700 text-gray-600 dark:text-navy-300 hover:border-sage-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-400 dark:text-navy-500 mb-4">{SOURCE_PROFILES[source].hint}</div>

      <AnimatePresence>
        {showDropzone && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {/* Dropzone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4 ${
                dragging ? 'border-sage-400 bg-sage-50 dark:bg-sage-500/10' : 'border-gray-300 dark:border-navy-600 hover:border-sage-400 hover:bg-gray-50 dark:hover:bg-navy-750'
              }`}
            >
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <Upload className="w-8 h-8 mx-auto text-gray-300 dark:text-navy-500 mb-2" />
              {file ? (
                <div className="text-sm font-medium text-navy-900 dark:text-white">{file.name}</div>
              ) : (
                <>
                  <div className="text-sm font-medium text-gray-600 dark:text-navy-300">Drop CSV here or click to browse</div>
                  <div className="text-xs text-gray-400 dark:text-navy-500 mt-1">Supports Census, CoStar, Radius+, Yardi, Esri, broker packages</div>
                </>
              )}
            </div>

            {/* Column mapping */}
            {parsed && (
              <div className="space-y-3 mb-4">
                <div className="text-xs font-semibold text-gray-600 dark:text-navy-300 uppercase tracking-wider">
                  Map CSV Columns → Dashboard Fields ({parsed.data.length} rows detected)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {TARGET_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <label className="text-xs text-gray-500 dark:text-navy-400 w-32 flex-shrink-0 truncate" title={label}>{label}</label>
                      <select
                        value={columnMap[key] || ''}
                        onChange={e => setColumnMap(prev => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-2 py-1.5 text-navy-900 dark:text-white text-xs focus:ring-1 focus:ring-sage-400 outline-none"
                      >
                        <option value="">— skip —</option>
                        {parsed.meta.fields?.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <button
                  onClick={doImport}
                  disabled={importing || !Object.values(columnMap).some(Boolean)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white rounded-lg font-semibold text-sm transition-all"
                >
                  <FileText className="w-4 h-4" />
                  {importing ? 'Importing…' : 'Import Mapped Fields'}
                </button>
              </div>
            )}

            {importResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2.5 border ${
                  importResult.success
                    ? 'bg-sage-50 dark:bg-sage-500/10 border-sage-200 dark:border-sage-500/20 text-sage-700 dark:text-sage-400'
                    : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                }`}
              >
                {importResult.success
                  ? <><CheckCircle className="w-4 h-4 flex-shrink-0" /> Imported {importResult.count} fields: {importResult.fields.join(', ')}</>
                  : <><AlertCircle className="w-4 h-4 flex-shrink-0" /> Import failed: {importResult.error}</>
                }
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual override fields (always visible) */}
      <div>
        <div className="text-xs font-semibold text-gray-500 dark:text-navy-400 uppercase tracking-wider mb-3">Manual Override / Additional Inputs</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { key: 'populationGrowthPct', label: 'Pop Growth %/yr', suffix: '%' },
            { key: 'householdGrowthPct', label: 'HH Growth %/yr', suffix: '%' },
            { key: 'renterPct', label: 'Renter %', suffix: '%' },
            { key: 'multifamilyPct', label: 'Multifamily %', suffix: '%' },
            { key: 'mobilityPct', label: 'Mobility %', suffix: '%' },
            { key: 'smallBizDensity', label: 'Small Biz/1K pop', suffix: '' },
            { key: 'newPipelineUnits', label: 'New Pipeline SqFt', suffix: '' },
          ].map(({ key, label, suffix }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 dark:text-navy-400 mb-1">{label}</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg px-2.5 py-2 text-navy-900 dark:text-white text-xs focus:ring-1 focus:ring-sage-400 outline-none pr-7"
                  onChange={e => {
                    const v = parseFloat(e.target.value)
                    if (!isNaN(v)) onDataImport({ [key]: v })
                  }}
                />
                {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{suffix}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
