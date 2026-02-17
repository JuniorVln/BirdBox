import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface SearchLeadResult {
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

interface UseSearchLeadsReturn {
  search: (businessType: string, location: string) => Promise<void>
  results: SearchLeadResult[]
  isLoading: boolean
  error: string | null
  total: number
}

export function useSearchLeads(): UseSearchLeadsReturn {
  const [results, setResults] = useState<SearchLeadResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const search = async (businessType: string, location: string) => {
    setIsLoading(true)
    setError(null)
    setResults([])
    setTotal(0)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-leads', {
        body: {
          businessType,
          location,
          limit: 20,
        },
      })

      if (fnError) throw new Error(fnError.message)
      if (!data?.success) throw new Error(data?.error || 'Search failed')

      setResults(data.leads || [])
      setTotal(data.total || 0)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search leads'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { search, results, isLoading, error, total }
}
