'use client'
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function SearchTracker({ query, filters, resultCount }: { query: string, filters: any, resultCount: number }) {
  const supabase = createClient()
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    
    // Only track if there's actually a query or filters
    if (!query && Object.keys(filters).length === 0) return

    const run = async () => {
      try {
        await (supabase.from('search_analytics') as any).insert({
          query_string: query || '',
          filters: filters,
          result_count: resultCount
        })
      } catch (e) {}
    }
    run()
  }, [query, filters, resultCount, supabase])

  return null
}
