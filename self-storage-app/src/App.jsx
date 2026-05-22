import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Presentation, Moon, Sun, Menu, X } from 'lucide-react'
import PresentationMode from './components/presentation/PresentationMode'
import DashboardMode from './components/dashboard/DashboardMode'

export default function App() {
  const [mode, setMode] = useState('presentation')
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900 dark:bg-navy-950 border-b border-navy-700 shadow-lg">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sage-500 rounded-md flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm leading-tight">StorageIQ</div>
                  <div className="text-navy-300 text-xs">Acquisition Intelligence</div>
                </div>
              </div>

              {/* Desktop Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-navy-800 rounded-lg p-1">
                <button
                  onClick={() => setMode('presentation')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === 'presentation'
                      ? 'bg-white text-navy-900'
                      : 'text-navy-300 hover:text-white'
                  }`}
                >
                  <Presentation className="w-4 h-4" />
                  Presentation
                </button>
                <button
                  onClick={() => setMode('dashboard')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === 'dashboard'
                      ? 'bg-white text-navy-900'
                      : 'text-navy-300 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </button>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-navy-300 hover:text-white transition-colors duration-200"
                  title="Toggle dark mode"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-navy-300 hover:text-white"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-navy-700 bg-navy-900 overflow-hidden"
              >
                <div className="px-4 py-3 flex flex-col gap-2">
                  <button
                    onClick={() => { setMode('presentation'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                      mode === 'presentation' ? 'bg-white text-navy-900' : 'text-navy-300'
                    }`}
                  >
                    <Presentation className="w-4 h-4" />
                    Presentation Mode
                  </button>
                  <button
                    onClick={() => { setMode('dashboard'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                      mode === 'dashboard' ? 'bg-white text-navy-900' : 'text-navy-300'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard Mode
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content */}
        <div className="pt-14">
          <AnimatePresence mode="wait">
            {mode === 'presentation' ? (
              <motion.div
                key="presentation"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PresentationMode />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardMode />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
