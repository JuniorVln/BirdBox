import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useI18n } from '@/hooks/useI18n'

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        <motion.div variants={staggerItem}>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-sm text-accent mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {t.landing.hero.badge}
          </span>
        </motion.div>

        <motion.h1
          variants={staggerItem}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
        >
          <span className="gradient-text">{t.landing.hero.titleSpan1}</span>
          <br />
          <span className="gradient-text">{t.landing.hero.titleSpan2}</span>
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          {t.landing.hero.subtitle}
        </motion.p>

        <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="bg-accent hover:bg-accent-hover text-white px-8 h-12 text-base">
              {t.landing.hero.startFree}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-border text-text-secondary hover:text-text-primary hover:bg-surface h-12 text-base"
          >
            <Play className="mr-2 h-4 w-4" />
            {t.landing.hero.watchDemo}
          </Button>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          variants={staggerItem}
          className="mt-16 mx-auto max-w-4xl"
        >
          <div className="relative rounded-xl border border-border bg-surface p-1 shadow-2xl shadow-accent/5">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-text-muted">app.pitchai.com/dashboard</span>
            </div>
            <div className="aspect-[16/9] rounded-b-lg bg-gradient-to-br from-surface via-surface-raised to-background flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-xl">
                {[
                  { label: t.landing.hero.stats.totalPitches, value: '247' },
                  { label: t.landing.hero.stats.openRate, value: '68%' },
                  { label: t.landing.hero.stats.responses, value: '43' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg bg-background/50 border border-border/50 p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
