import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Blog & Educational News - TamilEduHub',
  description: 'Read the latest educational updates, exam news, and study tips.',
}

export default async function ArticlesPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const searchParams = await props.searchParams
  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const selectedCategory = searchParams.category || ''
  const pageSize = 24
  const offset = (page - 1) * pageSize

  const supabase = await createClient()

  // Fetch categories for filter tabs
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')

  const categories = (categoriesData || []) as any[]

  // Build articles query
  let articlesQuery = supabase
    .from('articles')
    .select(`
      id, title, slug, excerpt, featured_image, published_at, category_id,
      categories(name, slug),
      profiles(full_name)
    `, { count: 'exact' })
    .eq('status', 'published')

  if (selectedCategory) {
    const matchedCategory = categories.find(c => c.slug === selectedCategory)
    if (matchedCategory) {
      articlesQuery = articlesQuery.eq('category_id', matchedCategory.id)
    }
  }

  const { data: articles, count, error } = await articlesQuery
    .order('published_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) {
    console.error("Fetch Error:", error)
  }

  const displayArticles = (articles || []) as any[]
  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Educational Blog & News</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Stay updated with the latest exam announcements, study materials, question papers, and educational guides for Tamil Nadu students.
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          size="sm"
          asChild
          className="rounded-full"
        >
          <Link href="/articles">All Topics</Link>
        </Button>
        {categories.map((cat: any) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
            asChild
            className="rounded-full"
          >
            <Link href={`/articles?category=${cat.slug}`}>{cat.name}</Link>
          </Button>
        ))}
      </div>

      {displayArticles.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <h3 className="text-xl font-medium text-slate-900 mb-2">No articles found</h3>
          <p className="text-slate-500">No articles available in this category yet. Check back soon!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayArticles.map((article: any) => (
              <Card key={article.id} className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow group border-slate-200">
                <Link href={`/articles/${article.slug}`} className="contents">
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {article.featured_image ? (
                      <img 
                        src={article.featured_image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                        <span className="font-bold text-4xl opacity-20">TamilEduHub</span>
                      </div>
                    )}
                    {article.categories?.name && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
                        {article.categories.name}
                      </div>
                    )}
                  </div>
                  <CardContent className="flex-1 p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 mb-6 line-clamp-3 flex-1 text-sm">
                      {article.excerpt || 'Read the full article for more details...'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{article.profiles?.full_name || 'Admin'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(article.published_at || new Date()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-8 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link href={`/articles?${selectedCategory ? `category=${selectedCategory}&` : ''}page=${page - 1}`}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Link>
                ) : (
                  <span>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </span>
                )}
              </Button>

              <span className="text-sm font-medium text-slate-600">
                Page {page} of {totalPages} ({totalCount} total articles)
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                asChild={page < totalPages}
              >
                {page < totalPages ? (
                  <Link href={`/articles?${selectedCategory ? `category=${selectedCategory}&` : ''}page=${page + 1}`}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                ) : (
                  <span>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
