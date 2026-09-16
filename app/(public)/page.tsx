import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, ArrowRight, BookOpen, Newspaper } from 'lucide-react'
import { AdSlot } from '@/components/ui/AdSlot'
import { CommunityLinksWrapper } from '@/components/ui/CommunityLinksWrapper'

export const metadata = {
  title: 'TamilEduHub - Modern Tamil Educational Resources',
  description: 'Download study materials, question papers, and educational resources for Tamil Nadu school students.',
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch real data
  const [
    { data: standards },
    { data: recentResources },
    { data: recentArticles }
  ] = await Promise.all([
    supabase.from('standards').select('name, slug').order('display_order').limit(6),
    supabase.from('resources')
      .select('title, slug, description, year, standards(name), subjects(name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3),
    supabase.from('articles')
      .select('title, slug, excerpt, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)
  ])

  const displayStandards = (standards || []) as any[]
  const displayResources = (recentResources || []) as any[]
  const displayArticles = (recentArticles || []) as any[]

  return (
    <>
      <AdSlot location="homepage_top" className="bg-slate-50 border-b border-slate-200 py-4" />
      {/* Hero Section */}
      <section className="bg-slate-50 py-20 px-4 border-b border-slate-200">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Educational Resources for Tamil Nadu Students
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Find the best study materials, question papers, and guides for all standards and subjects in one place.
          </p>
          <div className="relative max-w-xl mx-auto">
            <form action="/search" className="flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="search" 
                  name="q"
                  placeholder="Search for resources (e.g. 10th Tamil Guide)"
                  className="w-full h-12 pl-10 pr-4 rounded-l-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                />
              </div>
              <Button type="submit" className="h-12 rounded-l-none px-8 text-base">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* School Standards Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Browse by Standard</h2>
              <p className="text-slate-500 mt-2">Find resources for your specific class</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/school">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayStandards.map((std) => {
              // Try to extract the number for a cleaner UI if possible
              const match = std.name.match(/^(\d+)/)
              const number = match ? match[1] : ''
              const rest = number ? std.name.replace(number, '').trim() : std.name
              
              return (
                <Link key={std.slug} href={`/school/${std.slug}`}>
                  <Card className="hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-center h-full">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      {number ? (
                        <>
                          <span className="text-3xl font-bold text-blue-600">{number}</span>
                          <span className="text-sm font-semibold text-slate-700 block mt-1">{rest}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-blue-600">{std.name}</span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 px-4 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-blue-600" />
              Latest Study Materials
            </h2>
            <Link href="/resources" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayResources.length === 0 ? (
              <p className="text-slate-500 md:col-span-3">No study materials uploaded yet.</p>
            ) : (
              displayResources.map((res: any) => (
                <Card key={res.slug} className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
                        {res.standards?.name}
                      </span>
                      {res.year && <span className="text-xs text-slate-500">{res.year}</span>}
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link href={`/resources/${res.slug}`} className="hover:text-blue-600 before:absolute before:inset-0">
                        {res.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-slate-500 line-clamp-3 flex-1">
                      {res.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 px-4 border-t border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Newspaper className="h-7 w-7 text-amber-600" />
              Educational News
            </h2>
            <Link href="/articles" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
              Read Blog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayArticles.length === 0 ? (
              <p className="text-slate-500 md:col-span-3">No articles published yet.</p>
            ) : (
              displayArticles.map((article: any) => (
                <Card key={article.slug} className="hover:shadow-md transition-shadow flex flex-col border-amber-100">
                  <CardHeader>
                    <div className="text-xs text-slate-500 mb-2">
                      {new Date(article.published_at).toLocaleDateString()}
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link href={`/articles/${article.slug}`} className="hover:text-amber-700 before:absolute before:inset-0">
                        {article.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-slate-600 line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <CommunityLinksWrapper location="homepage_cta" />
        </div>
      </section>
    </>
  )
}
