// DFW Northgate Self-Storage — Mock Acquisition Data
export const mockAcquisition = {
  name: "DFW Northgate Self-Storage",
  location: "Fort Worth, TX 76120",
  description: "124-unit facility on 2.4 acres near Alliance corridor growth market",
  yearBuilt: 2004,
  totalUnits: 320,
  totalSqFt: 38400,
  purchasePrice: 4200000,
  expansionPotential: true,
  expansionSqFt: 8000,

  // Occupancy
  physicalOccupancy: 87,
  economicOccupancy: 82,
  delinquencyRate: 3.2,
  moveInTrend: [78, 80, 82, 85, 87, 89, 87],
  moveOutTrend: [22, 20, 18, 15, 13, 11, 13],

  // Revenue
  grossRevenue: 612000,
  effectiveGrossRevenue: 574000,
  avgRentPerUnit: 159,
  streetRate: 172,
  discountRate: 7.5,

  revenueByMonth: [
    { month: 'Jan', revenue: 44200 },
    { month: 'Feb', revenue: 43800 },
    { month: 'Mar', revenue: 46500 },
    { month: 'Apr', revenue: 48200 },
    { month: 'May', revenue: 51000 },
    { month: 'Jun', revenue: 52400 },
    { month: 'Jul', revenue: 53100 },
    { month: 'Aug', revenue: 51800 },
    { month: 'Sep', revenue: 50200 },
    { month: 'Oct', revenue: 48600 },
    { month: 'Nov', revenue: 45100 },
    { month: 'Dec', revenue: 43100 },
  ],

  // Expenses
  operatingExpenses: {
    propertyTax: 52000,
    insurance: 18000,
    payroll: 48000,
    utilities: 22000,
    maintenance: 18000,
    marketing: 12000,
    software: 8400,
    management: 34440,
    reserves: 9600,
    other: 15000,
    total: 237440,
  },

  noi: 336560,

  // Debt
  debt: {
    ltv: 70,
    loanAmount: 2940000,
    interestRate: 6.75,
    amortization: 25,
    annualDebtService: 243000,
    dscr: 1.39,
    monthlyPayment: 20250,
  },

  // Market
  market: {
    populationGrowth: 2.8,
    householdGrowth: 3.1,
    medianIncome: 72400,
    apartmentDensity: 38,
    smallBusinessDensity: 12.4,
    employmentGrowth: 3.4,
    residentialTurnover: 18,
    sqFtPerCapita: 7.2,
    competitorCount: 4,
    marketOccupancy: 89,
    newPipelineSqFt: 0,
    reitPresence: false,
    pricePerSqFt: 15.9,
    marketRent: 165,
  },

  // Risk Scores (0-100)
  riskScores: {
    marketAttractiveness: 85,
    occupancyQuality: 78,
    noiQuality: 82,
    competitionRisk: 75,
    expansionPotential: 70,
    infrastructureQuality: 65,
    financingViability: 88,
    managementComplexity: 80,
  },

  // Infrastructure
  infrastructure: {
    roofAge: 8,
    asphaltCondition: 'Good',
    drainage: 'Adequate',
    securitySystem: 'Keypad + cameras',
    lighting: 'LED upgraded 2022',
    climateControl: '42 units',
    deferredMaintenance: 85000,
    capexReserveAnnual: 28000,
  },

  // Revenue optimization upside
  revenueOpportunities: [
    { item: 'Rate Increase to Market (8%)', annualUplift: 45900 },
    { item: 'Insurance Revenue Program', annualUplift: 12800 },
    { item: 'Admin Fee Implementation', annualUplift: 6400 },
    { item: 'Late Fee Optimization', annualUplift: 4200 },
    { item: 'Digital Marketing Improvement', annualUplift: 18000 },
    { item: 'Occupancy to 93%', annualUplift: 22000 },
  ],
};

// Expense breakdown for waterfall chart
export const expenseWaterfall = [
  { name: 'Gross Revenue', value: 612000, type: 'total' },
  { name: 'Vacancy Loss', value: -38000, type: 'negative' },
  { name: 'EGR', value: 574000, type: 'subtotal' },
  { name: 'Prop Tax', value: -52000, type: 'negative' },
  { name: 'Insurance', value: -18000, type: 'negative' },
  { name: 'Payroll', value: -48000, type: 'negative' },
  { name: 'Utilities', value: -22000, type: 'negative' },
  { name: 'Maintenance', value: -18000, type: 'negative' },
  { name: 'Marketing', value: -12000, type: 'negative' },
  { name: 'Mgmt Fee', value: -34440, type: 'negative' },
  { name: 'Other', value: -33000, type: 'negative' },
  { name: 'NOI', value: 336560, type: 'result' },
];

export const unitMixData = [
  { type: '5x5', units: 40, sqft: 25, rent: 79, occupancy: 95 },
  { type: '5x10', units: 80, sqft: 50, rent: 109, occupancy: 92 },
  { type: '10x10', units: 80, sqft: 100, rent: 149, occupancy: 88 },
  { type: '10x15', units: 60, sqft: 150, rent: 179, occupancy: 85 },
  { type: '10x20', units: 40, sqft: 200, rent: 219, occupancy: 80 },
  { type: '10x30', units: 20, sqft: 300, rent: 289, occupancy: 75 },
];

export const sensitivityData = {
  capRates: [6.5, 7.0, 7.5, 8.0, 8.5, 9.0],
  noiLevels: [290000, 310000, 336560, 360000, 385000, 410000],
  values: [
    [4461538, 4153846, 3876000, 3625000, 3412000, 3222222],
    [4769231, 4428571, 4154667, 3875000, 3647059, 3444444],
    [5177143, 4771429, 4487467, 4200000, 3941176, 3722222],
    [5538462, 5142857, 4820800, 4500000, 4235294, 4000000],
    [5923077, 5514286, 5154133, 4812500, 4529412, 4277778],
    [6307692, 5885714, 5487467, 5125000, 4823529, 4555556],
  ],
};

export const marketComparables = [
  { name: 'Competitor A (Public Storage)', sqFt: 52000, units: 420, occupancy: 91, ratePerSqFt: 18.5, distance: '0.8mi' },
  { name: 'Competitor B (CubeSmart)', sqFt: 44000, units: 360, occupancy: 88, ratePerSqFt: 17.2, distance: '1.4mi' },
  { name: 'Competitor C (Local)', sqFt: 28000, units: 210, occupancy: 83, ratePerSqFt: 14.8, distance: '2.1mi' },
  { name: 'Competitor D (Local)', sqFt: 18000, units: 140, occupancy: 79, ratePerSqFt: 13.5, distance: '3.2mi' },
  { name: 'Subject Property', sqFt: 38400, units: 320, occupancy: 87, ratePerSqFt: 15.9, distance: '-' },
];
