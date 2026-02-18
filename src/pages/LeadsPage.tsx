import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useSearchLeads } from '@/hooks/useSearchLeads'
import { useCreateLead } from '@/hooks/useLeads'
import { LeadSearchBar } from '@/components/leads/LeadSearchBar'
import { LeadCard } from '@/components/leads/LeadCard'
import type { LeadData } from '@/components/leads/LeadCard'
import { LeadFilters } from '@/components/leads/LeadFilters'
import type { LeadFilterValues } from '@/components/leads/LeadFilters'
import { LeadCardSkeletonGrid } from '@/components/leads/LeadCardSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'

export function LeadsPage() {
  const navigate = useNavigate()
  const { search, results, isLoading, error, total } = useSearchLeads()
  const createLead = useCreateLead()
  const [hasSearched, setHasSearched] = useState(false)
  const [filters, setFilters] = useState<LeadFilterValues>({
    minRating: 0,
    hasWebsite: false,
    hasEmail: false,
  })

  const handleSearch = useCallback(
    (businessType: string, location: string) => {
      setHasSearched(true)
      setFilters({ minRating: 0, hasWebsite: false, hasEmail: false })
      search(businessType, location)
    },
    [search]
  )

  const filteredResults = useMemo(() => {
    return results.filter((lead) => {
      if (filters.minRating > 0 && (lead.rating === null || lead.rating < filters.minRating)) {
        return false
      }
      if (filters.hasWebsite && !lead.website_url) return false
      if (filters.hasEmail && !lead.email) return false
      return true
    })
  }, [results, filters])

  const handleSaveLead = useCallback(
    async (leadData: LeadData) => {
      try {
        const lead = await createLead.mutateAsync({
          business_name: leadData.business_name,
          address: leadData.address ?? undefined,
          phone: leadData.phone ?? undefined,
          website_url: leadData.website_url ?? undefined,
          email: leadData.email ?? undefined,
          rating: leadData.rating ?? undefined,
          review_count: leadData.review_count ?? undefined,
          category: leadData.category ?? undefined,
        })

        navigate('/dashboard/prospects/' + lead.id)
      } catch {
        // Error handled by React Query
      }
    },
    [createLead, navigate]
  )

  const handleRunAudit = useCallback(
    (leadData: LeadData) => {
      if (!leadData.website_url) return
      navigate(
        '/dashboard/audits?name=' + encodeURIComponent(leadData.business_name) +
        '&url=' + encodeURIComponent(leadData.website_url)
      )
    },
    [navigate]
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-1">Prospector</h2>
        <p className="text-text-secondary">
          Search for local businesses on Google Maps, save leads, and run website audits.
        </p>
      </div>

      <LeadSearchBar onSearch={handleSearch} isLoading={isLoading} />

      {results.length > 0 && (
        <LeadFilters
          filters={filters}
          onFilterChange={setFilters}
          totalResults={total}
          filteredCount={filteredResults.length}
        />
      )}

      {isLoading && <LeadCardSkeletonGrid count={6} />}

      {error && !isLoading && (
        <ErrorState
          title="Search failed"
          message={error}
          onRetry={() => setHasSearched(false)}
        />
      )}

      {!isLoading && !error && hasSearched && results.length === 0 && (
        <EmptyState
          icon={Search}
          title="No leads found"
          description="Try a different business type or location."
        />
      )}

      {!isLoading && !error && filteredResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults.map((lead, i) => (
            <LeadCard
              key={`${lead.business_name}-${i}`}
              lead={lead}
              onCreatePitch={handleSaveLead}
              onRunAudit={handleRunAudit}
              index={i}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && hasSearched && results.length > 0 && filteredResults.length === 0 && (
        <EmptyState
          icon={Search}
          title="No results match filters"
          description="Try adjusting your filters to see more results."
        />
      )}
    </div>
  )
}
