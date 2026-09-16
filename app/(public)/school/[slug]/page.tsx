import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BookOpen, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await (supabase.from('standards') as any).select('*').eq('slug', slug).single()
  const standard = data as any
  
  if (!standard) return { title: 'Standard Not Found' }
  return {
    title: `${standard.name} Study Materials - TamilEduHub`,
    description: standard.seo_description || `Download study materials, guides, and question papers for ${standard.name}.`
  }
}

export default async function StandardDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Fetch the Standard details
  const { data } = await (supabase.from('standards') as any).select('*').eq('slug', slug).single()
  const standard = data as any
  if (!standard) notFound()

  // 2. Fetch all subjects
  const { data: subjects } = await (supabase.from('subjects') as any).select('*').order('display_order')
  const displaySubjects = (subjects || []) as any[]

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white mb-12 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{standard.name}</h1>
        <p className="text-blue-100 max-w-2xl text-lg mb-8">
          Select a subject below to view all available study guides, notes, question papers, and revision materials for {standard.name}.
        </p>
        <Button variant="secondary" size="lg" asChild className="gap-2">
          <Link href={`/resources?standard=${standard.id}`}>
            View All {standard.name} Resources <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-blue-600" />
        Subjects
      </h2>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displaySubjects.map(subject => (
          <Link href={`/school/${standard.slug}/${subject.slug}`} key={subject.id}>
            <Card className="hover:border-blue-400 hover:shadow-md transition-all h-full group cursor-pointer bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900">{subject.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
