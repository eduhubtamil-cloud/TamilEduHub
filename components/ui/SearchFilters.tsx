'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchFilters({
  segments,
  standards,
  subjects,
  mediums,
  resourceTypes,
  examTypes,
  publications,
  dict
}: any) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') || ''
  const segment = searchParams.get('segment') || ''
  const standard = searchParams.get('standard') || ''
  const subject = searchParams.get('subject') || ''
  const medium = searchParams.get('medium') || ''
  const resourceType = searchParams.get('resourceType') || ''
  const examType = searchParams.get('examType') || ''
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (name: string, value: string) => {
    // If changing audience, reset specific filters
    let params = new URLSearchParams(searchParams.toString())
    
    if (name === 'segment') {
      params.delete('standard')
      params.delete('examType')
    }
    
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    
    router.push(`/search?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('q') as string
    
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/search')
  }

  const hasFilters = segment || standard || subject || medium || resourceType || examType

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={dict.searchOurResources || "Search textbooks, notes, question papers..."}
            className="pl-12 h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-lg shadow-sm"
          />
        </div>
        <Button type="submit" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-sm">
          {dict.search || "Search"}
        </Button>
      </form>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Filters</h3>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 h-8">
              Clear All
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={segment} 
            onChange={(e) => handleFilterChange('segment', e.target.value)}
            className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm max-w-[150px]"
          >
            <option value="">All Audiences</option>
            {segments.map((s: any) => <option key={s.id} value={s.slug}>{s.name}</option>)}
          </select>

          {segment === 'school' && (
            <select 
              value={standard} 
              onChange={(e) => handleFilterChange('standard', e.target.value)}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm max-w-[150px]"
            >
              <option value="">All Standards</option>
              {standards.map((s: any) => <option key={s.id} value={s.slug}>{s.name}</option>)}
            </select>
          )}

          {segment === 'competitive-exams' && (
            <select 
              value={examType} 
              onChange={(e) => handleFilterChange('examType', e.target.value)}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm max-w-[150px]"
            >
              <option value="">All Exams</option>
              {examTypes.map((s: any) => <option key={s.id} value={s.slug}>{s.name}</option>)}
            </select>
          )}

          <select 
            value={subject} 
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm max-w-[150px]"
          >
            <option value="">All Subjects</option>
            {subjects.map((s: any) => <option key={s.id} value={s.slug}>{s.name}</option>)}
          </select>

          <select 
            value={medium} 
            onChange={(e) => handleFilterChange('medium', e.target.value)}
            className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm max-w-[150px]"
          >
            <option value="">All Mediums</option>
            {mediums.map((s: any) => <option key={s.id} value={s.slug}>{s.name}</option>)}
          </select>

          <select 
            value={resourceType} 
            onChange={(e) => handleFilterChange('resourceType', e.target.value)}
            className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm max-w-[150px]"
          >
            <option value="">All Types</option>
            {resourceTypes.map((s: any) => <option key={s.id} value={s.slug}>{s.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
