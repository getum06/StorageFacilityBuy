import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Printer, FileText, Camera, CheckCircle } from 'lucide-react'

function downloadCSV(formData, metrics) {
  const rows = [
    ['Property Name', formData.propertyName],
    ['Location', formData.location],
    ['Purchase Price', formData.purchasePrice],
    ['Total Units', formData.totalUnits],
    ['Total SqFt', formData.totalSqFt],
    ['Physical Occupancy %', formData.physicalOccupancy],
    ['Economic Occupancy %', formData.economicOccupancy],
    ['Gross Revenue', formData.grossRevenue],
    ['Effective Gross Revenue', Math.round(metrics.egr)],
    ['Total Expenses', Math.round(metrics.totalExpenses)],
    ['NOI', Math.round(metrics.noi)],
    ['Cap Rate %', metrics.capRate.toFixed(2)],
    ['Loan Amount', Math.round(metrics.loanAmount)],
    ['Annual Debt Service', Math.round(metrics.annualDebtService)],
    ['DSCR', metrics.dscr.toFixed(2)],
    ['Cash Flow', Math.round(metrics.cashFlow)],
    ['Cash-on-Cash %', metrics.cashOnCash.toFixed(1)],
    ['Weighted Investment Score', metrics.scores.weightedScore.toFixed(1)],
    ['LTV %', formData.loanLtv],
    ['Interest Rate %', formData.interestRate],
    ['Amortization Years', formData.amortizationYears],
    ['Population Growth %', formData.populationGrowth],
    ['SqFt Per Capita', formData.sqFtPerCapita],
    ['Competitor Count', formData.competitorCount],
    ['Market Occupancy %', formData.marketOccupancy],
    ['Expansion Potential', formData.expansionPotential ? 'Yes' : 'No'],
    ['CapEx Estimate', formData.capexEstimate],
  ]

  const csv = rows.map(r => `"${r[0]}","${r[1]}"`).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${formData.propertyName.replace(/\s+/g, '_')}_analysis.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadJSON(formData, metrics) {
  const data = { inputs: formData, calculatedMetrics: { ...metrics, scores: metrics.scores } }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${formData.propertyName.replace(/\s+/g, '_')}_analysis.json`
  a.click()
  URL.revokeObjectURL(url)
}

const exportOptions = [
  {
    icon: Printer,
    title: 'Print Report',
    description: 'Send to printer or save as PDF via browser print dialog',
    action: () => window.print(),
    color: 'bg-blue-500',
    label: 'Print',
  },
  {
    icon: FileText,
    title: 'Export CSV',
    description: 'Download all inputs and calculated metrics in spreadsheet format',
    action: 'csv',
    color: 'bg-sage-500',
    label: 'Download CSV',
  },
  {
    icon: Download,
    title: 'Export JSON',
    description: 'Download full analysis data in JSON format for integration',
    action: 'json',
    color: 'bg-purple-500',
    label: 'Download JSON',
  },
]

export default function ExportPanel({ formData, metrics }) {
  const [downloaded, setDownloaded] = useState({})

  const handleAction = (opt) => {
    if (opt.action === 'csv') {
      downloadCSV(formData, metrics)
    } else if (opt.action === 'json') {
      downloadJSON(formData, metrics)
    } else if (typeof opt.action === 'function') {
      opt.action()
    }
    setDownloaded(prev => ({ ...prev, [opt.title]: true }))
    setTimeout(() => setDownloaded(prev => ({ ...prev, [opt.title]: false })), 3000)
  }

  const recommendation = metrics.scores.weightedScore >= 75 ? 'STRONG BUY' :
    metrics.scores.weightedScore >= 60 ? 'MODERATE OPPORTUNITY' :
    metrics.scores.weightedScore >= 45 ? 'HIGH RISK' : 'REJECT'

  return (
    <div className="space-y-5">
      {/* Summary for export */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-6"
        id="export-summary"
      >
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white">{formData.propertyName}</h2>
            <p className="text-gray-500 dark:text-navy-400">{formData.location}</p>
          </div>
          <div className={`px-5 py-3 rounded-xl text-white text-center ${
            recommendation === 'STRONG BUY' ? 'bg-sage-500' :
            recommendation === 'MODERATE OPPORTUNITY' ? 'bg-blue-600' :
            recommendation === 'HIGH RISK' ? 'bg-yellow-500' : 'bg-red-600'
          }`}>
            <div className="text-xs font-semibold opacity-80 mb-0.5">Recommendation</div>
            <div className="font-bold text-lg">{recommendation}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Purchase Price', value: `$${formData.purchasePrice.toLocaleString()}` },
            { label: 'Net Operating Income', value: `$${Math.round(metrics.noi).toLocaleString()}` },
            { label: 'Cap Rate', value: `${metrics.capRate.toFixed(2)}%` },
            { label: 'DSCR', value: `${metrics.dscr.toFixed(2)}x` },
            { label: 'Cash-on-Cash Return', value: `${metrics.cashOnCash.toFixed(1)}%` },
            { label: 'Physical Occupancy', value: `${formData.physicalOccupancy}%` },
            { label: 'Weighted Score', value: `${metrics.scores.weightedScore.toFixed(1)}/100` },
            { label: 'Annual Cash Flow', value: `$${Math.round(metrics.cashFlow).toLocaleString()}` },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 dark:bg-navy-900 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-navy-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-navy-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-700">
                <th className="text-left py-2 text-gray-500 dark:text-navy-400 font-semibold text-xs uppercase tracking-wider">Line Item</th>
                <th className="text-right py-2 text-gray-500 dark:text-navy-400 font-semibold text-xs uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-navy-700">
              {[
                { item: 'Gross Revenue', value: `$${formData.grossRevenue.toLocaleString()}`, indent: false },
                { item: 'Effective Gross Revenue', value: `$${Math.round(metrics.egr).toLocaleString()}`, indent: true },
                { item: 'Property Tax', value: `-$${formData.propertyTax.toLocaleString()}`, indent: true, neg: true },
                { item: 'Insurance', value: `-$${formData.insurance.toLocaleString()}`, indent: true, neg: true },
                { item: 'Payroll', value: `-$${formData.payroll.toLocaleString()}`, indent: true, neg: true },
                { item: 'Utilities', value: `-$${formData.utilities.toLocaleString()}`, indent: true, neg: true },
                { item: 'Maintenance', value: `-$${formData.maintenance.toLocaleString()}`, indent: true, neg: true },
                { item: 'Marketing', value: `-$${formData.marketing.toLocaleString()}`, indent: true, neg: true },
                { item: 'Management Fee', value: `-$${Math.round(metrics.mgmtFee).toLocaleString()}`, indent: true, neg: true },
                { item: 'Other / Reserves', value: `-$${(formData.otherExpenses + formData.reserves).toLocaleString()}`, indent: true, neg: true },
                { item: 'NET OPERATING INCOME', value: `$${Math.round(metrics.noi).toLocaleString()}`, bold: true, highlight: true },
                { item: 'Annual Debt Service', value: `-$${Math.round(metrics.annualDebtService).toLocaleString()}`, neg: true },
                { item: 'NET CASH FLOW', value: `$${Math.round(metrics.cashFlow).toLocaleString()}`, bold: true, highlight: true },
              ].map((row, i) => (
                <tr key={i} className={row.highlight ? 'bg-sage-50 dark:bg-sage-500/10' : ''}>
                  <td className={`py-2.5 ${row.indent ? 'pl-4' : ''} ${row.bold ? 'font-bold text-navy-900 dark:text-white' : 'text-gray-600 dark:text-navy-300'}`}>
                    {row.item}
                  </td>
                  <td className={`py-2.5 text-right font-mono ${row.bold ? 'font-bold' : ''} ${row.highlight ? 'text-sage-600 dark:text-sage-400' : row.neg ? 'text-red-500' : 'text-navy-900 dark:text-white'}`}>
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Export Options */}
      <div className="grid md:grid-cols-3 gap-4">
        {exportOptions.map((opt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5"
          >
            <div className={`w-10 h-10 ${opt.color} rounded-xl flex items-center justify-center mb-3`}>
              <opt.icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-semibold text-navy-900 dark:text-white mb-1">{opt.title}</h4>
            <p className="text-sm text-gray-500 dark:text-navy-400 mb-4 leading-relaxed">{opt.description}</p>
            <button
              onClick={() => handleAction(opt)}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                downloaded[opt.title]
                  ? 'bg-sage-500 text-white'
                  : `${opt.color} text-white hover:opacity-90`
              }`}
            >
              {downloaded[opt.title] ? (
                <><CheckCircle className="w-4 h-4" /> Done!</>
              ) : (
                <><opt.icon className="w-4 h-4" /> {opt.label}</>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 dark:bg-navy-900/50 rounded-xl border border-gray-200 dark:border-navy-700 p-4 text-xs text-gray-500 dark:text-navy-400"
      >
        <p><strong>Disclaimer:</strong> This analysis is generated from user-provided inputs and is for informational and planning purposes only. It does not constitute investment advice. All projections are estimates and actual results may vary materially. Consult with qualified financial advisors, legal counsel, and due diligence professionals before making any investment decisions.</p>
      </motion.div>
    </div>
  )
}
