import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Globe, Layout, Mail, Eye, MessageSquare } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useI18n } from '@/hooks/useI18n'

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useI18n()

  const features = [
    {
      icon: Search,
      title: t.landing.features.items[0].title,
      description: t.landing.features.items[0].description,
    },
    {
      icon: Globe,
      title: t.landing.features.items[1].title,
      description: t.landing.features.items[1].description,
    },
    {
      icon: Layout,
      title: t.landing.features.items[2].title,
      description: t.landing.features.items[2].description,
    },
    {
      icon: Mail,
      title: t.landing.features.items[3].title,
      description: t.landing.features.items[3].description,
    },
    {
      icon: Eye,
      title: t.landing.features.items[4].title,
      description: t.landing.features.items[4].description,
    },
    {
      icon: MessageSquare,
      title: t.landing.features.items[5].title,
      description: t.landing.features.items[5].description,
    },
  ]

  return (
    <section id="features" className="py-24 px-6 bg-surface/30" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={staggerItem} className="text-sm font-medium text-accent mb-3 uppercase tracking-wider">
            {t.landing.features.badge}
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-text-primary">
            {t.landing.features.title}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              className="group rounded-xl bg-surface border border-border p-6 hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
