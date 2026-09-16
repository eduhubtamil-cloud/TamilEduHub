import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'School Standards - TamilEduHub',
  description: 'Browse educational resources by standard for Tamil Nadu state board.',
}

export default async function SchoolStandardsPage() {
  const supabase = await createClient()
  
  // Fetch active standards from Supabase, ordered by display_order
  const { data: standards, error } = await supabase
    .from('standards')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error("Error fetching standards:", error)
  }

  const displayStandards = (standards || []) as any[];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">School Standards</h1>
        <p className="text-lg text-slate-600">
          Select your standard to find all related study materials, guides, and question papers.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayStandards.map((std) => (
          <Link key={std.id} href={`/school/${std.slug}`}>
            <Card className="hover:border-blue-500 hover:shadow-md transition-all h-full cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{std.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">View Resources</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
