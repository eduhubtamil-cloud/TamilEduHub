import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search as SearchIcon, FileText } from 'lucide-react'

export const metadata = {
  title: 'Search Results - TamilEduHub',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const query = q || '';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Search Resources</h1>
        <form className="flex gap-2" action="/search">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              type="search" 
              name="q"
              defaultValue={query}
              placeholder="Search for resources (e.g. 10th Tamil Guide)"
              className="w-full h-12 pl-10 text-base"
            />
          </div>
          <Button type="submit" className="h-12 px-8">Search</Button>
        </form>
      </div>

      {query ? (
        <div className="space-y-6">
          <p className="text-slate-600">
            Showing results for <span className="font-semibold text-slate-900">&quot;{query}&quot;</span>
          </p>
          
          {/* Mock Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col h-full hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 mb-3">
                    Study Guide
                  </span>
                  <span className="text-xs font-semibold text-slate-700">10th Std</span>
                </div>
                <CardTitle className="text-lg">
                  <Link href="/resources/10th-tamil-guide" className="hover:text-blue-600 before:absolute before:inset-0">
                    10th Tamil Guide 2026
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-slate-500">
                  Matches found in title and description.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-slate-700">Enter a search term above</h2>
          <p className="text-slate-500 mt-2">Try searching by standard, subject, or resource type.</p>
        </div>
      )}
    </div>
  )
}
