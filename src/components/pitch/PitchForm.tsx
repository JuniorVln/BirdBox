import { useState } from 'react'
import { Globe, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PitchFormProps {
  onSubmit: (businessName: string, websiteUrl: string) => void
  defaultBusinessName?: string
  defaultWebsiteUrl?: string
}

export function PitchForm({ onSubmit, defaultBusinessName = '', defaultWebsiteUrl = '' }: PitchFormProps) {
  const [businessName, setBusinessName] = useState(defaultBusinessName)
  const [websiteUrl, setWebsiteUrl] = useState(defaultWebsiteUrl)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required'
    } else {
      try {
        const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
        new URL(url)
      } catch {
        newErrors.websiteUrl = 'Please enter a valid URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
      onSubmit(businessName.trim(), url)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Create a New Pitch</h2>
        <p className="text-text-secondary">
          Enter the business details and we&apos;ll analyze their website.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName" className="text-text-secondary">
          Business Name
        </Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            id="businessName"
            placeholder="e.g., Classic Cuts Barbershop"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="pl-10 bg-background border-border text-text-primary placeholder:text-text-muted"
          />
        </div>
        {errors.businessName && (
          <p className="text-xs text-red-400">{errors.businessName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl" className="text-text-secondary">
          Website URL
        </Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            id="websiteUrl"
            placeholder="e.g., classiccutsbarbershop.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="pl-10 bg-background border-border text-text-primary placeholder:text-text-muted"
          />
        </div>
        {errors.websiteUrl && (
          <p className="text-xs text-red-400">{errors.websiteUrl}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white h-11">
        Analyze Website
      </Button>
    </form>
  )
}
