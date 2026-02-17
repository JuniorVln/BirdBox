import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, Wand2, Send } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Find Leads',
    description: 'Discover local businesses through Google Maps integration. Filter by category, rating, and location to find your ideal prospects.',
  },
  {
    icon: Wand2,
    number: '02',
    title: 'AI Redesigns',
    description: 'Our AI scrapes their existing website and generates a stunning, modern redesign using professional templates — in seconds.',
  },
  {
    icon: Send,
    number: '03',
    title: 'Send & Track',
    description: 'Send personalized outreach emails with live preview links. Track opens, collect feedback, and close more deals.',
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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
            How It Works
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-text-primary">
            Three Steps to More Clients
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
