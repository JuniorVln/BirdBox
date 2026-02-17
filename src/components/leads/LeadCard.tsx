import { Star, MapPin, Phone, Mail, Globe, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface LeadData {
  business_name: string
  address: string | null
  phone: string | null
  website_url: string | null
  email: string | null
  rating: number | null
  review_count: number | null
  category: string | null
  google_maps_data: Record<string, unknown>
}

interface LeadCardProps {
  lead: LeadData
  onCreatePitch: (lead: LeadData) => void
  index?: number
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-zinc-600'
          }`}
        />
      ))}
      <span className="text-sm text-text-secondary ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export function LeadCard({ lead, onCreatePitch, index = 0 }: LeadCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="bg-surface border-border hover:border-accent/40 transition-all duration-200 hover:shadow-lg hover:shadow-accent/5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-text-primary truncate">{lead.business_name}</h3>
              {lead.category && (
                <Badge variant="secondary" className="mt-1 bg-surface-raised text-text-secondary text-xs">
                  {lead.category}
                </Badge>
              )}
            </div>
          </div>

          {lead.rating !== null && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={lead.rating} />
              {lead.review_count !== null && (
                <span className="text-xs text-text-muted">({lead.review_count} reviews)</span>
              )}
            </div>
          )}

          <div className="space-y-2 mb-4">
            {lead.address && (
              <div className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-text-muted" />
                <span className="line-clamp-2">{lead.address}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="h-4 w-4 shrink-0 text-text-muted" />
                <span>{lead.phone}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {lead.website_url && (
              <Badge variant="outline" className="border-emerald-800 text-emerald-400 text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Website
              </Badge>
            )}
            {lead.email && (
              <Badge variant="outline" className="border-blue-800 text-blue-400 text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Badge>
            )}
          </div>

          <Button
            onClick={() => onCreatePitch(lead)}
            disabled={!lead.website_url}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40"
            size="sm"
          >
            <Zap className="mr-2 h-4 w-4" />
            {lead.website_url ? 'Create Pitch' : 'No website available'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export type { LeadData }
