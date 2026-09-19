import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FolderOpen, ArrowRight, Grid } from 'lucide-react'

export const metadata = {
  title: 'Curated Study Collections - TamilEduHub',
  description: 'Browse expertly curated study packs, exam preparation kits, and essential materials grouped by standard and subject.',
  openGraph: {
    title: 'Curated Study Collections - TamilEduHub',
    description: 'Browse expertly curated study packs, exam preparation kits, and essential materials grouped by standard and subject.',
    url: '/collections',
    type: 'website'
  }
}

export default async function CollectionsIndexPage() {
  const supabase = await createClient()

  // Fetch all active collections
  const { data: collections, error } = await (supabase.from('collections') as any)
    .select('id, title, slug, description, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Collections fetch error:", error)
  }

  const validCollections = collections || []

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-200">
            <Grid className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Curated Study Collections
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover expertly organized study packs and exam preparation kits designed specifically for Tamil Nadu State Board students.
          </p>
        </div>

        {validCollections.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No Collections Found</h3>
            <p className="text-slate-500 mt-2">Our team is currently building new study packs. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {validCollections.map((col: any) => (
              <Link href={`/collections/${col.slug}`} key={col.id} className="group h-full">
                <Card className="h-full hover:shadow-xl hover:border-blue-300 transition-all duration-300 border-slate-200 bg-white rounded-3xl overflow-hidden flex flex-col">
                  <CardHeader className="bg-gradient-to-br from-slate-50 to-white pb-4 border-b border-slate-100 p-8">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                      {col.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-6 flex-1 flex flex-col">
                    <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                      {col.description || 'Explore this curated collection of educational resources.'}
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300 mt-auto">
                      View Collection <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
