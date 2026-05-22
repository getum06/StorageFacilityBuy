import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, BarChart3, FileText, ChevronRight } from 'lucide-react'
import AcquisitionForm from './AcquisitionForm'
import DashboardMetrics from './DashboardMetrics'
import RecommendationEngine from './RecommendationEngine'
import ExportPanel from './ExportPanel'
import { mockAcquisition } from '../../data/mockData'

const defaultFormData = {
  propertyName: 'DFW Northgate Self-Storage',
  location: 'Fort Worth, TX',
  purchasePrice: 4200000,
  totalUnits: 320,
  totalSqFt: 38400,
  physicalOccupancy: 87,
  economicOccupancy: 82,
  grossRevenue: 612000,
  propertyTax: 52000,
  insurance: 18000,
  payroll: 48000,
  utilities: 22000,
  maintenance: 18000,
  marketing: 12000,
  software: 8400,
  managementFeePercent: 6,
  otherExpenses: 15000,
  reserves: 9600,
  loanLtv: 70,
  interestRate: 6.75,
  amortizationYears: 25,
  populationGrowth: 2.8,
  sqFtPerCapita: 7.2,
  competitorCount: 4,
  marketOccupancy: 89,
  expansionPotential: true,
  capexEstimate: 112000,
  taxReassessmentRisk: false,
}

const tabs = [
  { id: 'form', label: 'Input', icon: Calculator },
  { id: 'metrics', label: 'Analysis', icon: BarChart3 },
  { id: 'recommendation', label: 'Decision', icon: ChevronRight },
  { id: 'export', label: 'Export', icon: FileText },
]

function computeMetrics(form) {
  const egr = form.grossRevenue * (form.economicOccupancy / form.physicalOccupancy)
  const mgmtFee = egr * (form.managementFeePercent / 100)
  const totalExpenses = form.propertyTax + form.insurance + form.payroll + form.utilities +
    form.maintenance + form.marketing + form.software + mgmtFee + form.otherExpenses + form.reserves
  const noi = egr - totalExpenses
  const capRate = (noi / form.purchasePrice) * 100
  const loanAmount = form.purchasePrice * (form.loanLtv / 100)
  const equity = form.purchasePrice - loanAmount
  const monthlyRate = form.interestRate / 100 / 12
  const nPayments = form.amortizationYears * 12
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, nPayments)) / (Math.pow(1 + monthlyRate, nPayments) - 1)
  const annualDebtService = monthlyPayment * 12
  const dscr = noi / annualDebtService
  const cashFlow = noi - annualDebtService
  const cashOnCash = (cashFlow / equity) * 100
  const noiBankMargin = (noi / egr) * 100
  const expenseRatio = (totalExpenses / egr) * 100

  // Risk scoring
  const marketScore = Math.min(100, 50 + form.populationGrowth * 10 + (form.sqFtPerCapita < 8 ? 20 : 0) + (form.marketOccupancy - 80))
  const occupancyScore = Math.min(100, form.physicalOccupancy * 0.6 + form.economicOccupancy * 0.4 + (form.physicalOccupancy - form.economicOccupancy < 10 ? 10 : -10))
  const noiScore = Math.min(100, Math.max(0, (capRate - 5) * 20 + 30 + (noiBankMargin > 50 ? 15 : 0)))
  const competitionScore = Math.min(100, 100 - form.competitorCount * 8 + (form.sqFtPerCapita < 8 ? 15 : -10))
  const expansionScore = form.expansionPotential ? 80 : 40
  const infraScore = Math.min(100, Math.max(20, 100 - (form.capexEstimate / form.purchasePrice) * 200))
  const finScore = Math.min(100, dscr >= 1.5 ? 95 : dscr >= 1.25 ? 80 : dscr >= 1.1 ? 60 : 30)
  const mgmtScore = 75

  const weights = { market: 20, occupancy: 18, noi: 18, competition: 12, expansion: 10, infra: 10, fin: 8, mgmt: 4 }
  const weightedScore = (
    marketScore * weights.market +
    occupancyScore * weights.occupancy +
    noiScore * weights.noi +
    competitionScore * weights.competition +
    expansionScore * weights.expansion +
    infraScore * weights.infra +
    finScore * weights.fin +
    mgmtScore * weights.mgmt
  ) / 100

  return {
    egr, mgmtFee, totalExpenses, noi, capRate, loanAmount, equity,
    monthlyPayment, annualDebtService, dscr, cashFlow, cashOnCash,
    noiBankMargin, expenseRatio,
    scores: { marketScore, occupancyScore, noiScore, competitionScore, expansionScore, infraScore, finScore, mgmtScore, weightedScore },
  }
}

export default function DashboardMode() {
  const [formData, setFormData] = useState(defaultFormData)
  const [activeTab, setActiveTab] = useState('form')

  const metrics = computeMetrics(formData)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 dark:bg-navy-950">
      {/* Dashboard Header */}
      <div className="bg-navy-900 border-b border-navy-700 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-white font-bold text-lg">{formData.propertyName || 'Acquisition Dashboard'}</div>
            <div className="text-navy-400 text-sm">{formData.location || 'Interactive Evaluation Tool'}</div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { label: 'Cap Rate', value: `${metrics.capRate.toFixed(2)}%`, color: metrics.capRate >= 7 ? 'text-sage-400' : 'text-yellow-400' },
              { label: 'DSCR', value: metrics.dscr.toFixed(2), color: metrics.dscr >= 1.25 ? 'text-sage-400' : 'text-red-400' },
              { label: 'NOI', value: `$${Math.round(metrics.noi).toLocaleString()}`, color: 'text-white' },
              { label: 'Score', value: `${metrics.scores.weightedScore.toFixed(0)}/100`, color: metrics.scores.weightedScore >= 75 ? 'text-sage-400' : metrics.scores.weightedScore >= 60 ? 'text-yellow-400' : 'text-red-400' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-navy-800 rounded-lg px-3 py-2">
                <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                <div className="text-navy-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700 sticky top-14 z-30">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-sage-500 text-sage-600 dark:text-sage-400'
                    : 'border-transparent text-gray-500 dark:text-navy-400 hover:text-gray-700 dark:hover:text-navy-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'form' && (
            <AcquisitionForm formData={formData} onChange={handleChange} metrics={metrics} />
          )}
          {activeTab === 'metrics' && (
            <DashboardMetrics formData={formData} metrics={metrics} />
          )}
          {activeTab === 'recommendation' && (
            <RecommendationEngine formData={formData} metrics={metrics} />
          )}
          {activeTab === 'export' && (
            <ExportPanel formData={formData} metrics={metrics} />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export { computeMetrics }
