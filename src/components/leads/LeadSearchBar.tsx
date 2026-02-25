import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/useI18n'

interface LeadSearchBarProps {
  onSearch: (businessType: string, location: string) => void
  isLoading: boolean
}

export function LeadSearchBar({ onSearch, isLoading }: LeadSearchBarProps) {
  const [businessType, setBusinessType] = useState('')
  const [location, setLocation] = useState('')
  const { t } = useI18n()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (businessType.trim() && location.trim()) {
      onSearch(businessType.trim(), location.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder={t.leads.businessTypePlaceholder}
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        className="flex-1 bg-surface border-border text-text-primary placeholder:text-text-muted"
      />
      <Input
        placeholder={t.leads.locationPlaceholder}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="flex-1 bg-surface border-border text-text-primary placeholder:text-text-muted"
      />
      <Button
        type="submit"
        disabled={isLoading || !businessType.trim() || !location.trim()}
        className="bg-accent hover:bg-accent-hover min-w-[140px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="truncate">{t.leads.searching}</span>
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            {t.leads.searchButton}
          </>
        )}
      </Button>
    </form>
  )
}
