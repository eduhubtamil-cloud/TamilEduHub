import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download } from 'lucide-react'

export const metadata = {
  title: 'Study Materials & Resources - TamilEduHub',
  description: 'Download the latest study materials, guides, and PDF resources.',
}

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Filters</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Standard</label>
              <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                <option>All Standards</option>
                <option>12th Standard</option>
                <option>11th Standard</option>
                <option>10th Standard</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                <option>All Subjects</option>
                <option>Tamil</option>
                <option>English</option>
                <option>Mathematics</option>
                <option>Science</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-900">All Resources</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input type="search" placeholder="Search..." className="pl-9" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 mb-3">
                    Study Guide
                  </span>
                  <span className="text-xs text-slate-500">2.4 MB</span>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  10th Science Important Questions & Answers Guide 2026
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-slate-500 line-clamp-3">
                  A complete guide for 10th science covering physics, chemistry, and biology important questions.
                </p>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Pagination placeholder */}
        <div className="flex justify-center mt-12">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </div>
  )
}
