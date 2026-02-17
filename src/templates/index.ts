import type { TemplateConfig } from '@/types'
import { generateModernProfessional } from './modernProfessional'
import { generateBoldCreative } from './boldCreative'
import { generateMinimalElegant } from './minimalElegant'
import { generateLocalBusiness } from './localBusiness'

export const templates: TemplateConfig[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, corporate design with structured layouts and professional aesthetics.',
    thumbnail: '/templates/modern-professional.png',
    categories: ['Corporate', 'Healthcare', 'Legal', 'Finance'],
    generate: generateModernProfessional,
  },
  {
    id: 'bold-creative',
    name: 'Bold Creative',
    description: 'Vibrant, attention-grabbing design with bold typography and dynamic sections.',
    thumbnail: '/templates/bold-creative.png',
    categories: ['Agency', 'Fitness', 'Entertainment', 'Tech'],
    generate: generateBoldCreative,
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Whitespace-heavy, luxury aesthetic with serif headings and refined details.',
    thumbnail: '/templates/minimal-elegant.png',
    categories: ['Restaurant', 'Boutique', 'Spa', 'Photography'],
    generate: generateMinimalElegant,
  },
  {
    id: 'local-business',
    name: 'Local Business',
    description: 'Warm, approachable design built for trust and local community connection.',
    thumbnail: '/templates/local-business.png',
    categories: ['Barbershop', 'Bakery', 'Auto Shop', 'Local Services'],
    generate: generateLocalBusiness,
  },
]

export function getTemplateById(id: string): TemplateConfig | undefined {
  return templates.find((t) => t.id === id)
}
