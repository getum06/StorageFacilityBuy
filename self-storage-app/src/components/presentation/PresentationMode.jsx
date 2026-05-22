import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import Slide01_Title from './slides/Slide01_Title'
import Slide02_InvestmentThesis from './slides/Slide02_InvestmentThesis'
import Slide03_MarketFundamentals from './slides/Slide03_MarketFundamentals'
import Slide04_SupplyCompetition from './slides/Slide04_SupplyCompetition'
import Slide05_OccupancyRevenue from './slides/Slide05_OccupancyRevenue'
import Slide06_RevenueOptimization from './slides/Slide06_RevenueOptimization'
import Slide07_ExpenseStructure from './slides/Slide07_ExpenseStructure'
import Slide08_NOIFinancing from './slides/Slide08_NOIFinancing'
import Slide09_Infrastructure from './slides/Slide09_Infrastructure'
import Slide10_IdealVsDangerous from './slides/Slide10_IdealVsDangerous'
import Slide11_AcquisitionScorecard from './slides/Slide11_AcquisitionScorecard'
import Slide12_FinalRecommendation from './slides/Slide12_FinalRecommendation'

const slides = [
  { id: 1, title: 'Title', component: Slide01_Title },
  { id: 2, title: 'Investment Thesis', component: Slide02_InvestmentThesis },
  { id: 3, title: 'Market Fundamentals', component: Slide03_MarketFundamentals },
  { id: 4, title: 'Supply & Competition', component: Slide04_SupplyCompetition },
  { id: 5, title: 'Occupancy & Revenue', component: Slide05_OccupancyRevenue },
  { id: 6, title: 'Revenue Optimization', component: Slide06_RevenueOptimization },
  { id: 7, title: 'Expense Structure', component: Slide07_ExpenseStructure },
  { id: 8, title: 'NOI & Financing', component: Slide08_NOIFinancing },
  { id: 9, title: 'Infrastructure & CapEx', component: Slide09_Infrastructure },
  { id: 10, title: 'Ideal vs Dangerous', component: Slide10_IdealVsDangerous },
  { id: 11, title: 'Acquisition Scorecard', component: Slide11_AcquisitionScorecard },
  { id: 12, title: 'Recommendation', component: Slide12_FinalRecommendation },
]

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (direction) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function PresentationMode() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showOverview, setShowOverview] = useState(false)

  const goToSlide = useCallback((index) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
    setShowOverview(false)
  }, [currentSlide])

  const prev = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(c => c - 1)
    }
  }

  const next = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(c => c + 1)
    }
  }

  const CurrentSlideComponent = slides[currentSlide].component

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-gray-100 dark:bg-navy-950 flex flex-col">
      {/* Slide Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Bar */}
      <div className="sticky bottom-0 bg-navy-900 border-t border-navy-700 px-4 py-3 no-print z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Prev */}
          <button
            onClick={prev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 text-navy-200 hover:text-white hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Slide counter + dots */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOverview(!showOverview)}
              className="p-2 text-navy-300 hover:text-white transition-colors"
              title="Slide overview"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === currentSlide
                      ? 'w-6 h-2 bg-sage-400'
                      : 'w-2 h-2 bg-navy-600 hover:bg-navy-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-navy-400 text-xs font-mono">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>

          {/* Next */}
          <button
            onClick={next}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 text-navy-200 hover:text-white hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Overview Modal */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowOverview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-navy-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-white font-semibold text-lg mb-4">Slide Overview</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slides.map((slide, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`aspect-[4/3] rounded-lg flex flex-col items-center justify-center p-2 border-2 transition-all text-center ${
                      i === currentSlide
                        ? 'border-sage-400 bg-sage-500/10'
                        : 'border-navy-700 bg-navy-800 hover:border-navy-500'
                    }`}
                  >
                    <span className={`text-2xl font-bold mb-1 ${i === currentSlide ? 'text-sage-400' : 'text-navy-400'}`}>
                      {i + 1}
                    </span>
                    <span className="text-navy-300 text-[10px] leading-tight">{slide.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
