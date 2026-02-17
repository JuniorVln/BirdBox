import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getMockScrapedData } from '@/lib/mockData'
import type { ScrapedData } from '@/types'

const SCRAPING_STEPS = [
  'Connecting to website...',
  'Extracting page content...',
  'Analyzing images and media...',
  'Detecting color scheme...',
  'Identifying business category...',
  'Preparing results...',
]

interface UseScrapeResult {
  scrape: (businessName: string, websiteUrl: string) => Promise<ScrapedData>
  isLoading: boolean
  currentStep: string
  progress: number
  error: string | null
}

export function useScraper(): UseScrapeResult {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const scrape = async (businessName: string, websiteUrl: string): Promise<ScrapedData> => {
    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Show progress UI while the API call runs
      let step = 0
      const progressInterval = setInterval(() => {
        if (step < SCRAPING_STEPS.length) {
          setCurrentStep(SCRAPING_STEPS[step])
          setProgress(((step + 1) / SCRAPING_STEPS.length) * 100)
          step++
        }
      }, 1500)

      const { data, error: fnError } = await supabase.functions.invoke('scrape-website', {
        body: { url: websiteUrl, businessName },
      })

      clearInterval(progressInterval)
      setProgress(100)
      setCurrentStep('Done!')

      if (fnError) throw new Error(fnError.message)
      if (!data?.success) throw new Error(data?.error || 'Scraping failed')

      return data.data as ScrapedData
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to scrape website'
      setError(message)

      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        console.warn('Scraping failed, using mock data:', message)
        return getMockScrapedData(businessName)
      }

      throw err
    } finally {
      setIsLoading(false)
      setCurrentStep('')
      setProgress(0)
    }
  }

  return { scrape, isLoading, currentStep, progress, error }
}
