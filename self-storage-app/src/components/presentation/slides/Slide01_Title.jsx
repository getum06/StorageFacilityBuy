import { motion } from 'framer-motion'
import { Building2, TrendingUp, Shield, ChevronRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Slide01_Title() {
  return (
    <div className="min-h-[calc(100vh-112px)] relative overflow-hidden bg-navy-900">
      {/* Background geometric pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sage-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy-400 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Storage facility silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-5"
        style={{
          background: 'repeating-linear-gradient(90deg, #fff 0px, #fff 80px, transparent 80px, transparent 90px)',
          maskImage: 'linear-gradient(transparent, rgba(0,0,0,0.4) 60%)'
        }}
      />

      <div className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-112px)] max-w-6xl mx-auto px-8 md:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Main content */}
          <div>
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 max-w-[60px] bg-sage-400" />
              <span className="text-sage-400 text-sm font-semibold uppercase tracking-widest">
                Investment Framework
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight mb-6">
              Self-Storage
              <span className="block text-sage-400">Acquisition</span>
              <span className="block">Evaluation</span>
              <span className="block text-3xl md:text-4xl font-light text-navy-300 mt-1">Framework</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-navy-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Investment Evaluation & Operational Due Diligence for Institutional-Grade Self-Storage Acquisitions
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {['Market Analysis', 'Financial Modeling', 'Risk Scoring', 'Decision Framework'].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-800 border border-navy-600 text-navy-300 text-sm">
                  <ChevronRight className="w-3 h-3 text-sage-400" />
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Stats cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            {[
              { icon: Building2, label: 'Asset Class', value: 'Self-Storage', sub: 'CRE Alternative', color: 'bg-sage-500' },
              { icon: TrendingUp, label: 'Target Returns', value: '12–18%', sub: 'Cash-on-Cash', color: 'bg-navy-600' },
              { icon: Shield, label: 'Strategy', value: 'Value-Add', sub: 'Operational Upside', color: 'bg-navy-600' },
              { icon: Building2, label: 'Hold Period', value: '5–7 Yrs', sub: 'With Exit Options', color: 'bg-sage-500' },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-navy-800/60 backdrop-blur border border-navy-700 rounded-xl p-5 hover:border-navy-500 transition-all duration-300 group"
              >
                <div className={`w-9 h-9 ${card.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs text-navy-400 uppercase tracking-wider mb-1">{card.label}</div>
                <div className="text-xl font-bold text-white mb-0.5">{card.value}</div>
                <div className="text-xs text-navy-400">{card.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom footer */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-6 left-0 right-0 px-8 md:px-16 flex items-center justify-between"
        >
          <div className="text-navy-500 text-xs">Confidential — For Investment Partnership Use Only</div>
          <div className="text-navy-500 text-xs">© 2025 StorageIQ | Slide 1 of 12</div>
        </motion.div>
      </div>
    </div>
  )
}
