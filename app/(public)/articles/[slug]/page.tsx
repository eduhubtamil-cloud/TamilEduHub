import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, ChevronLeft } from 'lucide-react'
import { AdSlot } from '@/components/ui/AdSlot'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('articles').select('title, excerpt').eq('slug', slug).single()
  const article = data as any
  
  if (!article) return { title: 'Article Not Found' }
  return {
    title: `${article.title} - TamilEduHub`,
    description: article.excerpt || `Read ${article.title}`,
  }
}

export default async function ArticleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      categories(name),
      profiles(full_name, avatar_url)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) {
    notFound()
  }

  const article = data as any

  // Fetch related articles
  const { data: relatedData } = await supabase
    .from('articles')
    .select('id, title, slug, featured_image_url, categories(name)')
    .eq('category_id', article.category_id)
    .neq('id', article.id)
    .eq('status', 'published')
    .limit(3)

  const relatedArticles = relatedData || []

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link href="/articles" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to all articles
          </Link>
          
          <div className="space-y-6">
            {article.categories?.name && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {article.categories.name}
              </span>
            )}
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  {article.profiles?.avatar_url ? (
                    <img src={article.profiles.avatar_url} alt={article.profiles.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{article.profiles?.full_name || 'Admin'}</p>
                  <p className="text-xs text-slate-500">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.published_at || new Date()).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
          <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 bg-white aspect-[21/9]">
            <img 
              src={article.featured_image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`container mx-auto px-4 max-w-3xl ${article.featured_image ? 'pt-16' : 'pt-12'}`}>
        <AdSlot location="article_top" className="mb-8" />
        
        <article className="prose prose-slate prose-lg md:prose-xl max-w-none">
          {/* For MVP, we use dangerouslySetInnerHTML to render basic HTML or just preserve line breaks */}
          <div 
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </article>
      </div>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="container mx-auto px-4 max-w-5xl mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((res: any) => (
              <Link href={`/articles/${res.slug}`} key={res.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 h-full">
                <div className="aspect-[16/9] bg-slate-100 overflow-hidden relative">
                  {res.featured_image_url ? (
                    <img src={res.featured_image_url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      No Image
                    </div>
                  )}
                  {res.categories?.name && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-blue-700 shadow-sm">
                      {res.categories.name}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
