import { motion } from 'framer-motion'
import { Building2, DollarSign, TrendingUp, Percent, AlertCircle } from 'lucide-react'

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-5">
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100 dark:border-navy-700">
      <div className="w-7 h-7 bg-navy-900 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-sage-400" />
      </div>
      <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wide">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
)

const Field = ({ label, name, value, onChange, type = 'number', prefix, suffix, min, max, step, tooltip, fullWidth }) => (
  <div className={`${fullWidth ? 'sm:col-span-2' : ''}`}>
    <label className="block text-xs font-medium text-gray-600 dark:text-navy-300 mb-1.5">
      {label}
      {tooltip && (
        <span className="ml-1.5 inline-flex items-center" title={tooltip}>
          <AlertCircle className="w-3 h-3 text-gray-400 dark:text-navy-500" />
        </span>
      )}
    </label>
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-navy-400 text-sm font-medium">{prefix}</div>
      )}
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        step={step || (type === 'number' ? 1 : undefined)}
        onChange={e => onChange(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className={`w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-lg py-2.5 text-navy-900 dark:text-white text-sm focus:ring-2 focus:ring-sage-400 focus:border-transparent outline-none transition-all ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-10' : 'pr-3'}`}
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-navy-400 text-sm">{suffix}</div>
      )}
    </div>
  </div>
)

