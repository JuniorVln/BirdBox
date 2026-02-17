import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

const testimonials = [
  {
    name: 'Marcus Chen',
    role: 'Founder, PixelForge Studio',
    text: 'Pitch AI completely transformed our outreach. We went from 5 pitches a week to 30 — and our close rate actually went up.',
    rating: 5,
  },
  {
    name: 'Sarah Williams',
    role: 'Lead Designer, Webcraft Agency',
    text: 'The AI-generated redesigns are genuinely impressive. Clients are blown away when they see a custom preview of their site.',
    rating: 5,
  },
  {
    name: 'Alex Rivera',
    role: 'Freelance Web Designer',
    text: 'As a solo freelancer, this tool is a game-changer. I can prospect and pitch at scale without hiring a sales team.',
    rating: 5,
  },
]

export function SocialProof() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={staggerItem} className="text-sm font-medium text-accent mb-3 uppercase tracking-wider">
            Testimonials
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-text-primary">
            Loved by Agencies Worldwide
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className="rounded-xl bg-surface border border-border p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
