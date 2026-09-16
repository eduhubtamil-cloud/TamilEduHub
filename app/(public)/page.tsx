import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Search } from 'lucide-react'

export const metadata = {
  title: 'TamilEduHub - Modern Tamil Educational Resources',
  description: 'Download study materials, question papers, and educational resources for Tamil Nadu school students.',
}

export default function HomePage() {
  return (
    <>
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
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Browse by Standard</h2>
              <p className="text-slate-500 mt-2">Find resources for your specific class</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/school">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[10, 11, 12, 9, 8, 7].map((std) => (
              <Link key={std} href={`/school/${std}th-standard`}>
                <Card className="hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-center">
                  <CardContent className="p-6">
                    <span className="text-3xl font-bold text-blue-600">{std}</span>
                    <span className="text-sm font-semibold text-slate-700 block mt-1">Standard</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources (Placeholder) */}
      <section className="py-16 px-4 bg-slate-50 border-t border-b border-slate-200">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
                      Study Material
                    </span>
                    <span className="text-xs text-slate-500">2026</span>
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-blue-600 cursor-pointer">
                    10th Tamil Full Study Material & Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 line-clamp-3">
                    Comprehensive study guide covering all chapters with important questions and answers.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
