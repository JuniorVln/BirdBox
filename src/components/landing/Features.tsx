import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Globe, Layout, Mail, Eye, MessageSquare } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

const features = [
  {
    icon: Search,
    title: 'Lead Discovery',
    description: 'Find local businesses through Google Maps with smart filters for rating, category, and website availability.',
  },
  {
    icon: Globe,
    title: 'Website Scraping',
    description: 'Automatically extract content, images, testimonials, and contact info from any business website.',
  },
  {
    icon: Layout,
    title: 'AI Templates',
    description: 'Choose from professional templates. Our AI populates them with scraped content for instant redesigns.',
  },
  {
    icon: Mail,
    title: 'Email Outreach',
    description: 'Send personalized emails with live preview links directly from the platform via Gmail integration.',
  },
  {
    icon: Eye,
    title: 'Open Tracking',
    description: 'Know exactly when prospects view your pitch. Track opens, locations, and time spent on page.',
  },
  {
    icon: MessageSquare,
    title: 'Feedback Collection',
    description: 'Built-in feedback forms let prospects rate designs and request changes — right from the pitch.',
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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
            Features
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-text-primary">
            Everything You Need to Close Deals
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
