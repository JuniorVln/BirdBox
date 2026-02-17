import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { staggerContainer, staggerItem } from '@/lib/animations'

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for trying out Pitch AI',
    features: [
      '5 pitches per month',
      '2 website templates',
      'Basic preview links',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For growing agencies and freelancers',
    features: [
      'Unlimited pitches',
      'All website templates',
      'Email outreach integration',
      'Open tracking & analytics',
      'Custom branding',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: '$149',
    period: '/month',
    description: 'For teams and large-scale outreach',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'White-label pitches',
      'Email warm-up integration',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="py-24 px-6 bg-surface/30" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={staggerItem} className="text-sm font-medium text-accent mb-3 uppercase tracking-wider">
            Pricing
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-text-primary">
            Simple, Transparent Pricing
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={staggerItem}
              className={cn(
                'relative rounded-xl border p-8 flex flex-col',
                tier.highlighted
                  ? 'bg-surface border-accent shadow-lg shadow-accent/10'
                  : 'bg-surface border-border'
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                  Popular
                </span>
              )}

              <h3 className="text-xl font-semibold text-text-primary">{tier.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-text-primary">{tier.price}</span>
                {tier.period && <span className="text-text-muted">{tier.period}</span>}
              </div>
              <p className="text-sm text-text-secondary mb-6">{tier.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button
                  className={cn(
                    'w-full',
                    tier.highlighted
                      ? 'bg-accent hover:bg-accent-hover text-white'
                      : 'bg-surface-raised hover:bg-surface-raised/80 text-text-primary border border-border'
                  )}
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
