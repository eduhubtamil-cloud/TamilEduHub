import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, ArrowRight, BookOpen, Newspaper, FileText, Download, Calendar } from 'lucide-react'
import { AdSlot } from '@/components/ui/AdSlot'
import { CommunityLinksWrapper } from '@/components/ui/CommunityLinksWrapper'

export const metadata = {
  title: 'TamilEduHub - Modern Tamil Educational Resources',
  description: 'Download study materials, question papers, and educational resources for Tamil Nadu school students.',
}

function ResourceCard({ resource }: { resource: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow group h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          {resource.standards?.name && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {resource.standards.name}
            </span>
          )}
          {resource.subjects?.name && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded truncate">
              {resource.subjects.name}
            </span>
          )}
        </div>
        <CardTitle className="text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/resources/${resource.slug}`} className="before:absolute before:inset-0">
            {resource.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-sm text-slate-500 line-clamp-2">{resource.description}</p>
      </CardContent>
    </Card>
  )
}

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: standards },
    { data: studyGuides },
    { data: textbooks },
    { data: questionPapers },
    { data: collections },
    { data: latestResources },
    { data: popularResources },
    { data: latestArticles }
  ] = await Promise.all([
    supabase.from('standards').select('name, slug').order('display_order'),
    (supabase.from('resources') as any).select('id, title, slug, description, standards(name), subjects(name)').eq('status', 'published').ilike('title', '%guide%').order('created_at', { ascending: false }).limit(4),
    (supabase.from('resources') as any).select('id, title, slug, description, standards(name), subjects(name)').eq('status', 'published').ilike('title', '%textbook%').order('created_at', { ascending: false }).limit(4),
    supabase.from('question_papers').select('id, title, slug, description, standards(name), subjects(name)').eq('status', 'published').order('created_at', { ascending: false }).limit(4),
    (supabase.from('collections') as any).select('id, title, slug, description').order('created_at', { ascending: false }).limit(4),
    (supabase.from('resources') as any).select('id, title, slug, description, standards(name), subjects(name)').eq('status', 'published').order('created_at', { ascending: false }).limit(5),
    (supabase.from('resources') as any).select('id, title, slug, description, standards(name), subjects(name)').eq('status', 'published').order('views_count', { ascending: false }).limit(5),
    supabase.from('articles').select('id, title, slug, excerpt').eq('status', 'published').order('published_at', { ascending: false }).limit(3)
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 max-w-3xl mx-auto">
          Find Any Tamil Nadu Study Material
        </h1>
        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
          Search thousands of free guides, textbooks, and question papers for all standards.
        </p>
        
        <form action="/search" method="GET" className="max-w-2xl mx-auto relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400" />
          <input 
            type="search" 
            name="q" 
            placeholder="e.g. 10th Science Quarterly Question Paper" 
            className="w-full h-14 pl-12 pr-32 rounded-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Button type="submit" className="absolute right-1.5 h-11 rounded-full px-6">
            Search
          </Button>
        </form>
      </section>

      <section className="py-8 bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <CommunityLinksWrapper location="homepage_top" compact={true} />
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl space-y-20">
        
        {standards && standards.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" /> Browse by Standard
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {standards.map((std: any) => (
                <Link href={`/${std.slug}`} key={std.slug} className="group">
                  <div className="bg-white border rounded-xl p-4 text-center hover:border-blue-500 hover:shadow-md transition-all h-full flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-slate-800 group-hover:text-blue-600">{std.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {studyGuides && studyGuides.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Study Guides & Notes</h2>
              <Link href="/study-guides" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {studyGuides.map((res: any) => <ResourceCard key={res.id} resource={res} />)}
            </div>
          </section>
        )}

        {questionPapers && questionPapers.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Latest Question Papers</h2>
              <Link href="/question-papers" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {questionPapers.map((qp: any) => (
                <Card key={qp.id} className="hover:shadow-md transition-shadow group h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Question Paper
                      </span>
                    </div>
                    <CardTitle className="text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/question-papers/${qp.slug}`} className="before:absolute before:inset-0">
                        {qp.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <p className="text-sm text-slate-500 line-clamp-2">{qp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <AdSlot location="homepage_mid" className="my-8" />

        {textbooks && textbooks.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Textbooks</h2>
              <Link href="/textbooks" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {textbooks.map((res: any) => <ResourceCard key={res.id} resource={res} />)}
            </div>
          </section>
        )}

        {collections && collections.length > 0 && (
          <section className="bg-slate-50 -mx-4 px-4 py-12 border-y">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Featured Collections</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {collections.map((col: any) => (
                  <Link href={`/collections/${col.slug}`} key={col.id} className="group">
                    <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all bg-white">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-blue-600">{col.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-500 line-clamp-2">{col.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {latestResources && latestResources.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> Latest Additions
              </h2>
              <div className="space-y-3">
                {latestResources.map((res: any) => (
                  <div key={res.id} className="flex gap-4 items-center p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow group relative">
                    <div className="flex-1 min-w-0">
                      <Link href={`/resources/${res.slug}`} className="before:absolute before:inset-0 font-medium text-slate-900 group-hover:text-blue-600 truncate block">
                        {res.title}
                      </Link>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {res.standards?.name} • {res.subjects?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {popularResources && popularResources.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" /> Most Popular
              </h2>
              <div className="space-y-3">
                {popularResources.map((res: any) => (
                  <div key={res.id} className="flex gap-4 items-center p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow group relative">
                    <div className="flex-1 min-w-0">
                      <Link href={`/resources/${res.slug}`} className="before:absolute before:inset-0 font-medium text-slate-900 group-hover:text-blue-600 truncate block">
                        {res.title}
                      </Link>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {res.standards?.name} • {res.subjects?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {latestArticles && latestArticles.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-blue-600" /> Educational News & Articles
              </h2>
              <Link href="/articles" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {latestArticles.map((article: any) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow group h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg leading-snug group-hover:text-blue-600 transition-colors">
                      <Link href={`/articles/${article.slug}`} className="before:absolute before:inset-0">
                        {article.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <p className="text-sm text-slate-500 line-clamp-3">{article.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

      </main>

      <section className="bg-slate-900 py-16 text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-6">Join Our Community</h2>
        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
          Get instant updates on new study materials, question papers, and educational news.
        </p>
        <div className="max-w-xl mx-auto">
          <CommunityLinksWrapper location="homepage_bottom" compact={false} />
        </div>
      </section>
    </div>
  )
}
