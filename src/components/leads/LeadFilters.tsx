import { Globe, Mail, Star, Filter, Phone } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/hooks/useI18n'

export interface LeadFilterValues {
  minRating: number
  hasWebsite: boolean
  hasEmail: boolean
  hasPhone: boolean
}

interface LeadFiltersProps {
  filters: LeadFilterValues
  onFilterChange: (filters: LeadFilterValues) => void
  totalResults: number
  filteredCount: number
}

export function LeadFilters({ filters, onFilterChange, totalResults, filteredCount }: LeadFiltersProps) {
  const { t } = useI18n()
  const activeCount = (filters.minRating > 0 ? 1 : 0) + (filters.hasWebsite ? 1 : 0) + (filters.hasEmail ? 1 : 0) + (filters.hasPhone ? 1 : 0)

  const showingText = t.leads.filters.showingResults
    .replace('{filtered}', String(filteredCount))
    .replace('{total}', String(totalResults))

  return (
    <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-surface rounded-lg border border-border">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Filter className="h-4 w-4" />
        <span>Filters{activeCount > 0 ? ` (${activeCount})` : ''}</span>
      </div>

      <div className="h-5 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Star className="h-3.5 w-3.5 text-yellow-400" />
        <Label className="text-sm text-text-secondary">{t.leads.filters.minRating}:</Label>
        <select
          value={filters.minRating}
          onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
          className="bg-surface-raised border border-border rounded px-2 py-1 text-sm text-text-primary"
        >
          <option value={0}>Any</option>
          <option value={3}>3+</option>
          <option value={3.5}>3.5+</option>
          <option value={4}>4+</option>
          <option value={4.5}>4.5+</option>
        </select>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.hasWebsite}
          onChange={(e) => onFilterChange({ ...filters, hasWebsite: e.target.checked })}
          className="rounded border-border bg-surface-raised accent-accent"
        />
        <Globe className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-sm text-text-secondary">{t.leads.filters.hasWebsite}</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.hasEmail}
          onChange={(e) => onFilterChange({ ...filters, hasEmail: e.target.checked })}
          className="rounded border-border bg-surface-raised accent-accent"
        />
        <Mail className="h-3.5 w-3.5 text-blue-400" />
        <span className="text-sm text-text-secondary">{t.leads.filters.hasEmail}</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.hasPhone}
          onChange={(e) => onFilterChange({ ...filters, hasPhone: e.target.checked })}
          className="rounded border-border bg-surface-raised accent-accent"
        />
        <Phone className="h-3.5 w-3.5 text-green-400" />
        <span className="text-sm text-text-secondary">{t.leads.filters.hasPhone}</span>
      </label>

      {totalResults > 0 && (
        <>
          <div className="h-5 w-px bg-border" />
          <span className="text-xs text-text-muted">{showingText}</span>
        </>
      )}
    </div>
  )
}
