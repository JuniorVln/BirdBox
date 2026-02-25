import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, Wand2, Send } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useI18n } from '@/hooks/useI18n'

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useI18n()

  const steps = [
    {
      icon: Search,
      number: '01',
      title: t.landing.howItWorks.steps[0].title,
      description: t.landing.howItWorks.steps[0].description,
    },
    {
      icon: Wand2,
      number: '02',
      title: t.landing.howItWorks.steps[1].title,
      description: t.landing.howItWorks.steps[1].description,
    },
    {
      icon: Send,
      number: '03',
      title: t.landing.howItWorks.steps[2].title,
      description: t.landing.howItWorks.steps[2].description,
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={staggerItem} className="text-sm font-medium text-accent mb-3 uppercase tracking-wider">
            {t.landing.howItWorks.badge}
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-text-primary">
            {t.landing.howItWorks.title}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step) => (
            <motion.div key={step.number} variants={staggerItem} className="relative text-center">
              <div className="relative mx-auto mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-border mx-auto">
                  <step.icon className="h-7 w-7 text-accent" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