const Toggle = ({ label, name, value, onChange, tooltip }) => (
  <div className="flex items-center justify-between">
    <label className="text-xs font-medium text-gray-600 dark:text-navy-300">
      {label}
      {tooltip && <span className="ml-1.5 text-gray-400" title={tooltip}>ℹ</span>}
    </label>
    <button
      onClick={() => onChange(name, !value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-sage-500' : 'bg-gray-300 dark:bg-navy-600'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
)

export default function AcquisitionForm({ formData, onChange, metrics }) {
  return (
    <div className="space-y-5">
      {/* Live Metrics Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-navy-900 rounded-xl border border-navy-700 p-4"
      >
        <div className="text-navy-400 text-xs mb-3 font-semibold uppercase tracking-wider">Live Calculation Results</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'EGR', value: `$${Math.round(metrics.egr).toLocaleString()}`, color: 'text-white' },
            { label: 'Total Expenses', value: `$${Math.round(metrics.totalExpenses).toLocaleString()}`, color: 'text-red-400' },
            { label: 'NOI', value: `$${Math.round(metrics.noi).toLocaleString()}`, color: 'text-sage-400' },
            { label: 'Cap Rate', value: `${metrics.capRate.toFixed(2)}%`, color: metrics.capRate >= 7 ? 'text-sage-400' : 'text-yellow-400' },
            { label: 'Loan Amt', value: `$${(metrics.loanAmount/1000000).toFixed(2)}M`, color: 'text-white' },
            { label: 'Debt Service', value: `$${Math.round(metrics.annualDebtService).toLocaleString()}`, color: 'text-red-400' },
            { label: 'DSCR', value: `${metrics.dscr.toFixed(2)}x`, color: metrics.dscr >= 1.25 ? 'text-sage-400' : 'text-red-400' },
            { label: 'Cash-on-Cash', value: `${metrics.cashOnCash.toFixed(1)}%`, color: metrics.cashOnCash >= 8 ? 'text-sage-400' : 'text-yellow-400' },
          ].map((s, i) => (
            <div key={i} className="text-center bg-navy-800 rounded-lg px-2 py-2">
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
              <div className="text-navy-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Property Info */}
        <Section title="Property Information" icon={Building2}>
          <Field label="Property Name" name="propertyName" value={formData.propertyName} onChange={onChange} type="text" fullWidth />
          <Field label="Location" name="location" value={formData.location} onChange={onChange} type="text" />
          <Field label="Purchase Price" name="purchasePrice" value={formData.purchasePrice} onChange={onChange} prefix="$" step={10000} tooltip="Total acquisition cost including closing costs" />
          <Field label="Total Units" name="totalUnits" value={formData.totalUnits} onChange={onChange} min={1} />
          <Field label="Total Square Footage" name="totalSqFt" value={formData.totalSqFt} onChange={onChange} suffix="sqft" step={100} />
          <Field label="CapEx Estimate" name="capexEstimate" value={formData.capexEstimate} onChange={onChange} prefix="$" step={5000} tooltip="Total deferred maintenance and capital improvement budget" />
        </Section>

        {/* Revenue & Occupancy */}
        <Section title="Revenue & Occupancy" icon={TrendingUp}>
          <Field label="Gross Revenue (Annual)" name="grossRevenue" value={formData.grossRevenue} onChange={onChange} prefix="$" step={1000} />
          <Field label="Physical Occupancy" name="physicalOccupancy" value={formData.physicalOccupancy} onChange={onChange} suffix="%" min={0} max={100} step={0.5} tooltip="Percentage of units physically occupied" />
          <Field label="Economic Occupancy" name="economicOccupancy" value={formData.economicOccupancy} onChange={onChange} suffix="%" min={0} max={100} step={0.5} tooltip="Revenue collected vs. potential at full occupancy" />
          <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            <Toggle label="Expansion Potential" name="expansionPotential" value={formData.expansionPotential} onChange={onChange} tooltip="Does the property have land or zoning for future expansion?" />
            <Toggle label="Tax Reassessment Risk" name="taxReassessmentRisk" value={formData.taxReassessmentRisk} onChange={onChange} tooltip="Is a significant tax increase likely upon sale?" />
          </div>
        </Section>

        {/* Expenses */}
        <Section title="Operating Expenses (Annual)" icon={DollarSign}>
          <Field label="Property Tax" name="propertyTax" value={formData.propertyTax} onChange={onChange} prefix="$" step={500} />
          <Field label="Insurance" name="insurance" value={formData.insurance} onChange={onChange} prefix="$" step={500} />
          <Field label="Payroll" name="payroll" value={formData.payroll} onChange={onChange} prefix="$" step={500} />
          <Field label="Utilities" name="utilities" value={formData.utilities} onChange={onChange} prefix="$" step={100} />
          <Field label="Maintenance" name="maintenance" value={formData.maintenance} onChange={onChange} prefix="$" step={100} />
          <Field label="Marketing" name="marketing" value={formData.marketing} onChange={onChange} prefix="$" step={100} />
          <Field label="Software/Tech" name="software" value={formData.software} onChange={onChange} prefix="$" step={100} />
          <Field label="Mgmt Fee (% of EGR)" name="managementFeePercent" value={formData.managementFeePercent} onChange={onChange} suffix="%" min={0} max={15} step={0.5} />
          <Field label="Reserves" name="reserves" value={formData.reserves} onChange={onChange} prefix="$" step={500} />
          <Field label="Other Expenses" name="otherExpenses" value={formData.otherExpenses} onChange={onChange} prefix="$" step={500} />
        </Section>

        {/* Debt & Market */}
        <div className="space-y-5">
          <Section title="Debt Assumptions" icon={Percent}>
            <Field label="Loan-to-Value (LTV)" name="loanLtv" value={formData.loanLtv} onChange={onChange} suffix="%" min={0} max={80} step={5} />
            <Field label="Interest Rate" name="interestRate" value={formData.interestRate} onChange={onChange} suffix="%" min={3} max={12} step={0.125} />
            <Field label="Amortization" name="amortizationYears" value={formData.amortizationYears} onChange={onChange} suffix="yrs" min={10} max={30} />
            <div className="sm:col-span-2 bg-navy-900/60 dark:bg-navy-900 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-navy-400">Loan Amount</div>
                  <div className="text-white font-bold">${(metrics.loanAmount/1000000).toFixed(2)}M</div>
                </div>
                <div>
                  <div className="text-navy-400">Monthly Payment</div>
                  <div className="text-white font-bold">${Math.round(metrics.monthlyPayment).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-navy-400">Annual Debt Service</div>
                  <div className="text-white font-bold">${Math.round(metrics.annualDebtService).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-navy-400">Equity Required</div>
                  <div className="text-white font-bold">${(metrics.equity/1000000).toFixed(2)}M</div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Market Inputs" icon={TrendingUp}>
            <Field label="Population Growth (% YoY)" name="populationGrowth" value={formData.populationGrowth} onChange={onChange} suffix="%" min={-2} max={10} step={0.1} />
            <Field label="Sq Ft Per Capita" name="sqFtPerCapita" value={formData.sqFtPerCapita} onChange={onChange} suffix="sf/cap" min={0} max={20} step={0.1} />
            <Field label="Competitor Count (5mi)" name="competitorCount" value={formData.competitorCount} onChange={onChange} min={0} max={20} />
            <Field label="Market Occupancy" name="marketOccupancy" value={formData.marketOccupancy} onChange={onChange} suffix="%" min={50} max={100} step={0.5} />
          </Section>
        </div>
      </div>
    </div>
  )
}
